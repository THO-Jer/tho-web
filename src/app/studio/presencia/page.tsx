"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BrandLoader } from "@/components/BrandLoader";
import { DailyViewsChart } from "@/components/studio/blog/DailyViewsChart";
import type { PresenceDashboard, PresenceOpportunity, PresencePeriod } from "@/lib/presenceTypes";

const PERIOD_KEY = "tho_studio_presencia_period";
const BAR_COLOR = "#1e71b8"; // azul THO, misma serie en todo el panel

const nf = (n: number) => n.toLocaleString("es-CL");
const pct = (n: number, digits = 0) => `${(n * 100).toLocaleString("es-CL", { maximumFractionDigits: digits })}%`;

function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous) return current > 0 ? <span className="text-xs font-medium text-emerald-700">nuevo</span> : null;
  const change = (current - previous) / previous;
  if (Math.abs(change) < 0.005) return <span className="text-xs text-slate-500">= igual</span>;
  return (
    <span className={`text-xs font-medium ${change > 0 ? "text-emerald-700" : "text-rose-700"}`}>
      {change > 0 ? "▲" : "▼"} {Math.abs(change * 100).toFixed(0)}%
      <span className="font-normal text-slate-500"> vs. período anterior</span>
    </span>
  );
}

// Lista de barras horizontales con valor directo (una sola serie, sin leyenda).
function BarList({ rows, total, extra }: { rows: Array<{ key: string; label: string; value: number; note?: string }>; total: number; extra?: (key: string) => React.ReactNode }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.key} title={`${r.label}: ${nf(r.value)}`}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-slate-800">{r.label}</span>
            <span className="shrink-0 tabular-nums text-slate-900">
              <strong>{nf(r.value)}</strong>
              {total ? <span className="ml-1 text-xs text-slate-500">{pct(r.value / total)}</span> : null}
            </span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
            <div className="h-2 rounded-full" style={{ width: `${(r.value / max) * 100}%`, minWidth: r.value ? 4 : 0, backgroundColor: BAR_COLOR }} />
          </div>
          {r.note || extra ? (
            <div className="mt-0.5 text-xs text-slate-500">
              {r.note}
              {extra?.(r.key)}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const OPP_ICON: Record<PresenceOpportunity["kind"], string> = {
  topic_potential: "↑",
  low_ctr: "✎",
  brand_heavy: "◎",
  channel_no_leads: "→",
  landing_no_leads: "→",
  ai_traffic: "✦",
  heard_from_low: "?",
};

export default function StudioPresenciaPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [canBlog, setCanBlog] = useState(false);
  const [period, setPeriod] = useState<PresencePeriod>(30);
  const [data, setData] = useState<PresenceDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryFilter, setQueryFilter] = useState<"topics" | "brand" | "all">("topics");

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(PERIOD_KEY));
      if (saved === 7 || saved === 30 || saved === 90) setPeriod(saved);
    } catch {
      // ignorar
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then(async (session) => {
        const p = session.permissions || {};
        const isSuperAdmin = String(session.role || "") === "superadmin";
        if (!session.authenticated || !(p.canBlog || p.canCrm || isSuperAdmin)) {
          router.replace("/studio");
          return;
        }
        setCanBlog(Boolean(p.canBlog));
        if (!isSuperAdmin) {
          const res = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
          const onboarding = await res.json();
          if (res.ok) {
            const required = Boolean(onboarding?.config?.required ?? true);
            const blockInternal = Boolean(onboarding?.config?.blockInternal ?? false);
            const completed = Boolean(onboarding?.onboarding?.completed);
            setBlocked(required && blockInternal && !completed);
          }
        }
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setCheckingAuth(false));
  }, [router]);

  async function load(days: PresencePeriod) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/presence-metrics?days=${days}`, { credentials: "include", cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudieron cargar las métricas.");
      setData(json as PresenceDashboard);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando métricas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (checkingAuth || blocked) return;
    load(period).catch(() => undefined);
  }, [checkingAuth, blocked, period]);

  function changePeriod(next: PresencePeriod) {
    setPeriod(next);
    try {
      window.localStorage.setItem(PERIOD_KEY, String(next));
    } catch {
      // ignorar
    }
  }

  const queries = useMemo(() => {
    const list = data?.gsc?.queries ?? [];
    const filtered = queryFilter === "all" ? list : list.filter((q) => (queryFilter === "brand" ? q.brand : !q.brand));
    return filtered.slice(0, 25);
  }, [data, queryFilter]);

  if (checkingAuth) {
    return (
      <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10 text-sm text-slate-600">
        <BrandLoader message="Cargando Studio Presencia..." />
      </main>
    );
  }

  if (blocked) {
    return (
      <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-2xl font-semibold text-amber-900">Bloqueado hasta completar onboarding</h1>
          <p className="mt-2 text-sm text-amber-900">Para acceder a este módulo interno primero debes completar Studio Onboarding.</p>
          <Link href="/studio/onboarding" className="mt-4 inline-flex rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white">Ir a onboarding</Link>
        </section>
      </main>
    );
  }

  const t = data?.totals;
  const g = data?.gsc ?? null;
  const knownGoogleClicks = g ? g.brand.clicks + g.topics.clicks : 0;
  const answered = (data?.heardFrom ?? []).filter((h) => h.key !== "sin_respuesta");
  const totalHeard = answered.reduce((s, h) => s + h.leads, 0);
  const noAnswer = (data?.heardFrom ?? []).find((h) => h.key === "sin_respuesta")?.leads ?? 0;
  const visitChannels = (data?.channels ?? []).filter((c) => c.sessions > 0);
  const unknownLeads = (data?.channels ?? []).filter((c) => c.sessions === 0).reduce((s, c) => s + c.leads, 0);

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Studio Presencia</h1>
            <p className="mt-2 text-sm text-slate-600">Cómo encuentran a THO: canales de llegada, Google y origen de los contactos.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver al Studio</Link>
            {canBlog ? <Link href="/studio/blog" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Studio Blog</Link> : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
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
            {data ? (
              <span>
                {new Date(`${data.period.from}T12:00:00Z`).toLocaleDateString("es-CL", { day: "numeric", month: "short", timeZone: "UTC" })} –{" "}
                {new Date(`${data.period.to}T12:00:00Z`).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })} · comparado con los {period} días anteriores
              </span>
            ) : null}
            <button type="button" onClick={() => load(period)} disabled={loading} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs hover:bg-slate-50">
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p> : null}

        {data && !data.analytics.ready ? (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>La medición del sitio aún no está activa.</strong> {data.analytics.error} Pasos en <code className="rounded bg-amber-100 px-1">docs/studio-presencia.md</code>.
          </div>
        ) : null}
        {data && !data.searchConsole.ready ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            {data.searchConsole.configured ? (
              <><strong>Search Console con error:</strong> {data.searchConsole.error}</>
            ) : (
              <><strong>Search Console no está conectado.</strong> Los pasos están en <code className="rounded bg-slate-100 px-1">docs/blog-analytics.md</code>.</>
            )}
          </div>
        ) : null}

        {!data && loading ? <div className="mt-6"><BrandLoader message="Cargando métricas..." /></div> : null}

        {data && t ? (
          <div className="mt-5 space-y-5">
            {/* KPIs */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Visitas al sitio</div>
                <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{nf(t.sessions)}</div>
                <div className="mt-1"><Delta current={t.sessions} previous={t.sessionsPrev} /></div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contactos</div>
                <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{nf(t.leads)}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {t.sessions ? `${pct(t.leads / t.sessions, 1)} de las visitas termina en contacto` : "Todos los formularios de la web"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clics desde Google</div>
                <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{g ? nf(g.totals.clicks) : "—"}</div>
                <div className="mt-1">{g ? <Delta current={g.totals.clicks} previous={g.prevTotals.clicks} /> : <span className="text-xs text-slate-500">Requiere Search Console</span>}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Apariciones en Google</div>
                <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{g ? nf(g.totals.impressions) : "—"}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {g && g.totals.impressions ? `Posición media ${g.totals.position.toLocaleString("es-CL", { maximumFractionDigits: 1 })} · 2–3 días de retraso` : "Requiere Search Console"}
                </div>
              </div>
            </div>

            {/* Serie diaria */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Visitas por día</h2>
                <p className="text-xs text-slate-500">Una visita = una persona navegando (se renueva tras 30 min sin actividad) · sin bots ni equipo con sesión en Studio</p>
              </div>
              <div className="mt-4"><DailyViewsChart data={data.daily} unitLabel="visitas" /></div>
            </section>

            {/* Canales + cómo supieron */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Cómo llegan al sitio</h2>
                <p className="mt-1 text-xs text-slate-500">Visitas por canal. Debajo, contactos que llegaron por primera vez por ese canal.</p>
                <div className="mt-4">
                  {visitChannels.length ? (
                    <BarList
                      rows={visitChannels.map((c) => ({ key: c.channel, label: c.label, value: c.sessions }))}
                      total={t.sessions}
                      extra={(key) => {
                        const c = data.channels.find((x) => x.channel === key);
                        if (!c) return null;
                        return (
                          <span>
                            {c.leads} contacto{c.leads === 1 ? "" : "s"}
                            {c.sessions ? ` · ${pct(c.leads / c.sessions, 1)} de conversión` : ""}
                          </span>
                        );
                      }}
                    />
                  ) : (
                    <p className="text-sm text-slate-500">Aún no hay visitas registradas en el período.</p>
                  )}
                </div>
                {unknownLeads ? (
                  <p className="mt-3 text-xs text-slate-500">
                    {unknownLeads} contacto{unknownLeads === 1 ? "" : "s"} sin datos de origen (llegaron antes de activar la medición o con el almacenamiento del navegador bloqueado).
                  </p>
                ) : null}
                {data.sources.length ? (
                  <details className="mt-4 text-sm">
                    <summary className="cursor-pointer select-none text-xs text-slate-500 hover:text-slate-700">Ver fuentes específicas ({data.sources.length})</summary>
                    <table className="mt-2 w-full text-xs">
                      <tbody>
                        {data.sources.map((s) => (
                          <tr key={`${s.channel}-${s.source}`} className="border-t border-slate-100">
                            <td className="py-1 pr-2 text-slate-800">{s.source}</td>
                            <td className="py-1 pr-2 text-slate-500">{data.channels.find((c) => c.channel === s.channel)?.label.split(" (")[0] ?? s.channel}</td>
                            <td className="py-1 text-right tabular-nums">{nf(s.sessions)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                ) : null}
              </section>

              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Cómo supieron de THO</h2>
                <p className="mt-1 text-xs text-slate-500">Lo que responden en el formulario de contacto. Capta lo que la analítica no ve: recomendaciones, eventos, relaciones.</p>
                <div className="mt-4">
                  {answered.length ? (
                    <BarList rows={answered.map((h) => ({ key: h.key, label: h.label, value: h.leads }))} total={totalHeard} />
                  ) : (
                    <p className="text-sm text-slate-500">Aún no hay contactos con respuesta en el período.</p>
                  )}
                  {noAnswer ? (
                    <p className="mt-3 text-xs text-slate-500">
                      {noAnswer === 1
                        ? "1 contacto no respondió (o usó un formulario sin la pregunta)."
                        : `${noAnswer} contactos no respondieron (o usaron un formulario sin la pregunta).`}{" "}
                      Porcentajes sobre quienes respondieron.
                    </p>
                  ) : null}
                </div>
                {g && knownGoogleClicks ? (
                  <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">En Google buscan…</div>
                    <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div style={{ width: `${(g.brand.clicks / knownGoogleClicks) * 100}%`, backgroundColor: BAR_COLOR }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-slate-600">
                      <span><strong className="text-slate-900">{pct(g.brand.clicks / knownGoogleClicks)}</strong> por el nombre de THO</span>
                      <span><strong className="text-slate-900">{pct(g.topics.clicks / knownGoogleClicks)}</strong> por temas</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">Sobre los clics con búsqueda conocida (Google oculta las búsquedas poco frecuentes).</p>
                  </div>
                ) : null}
              </section>
            </div>

            {/* Qué hacer ahora */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">Qué hacer ahora</h2>
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {data.opportunities.map((o, i) => (
                  <div key={`${o.kind}-${i}`} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span aria-hidden className="mt-0.5 w-4 text-center text-sm text-slate-700">{OPP_ICON[o.kind]}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{o.headline}</div>
                      <p className="mt-0.5 text-sm text-slate-700">{o.detail}</p>
                      {o.href && canBlog ? <Link href={o.href} className="mt-1.5 inline-flex text-xs font-semibold text-slate-900 underline underline-offset-2">Escribir una entrada</Link> : null}
                    </div>
                  </div>
                ))}
                {!data.opportunities.length ? (
                  <p className="text-sm text-slate-500">Sin sugerencias por ahora. Aparecerán a medida que se acumulen visitas, contactos y datos de Google.</p>
                ) : null}
              </div>
            </section>

            {/* Búsquedas en Google */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Búsquedas en Google</h2>
                <div className="flex items-center gap-1 rounded-lg border border-slate-300 p-0.5 text-xs">
                  {([["topics", "Por temas"], ["brand", "Por nombre de THO"], ["all", "Todas"]] as const).map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setQueryFilter(value)} className={`rounded-md px-2.5 py-1 font-semibold ${queryFilter === value ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {g ? (
                queries.length ? (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead className="border-b border-slate-200 text-xs text-slate-500">
                        <tr>
                          <th className="py-2 pr-3 font-medium">Búsqueda</th>
                          <th className="px-2 py-2 text-right font-medium">Apariciones</th>
                          <th className="px-2 py-2 text-right font-medium">Clics</th>
                          <th className="px-2 py-2 text-right font-medium">% clics</th>
                          <th className="py-2 pl-2 text-right font-medium">Posición</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queries.map((q) => (
                          <tr key={q.query} className="border-b border-slate-100">
                            <td className="py-2 pr-3 text-slate-800">{q.query}</td>
                            <td className="px-2 py-2 text-right tabular-nums">{nf(q.impressions)}</td>
                            <td className="px-2 py-2 text-right tabular-nums">{nf(q.clicks)}</td>
                            <td className="px-2 py-2 text-right tabular-nums text-slate-600">{pct(q.ctr, 1)}</td>
                            <td className="py-2 pl-2 text-right tabular-nums">{q.position.toLocaleString("es-CL", { maximumFractionDigits: 1 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Sin búsquedas en este filtro todavía.</p>
                )
              ) : (
                <p className="mt-3 text-sm text-slate-500">Disponible al conectar Search Console.</p>
              )}
            </section>

            {/* Páginas */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">Páginas del sitio</h2>
              <p className="mt-1 text-xs text-slate-500">
                Entradas: visitas que empezaron en esa página. Contactos: personas que llegaron al sitio por primera vez por esa página.
              </p>
              {data.pages.length ? (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-slate-200 text-xs text-slate-500">
                      <tr>
                        <th className="py-2 pr-3 font-medium">Página</th>
                        <th className="px-2 py-2 text-right font-medium">Entradas</th>
                        <th className="px-2 py-2 text-right font-medium">Vistas</th>
                        <th className="px-2 py-2 text-right font-medium">Contactos</th>
                        <th className="px-2 py-2 text-right font-medium">Clics Google</th>
                        <th className="py-2 pl-2 text-right font-medium">Apariciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.pages.map((p) => (
                        <tr key={p.path} className="border-b border-slate-100">
                          <td className="py-2 pr-3">
                            <a href={p.path} target="_blank" rel="noreferrer" className="break-all text-slate-800 hover:underline">{p.path === "/" ? "/ (inicio)" : p.path}</a>
                          </td>
                          <td className="px-2 py-2 text-right tabular-nums">{nf(p.entries)}</td>
                          <td className="px-2 py-2 text-right tabular-nums text-slate-600">{nf(p.views)}</td>
                          <td className="px-2 py-2 text-right tabular-nums">
                            <span className={p.leads ? "font-semibold text-slate-900" : "text-slate-400"}>{p.leads}</span>
                          </td>
                          <td className="px-2 py-2 text-right tabular-nums text-slate-600">{p.gscClicks === null ? "—" : nf(p.gscClicks)}</td>
                          <td className="py-2 pl-2 text-right tabular-nums text-slate-600">{p.gscImpressions === null ? "—" : nf(p.gscImpressions)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Aún no hay páginas con datos en el período.</p>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
