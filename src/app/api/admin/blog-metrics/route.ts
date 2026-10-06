import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import {
  type BlogDashboardRaw,
  describeAnalyticsError,
  getBlogDashboardRaw,
  isAnalyticsConfigured,
  localDay,
  shiftDay,
} from "@/lib/blogAnalytics";
import type { BlogDashboard, DashboardPeriod, DashboardPost, Opportunity, PostIssue } from "@/lib/blogDashboardTypes";
import { type BlogPostMeta, listPostsMeta } from "@/lib/blogStore";
import { type GscBlogPerformance, getBlogSearchPerformance, isSearchConsoleConfigured } from "@/lib/searchConsole";

export const dynamic = "force-dynamic";

const EMPTY_RAW: BlogDashboardRaw = {
  views: [],
  views_prev: [],
  views_total: [],
  daily: [],
  leads: [],
  leads_total: 0,
  leads_with_blog: 0,
  leads_prev_total: 0,
  leads_prev_with_blog: 0,
};

function toMap<T extends { slug: string }>(rows: T[]) {
  const map = new Map<string, T>();
  for (const row of rows) map.set(row.slug, row);
  return map;
}

// Chequeos editoriales y de SEO básicos por entrada.
function postIssues(post: BlogPostMeta): PostIssue[] {
  const issues: PostIssue[] = [];
  const seoTitle = post.seoTitle || `${post.title} | The Human Org`;
  const description = (post.seoDescription || post.excerpt || "").trim();

  if (!post.coverImage) issues.push({ id: "no_cover", label: "Sin imagen de portada (se ve pobre al compartir en redes)" });
  else if (!post.coverImageAlt) issues.push({ id: "no_cover_alt", label: "Portada sin texto alternativo" });
  if (!post.seoDescription) issues.push({ id: "no_seo_description", label: "Sin descripción SEO (Google usará el extracto)" });
  if (description.length > 160) issues.push({ id: "desc_long", label: `Descripción de ${description.length} caracteres: Google la cortará (ideal 120–155)` });
  else if (description.length > 0 && description.length < 70) issues.push({ id: "desc_short", label: `Descripción de solo ${description.length} caracteres (ideal 120–155)` });
  if (seoTitle.length > 60) issues.push({ id: "title_long", label: `Título SEO de ${seoTitle.length} caracteres: Google lo cortará (ideal ≤ 60)` });
  if (!post.category) issues.push({ id: "no_category", label: "Sin categoría" });
  if (!post.tags.length) issues.push({ id: "no_tags", label: "Sin tags (afecta las entradas relacionadas)" });
  return issues;
}

function daysBetween(fromIso: string, to = Date.now()) {
  const t = new Date(fromIso).getTime();
  return Number.isNaN(t) ? 0 : Math.floor((to - t) / 86_400_000);
}

