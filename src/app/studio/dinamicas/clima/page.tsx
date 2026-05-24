"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";
import { PREGUNTAS } from "@/app/studio/clima/page";

type Ronda = {
  id: string;
  nombre: string;
  estado: "activa" | "cerrada";
  created_at: string;
  cerrada_at?: string;
};

type RespuestaRaw = {
  respuestas: Record<string, number | string>;
  created_at: string;
};

const DIMS = ["Bienestar", "Equipo", "Liderazgo", "Propósito", "Crecimiento"] as const;

// Agrega los datos por dimensión y por pregunta
function agregar(rows: RespuestaRaw[]) {
  const byQ: Record<string, number[]> = {};
  const comentarios: string[] = [];

  for (const row of rows) {
    for (const [key, val] of Object.entries(row.respuestas)) {
      if (key === "comentario") {
        if (typeof val === "string" && val.trim()) comentarios.push(val.trim());
      } else if (typeof val === "number") {
        if (!byQ[key]) byQ[key] = [];
        byQ[key].push(val);
      }
    }
  }

  const byDim: Record<string, { avg: number; n: number }> = {};
  for (const dim of DIMS) {
    const pregs = PREGUNTAS.filter((p) => p.dim === dim);
    const vals: number[] = pregs.flatMap((p) => byQ[p.id] || []);
    byDim[dim] = vals.length
      ? { avg: vals.reduce((a, b) => a + b, 0) / vals.length, n: vals.length }
      : { avg: 0, n: 0 };
  }

  return { byQ, byDim, comentarios };
}

