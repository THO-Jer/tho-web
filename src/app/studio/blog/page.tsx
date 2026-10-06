"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";

import { BrandLoader } from "@/components/BrandLoader";
import { ConfirmDialog } from "@/components/studio/ConfirmDialog";
import { DailyViewsChart } from "@/components/studio/blog/DailyViewsChart";
import type { BlogDashboard, DashboardPeriod, DashboardPost, Opportunity } from "@/lib/blogDashboardTypes";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  status: "draft" | "published";
  updatedAt: string;
  minutes: number;
  tags: string[];
  category?: string;
};

type PostFilter = "all" | "draft" | "published";
type Tab = "panel" | "entries";
type SortKey = "views" | "viewsTotal" | "leads" | "clicks" | "impressions" | "position";

const TAB_KEY = "tho_studio_blog_tab";
const PERIOD_KEY = "tho_studio_blog_period";

// ── Formato ─────────────────────────────────────────────────────────────────

const nf = (n: number) => n.toLocaleString("es-CL");
const pct = (n: number, digits = 1) => `${(n * 100).toLocaleString("es-CL", { maximumFractionDigits: digits, minimumFractionDigits: 0 })}%`;

function delta(current: number, previous: number) {
  if (!previous) return current > 0 ? { text: "nuevo", tone: "up" as const } : null;
  const change = (current - previous) / previous;
  if (Math.abs(change) < 0.005) return { text: "= igual", tone: "flat" as const };
  return {
    text: `${change > 0 ? "▲" : "▼"} ${Math.abs(change * 100).toFixed(0)}%`,
    tone: change > 0 ? ("up" as const) : ("down" as const),
  };
}

function DeltaBadge({ current, previous, suffix }: { current: number; previous: number; suffix?: string }) {
  const d = delta(current, previous);
  if (!d) return null;
  const tone = d.tone === "up" ? "text-emerald-700" : d.tone === "down" ? "text-rose-700" : "text-slate-500";
  return (
    <span className={`text-xs font-medium ${tone}`}>
      {d.text}
      {suffix ? <span className="font-normal text-slate-500"> {suffix}</span> : null}
    </span>
  );
}

const OPPORTUNITY_STYLE: Record<Opportunity["kind"], { icon: string; tone: string }> = {
  converts: { icon: "★", tone: "border-emerald-200 bg-emerald-50" },
  near_first_page: { icon: "↑", tone: "border-sky-200 bg-sky-50" },
  low_ctr: { icon: "✎", tone: "border-amber-200 bg-amber-50" },
  no_conversion: { icon: "→", tone: "border-amber-200 bg-amber-50" },
  stale_draft: { icon: "‖", tone: "border-slate-200 bg-slate-50" },
  no_reads: { icon: "○", tone: "border-slate-200 bg-slate-50" },
};

// ── Página ──────────────────────────────────────────────────────────────────

