// Tipos compartidos entre /api/admin/blog/metrics y el panel de Studio Blog.

export type DashboardPeriod = 7 | 30 | 90;

export type PostIssue = { id: string; label: string };

export type DashboardPost = {
  slug: string;
  title: string;
  status: "draft" | "published";
  category?: string;
  publishedAt: string | null;
  updatedAt: string;
  views: number;
  viewsPrev: number;
  viewsTotal: number;
  leadsLast: number;
  leadsAssisted: number;
  gsc: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    queries: Array<{ query: string; clicks: number; impressions: number; position: number }>;
  } | null;
  issues: PostIssue[];
};

export type Opportunity = {
  slug: string;
  title: string;
  kind: "near_first_page" | "low_ctr" | "no_conversion" | "converts" | "stale_draft" | "no_reads";
  headline: string;
  detail: string;
};

export type BlogDashboard = {
  period: { days: DashboardPeriod; from: string; to: string; prevFrom: string };
  analytics: { ready: boolean; error?: string };
  searchConsole: { configured: boolean; ready: boolean; error?: string; siteUrl?: string };
  totals: {
    views: number;
    viewsPrev: number;
    leadsTotal: number;
    leadsWithBlog: number;
    leadsPrevTotal: number;
    leadsPrevWithBlog: number;
    published: number;
    drafts: number;
    gsc: { clicks: number; impressions: number; ctr: number; position: number } | null;
  };
  daily: Array<{ day: string; views: number }>;
  posts: DashboardPost[];
  opportunities: Opportunity[];
};
