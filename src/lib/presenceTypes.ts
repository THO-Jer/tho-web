// Tipos compartidos entre /api/admin/presence-metrics y Studio Presencia.

export type PresencePeriod = 7 | 30 | 90;

export type PresenceOpportunity = {
  kind: "topic_potential" | "low_ctr" | "brand_heavy" | "channel_no_leads" | "landing_no_leads" | "ai_traffic" | "heard_from_low";
  headline: string;
  detail: string;
  href?: string;
};

export type PresenceDashboard = {
  period: { days: PresencePeriod; from: string; to: string; prevFrom: string; prevTo: string };
  analytics: { ready: boolean; error?: string };
  searchConsole: { configured: boolean; ready: boolean; error?: string };
  totals: {
    sessions: number;
    sessionsPrev: number;
    views: number;
    leads: number;
    leadsPrev: number;
    leadsWithHeardFrom: number;
  };
  daily: Array<{ day: string; views: number }>;
  channels: Array<{ channel: string; label: string; sessions: number; sessionsPrev: number; leads: number }>;
  sources: Array<{ channel: string; source: string; sessions: number }>;
  heardFrom: Array<{ key: string; label: string; leads: number }>;
  pages: Array<{ path: string; entries: number; views: number; leads: number; gscClicks: number | null; gscImpressions: number | null }>;
  gsc: {
    totals: { clicks: number; impressions: number; ctr: number; position: number };
    prevTotals: { clicks: number; impressions: number; ctr: number; position: number };
    daily: Array<{ day: string; clicks: number; impressions: number }>;
    queries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number; brand: boolean }>;
    brand: { clicks: number; impressions: number };
    topics: { clicks: number; impressions: number };
  } | null;
  opportunities: PresenceOpportunity[];
};