export default function BlogStudioIndexPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState("");
  const [blockedByOnboarding, setBlockedByOnboarding] = useState(false);
  const [filter, setFilter] = useState<PostFilter>("all");
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>("panel");
  const [period, setPeriod] = useState<DashboardPeriod>(30);
  const [dashboard, setDashboard] = useState<BlogDashboard | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showDrafts, setShowDrafts] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const notice = params.get("notice");
    const slug = params.get("slug");
    if (notice === "created") setMessage(`Entrada creada correctamente${slug ? `: ${slug}` : "."}`);
    if (notice === "updated") setMessage(`Entrada actualizada correctamente${slug ? `: ${slug}` : "."}`);
    // Tras guardar una entrada, volver directo al listado.
    if (notice) setTab("entries");
    else {
      try {
        const savedTab = window.localStorage.getItem(TAB_KEY);
        if (savedTab === "panel" || savedTab === "entries") setTab(savedTab);
      } catch {
        // ignorar
      }
    }
    try {
      const savedPeriod = Number(window.localStorage.getItem(PERIOD_KEY));
      if (savedPeriod === 7 || savedPeriod === 30 || savedPeriod === 90) setPeriod(savedPeriod);
    } catch {
      // ignorar
    }
  }, []);

  function changeTab(next: Tab) {
    setTab(next);
    try {
      window.localStorage.setItem(TAB_KEY, next);
    } catch {
      // ignorar
    }
  }

  function changePeriod(next: DashboardPeriod) {
    setPeriod(next);
    try {
      window.localStorage.setItem(PERIOD_KEY, String(next));
    } catch {
      // ignorar
    }
  }

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data.authenticated || !data.permissions?.canBlog) {
          router.replace("/studio");
          return;
        }
        if (data.email) setEmail(data.email);
        const isSuperAdmin = String(data.role || "") === "superadmin";
        if (!isSuperAdmin) {
          const onboardingRes = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
          const onboarding = await onboardingRes.json();
          if (onboardingRes.ok) {
            const required = Boolean(onboarding?.config?.required ?? true);
            const blockInternal = Boolean(onboarding?.config?.blockInternal ?? false);
            const completed = Boolean(onboarding?.onboarding?.completed);
            const canAccess = onboarding?.onboarding?.can_access || {};
            const moduleAllowed = Boolean(canAccess.blog);
            setBlockedByOnboarding((required && blockInternal && !completed) || !moduleAllowed);
          }
        }
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setCheckingAuth(false));
  }, [router]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudieron cargar las entradas.");
      setPosts(data.posts || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error cargando entradas.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDashboard(days: DashboardPeriod) {
    setDashboardLoading(true);
    setDashboardError("");
    try {
      const res = await fetch(`/api/admin/blog-metrics?days=${days}`, { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudieron cargar las métricas.");
      setDashboard(data as BlogDashboard);
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Error cargando métricas.");
    } finally {
      setDashboardLoading(false);
    }
  }

  useEffect(() => {
    if (checkingAuth) return;
    fetchPosts().catch(() => undefined);
  }, [checkingAuth]);

  useEffect(() => {
    if (checkingAuth) return;
    fetchDashboard(period).catch(() => undefined);
  }, [checkingAuth, period]);

  async function onDelete(slug: string) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar.");
      setPosts((prev) => prev.filter((post) => post.slug !== slug));
      setMessage("Entrada eliminada.");
      fetchDashboard(period).catch(() => undefined);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error eliminando entrada.");
    } finally {
      setLoading(false);
    }
  }

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [posts]
  );

  const visiblePosts = useMemo(() => {
    if (filter === "all") return sortedPosts;
    return sortedPosts.filter((post) => post.status === filter);
  }, [filter, sortedPosts]);

  const counters = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((post) => post.status === "published").length,
      draft: posts.filter((post) => post.status === "draft").length,
    }),
    [posts]
  );

  const metricsBySlug = useMemo(() => new Map((dashboard?.posts ?? []).map((p) => [p.slug, p])), [dashboard]);

  const performanceRows = useMemo(() => {
    const rows = (dashboard?.posts ?? []).filter((p) => showDrafts || p.status === "published");
    const value = (p: DashboardPost): number => {
      switch (sortKey) {
        case "views":
          return p.views;
        case "viewsTotal":
          return p.viewsTotal;
        case "leads":
          return p.leadsAssisted * 1000 + p.leadsLast;
        case "clicks":
          return p.gsc?.clicks ?? -1;
        case "impressions":
          return p.gsc?.impressions ?? -1;
        case "position":
          // menor es mejor; sin datos al final
          return p.gsc && p.gsc.impressions ? -p.gsc.position : -1e9;
      }
    };
    return [...rows].sort((a, b) => value(b) - value(a) || b.viewsTotal - a.viewsTotal);
  }, [dashboard, sortKey, showDrafts]);

  const health = useMemo(() => {
    const published = (dashboard?.posts ?? []).filter((p) => p.status === "published");
    const count = (id: string) => published.filter((p) => p.issues.some((i) => i.id === id)).length;
    return {
      published: published.length,
      clean: published.filter((p) => p.issues.length === 0).length,
      items: [
        { id: "no_cover", label: "Sin imagen de portada", n: count("no_cover") },
        { id: "no_seo_description", label: "Sin descripción SEO", n: count("no_seo_description") },
        { id: "title_long", label: "Título SEO demasiado largo", n: count("title_long") },
        { id: "desc_length", label: "Descripción muy larga o muy corta", n: count("desc_long") + count("desc_short") },
        { id: "no_category", label: "Sin categoría", n: count("no_category") },
        { id: "no_tags", label: "Sin tags", n: count("no_tags") },
      ],
    };
  }, [dashboard]);

  if (blockedByOnboarding) {
    return (
      <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-2xl font-semibold text-amber-900">Bloqueado hasta completar onboarding</h1>
          <p className="mt-2 text-sm text-amber-900">Para acceder a este módulo interno primero debes completar Studio Onboarding.</p>
          <div className="mt-4 flex gap-2">
            <Link href="/studio/onboarding" className="rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white">Ir a onboarding</Link>
            <Link href="/studio/canal-confidencial" className="rounded-lg border border-amber-400 px-4 py-2 text-sm text-amber-900">Canal confidencial</Link>
          </div>
        </section>
      </main>
    );
  }

  if (checkingAuth) {
    return (
      <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10 text-sm text-slate-600">
        <BrandLoader message="Cargando Studio Blog..." />
      </main>
    );
  }

  const totals = dashboard?.totals;
  const gscTotals = totals?.gsc ?? null;

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Studio Blog</h1>
            <p className="mt-2 text-sm text-slate-600">Entraste como {email || "editor"}. Mide qué funciona y gestiona las entradas.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 active:scale-[0.99]">Volver al Studio</Link>
            <Link href="/studio/blog/editor?fresh=1" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.99]">Nueva entrada</Link>
          </div>
        </div>

        {/* Pestañas */}
        <div className="mt-6 flex gap-1 border-b border-slate-200" role="tablist">
          {([
            ["panel", "Centro de comando"],
            ["entries", `Entradas (${counters.all})`],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => changeTab(value)}
              className={`-mb-px rounded-t-lg border px-4 py-2 text-sm font-semibold ${
                tab === value ? "border-slate-200 border-b-white bg-white text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {message ? <p className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{message}</p> : null}

        {tab === "panel" ? (
          <div className="mt-5 space-y-5">
            {/* Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5">
                {([7, 30, 90] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => changePeriod(d)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold ${period === d ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {d} días
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {dashboard ? (
                  <span>
                    {new Date(`${dashboard.period.from}T12:00:00Z`).toLocaleDateString("es-CL", { day: "numeric", month: "short", timeZone: "UTC" })} –{" "}
                    {new Date(`${dashboard.period.to}T12:00:00Z`).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })} · comparado con los {period} días anteriores
                  </span>
                ) : null}
                <button type="button" onClick={() => fetchDashboard(period)} disabled={dashboardLoading} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">
                  {dashboardLoading ? "Actualizando..." : "Actualizar"}
                </button>
              </div>
            </div>

            {dashboardError ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{dashboardError}</p> : null}

            {/* Avisos de configuración */}
            {dashboard && !dashboard.analytics.ready ? (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <strong>La medición de lecturas aún no está activa.</strong> {dashboard.analytics.error}{" "}
                Pasos en <code className="rounded bg-amber-100 px-1">docs/blog-analytics.md</code>.
              </div>
            ) : null}
            {dashboard && !dashboard.searchConsole.ready ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                {dashboard.searchConsole.configured ? (
                  <>
                    <strong>Search Console conectado, pero con error:</strong> {dashboard.searchConsole.error}
                  </>
                ) : (
                  <>
                    <strong>Conecta Google Search Console</strong> para ver clics, posición en Google y las búsquedas que traen a cada entrada.
                    Pasos en <code className="rounded bg-slate-100 px-1">docs/blog-analytics.md</code>.
                  </>
                )}
              </div>
            ) : null}

            {!dashboard && dashboardLoading ? <BrandLoader message="Cargando métricas..." /> : null}

            {dashboard && totals ? (
              <>
                {/* KPIs */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lecturas</div>
                    <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{nf(totals.views)}</div>
                    <div className="mt-1"><DeltaBadge current={totals.views} previous={totals.viewsPrev} suffix="vs. período anterior" /></div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contactos que leyeron el blog</div>
                    <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{nf(totals.leadsWithBlog)}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {totals.leadsTotal
                        ? `${pct(totals.leadsWithBlog / totals.leadsTotal, 0)} de ${nf(totals.leadsTotal)} contactos de la web`
                        : "Aún no hay contactos en el período"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clics desde Google</div>
                    <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{gscTotals ? nf(gscTotals.clicks) : "—"}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {gscTotals ? `${nf(gscTotals.impressions)} apariciones en resultados · ${pct(gscTotals.ctr)} de clics` : "Requiere Search Console"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Posición media en Google</div>
                    <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">
                      {gscTotals && gscTotals.impressions ? gscTotals.position.toLocaleString("es-CL", { maximumFractionDigits: 1 }) : "—"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {gscTotals ? "1–10 = primera página · Google informa con 2–3 días de retraso" : "Requiere Search Console"}
                    </div>
                  </div>
                </div>

                {/* Serie diaria */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">Lecturas por día</h2>
                    <p className="text-xs text-slate-500">Visitas de más de 5 segundos · una por persona y día · sin bots ni equipo con sesión en Studio</p>
                  </div>
                  <div className="mt-4">
                    <DailyViewsChart data={dashboard.daily} />
                  </div>
                </section>

                {/* Acciones + salud */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                  <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="text-lg font-semibold text-slate-900">Qué hacer ahora</h2>
                    <p className="mt-1 text-xs text-slate-500">Sugerencias calculadas con lecturas, contactos y Google.</p>
                    <div className="mt-4 grid grid-cols-1 gap-2">
                      {dashboard.opportunities.map((o) => (
                        <div key={`${o.kind}-${o.slug}`} className={`rounded-xl border p-3 ${OPPORTUNITY_STYLE[o.kind].tone}`}>
                          <div className="flex items-start gap-3">
                            <span aria-hidden className="mt-0.5 w-4 text-center text-sm text-slate-700">{OPPORTUNITY_STYLE[o.kind].icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{o.headline}</div>
                              <div className="mt-0.5 truncate text-sm font-semibold text-slate-900">{o.title}</div>
                              <p className="mt-0.5 text-sm text-slate-700">{o.detail}</p>
                            </div>
                            <Link href={`/studio/blog/editor?slug=${encodeURIComponent(o.slug)}`} className="shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs hover:bg-slate-50">
                              Editar
                            </Link>
                          </div>
                        </div>
                      ))}
                      {!dashboard.opportunities.length ? (
                        <p className="text-sm text-slate-500">
                          Sin sugerencias por ahora. Aparecerán a medida que se acumulen lecturas, contactos y datos de Google.
                        </p>
                      ) : null}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="text-lg font-semibold text-slate-900">Salud editorial</h2>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-2xl font-semibold tabular-nums text-slate-900">{totals.published}</div>
                        <div className="text-xs text-slate-500">Publicadas</div>
                      </div>
                      <button type="button" onClick={() => { changeTab("entries"); setFilter("draft"); }} className="rounded-xl bg-slate-50 p-3 hover:bg-slate-100">
                        <div className="text-2xl font-semibold tabular-nums text-slate-900">{totals.drafts}</div>
                        <div className="text-xs text-slate-500">Borradores</div>
                      </button>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Publicadas con todo en orden: {health.clean} de {health.published}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {health.items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-2">
                          <span className="text-slate-700">{item.label}</span>
                          <span className={`min-w-8 rounded-full px-2 py-0.5 text-center text-xs font-semibold tabular-nums ${item.n ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-500"}`}>
                            {item.n ? item.n : "✓"}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-500">Abre una entrada en la tabla de abajo para ver qué le falta.</p>
                  </section>
                </div>

                {/* Tabla por entrada */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">Rendimiento por entrada</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <label className="flex items-center gap-1.5 text-slate-600">
                        Ordenar por
                        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="rounded-md border border-slate-300 bg-white px-2 py-1">
                          <option value="views">Lecturas del período</option>
                          <option value="viewsTotal">Lecturas históricas</option>
                          <option value="leads">Contactos</option>
                          <option value="clicks">Clics desde Google</option>
                          <option value="impressions">Apariciones en Google</option>
                          <option value="position">Mejor posición en Google</option>
                        </select>
                      </label>
                      <label className="flex items-center gap-1.5 text-slate-600">
                        <input type="checkbox" checked={showDrafts} onChange={(e) => setShowDrafts(e.target.checked)} />
                        Incluir borradores
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="border-b border-slate-200 text-xs text-slate-500">
                        <tr>
                          <th className="py-2 pr-3 font-medium">Entrada</th>
                          <th className="px-2 py-2 text-right font-medium">Lecturas</th>
                          <th className="px-2 py-2 text-right font-medium">Histórico</th>
                          <th className="px-2 py-2 text-right font-medium" title="Contactos que leyeron la entrada antes de escribir (entre paréntesis: fue la última que leyeron)">Contactos</th>
                          <th className="px-2 py-2 text-right font-medium">Clics Google</th>
                          <th className="px-2 py-2 text-right font-medium">Apariciones</th>
                          <th className="px-2 py-2 text-right font-medium">Posición</th>
                          <th className="py-2 pl-2 text-right font-medium">Detalle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceRows.map((p) => {
                          const open = expanded === p.slug;
                          return (
                            <Fragment key={p.slug}>
                              <tr className="border-b border-slate-100 align-top">
                                <td className="py-2.5 pr-3">
                                  <div className="font-medium text-slate-900">{p.title}</div>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                    {p.status === "draft" ? <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold uppercase">Borrador</span> : null}
                                    {p.category ? <span>{p.category}</span> : null}
                                    {p.issues.length ? <span className="text-amber-800">· {p.issues.length} mejora{p.issues.length === 1 ? "" : "s"} pendiente{p.issues.length === 1 ? "" : "s"}</span> : null}
                                  </div>
                                </td>
                                <td className="px-2 py-2.5 text-right">
                                  <div className="tabular-nums text-slate-900">{nf(p.views)}</div>
                                  <DeltaBadge current={p.views} previous={p.viewsPrev} />
                                </td>
                                <td className="px-2 py-2.5 text-right tabular-nums text-slate-600">{nf(p.viewsTotal)}</td>
                                <td className="px-2 py-2.5 text-right tabular-nums">
                                  <span className={p.leadsAssisted ? "font-semibold text-slate-900" : "text-slate-400"}>{p.leadsAssisted}</span>
                                  {p.leadsLast ? <span className="text-xs text-slate-500"> ({p.leadsLast})</span> : null}
                                </td>
                                <td className="px-2 py-2.5 text-right tabular-nums text-slate-700">{p.gsc ? nf(p.gsc.clicks) : "—"}</td>
                                <td className="px-2 py-2.5 text-right tabular-nums text-slate-700">{p.gsc ? nf(p.gsc.impressions) : "—"}</td>
                                <td className="px-2 py-2.5 text-right tabular-nums text-slate-700">
                                  {p.gsc && p.gsc.impressions ? p.gsc.position.toLocaleString("es-CL", { maximumFractionDigits: 1 }) : "—"}
                                </td>
                                <td className="py-2.5 pl-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => setExpanded(open ? null : p.slug)}
                                    aria-expanded={open}
                                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-50"
                                  >
                                    {open ? "Cerrar" : "Ver"}
                                  </button>
                                </td>
                              </tr>
                              {open ? (
                                <tr className="border-b border-slate-100 bg-slate-50/60">
                                  <td colSpan={8} className="px-3 py-3">
                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div>
                                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Búsquedas en Google que la muestran</div>
                                        {p.gsc?.queries.length ? (
                                          <table className="mt-2 w-full text-xs">
                                            <thead className="text-slate-500">
                                              <tr>
                                                <th className="py-1 text-left font-medium">Búsqueda</th>
                                                <th className="py-1 text-right font-medium">Apariciones</th>
                                                <th className="py-1 text-right font-medium">Clics</th>
                                                <th className="py-1 text-right font-medium">Posición</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {p.gsc.queries.map((q) => (
                                                <tr key={q.query} className="border-t border-slate-200">
                                                  <td className="py-1 pr-2 text-slate-800">{q.query}</td>
                                                  <td className="py-1 text-right tabular-nums">{nf(q.impressions)}</td>
                                                  <td className="py-1 text-right tabular-nums">{nf(q.clicks)}</td>
                                                  <td className="py-1 text-right tabular-nums">{q.position.toLocaleString("es-CL", { maximumFractionDigits: 1 })}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        ) : (
                                          <p className="mt-2 text-sm text-slate-500">
                                            {dashboard.searchConsole.ready ? "Google aún no la muestra en búsquedas en este período." : "Disponible al conectar Search Console."}
                                          </p>
                                        )}
                                      </div>
                                      <div>
                                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mejoras pendientes</div>
                                        {p.issues.length ? (
                                          <ul className="mt-2 space-y-1 text-sm text-slate-700">
                                            {p.issues.map((i) => (
                                              <li key={i.id} className="flex gap-2"><span aria-hidden className="text-amber-700">•</span>{i.label}</li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="mt-2 text-sm text-slate-600">✓ Todo en orden.</p>
                                        )}
                                        <div className="mt-3 flex gap-2">
                                          <Link href={`/studio/blog/editor?slug=${encodeURIComponent(p.slug)}`} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">Editar entrada</Link>
                                          {p.status === "published" ? (
                                            <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">Ver en el blog</a>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : null}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                    {!performanceRows.length ? <p className="py-4 text-sm text-slate-500">No hay entradas publicadas todavía.</p> : null}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Contactos: personas que leyeron la entrada en los 30 días previos a escribir por cualquier formulario de la web; entre paréntesis, cuántas la tenían como última lectura.
                  </p>
                </section>
              </>
            ) : null}
          </div>
        ) : (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">Entradas ({visiblePosts.length})</h2>
              <div className="flex flex-wrap items-center gap-2">
                {(["all", "published", "draft"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === option ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700"}`}
                  >
                    {option === "all" ? `Todas (${counters.all})` : option === "published" ? `Publicadas (${counters.published})` : `Borradores (${counters.draft})`}
                  </button>
                ))}
                <button type="button" onClick={() => fetchPosts()} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50" disabled={loading}>
                  {loading ? "Actualizando..." : "Recargar"}
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {visiblePosts.map((post) => {
                const m = metricsBySlug.get(post.slug);
                return (
                  <article key={post.slug} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold uppercase text-slate-500">{post.status === "published" ? "Publicado" : "Borrador"}</div>
                        <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                        <p className="break-all text-xs text-slate-600">/{post.slug} · {post.minutes} min · Editado: {new Date(post.updatedAt).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">Ver</a>
                        <Link href={`/studio/blog/editor?slug=${encodeURIComponent(post.slug)}`} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">Editar</Link>
                        <button type="button" onClick={() => setConfirmDeleteSlug(post.slug)} className="rounded-md border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50" disabled={loading}>Borrar</button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{post.excerpt}</p>
                    {post.category ? <p className="mt-2 text-xs text-slate-500">Categoría: <strong>{post.category}</strong></p> : null}
                    {post.tags?.length ? <p className="mt-1 text-xs text-slate-500">Tags: {post.tags.join(", ")}</p> : null}
                    {m && post.status === "published" && dashboard?.analytics.ready ? (
                      <p className="mt-2 text-xs text-slate-600">
                        <strong className="tabular-nums">{nf(m.views)}</strong> lecturas en {period} días · <strong className="tabular-nums">{nf(m.viewsTotal)}</strong> en total ·{" "}
                        <strong className="tabular-nums">{m.leadsAssisted}</strong> contacto{m.leadsAssisted === 1 ? "" : "s"}
                        {m.gsc ? <> · <strong className="tabular-nums">{nf(m.gsc.clicks)}</strong> clics desde Google</> : null}
                      </p>
                    ) : null}
                  </article>
                );
              })}
              {!visiblePosts.length ? <p className="text-sm text-slate-500">No hay entradas para este filtro.</p> : null}
            </div>
          </section>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeleteSlug)}
        title="Eliminar entrada"
        description={confirmDeleteSlug ? `Se eliminará "${confirmDeleteSlug}" de forma permanente. Esta acción no se puede deshacer.` : undefined}
        confirmLabel="Eliminar"
        destructive
        onCancel={() => setConfirmDeleteSlug(null)}
        onConfirm={() => {
          const slug = confirmDeleteSlug;
          setConfirmDeleteSlug(null);
          if (slug) onDelete(slug).catch(() => undefined);
        }}
      />
    </main>
  );
}
