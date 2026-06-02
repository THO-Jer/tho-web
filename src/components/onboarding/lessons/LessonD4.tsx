import { diagnosisLessonD4 } from "@/content/onboarding/moduleD";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D4 · Diagnóstico interpretativo — "Interpretar con criterio, no acumular información"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Callout distinción central (descripción vs. interpretación).
 *  3. Herramientas disponibles (BulletSection).
 *  4. Criterios para interpretación sólida (BulletSection).
 *  5. Grid: qué debe producir un diagnóstico.
 *  6. Síntesis.
 */
export function LessonD4({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = diagnosisLessonD4;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d4-premise" />

      {/* Callout distinción central */}
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.notAccumulation.label}
        </p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">
          {d.notAccumulation.statement}
        </p>
        {d.notAccumulation.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.notAccumulation.body.map((line, i) => (
              <p key={`d4-notaccum-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <BulletSection
        className="mt-8"
        heading={d.tools.heading}
        intro={d.tools.intro}
        bullets={d.tools.bullets}
        closing={d.tools.closing}
      />

      <BulletSection
        className="mt-8"
        heading={d.interpretiveCriteria.heading}
        intro={d.interpretiveCriteria.intro}
        bullets={d.interpretiveCriteria.bullets}
        closing={d.interpretiveCriteria.closing}
      />

      {/* Qué debe producir un diagnóstico */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">
          {d.diagnosisOutput.heading}
        </h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          {d.diagnosisOutput.intro}
        </p>
        <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
          {d.diagnosisOutput.elements.map((el) => (
            <div key={el.name} className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-3">
              <p className="text-[15px] font-semibold text-slate-900">{el.name}</p>
              <p className="text-[15px] leading-relaxed text-slate-700 sm:col-span-2">
                {el.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SynthesisBox lines={d.synthesis} keyPrefix="d4-synth" />
    </LessonShell>
  );
}
