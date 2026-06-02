import { dodAdvisoryLessonD6 } from "@/content/onboarding/moduleD";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D6 · Estándar mínimo de entregables (DoD en asesorías) — "Definición de Hecho"
 *
 * Estructura:
 *  1. Premisa.
 *  2. 6 elementos del DoD con número, nombre, descripción y ejemplo de falla.
 *  3. Callout regla del DoD.
 *  4. Síntesis.
 */
export function LessonD6({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = dodAdvisoryLessonD6;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d6-premise" />

      {/* 6 elementos del DoD */}
      <section className="mt-8 space-y-4">
        {d.dodElements.map((el) => (
          <div
            key={el.number}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                {el.number}
              </span>
              <p className="text-[15px] font-semibold text-slate-900">{el.name}</p>
            </div>
            <div className="px-4 py-3 space-y-3">
              <p className="text-[15px] leading-relaxed text-slate-700">{el.description}</p>
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                  Ejemplo de falla
                </p>
                <p className="mt-0.5 text-[14px] leading-relaxed text-slate-800">
                  {el.failureExample}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Callout regla del DoD */}
      <div className="mt-8 rounded-xl border border-emerald-300 bg-emerald-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.dodRule.label}
        </p>
        <p className="mt-1 text-[18px] font-semibold leading-snug text-slate-900">
          {d.dodRule.statement}
        </p>
        {d.dodRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.dodRule.body.map((line, i) => (
              <p key={`d6-dod-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="d6-synth" />
    </LessonShell>
  );
}
