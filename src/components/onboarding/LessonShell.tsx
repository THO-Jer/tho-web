import type { ReactNode } from "react";

/**
 * Wrapper estándar de una lección hand-crafted del onboarding.
 *
 * Aporta:
 *  - Label uppercase + título grande coherente con el sello de Módulo A.
 *  - Max-width centrado y padding interno.
 *  - Footer "anti-trampa" con tiempo transcurrido y final alcanzado.
 *
 * El contenido específico de la lección va como children.
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
  return (
    <div className={`mx-auto ${maxWidth} ${padding}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{title}</h2>
      {children}
      <p className="mt-6 text-xs text-slate-500">
        Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.
      </p>
      <div className="mt-1 text-xs text-slate-500">
        Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}
      </div>
    </div>
  );
}
