import { culturalLessonA5 } from "@/content/onboarding/moduleA";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * A5 · Cultura organizacional — "Valores organizacionales en acción"
 *
 * Premisa → 3 valores (Humanidad / Colaboración / Adaptabilidad), cada uno con
 * la estructura "qué protege / qué exige / estándar / qué invalida" → tensión
 * real → síntesis.
 *
 * El layout interno de cada valor es bespoke (cuatro sub-bloques tipados con
 * uppercase headings), por lo que no se delega en BulletSection.
 */
export function LessonA5({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  return (
    <LessonShell
      label={culturalLessonA5.label}
      title={culturalLessonA5.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
    >
      <LessonIntro paragraphs={culturalLessonA5.premise} keyPrefix="a5-premise" />

      <div className="mt-8 space-y-8">
        {culturalLessonA5.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">{section.heading}</h3>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Qué protege</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                {section.protects.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Qué exige</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                {section.requires.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <p className="text-[16px] font-medium leading-relaxed text-slate-800">{section.standard}</p>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Qué invalida</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                {section.invalidates.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <BulletSection
        className="mt-8"
        tone="callout"
        heading={culturalLessonA5.tension.heading}
        intro={culturalLessonA5.tension.intro}
        bullets={culturalLessonA5.tension.bullets}
        closing={culturalLessonA5.tension.closing}
      />

      <SynthesisBox lines={culturalLessonA5.synthesis} keyPrefix="a5-synth" />
    </LessonShell>
  );
}
