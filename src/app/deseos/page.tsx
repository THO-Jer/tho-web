"use client";

import { useRef, useState } from "react";

const MAX_CHARS = 300;

type Screen = "form" | "animating" | "done" | "error";

export default function DeseosPage() {
  const [screen, setScreen] = useState<Screen>("form");
  const [mensaje, setMensaje] = useState("");
  const [sending, setSending] = useState(false);
  const [errorText, setErrorText] = useState("");
  const paperRef = useRef<SVGSVGElement>(null);

  async function enviar() {
    const msg = mensaje.trim();
    if (!msg) {
      setErrorText("Escribe algo antes de guardar.");
      return;
    }
    setErrorText("");
    setSending(true);

    try {
      const res = await fetch("/api/deseos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: msg }),
      });
      if (!res.ok) throw new Error("Error " + res.status);

      setScreen("animating");
      setTimeout(() => {
        if (paperRef.current) {
          paperRef.current.classList.add("paper-fall");
        }
        setTimeout(() => setScreen("done"), 2200);
      }, 300);
    } catch {
      setSending(false);
      setScreen("error");
    }
  }

  function reintentar() {
    setSending(false);
    setScreen("form");
  }

  return (
    <>
      <style>{`
        @keyframes paperFall {
          0%   { top: 0px;   transform: translateX(-50%) rotate(0deg)   scale(1);    opacity: 1; }
          25%  { top: 50px;  transform: translateX(-62%) rotate(-14deg) scale(0.92); opacity: 1; }
          55%  { top: 105px; transform: translateX(-38%) rotate(10deg)  scale(0.78); opacity: 1; }
          80%  { top: 148px; transform: translateX(-50%) rotate(-5deg)  scale(0.45); opacity: 0.8; }
          100% { top: 162px; transform: translateX(-50%) rotate(0deg)   scale(0.05); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .paper-fall {
          animation: paperFall 2s cubic-bezier(0.4,0,0.6,1) forwards;
        }
        .fade-up-1 { animation: fadeUp 0.6s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.4s both; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.7s both; }
      `}</style>

      <main className="flex min-h-screen flex-col items-center justify-center bg-tho-bg px-4 py-12">
        <div className="w-full max-w-md">

          {/* FORM */}
          {(screen === "form" || screen === "error") && (
            <div className="flex flex-col items-center">
              <p className="mb-4 text-[11px] tracking-widest text-slate-400 uppercase">
                THO · Aniversario 2026
              </p>
              <h1 className="font-tho-title mb-3 text-center text-5xl leading-[0.95] text-slate-950">
                {screen === "error" ? "Algo salió mal" : "Pecera de los deseos"}
              </h1>
              <p className="mb-8 text-center text-[15px] leading-relaxed text-slate-500">
                {screen === "error"
                  ? "No pudimos guardar tu mensaje.\nIntenta de nuevo."
                  : "¿Qué le deseas a THO para el año 4?\nEscribe tu mensaje. Lo abriremos juntos el próximo año."}
              </p>

              {screen === "form" && (
                <>
                  <textarea
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-300 focus:border-slate-400 transition-colors"
                    rows={5}
                    maxLength={MAX_CHARS}
                    placeholder="Mi deseo para THO es..."
                    value={mensaje}
                    onChange={(e) => {
                      setMensaje(e.target.value);
                      if (errorText) setErrorText("");
                    }}
                    disabled={sending}
                  />
                  <p className="mt-1.5 self-end text-[12px] text-slate-300">
                    {mensaje.length} / {MAX_CHARS}
                  </p>
                  {errorText && (
                    <p className="mt-1 text-[13px] text-red-500">{errorText}</p>
                  )}
                  <button
                    onClick={enviar}
                    disabled={sending || !mensaje.trim()}
                    className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-900 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? "Guardando…" : "Guardar en la pecera"}
                  </button>
                </>
              )}

              {screen === "error" && (
                <button
                  onClick={reintentar}
                  className="mt-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-[15px] font-medium text-slate-900 transition hover:bg-slate-50"
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          {/* ANIMATION + DONE */}
          {(screen === "animating" || screen === "done") && (
            <div className="flex flex-col items-center">
              <p className="mb-6 text-[11px] tracking-widest text-slate-400 uppercase">
                THO · Aniversario 2026
              </p>

              {/* Pecera */}
              <div className="relative mb-6" style={{ width: 260, height: 200 }}>
                <svg
                  viewBox="0 0 260 180"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: 260, height: 180, position: "absolute", bottom: 0, left: 0 }}
                >
                  {/* Cuerpo */}
                  <rect x="10" y="40" width="240" height="132" rx="12" fill="#E8EEF5" opacity="0.5"/>
                  <rect x="10" y="40" width="240" height="132" rx="12" fill="none" stroke="#94A3B8" strokeWidth="1" opacity="0.5"/>
                  {/* Superficie */}
                  <rect x="10" y="40" width="240" height="16" rx="4" fill="#CBD5E1" opacity="0.3"/>
                  {/* Reflejo */}
                  <ellipse cx="130" cy="172" rx="118" ry="6" fill="#CBD5E1" opacity="0.2"/>
                  {/* Algas */}
                  <path d="M40 148 Q55 134 70 146" stroke="#86EFAC" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <path d="M46 156 Q61 142 76 154" stroke="#86EFAC" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <path d="M185 155 Q200 141 215 153" stroke="#86EFAC" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  {/* Etiqueta */}
                  <text x="130" y="30" textAnchor="middle" fontFamily="inherit" fontSize="11" fill="#94A3B8">
                    pecera de los deseos
                  </text>
                </svg>

                {/* Papelito animado */}
                <svg
                  ref={paperRef}
                  viewBox="0 0 36 28"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: 36,
                    height: 28,
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <rect x="0" y="4" width="36" height="24" rx="2" fill="white" stroke="#CBD5E1" strokeWidth="1"/>
                  <path d="M0 4 L18 14 L36 4" fill="#EFF6FF" stroke="#CBD5E1" strokeWidth="1"/>
                  <line x1="6" y1="18" x2="22" y2="18" stroke="#E2E8F0" strokeWidth="1"/>
                  <line x1="6" y1="22" x2="18" y2="22" stroke="#E2E8F0" strokeWidth="1"/>
                </svg>
              </div>

              {screen === "done" && (
                <>
                  <h2 className="font-tho-title fade-up-1 mb-2 text-center text-4xl leading-[0.95] text-slate-950">
                    Tu deseo ya está guardado.
                  </h2>
                  <p className="fade-up-2 text-center text-[14px] text-slate-500">
                    Lo abriremos juntos el próximo año.
                  </p>
                  <p className="fade-up-3 mt-6 text-center text-[12px] text-slate-300">
                    Gracias por ser parte de THO ✦
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
