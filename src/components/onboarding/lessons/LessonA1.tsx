import { architecturalLessonA1 } from "@/content/onboarding/moduleA";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { ScenarioBox } from "@/components/onboarding/ScenarioBox";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * A1 · Arquitectura estratégica — "Propósito organizacional"
 *
 * Definición → 3 secciones (qué NO es, qué SÍ es, cómo opera) → escenario aplicado
 * → traducción operativa → síntesis.
 */
export function LessonA1({
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
      label={architecturalLessonA1.label}
      title={architecturalLessonA1.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
    >
      <LessonIntro paragraphs={architecturalLessonA1.definition} keyPrefix="a1-def" />

      <div className="mt-8 space-y-7">
        {architecturalLessonA1.sections.map((section) => (
          <BulletSection
            key={section.heading}
            heading={section.heading}
            intro={section.intro}
            bullets={section.bullets}
            closing={section.closing}
          />
        ))}
      </div>

      <ScenarioBox
        heading={architecturalLessonA1.scenario.heading}
        lines={architecturalLessonA1.scenario.text}
        keyPrefix="a1-scenario"
      />

      <BulletSection
        className="mt-8"
        heading={architecturalLessonA1.translation.heading}
        intro={architecturalLessonA1.translation.intro}
        bullets={architecturalLessonA1.translation.bullets}
      />

      <SynthesisBox lines={architecturalLessonA1.synthesis} keyPrefix="a1-synth" />
    </LessonShell>
  );
}
