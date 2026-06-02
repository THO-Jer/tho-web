import { sensitiveInfoLessonC8 } from "@/content/onboarding/moduleC";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C8 · Información sensible — "Resguardo profesional de información sensible"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Qué cuenta como sensible (BulletSection con closing).
 *  3. Reglas de manejo (BulletSection con closing).
 *  4. Escenarios de riesgo comunes (tabla escenario + riesgo).
 *  5. Síntesis.
 */
export function LessonC8({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = sensitiveInfoLessonC8;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c8-premise" />

      {/* Qué es sensible */}
      <BulletSection
        className="mt-8"
        heading={d.whatIsSensitive.heading}
        bullets={d.whatIsSensitive.bullets}
        closing={d.whatIsSensitive.closing}
      />

      {/* Reglas de manejo */}
      <BulletSection
        className="mt-8"
        tone="callout"
        heading={d.handlingRules.heading}
        bullets={d.handlingRules.bullets}
        closing={d.handlingRules.closing}
      />

      {/* Escenarios de riesgo */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.breachScenarios.heading}</h3>
        <div className="mt-4 space-y-3">
          {d.breachScenarios.scenarios.map((s, i) => (
            <div key={`c8-scenario-${i}`} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-[15px] font-semibold text-slate-900">{s.scenario}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-amber-900">
                <span className="font-semibold">Riesgo: </span>{s.risk}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SynthesisBox lines={d.synthesis} keyPrefix="c8-synth" />
    </LessonShell>
  );
}
