import type { ReactNode } from "react";

/**
 * Wrapper estándar de una lección hand-crafted del onboarding.
 *
 * Aporta:
 *  - Label uppercase + título grande coherente con el sello de Módulo A.
 *  - Max-width centrado y padding interno.
 *  - Indicador de lectura: muestra progreso de tiempo y scroll sin exponer
 *    la mecánica interna al usuario.
 */
export function LessonShell({
  label,
  title,
  children,
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
  maxWidth = "max-w-[720px]",
  padding = "p-6 sm:p-8",
}: {
  label: string;
  title: string;
  children: ReactNode;
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
  /** Override de la clase de ancho máximo. Algunas lecciones (A7, A8) usan 760px. */
  maxWidth?: string;
  /** Override de padding. A8 usa `p-6 sm:p-10` en el original. */
  padding?: string;
}) {
  const timePct = Math.min(100, Math.round((elapsedSeconds / minLessonSeconds) * 100));
  const timeReady = elapsedSeconds >= minLessonSeconds;
  const allReady = timeReady && reachedEnd;

  return (
    <div className={`mx-auto ${maxWidth} ${padding}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{title}</h2>
      {children}
      {/* Indicador de lectura — reemplaza el texto "Anti-trampa suave" */}
      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold text-slate-600">
          {allReady ? "Lección lista para completar" : "Completando lectura…"}
        </p>
        <div className="mt-2 flex items-center gap-3">
          {/* Barra de tiempo de lectura */}
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>Tiempo de lectura</span>
              <span>{timeReady ? "✓" : `${elapsedSeconds}s`}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-200">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ${timeReady ? "bg-emerald-500" : "bg-slate-400"}`}
                style={{ width: `${timePct}%` }}
              />
            </div>
          </div>
          {/* Indicador de scroll */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <div
              className={`h-2 w-2 rounded-full ${reachedEnd ? "bg-emerald-500" : "bg-slate-300"}`}
            />
            <span>{reachedEnd ? "Scroll ✓" : "Llega al final"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
