import { operationalLessonA3 } from "@/content/onboarding/moduleA";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * A3 · Método de trabajo — "Cómo trabajamos en THO"
 *
 * Premisa → 4 secciones del método → ciclo operativo (chips encadenadas)
 * → principios no negociables → síntesis.
 *
 * El ciclo operativo es bespoke: un row de chips con flecha entre cada paso.
 */
export function LessonA3({
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
      label={operationalLessonA3.label}
      title={operationalLessonA3.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
    >
      <LessonIntro paragraphs={operationalLessonA3.premise} keyPrefix="a3-premise" />

      <div className="mt-8 space-y-7">
        {operationalLessonA3.sections.map((section) => (
          <BulletSection
            key={section.heading}
            heading={section.heading}
            intro={section.intro}
            bullets={section.bullets}
            closing={section.closing}
          />
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-xl font-semibold text-slate-900">{operationalLessonA3.cycle.heading}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-slate-700">
          {operationalLessonA3.cycle.stages.map((stage, idx) => (
            <div key={stage} className="flex items-center gap-2">
              <span className="rounded-md border border-slate-300 bg-white px-2 py-1">{stage}</span>
              {idx < operationalLessonA3.cycle.stages.length - 1 ? <span className="text-slate-400">→</span> : null}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{operationalLessonA3.cycle.closing}</p>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{operationalLessonA3.principles.heading}</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {operationalLessonA3.principles.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>

      <SynthesisBox lines={operationalLessonA3.synthesis} keyPrefix="a3-synth" />
    </LessonShell>
  );
}
