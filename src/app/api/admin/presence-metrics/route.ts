import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { isAnalyticsConfigured, localDay, shiftDay } from "@/lib/blogAnalytics";
import type { PresenceDashboard, PresenceOpportunity, PresencePeriod } from "@/lib/presenceTypes";
import { type GscSitePerformance, getSitePerformance, isSearchConsoleConfigured } from "@/lib/searchConsole";
import { CHANNELS, HEARD_FROM, isChannel, isHeardFrom } from "@/lib/webChannels";
import { EMPTY_WEB_RAW, getWebDashboardRaw } from "@/lib/webAnalytics";

export const dynamic = "force-dynamic";

function channelLabel(channel: string) {
  if (isChannel(channel)) return CHANNELS[channel].label;
  return "Sin datos de origen";
}

function describeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/PGRST202|PGRST205|Could not find the function|Could not find the table|does not exist/i.test(message)) {
    return "Falta ejecutar sql/web_analytics.sql en Supabase.";
  }
  return message;
}

const fmt = (n: number, digits = 1) => n.toLocaleString("es-CL", { maximumFractionDigits: digits });

function buildOpportunities(d: Omit<PresenceDashboard, "opportunities">): PresenceOpportunity[] {
  const out: PresenceOpportunity[] = [];
  const gsc = d.gsc;

  if (gsc) {
    const topics = gsc.queries
      .filter((q) => !q.brand && q.impressions >= 30 && q.position >= 4 && q.position <= 20)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 3);
    for (const q of topics) {
      out.push({
        kind: "topic_potential",
        headline: "Tema con potencial en Google",
        detail: `“${q.query}”: ${fmt(q.impressions, 0)} apariciones, posición media ${fmt(q.position)}. Escribe o refuerza una entrada o página de servicio sobre ese tema y enlázala desde el inicio.`,
        href: "/studio/blog/editor?fresh=1",
      });
    }

    const brandClicks = gsc.brand.clicks;
    const knownClicks = gsc.brand.clicks + gsc.topics.clicks;
    if (knownClicks >= 10 && brandClicks / knownClicks > 0.7) {
      out.push({
        kind: "brand_heavy",
        headline: "Te encuentran sobre todo quienes ya te conocen",
        detail: `${fmt((brandClicks / knownClicks) * 100, 0)}% de los clics desde Google vienen de búsquedas por el nombre de THO. Google todavía no asocia el sitio a los temas en que trabajas: el blog y las páginas de servicio son la vía para cambiar eso.`,
      });
    }
  }

  for (const p of d.pages) {
    if (p.gscImpressions !== null && p.gscImpressions >= 100 && p.gscClicks !== null && p.gscClicks / p.gscImpressions < 0.02) {
      out.push({
        kind: "low_ctr",
        headline: "Aparece en Google, pero casi nadie hace clic",
        detail: `${p.path}: ${fmt(p.gscImpressions, 0)} apariciones y ${fmt((p.gscClicks / p.gscImpressions) * 100)}% de clics. Revisa su título y descripción: deben decir qué problema resuelve THO.`,
      });
    }
    if (p.entries >= 40 && p.leads === 0 && !p.path.startsWith("/blog/")) {
      out.push({
        kind: "landing_no_leads",
        headline: "Mucha gente entra por aquí, nadie escribe",
        detail: `${p.path}: ${fmt(p.entries, 0)} visitas empezaron en esta página y ningún contacto. Agrega un llamado a la acción visible (agendar, escribir, descargar un recurso).`,
      });
    }
  }

  for (const c of d.channels) {
    if (c.channel !== "directo" && c.sessions >= 30 && c.leads === 0) {
      out.push({
        kind: "channel_no_leads",
        headline: `${CHANNELS[c.channel as keyof typeof CHANNELS]?.short ?? c.channel}: visitas sin contactos`,
        detail: `${fmt(c.sessions, 0)} visitas en el período y ningún contacto que haya llegado por este canal. Revisa a qué página aterrizan esas visitas y si allí está claro el siguiente paso.`,
      });
    }
  }

  const ai = d.channels.find((c) => c.channel === "ia");
  if (ai && ai.sessions > 0) {
    out.push({
      kind: "ai_traffic",
      headline: "Ya llegan visitas desde asistentes de IA",
      detail: `${fmt(ai.sessions, 0)} visitas desde ChatGPT, Perplexity u otros. Estos asistentes citan páginas claras y con autoría: definiciones precisas, casos y datos concretos ayudan a que recomienden a THO.`,
    });
  }

  if (d.totals.leads >= 5 && d.totals.leadsWithHeardFrom / d.totals.leads < 0.3) {
    out.push({
      kind: "heard_from_low",
      headline: "Pocos responden “¿Cómo supiste de THO?”",
      detail: `Solo ${d.totals.leadsWithHeardFrom} de ${d.totals.leads} contactos respondió. Pregúntalo también en la primera reunión y regístralo en el CRM: es el dato que mejor muestra el peso de las recomendaciones.`,
    });
  }

  return out.slice(0, 8);
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session || !(session.canBlog || session.canCrm || session.isSuperAdmin)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const requested = Number(req.nextUrl.searchParams.get("days"));
  const days: PresencePeriod = requested === 7 || requested === 90 ? requested : 30;
  const to = localDay();
  const from = shiftDay(to, -(days - 1));
  const prevFrom = shiftDay(from, -days);
  const prevTo = shiftDay(from, -1);

  const gscConfigured = isSearchConsoleConfigured();
  const [rawResult, gscResult] = await Promise.allSettled([
    isAnalyticsConfigured() ? getWebDashboardRaw(from, to, prevFrom) : Promise.reject(new Error("Supabase no configurado.")),
    gscConfigured ? getSitePerformance(from, to, prevFrom, prevTo) : Promise.resolve(null as GscSitePerformance | null),
  ]);

  const raw = rawResult.status === "fulfilled" ? rawResult.value : EMPTY_WEB_RAW;
  const gsc = gscResult.status === "fulfilled" ? gscResult.value : null;

  // Canales: visitas + contactos (por primer canal de llegada).
  const leadsByChannel = new Map(raw.lead_channels.map((c) => [c.channel, c]));
  const channelKeys = new Set<string>([...raw.channels.map((c) => c.channel), ...raw.lead_channels.filter((c) => c.leads > 0).map((c) => c.channel)]);
  const channels = Array.from(channelKeys)
    .map((channel) => {
      const s = raw.channels.find((c) => c.channel === channel);
      return {
        channel,
        label: channelLabel(channel),
        sessions: s?.sessions ?? 0,
        sessionsPrev: s?.sessions_prev ?? 0,
        leads: leadsByChannel.get(channel)?.leads ?? 0,
      };
    })
    .filter((c) => c.sessions > 0 || c.leads > 0)
    .sort((a, b) => b.sessions - a.sessions || b.leads - a.leads);

  const heardFrom = raw.lead_heard.map((h) => ({
    key: h.heard_from,
    label: isHeardFrom(h.heard_from) ? HEARD_FROM[h.heard_from] : "No respondió",
    leads: h.leads,
  }));

  // Páginas: entradas, vistas, contactos que entraron por ahí y Google.
  const pageMap = new Map<string, { path: string; entries: number; views: number; leads: number; gscClicks: number | null; gscImpressions: number | null }>();
  const page = (path: string) => {
    let row = pageMap.get(path);
    if (!row) {
      row = { path, entries: 0, views: 0, leads: 0, gscClicks: null, gscImpressions: null };
      pageMap.set(path, row);
    }
    return row;
  };
  for (const l of raw.landings) page(l.path).entries += l.sessions;
  for (const p of raw.pages) page(p.path).views += p.views;
  for (const l of raw.lead_landings) page(l.path).leads += l.leads;
  for (const g of gsc?.pages ?? []) {
    const row = page(g.path);
    row.gscClicks = (row.gscClicks ?? 0) + g.clicks;
    row.gscImpressions = (row.gscImpressions ?? 0) + g.impressions;
  }
  const pages = Array.from(pageMap.values())
    .sort((a, b) => b.entries - a.entries || b.views - a.views || (b.gscImpressions ?? 0) - (a.gscImpressions ?? 0))
    .slice(0, 40);

  const dailyMap = new Map(raw.daily.map((d) => [d.day, d.sessions]));
  const daily: PresenceDashboard["daily"] = [];
  for (let i = 0; i < days; i++) {
    const day = shiftDay(from, i);
    daily.push({ day, views: dailyMap.get(day) ?? 0 });
  }

  const leads = raw.lead_channels.reduce((sum, c) => sum + c.leads, 0);
  const base: Omit<PresenceDashboard, "opportunities"> = {
    period: { days, from, to, prevFrom, prevTo },
    analytics: rawResult.status === "fulfilled" ? { ready: true } : { ready: false, error: describeError(rawResult.reason) },
    searchConsole: {
      configured: gscConfigured,
      ready: gscConfigured && gscResult.status === "fulfilled",
      error: gscResult.status === "rejected" ? (gscResult.reason instanceof Error ? gscResult.reason.message : String(gscResult.reason)) : undefined,
    },
    totals: {
      sessions: raw.channels.reduce((sum, c) => sum + c.sessions, 0),
      sessionsPrev: raw.channels.reduce((sum, c) => sum + c.sessions_prev, 0),
      views: raw.views_total,
      leads,
      leadsPrev: raw.lead_channels.reduce((sum, c) => sum + c.leads_prev, 0),
      leadsWithHeardFrom: raw.lead_heard.filter((h) => h.heard_from !== "sin_respuesta").reduce((sum, h) => sum + h.leads, 0),
    },
    daily,
    channels,
    sources: raw.sources,
    heardFrom,
    pages,
    gsc: gsc
      ? {
          totals: gsc.totals,
          prevTotals: gsc.prevTotals,
          daily: gsc.daily,
          queries: gsc.queries.slice(0, 100),
          brand: gsc.brand,
          topics: gsc.topics,
        }
      : null,
  };

  return NextResponse.json({ ...base, opportunities: buildOpportunities(base) } satisfies PresenceDashboard);
}
