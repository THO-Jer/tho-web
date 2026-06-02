import { advisingMeaningLessonD1 } from "@/content/onboarding/moduleD";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D1 · Qué significa asesorar en THO — "Intervención sobre sistemas complejos"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Lo que asesorar NO es (BulletSection).
 *  3. Lo que asesorar sí implica — 6 dimensiones (BulletSection).
 *  4. Callout principio de complejidad.
 *  5. Implicaciones prácticas (BulletSection).
 *  6. Síntesis.
 */
export function LessonD1({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = advisingMeaningLessonD1;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d1-premise" />

      <BulletSection
        className="mt-8"
        heading={d.whatIsNot.heading}
        intro={d.whatIsNot.intro}
        bullets={d.whatIsNot.bullets}
        closing={d.whatIsNot.closing}
      />

      <BulletSection
        className="mt-8"
        heading={d.whatItIs.heading}
        intro={d.whatItIs.intro}
        bullets={d.whatItIs.bullets}
        closing={d.whatItIs.closing}
      />

      {/* Callout principio de complejidad */}
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.complexityRule.label}
        </p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">
          {d.complexityRule.statement}
        </p>
        {d.complexityRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.complexityRule.body.map((line, i) => (
              <p key={`d1-complexity-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <BulletSection
        className="mt-8"
        heading={d.implications.heading}
        intro={d.implications.intro}
        bullets={d.implications.bullets}
        closing={d.implications.closing}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="d1-synth" />
    </LessonShell>
  );
}
