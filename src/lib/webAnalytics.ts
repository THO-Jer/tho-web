// Analítica del sitio completo (Studio Presencia). Solo servidor.
// Tablas y funciones en sql/web_analytics.sql.

import { localDay, supabaseFetch } from "@/lib/blogAnalytics";
import type { Channel } from "@/lib/webChannels";

// Bots, previsualizadores de enlaces y herramientas de auditoría.
export const BOT_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|embedly|headless|lighthouse|pagespeed|gtmetrix|monitor|uptime|curl|wget|python|axios|node-fetch|go-http|java\//i;

export async function recordWebHit(hit: { path: string; page: boolean; visit: { channel: Channel; source: string } | null }) {
  await supabaseFetch("/rest/v1/rpc/track_web_hit", {
    p_day: localDay(),
    p_path: hit.path,
    p_page: hit.page,
    p_visit: Boolean(hit.visit),
    p_channel: hit.visit?.channel ?? "directo",
    p_source: hit.visit?.source ?? "",
  });
}

export type WebDashboardRaw = {
  channels: Array<{ channel: string; sessions: number; sessions_prev: number }>;
  sources: Array<{ channel: string; source: string; sessions: number }>;
  landings: Array<{ path: string; sessions: number }>;
  pages: Array<{ path: string; views: number }>;
  daily: Array<{ day: string; sessions: number }>;
  views_total: number;
  lead_channels: Array<{ channel: string; leads: number; leads_prev: number }>;
  lead_heard: Array<{ heard_from: string; leads: number }>;
  lead_landings: Array<{ path: string; leads: number }>;
};

export const EMPTY_WEB_RAW: WebDashboardRaw = {
  channels: [],
  sources: [],
  landings: [],
  pages: [],
  daily: [],
  views_total: 0,
  lead_channels: [],
  lead_heard: [],
  lead_landings: [],
};

export async function getWebDashboardRaw(from: string, to: string, prevFrom: string): Promise<WebDashboardRaw> {
  const data = (await supabaseFetch("/rest/v1/rpc/web_dashboard", {
    p_from: from,
    p_to: to,
    p_prev_from: prevFrom,
  })) as Partial<WebDashboardRaw> | null;
  return { ...EMPTY_WEB_RAW, ...(data ?? {}) };
}
