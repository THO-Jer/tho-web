// Analítica propia del blog: lecturas por entrada y relación contactos ↔ blog.
// Tablas y funciones en sql/blog_analytics.sql. Solo se usa desde el servidor
// (service role); no guarda datos personales.

const TIME_ZONE = "America/Santiago";
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,159}$/;

export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && SLUG_PATTERN.test(value);
}

// Día calendario en Chile (YYYY-MM-DD).
export function localDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function shiftDay(day: string, delta: number) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_SUPABASE_PUBLIC_URL || "")
    .trim()
    .replace(/^ttps:\/\//, "https://")
    .replace(/\/$/, "");
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, service };
}

export function isAnalyticsConfigured() {
  const { url, service } = getSupabaseEnv();
  return Boolean(url && service);
}

async function supabaseFetch(pathname: string, body: unknown, prefer?: string) {
  const { url, service } = getSupabaseEnv();
  if (!url || !service) throw new Error("Supabase no configurado para analítica del blog.");

  const res = await fetch(`${url}${pathname}`, {
    method: "POST",
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "content-type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase analytics error (${res.status}): ${text}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Mensaje entendible cuando falta correr la migración SQL.
export function describeAnalyticsError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/PGRST202|PGRST205|Could not find the function|Could not find the table|does not exist/i.test(message)) {
    return "Falta ejecutar sql/blog_analytics.sql en Supabase.";
  }
  return message;
}

// ── Escrituras ──────────────────────────────────────────────────────────────

export async function recordBlogView(slug: string) {
  await supabaseFetch("/rest/v1/rpc/increment_blog_view", { p_slug: slug, p_day: localDay() });
}

export type LeadBlogTouch = {
  leadType: string;
  source?: string;
  slug?: string | null;
  slugsRead: string[];
};

export async function recordLeadEvent(touch: LeadBlogTouch) {
  await supabaseFetch(
    "/rest/v1/blog_lead_events",
    {
      lead_type: touch.leadType.slice(0, 40),
      source: touch.source ? touch.source.slice(0, 120) : null,
      slug: touch.slug ?? null,
      slugs_read: touch.slugsRead,
    },
    "return=minimal",
  );
}

// ── Lectura para el panel ───────────────────────────────────────────────────

type SlugCount = { slug: string; views: number };

export type BlogDashboardRaw = {
  views: SlugCount[];
  views_prev: SlugCount[];
  views_total: SlugCount[];
  daily: Array<{ day: string; views: number }>;
  leads: Array<{ slug: string; last_touch: number; assisted: number }>;
  leads_total: number;
  leads_with_blog: number;
  leads_prev_total: number;
  leads_prev_with_blog: number;
};

export async function getBlogDashboardRaw(from: string, to: string, prevFrom: string): Promise<BlogDashboardRaw> {
  const data = (await supabaseFetch("/rest/v1/rpc/blog_dashboard", {
    p_from: from,
    p_to: to,
    p_prev_from: prevFrom,
  })) as Partial<BlogDashboardRaw> | null;

  return {
    views: data?.views ?? [],
    views_prev: data?.views_prev ?? [],
    views_total: data?.views_total ?? [],
    daily: data?.daily ?? [],
    leads: data?.leads ?? [],
    leads_total: data?.leads_total ?? 0,
    leads_with_blog: data?.leads_with_blog ?? 0,
    leads_prev_total: data?.leads_prev_total ?? 0,
    leads_prev_with_blog: data?.leads_prev_with_blog ?? 0,
  };
}
