import { qualityLessonA4 } from "@/content/onboarding/moduleA";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { ScenarioBox } from "@/components/onboarding/ScenarioBox";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * A4 · Estándar de calidad — "¿Qué significa que un trabajo esté Done?"
 *
 * Premisa → "Qué es DoD" → "Qué NO es Done" (callout) → 5 criterios en cards →
 * escenario aplicado → checklist final → síntesis.
 *
 * Las cards de criterios y el checklist son bespoke (formato visual particular).
 */
export function LessonA4({
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
      label={qualityLessonA4.label}
      title={qualityLessonA4.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
    >
      <LessonIntro paragraphs={qualityLessonA4.premise} keyPrefix="a4-premise" />

      <BulletSection
        className="mt-8"
        heading={qualityLessonA4.whatIs.heading}
        intro={qualityLessonA4.whatIs.intro}
        bullets={qualityLessonA4.whatIs.bullets}
        closing={qualityLessonA4.whatIs.closing}
      />

      <BulletSection
        className="mt-8"
        tone="callout"
        heading={qualityLessonA4.whatIsNot.heading}
        intro={qualityLessonA4.whatIsNot.intro}
        bullets={qualityLessonA4.whatIsNot.bullets}
        closing={qualityLessonA4.whatIsNot.closing}
      />

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{qualityLessonA4.criteria.heading}</h3>
        <div className="mt-3 space-y-2">
          {qualityLessonA4.criteria.items.map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <ScenarioBox
        heading={qualityLessonA4.scenario.heading}
        lines={qualityLessonA4.scenario.lines}
        keyPrefix="a4-scenario"
      />

      <section className="mt-8 rounded-xl border border-slate-300 bg-white p-4">
        <h3 className="text-xl font-semibold text-slate-900">{qualityLessonA4.checklist.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualityLessonA4.checklist.intro}</p>
        <ul className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
          {qualityLessonA4.checklist.bullets.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-[3px] inline-block h-4 w-4 shrink-0 rounded border border-slate-400" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{qualityLessonA4.checklist.closing}</p>
      </section>

      <SynthesisBox lines={qualityLessonA4.synthesis} keyPrefix="a4-synth" />
    </LessonShell>
  );
}
