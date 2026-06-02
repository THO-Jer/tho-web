import { closingModuleDLesson } from "@/content/onboarding/moduleD";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * Cierre · Módulo D — "Asesorar es mejorar decisiones, no producir documentos"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Callout idea central del módulo.
 *  3. Lo que tienes al completar el módulo (BulletSection).
 *  4. Lo que sigue (BulletSection).
 *  5. Síntesis.
 */
export function LessonDCierre({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = closingModuleDLesson;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="dcierre-premise" />

      {/* Callout idea central */}
      <div className="mt-8 rounded-xl border border-emerald-300 bg-emerald-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.coreIdea.label}
        </p>
        <p className="mt-1 text-[18px] font-semibold leading-snug text-slate-900">
          {d.coreIdea.statement}
        </p>
        {d.coreIdea.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.coreIdea.body.map((line, i) => (
              <p key={`dcierre-core-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <BulletSection
        className="mt-8"
        heading={d.whatYouNowHave.heading}
        intro={d.whatYouNowHave.intro}
        bullets={d.whatYouNowHave.bullets}
      />

      <BulletSection
        className="mt-8"
        heading={d.goingForward.heading}
        intro={d.goingForward.intro}
        bullets={d.goingForward.bullets}
        closing={d.goingForward.closing}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="dcierre-synth" />
    </LessonShell>
  );
}
