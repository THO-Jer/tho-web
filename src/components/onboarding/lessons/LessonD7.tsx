import { traceabilityLessonD7 } from "@/content/onboarding/moduleD";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D7 · Documentación y trazabilidad — "El registro como protección y continuidad"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Por qué documentar (BulletSection).
 *  3. Qué registrar (BulletSection).
 *  4. Callout estándar de trazabilidad THO.
 *  5. La documentación no es un paso adicional (BulletSection).
 *  6. Síntesis.
 */
export function LessonD7({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = traceabilityLessonD7;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d7-premise" />

      <BulletSection
        className="mt-8"
        heading={d.whyDocument.heading}
        intro={d.whyDocument.intro}
        bullets={d.whyDocument.bullets}
        closing={d.whyDocument.closing}
      />

      <BulletSection
        className="mt-8"
        heading={d.whatToDocument.heading}
        intro={d.whatToDocument.intro}
        bullets={d.whatToDocument.bullets}
        closing={d.whatToDocument.closing}
      />

      {/* Callout estándar de trazabilidad */}
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.traceabilityRule.label}
        </p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">
          {d.traceabilityRule.statement}
        </p>
        {d.traceabilityRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.traceabilityRule.body.map((line, i) => (
              <p key={`d7-trace-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <BulletSection
        className="mt-8"
        heading={d.notABurden.heading}
        intro={d.notABurden.intro}
        bullets={d.notABurden.bullets}
        closing={d.notABurden.closing}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="d7-synth" />
    </LessonShell>
  );
}
