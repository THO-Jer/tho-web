import { interventionStructureLessonD3 } from "@/content/onboarding/moduleD";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D3 · Estructura de una intervención — "Seis fases para intervenir con método"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Secuencia de 6 fases con número, nombre, descripción, pregunta clave y error frecuente.
 *  3. Callout regla de secuencia.
 *  4. Síntesis.
 */
export function LessonD3({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = interventionStructureLessonD3;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d3-premise" />

      {/* Secuencia de 6 fases */}
      <section className="mt-8 space-y-4">
        {d.phases.map((phase) => (
          <div
            key={phase.number}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                {phase.number}
              </span>
              <p className="text-[15px] font-semibold text-slate-900">{phase.name}</p>
            </div>
            <div className="px-4 py-4 space-y-3">
              <p className="text-[15px] leading-relaxed text-slate-700">{phase.description}</p>
              <div className="rounded-lg bg-emerald-50 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Pregunta clave
                </p>
                <p className="mt-0.5 text-[14px] leading-relaxed text-slate-800">
                  {phase.keyQuestion}
                </p>
              </div>
              <div className="rounded-lg bg-rose-50 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                  Error frecuente
                </p>
                <p className="mt-0.5 text-[14px] leading-relaxed text-slate-800">
                  {phase.commonError}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Callout regla de secuencia */}
      <div className="mt-8 rounded-xl border border-emerald-300 bg-emerald-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.structureRule.label}
        </p>
        <p className="mt-1 text-[18px] font-semibold leading-snug text-slate-900">
          {d.structureRule.statement}
        </p>
        {d.structureRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.structureRule.body.map((line, i) => (
              <p key={`d3-rule-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="d3-synth" />
    </LessonShell>
  );
}
