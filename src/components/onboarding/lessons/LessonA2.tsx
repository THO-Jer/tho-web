import { contrastLessonA2 } from "@/content/onboarding/moduleA";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { ScenarioBox } from "@/components/onboarding/ScenarioBox";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * A2 · Arquitectura comercial — "Propósito vs Propuesta de Valor"
 *
 * Hook narrativo → contraste a dos columnas (propósito ↔ propuesta de valor)
 * → sección "Donde se cruzan" → escenario aplicado → traducción operativa →
 * síntesis multilinea.
 *
 * El contraste a dos columnas es bespoke: cada columna tiene un patrón distinto
 * al de BulletSection (heading + question + answer + bullets + closing), por lo
 * que se mantiene inline.
 */
export function LessonA2({
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
      label={contrastLessonA2.label}
      title={contrastLessonA2.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
    >
      <LessonIntro paragraphs={contrastLessonA2.hook} keyPrefix="a2-hook" />

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.purpose.heading}</h3>
          <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.purpose.question}</p>
          <p className="mt-2 text-[16px] font-semibold leading-relaxed text-slate-800">{contrastLessonA2.purpose.answer}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {contrastLessonA2.purpose.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.purpose.closing}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.value.heading}</h3>
          <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.value.question}</p>
          <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.value.answer}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {contrastLessonA2.value.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.value.closing}</p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.crossing.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.crossing.intro}</p>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.crossing.body}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {contrastLessonA2.crossing.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.crossing.closing}</p>
      </section>

      <ScenarioBox
        heading={contrastLessonA2.scenario.heading}
        lines={contrastLessonA2.scenario.lines}
        keyPrefix="a2-scenario"
      />

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.translation.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.translation.intro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {contrastLessonA2.translation.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.translation.closing}</p>
      </section>

      <SynthesisBox lines={contrastLessonA2.synthesis} keyPrefix="a2-synth" />
    </LessonShell>
  );
}
