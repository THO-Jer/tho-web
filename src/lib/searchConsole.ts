// Google Search Console (solo lectura) para el panel de Studio Blog.
//
// Se autentica con una cuenta de servicio de Google Cloud, sin librerías
// externas: firma un JWT (RS256) y lo cambia por un token de acceso.
// Configuración en docs/blog-analytics.md. Si faltan variables, el panel
// simplemente muestra cómo activarlo.

import { createSign } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

type GscConfig = { clientEmail: string; privateKey: string; siteUrl: string };

function getConfig(): GscConfig | null {
  const clientEmail = (process.env.GSC_CLIENT_EMAIL || "").trim();
  const privateKey = (process.env.GSC_PRIVATE_KEY || "").replace(/\\n/g, "\n").trim();
  const siteUrl = (process.env.GSC_SITE_URL || "sc-domain:tho.cl").trim();
  if (!clientEmail || !privateKey) return null;
  return { clientEmail, privateKey, siteUrl };
}

export function isSearchConsoleConfigured() {
  return getConfig() !== null;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(config: GscConfig) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({ iss: config.clientEmail, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(config.privateKey));

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(`Search Console: no se pudo autenticar (${data.error_description || res.status}).`);
  }
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.token;
}

type GscRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function querySearchAnalytics(config: GscConfig, body: Record<string, unknown>): Promise<GscRow[]> {
  const token = await getAccessToken(config);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const data = (await res.json().catch(() => ({}))) as { rows?: GscRow[]; error?: { message?: string } };
  if (!res.ok) {
    const reason = data.error?.message || String(res.status);
    if (res.status === 403) {
      throw new Error(
        `Search Console: la cuenta de servicio no tiene acceso a ${config.siteUrl}. Agrégala como usuario de la propiedad. (${reason})`,
      );
    }
    throw new Error(`Search Console: ${reason}`);
  }
  return data.rows ?? [];
}

// Convierte la URL que reporta Google al slug de la entrada (ignora www, / final, ?query).
function slugFromUrl(url: string) {
  try {
    const { pathname } = new URL(url);
    const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]).toLowerCase() : null;
  } catch {
    return null;
  }
}

export type GscQuery = { query: string; clicks: number; impressions: number; position: number };

export type GscPagePerformance = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  queries: GscQuery[];
};

export type GscBlogPerformance = {
  bySlug: Record<string, GscPagePerformance>;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
};

type Acc = { clicks: number; impressions: number; positionWeighted: number };

function finish(acc: Acc) {
  return {
    clicks: acc.clicks,
    impressions: acc.impressions,
    ctr: acc.impressions ? acc.clicks / acc.impressions : 0,
    // Posición promedio ponderada por impresiones (como la calcula Google).
    position: acc.impressions ? acc.positionWeighted / acc.impressions : 0,
  };
}

export async function getBlogSearchPerformance(startDate: string, endDate: string): Promise<GscBlogPerformance> {
  const config = getConfig();
  if (!config) throw new Error("Search Console no configurado.");

  const pageFilter = {
    dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: "/blog/" }] }],
  };

  const [pageRows, queryRows] = await Promise.all([
    querySearchAnalytics(config, { startDate, endDate, dimensions: ["page"], rowLimit: 1000, ...pageFilter }),
    querySearchAnalytics(config, { startDate, endDate, dimensions: ["page", "query"], rowLimit: 5000, ...pageFilter }),
  ]);

  const pages = new Map<string, Acc>();
  const total: Acc = { clicks: 0, impressions: 0, positionWeighted: 0 };
  for (const row of pageRows) {
    const slug = slugFromUrl(row.keys[0] || "");
    if (!slug) continue;
    const acc = pages.get(slug) ?? { clicks: 0, impressions: 0, positionWeighted: 0 };
    acc.clicks += row.clicks;
    acc.impressions += row.impressions;
    acc.positionWeighted += row.position * row.impressions;
    pages.set(slug, acc);
    total.clicks += row.clicks;
    total.impressions += row.impressions;
    total.positionWeighted += row.position * row.impressions;
  }

  const queries = new Map<string, Map<string, Acc>>();
  for (const row of queryRows) {
    const slug = slugFromUrl(row.keys[0] || "");
    const query = row.keys[1];
    if (!slug || !query) continue;
    const bySlug = queries.get(slug) ?? new Map<string, Acc>();
    const acc = bySlug.get(query) ?? { clicks: 0, impressions: 0, positionWeighted: 0 };
    acc.clicks += row.clicks;
    acc.impressions += row.impressions;
    acc.positionWeighted += row.position * row.impressions;
    bySlug.set(query, acc);
    queries.set(slug, bySlug);
  }

  const bySlug: Record<string, GscPagePerformance> = {};
  for (const [slug, acc] of pages) {
    const top = Array.from(queries.get(slug)?.entries() ?? [])
      .map(([query, q]) => {
        const f = finish(q);
        return { query, clicks: f.clicks, impressions: f.impressions, position: f.position };
      })
      .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
      .slice(0, 5);
    bySlug[slug] = { ...finish(acc), queries: top };
  }

  return { bySlug, totals: finish(total) };
}