function buildOpportunities(posts: DashboardPost[], days: number): Opportunity[] {
  const items: Array<Opportunity & { score: number }> = [];

  for (const post of posts) {
    if (post.status === "draft") {
      const idle = daysBetween(post.updatedAt);
      if (idle >= 30) {
        items.push({
          slug: post.slug,
          title: post.title,
          kind: "stale_draft",
          headline: "Borrador detenido",
          detail: `Sin cambios hace ${idle} días. Publícalo, retómalo o elimínalo.`,
          score: 10,
        });
      }
      continue;
    }

    const gsc = post.gsc;
    if (gsc && gsc.impressions >= 20 && gsc.position >= 8 && gsc.position <= 20) {
      const q = gsc.queries[0];
      items.push({
        slug: post.slug,
        title: post.title,
        kind: "near_first_page",
        headline: "A un paso de la primera página de Google",
        detail: `Posición media ${gsc.position.toLocaleString("es-CL", { maximumFractionDigits: 1 })}${q ? ` · búsqueda principal: “${q.query}”` : ""}. Amplía el contenido sobre ese tema y enlázala desde otras entradas.`,
        score: 40 + gsc.impressions / 10,
      });
    }
    if (gsc && gsc.impressions >= 100 && gsc.ctr < 0.02) {
      items.push({
        slug: post.slug,
        title: post.title,
        kind: "low_ctr",
        headline: "Google la muestra, pero pocos hacen clic",
        detail: `${gsc.impressions.toLocaleString("es-CL")} apariciones en Google y solo ${(gsc.ctr * 100).toLocaleString("es-CL", { maximumFractionDigits: 1 })}% de clics. Reescribe el título SEO y la descripción para que prometan algo concreto.`,
        score: 35 + gsc.impressions / 20,
      });
    }
    if (post.leadsAssisted > 0) {
      items.push({
        slug: post.slug,
        title: post.title,
        kind: "converts",
        headline: "Esta entrada trae contactos",
        detail: `${post.leadsAssisted} contacto${post.leadsAssisted === 1 ? "" : "s"} la leyó antes de escribir. Promuévela (LinkedIn, newsletter) y enlázala desde las páginas de servicios.`,
        score: 50 + post.leadsAssisted * 10,
      });
    } else if (post.views >= 50) {
      items.push({
        slug: post.slug,
        title: post.title,
        kind: "no_conversion",
        headline: "Se lee, pero no genera contactos",
        detail: `${post.views} lecturas en ${days} días y ningún contacto. Agrega al final un llamado a la acción ligado a un servicio o un recurso descargable.`,
        score: 30 + post.views / 10,
      });
    }
    if (post.views === 0 && post.publishedAt && daysBetween(post.publishedAt) > days) {
      items.push({
        slug: post.slug,
        title: post.title,
        kind: "no_reads",
        headline: "Sin lecturas en el período",
        detail: "Actualízala, compártela de nuevo o enlázala desde una entrada que sí se lea.",
        score: 5,
      });
    }
  }

  return items
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ score: _score, ...item }) => {
      void _score;
      return item;
    });
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session || !session.canBlog) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const requested = Number(req.nextUrl.searchParams.get("days"));
  const days: DashboardPeriod = requested === 7 || requested === 90 ? requested : 30;
  const to = localDay();
  const from = shiftDay(to, -(days - 1));
  const prevFrom = shiftDay(from, -days);

  const gscConfigured = isSearchConsoleConfigured();

  const [postsResult, rawResult, gscResult] = await Promise.allSettled([
    listPostsMeta(),
    isAnalyticsConfigured() ? getBlogDashboardRaw(from, to, prevFrom) : Promise.reject(new Error("Supabase no configurado.")),
    gscConfigured ? getBlogSearchPerformance(from, to) : Promise.resolve(null as GscBlogPerformance | null),
  ]);

  if (postsResult.status === "rejected") {
    const message = postsResult.reason instanceof Error ? postsResult.reason.message : "No se pudieron cargar las entradas.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const posts = postsResult.value;
  const raw = rawResult.status === "fulfilled" ? rawResult.value : EMPTY_RAW;
  const gsc = gscResult.status === "fulfilled" ? gscResult.value : null;

  const views = toMap(raw.views);
  const viewsPrev = toMap(raw.views_prev);
  const viewsTotal = toMap(raw.views_total);
  const leads = toMap(raw.leads);

  const rows: DashboardPost[] = posts.map((post) => {
    const g = gsc?.bySlug[post.slug];
    return {
      slug: post.slug,
      title: post.title,
      status: post.status,
      category: post.category,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      views: views.get(post.slug)?.views ?? 0,
      viewsPrev: viewsPrev.get(post.slug)?.views ?? 0,
      viewsTotal: viewsTotal.get(post.slug)?.views ?? 0,
      leadsLast: leads.get(post.slug)?.last_touch ?? 0,
      leadsAssisted: leads.get(post.slug)?.assisted ?? 0,
      gsc: g ? { clicks: g.clicks, impressions: g.impressions, ctr: g.ctr, position: g.position, queries: g.queries } : null,
      issues: postIssues(post),
    };
  });

  // Serie diaria completa (días sin lecturas = 0).
  const dailyMap = new Map(raw.daily.map((d) => [d.day, d.views]));
  const daily: BlogDashboard["daily"] = [];
  for (let i = 0; i < days; i++) {
    const day = shiftDay(from, i);
    daily.push({ day, views: dailyMap.get(day) ?? 0 });
  }

  const body: BlogDashboard = {
    period: { days, from, to, prevFrom },
    analytics:
      rawResult.status === "fulfilled"
        ? { ready: true }
        : { ready: false, error: describeAnalyticsError(rawResult.reason) },
    searchConsole: {
      configured: gscConfigured,
      ready: gscConfigured && gscResult.status === "fulfilled",
      error: gscResult.status === "rejected" ? (gscResult.reason instanceof Error ? gscResult.reason.message : String(gscResult.reason)) : undefined,
      siteUrl: gscConfigured ? process.env.GSC_SITE_URL || "sc-domain:tho.cl" : undefined,
    },
    totals: {
      views: raw.views.reduce((sum, r) => sum + r.views, 0),
      viewsPrev: raw.views_prev.reduce((sum, r) => sum + r.views, 0),
      leadsTotal: raw.leads_total,
      leadsWithBlog: raw.leads_with_blog,
      leadsPrevTotal: raw.leads_prev_total,
      leadsPrevWithBlog: raw.leads_prev_with_blog,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status === "draft").length,
      gsc: gsc ? gsc.totals : null,
    },
    daily,
    posts: rows,
    opportunities: buildOpportunities(rows, days),
  };

  return NextResponse.json(body);
}
