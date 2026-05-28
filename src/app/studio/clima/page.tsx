"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

// ─── Preguntas basadas en literatura de clima organizacional ───────────────────
// Dimensiones: Bienestar, Equipo, Liderazgo, Propósito, Crecimiento
export const PREGUNTAS = [
  // Bienestar y carga
  { id: "q1", dim: "Bienestar", texto: "Mi carga de trabajo actual es manejable." },
  { id: "q2", dim: "Bienestar", texto: "Puedo desconectarme del trabajo fuera del horario laboral." },
  // Equipo
  { id: "q3", dim: "Equipo", texto: "El equipo colabora bien cuando enfrentamos desafíos." },
  { id: "q4", dim: "Equipo", texto: "Me siento cómodo/a expresando mis opiniones en el equipo." },
  // Liderazgo
  { id: "q5", dim: "Liderazgo", texto: "La dirección comunica con claridad los objetivos y decisiones." },
  { id: "q6", dim: "Liderazgo", texto: "Siento que mi trabajo es reconocido y valorado." },
  // Propósito
  { id: "q7", dim: "Propósito", texto: "El trabajo que hago en THO tiene sentido para mí." },
  { id: "q8", dim: "Propósito", texto: "Me siento parte del equipo THO." },
  // Crecimiento
  { id: "q9",  dim: "Crecimiento", texto: "Tengo oportunidades de aprender y crecer en mi rol." },
  { id: "q10", dim: "Crecimiento", texto: "Recomendaría THO como un buen lugar para trabajar." },
] as const;

const ESCALA = [
  { value: 1, label: "Muy en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Muy de acuerdo" },
];

type Ronda = { id: string; nombre: string; estado: string; created_at: string };
type Respuestas = Record<string, number | string>;

export default function StudioClimaPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [ronda, setRonda] = useState<Ronda | null>(null);
  const [loadingRonda, setLoadingRonda] = useState(true);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [screen, setScreen] = useState<"form" | "done" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthorized(true);
        } else {
          router.replace("/studio");
        }
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setChecking(false));
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    fetch("/api/clima/ronda", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ronda !== undefined) {
          setRonda(data.ronda || null);
        } else if (Array.isArray(data.rondas)) {
          // Admins reciben lista completa — buscar la ronda activa
          setRonda(data.rondas.find((r: Ronda) => r.estado === "activa") || null);
        } else {
          setRonda(null);
        }
      })
      .catch(() => setRonda(null))
      .finally(() => setLoadingRonda(false));
  }, [authorized]);

  const totalPreguntas = PREGUNTAS.length;
  const respondidas = PREGUNTAS.filter((p) => typeof respuestas[p.id] === "number").length;
  const progreso = Math.round((respondidas / totalPreguntas) * 100);
  const completa = respondidas === totalPreguntas;

  function setRespuesta(id: string, value: number) {
    setRespuestas((prev) => ({ ...prev, [id]: value }));
  }

  async function enviar() {
    if (!completa || !ronda) return;
    setEnviando(true);
    setErrorMsg("");
    try {
      const payload: Respuestas = { ...respuestas };
      if (comentario.trim()) payload["comentario"] = comentario.trim();

      const res = await fetch("/api/clima/respuesta", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rondaId: ronda.id, respuestas: payload }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar.");
      }
      setScreen("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Error inesperado.");
      setScreen("error");
    } finally {
      setEnviando(false);
    }
  }

  if (checking) return <BrandLoader />;
  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/studio" className="hover:text-slate-700 transition-colors">Studio</Link>
          <span>/</span>
          <span className="text-slate-700">Encuesta de clima</span>
        </nav>

        {/* Loading ronda */}
        {loadingRonda ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400">Buscando encuesta activa…</p>
          </div>
        ) : !ronda ? (
          /* Sin ronda activa */
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
            <p className="font-tho-title text-3xl text-slate-950">No hay encuesta activa</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Cuando se abra una nueva ronda aparecerá aquí para que la puedas responder.
            </p>
            <Link href="/studio" className="mt-6 inline-block text-sm text-slate-400 hover:text-slate-700 transition-colors">
              ← Volver al Studio
            </Link>
          </div>
        ) : screen === "done" ? (
          /* Enviado */
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-slate-700" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
            </div>
            <h1 className="font-tho-title text-4xl leading-[0.95] text-slate-950">Gracias por responder.</h1>
            <p className="mt-3 text-sm text-slate-500">Tu respuesta fue guardada de forma anónima.</p>
            <Link href="/studio" className="mt-8 text-sm text-slate-400 hover:text-slate-700 transition-colors">
              ← Volver al Studio
            </Link>
          </div>
        ) : (
          /* Formulario */
          <>
            <header className="mb-8">
              <h1 className="font-tho-title text-4xl leading-[0.95] text-slate-950 sm:text-5xl">Encuesta de clima</h1>
              <p className="mt-2 text-sm text-slate-500">{ronda.nombre} · Respuesta anónima</p>

              {/* Barra de progreso */}
              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-[11px] text-slate-400">
                  <span>{respondidas} de {totalPreguntas} preguntas</span>
                  <span>{progreso}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-400 transition-all duration-300"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            </header>

            {/* Preguntas agrupadas por dimensión */}
            {(["Bienestar", "Equipo", "Liderazgo", "Propósito", "Crecimiento"] as const).map((dim) => {
              const qs = PREGUNTAS.filter((p) => p.dim === dim);
              return (
                <section key={dim} className="mb-8">
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">{dim}</p>
                  <div className="space-y-4">
                    {qs.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                        <p className="mb-4 text-[15px] leading-relaxed text-slate-800">{p.texto}</p>
                        <div className="flex flex-wrap gap-2">
                          {ESCALA.map((e) => (
                            <button
                              key={e.value}
                              title={e.label}
                              onClick={() => setRespuesta(p.id, e.value)}
                              className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition-all ${
                                respuestas[p.id] === e.value
                                  ? "border-slate-700 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                              }`}
                            >
                              {e.value}
                            </button>
                          ))}
                          <span className="ml-1 self-center text-[11px] text-slate-300">
                            {typeof respuestas[p.id] === "number"
                              ? ESCALA.find((e) => e.value === respuestas[p.id])?.label
                              : "1 = muy en desacuerdo · 5 = muy de acuerdo"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Comentario opcional */}
            <section className="mb-8">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">Comentario abierto (opcional)</p>
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="mb-3 text-[15px] leading-relaxed text-slate-800">
                  ¿Hay algo que quieras compartir con la dirección?
                </p>
                <textarea
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-300 focus:border-slate-400 transition-colors"
                  rows={3}
                  maxLength={500}
                  placeholder="Escribe aquí… (anónimo)"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
                <p className="mt-1 text-right text-[11px] text-slate-300">{comentario.length}/500</p>
              </div>
            </section>

            {/* Error */}
            {screen === "error" && errorMsg && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            {/* Enviar */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <p className="text-[13px] text-slate-400">
                {completa ? "Todo listo para enviar." : `Faltan ${totalPreguntas - respondidas} respuestas.`}
              </p>
              <button
                onClick={enviar}
                disabled={!completa || enviando}
                className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {enviando ? "Enviando…" : "Enviar encuesta"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