function ScoreBar({ score }: { score: number }) {
  const pct = ((score - 1) / 4) * 100;
  const color =
    score >= 4 ? "bg-green-400" : score >= 3 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right text-sm font-semibold text-slate-700">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function DistribucionBar({ vals }: { vals: number[] }) {
  const total = vals.length || 1;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((v) => {
        const count = vals.filter((x) => x === v).length;
        const pct = (count / total) * 100;
        return (
          <div key={v} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-12 w-full items-end justify-center">
              <div
                className="w-full rounded-t bg-slate-200 transition-all"
                style={{ height: `${Math.max(pct, 4)}%` }}
                title={`${count} respuesta${count !== 1 ? "s" : ""}`}
              />
            </div>
            <span className="text-[10px] text-slate-400">{v}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function StudioClimaAdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [rondas, setRondas] = useState<Ronda[]>([]);
  const [rondaActiva, setRondaActiva] = useState<Ronda | null>(null);
  const [selectedRonda, setSelectedRonda] = useState<string>("");
  const [resultados, setResultados] = useState<RespuestaRaw[]>([]);
  const [loadingResultados, setLoadingResultados] = useState(false);
  const [nuevaRonda, setNuevaRonda] = useState("");
  const [creando, setCreando] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [tab, setTab] = useState<"resultados" | "rondas">("resultados");

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.canManageAccess) setAuthorized(true);
        else router.replace("/studio");
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setChecking(false));
  }, [router]);

  const cargarRondas = useCallback(async () => {
    const res = await fetch("/api/clima/ronda", { credentials: "include" });
    const data = await res.json();
    const lista: Ronda[] = data.rondas || [];
    setRondas(lista);
    const activa = lista.find((r) => r.estado === "activa") || null;
    setRondaActiva(activa);
    if (!selectedRonda && lista.length > 0) {
      setSelectedRonda(activa?.id || lista[0].id);
    }
  }, [selectedRonda]);

  useEffect(() => { if (authorized) cargarRondas(); }, [authorized, cargarRondas]);

  const cargarResultados = useCallback(async () => {
    if (!selectedRonda) return;
    setLoadingResultados(true);
    try {
      const res = await fetch(`/api/clima/respuesta?rondaId=${encodeURIComponent(selectedRonda)}`, { credentials: "include" });
      const data = await res.json();
      setResultados(data.respuestas || []);
    } finally {
      setLoadingResultados(false);
    }
  }, [selectedRonda]);

  useEffect(() => { if (authorized && selectedRonda) cargarResultados(); }, [authorized, selectedRonda, cargarResultados]);

  async function crearRonda() {
    if (!nuevaRonda.trim()) return;
    setCreando(true);
    await fetch("/api/clima/ronda", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevaRonda.trim() }),
    });
    setNuevaRonda("");
    await cargarRondas();
    setCreando(false);
  }

  async function toggleRonda(ronda: Ronda) {
    setActualizando(true);
    await fetch("/api/clima/ronda", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rondaId: ronda.id, accion: ronda.estado === "activa" ? "cerrar" : "reabrir" }),
    });
    await cargarRondas();
    setActualizando(false);
  }

  if (checking) return <BrandLoader />;
  if (!authorized) return null;

  const { byQ, byDim, comentarios } = agregar(resultados);
  const rondasOpts = rondas.map((r) => ({ value: r.id, label: r.nombre + (r.estado === "activa" ? " (activa)" : "") }));
  const rondasSeleccionada = rondas.find((r) => r.id === selectedRonda);

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/studio" className="hover:text-slate-700 transition-colors">Studio</Link>
          <span>/</span>
          <Link href="/studio/dinamicas" className="hover:text-slate-700 transition-colors">Dinámicas</Link>
          <span>/</span>
          <span className="text-slate-700">Clima organizacional</span>
        </nav>

        <header className="mb-6">
          <h1 className="font-tho-title text-4xl leading-[0.95] text-slate-950 sm:text-5xl">Clima organizacional</h1>
          <p className="mt-2 text-sm text-slate-500">
            {rondaActiva ? `Ronda activa: ${rondaActiva.nombre}` : "No hay ronda activa en este momento."}
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {(["resultados", "rondas"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all capitalize ${
                tab === t ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "resultados" ? "Resultados" : "Gestionar rondas"}
            </button>
          ))}
        </div>

        {/* ─── TAB: RESULTADOS ─────────────────────────────────────── */}
        {tab === "resultados" && (
          <>
            {/* Selector de ronda */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <select
                value={selectedRonda}
                onChange={(e) => setSelectedRonda(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
              >
                {rondasOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                onClick={cargarResultados}
                disabled={loadingResultados}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
              >
                {loadingResultados ? "Cargando…" : "Actualizar"}
              </button>
              <span className="text-sm text-slate-400">
                {resultados.length} respuesta{resultados.length !== 1 ? "s" : ""}
              </span>
              <Link
                href="/studio/clima"
                className="ml-auto text-sm text-slate-400 hover:text-slate-700 transition-colors"
                target="_blank"
              >
                Ver encuesta del equipo ↗
              </Link>
            </div>

            {loadingResultados ? (
              <div className="py-12 text-center text-sm text-slate-400">Cargando resultados…</div>
            ) : resultados.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
                <p className="text-sm text-slate-400">
                  {rondasSeleccionada ? `Aún no hay respuestas para "${rondasSeleccionada.nombre}".` : "Selecciona una ronda."}
                </p>
              </div>
            ) : (
              <>
                {/* Resumen por dimensión */}
                <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-sm font-semibold text-slate-700">Promedio por dimensión</h2>
                  <div className="space-y-3">
                    {DIMS.map((dim) => {
                      const { avg, n } = byDim[dim];
                      return (
                        <div key={dim}>
                          <div className="mb-1 flex justify-between text-[12px]">
                            <span className="text-slate-600">{dim}</span>
                            <span className="text-slate-400">{n} resp.</span>
                          </div>
                          <ScoreBar score={avg} />
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-[11px] text-slate-300">Escala 1–5 · Verde ≥ 4 · Amarillo ≥ 3 · Rojo &lt; 3</p>
                </section>

                {/* Detalle por pregunta */}
                <section className="mb-8">
                  <h2 className="mb-4 text-sm font-semibold text-slate-700">Detalle por pregunta</h2>
                  <div className="space-y-3">
                    {PREGUNTAS.map((p) => {
                      const vals = byQ[p.id] || [];
                      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
                      return (
                        <div key={p.id} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <p className="text-[13px] leading-relaxed text-slate-700">{p.texto}</p>
                            <span className="shrink-0 rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-400">{p.dim}</span>
                          </div>
                          {vals.length > 0 ? (
                            <>
                              <ScoreBar score={avg} />
                              <div className="mt-3">
                                <DistribucionBar vals={vals} />
                              </div>
                              <p className="mt-1 text-[11px] text-slate-300">{vals.length} respuesta{vals.length !== 1 ? "s" : ""}</p>
                            </>
                          ) : (
                            <p className="text-[12px] text-slate-300">Sin respuestas.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Comentarios */}
                {comentarios.length > 0 && (
                  <section className="mb-8">
                    <h2 className="mb-4 text-sm font-semibold text-slate-700">
                      Comentarios abiertos <span className="font-normal text-slate-400">({comentarios.length})</span>
                    </h2>
                    <div className="space-y-3">
                      {comentarios.map((c, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                          <p className="text-[14px] leading-relaxed text-slate-700">{c}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}

        {/* ─── TAB: GESTIONAR RONDAS ───────────────────────────────── */}
        {tab === "rondas" && (
          <>
            {/* Nueva ronda */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Abrir nueva ronda</h2>
              <p className="mb-3 text-[13px] text-slate-500">
                Al crear una ronda, la anterior (si está activa) se cerrará automáticamente.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ej: Clima Mayo 2026"
                  value={nuevaRonda}
                  onChange={(e) => setNuevaRonda(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && crearRonda()}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
                />
                <button
                  onClick={crearRonda}
                  disabled={creando || !nuevaRonda.trim()}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40"
                >
                  {creando ? "Creando…" : "Crear y abrir"}
                </button>
              </div>
            </div>

            {/* Lista de rondas */}
            <div className="space-y-3">
              {rondas.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">{r.nombre}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                        r.estado === "activa"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        {r.estado === "activa" ? "Activa" : "Cerrada"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Creada {new Date(r.created_at).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
                      {r.cerrada_at && ` · Cerrada ${new Date(r.cerrada_at).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}`}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleRonda(r)}
                    disabled={actualizando}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
                  >
                    {r.estado === "activa" ? "Cerrar" : "Reabrir"}
                  </button>
                </div>
              ))}

              {rondas.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
                  <p className="text-sm text-slate-400">Aún no hay rondas. Crea la primera arriba.</p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-10 border-t border-slate-100 pt-6">
          <Link href="/studio/dinamicas" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
            ← Volver a Dinámicas
          </Link>
        </div>
      </div>
    </main>
  );
}
