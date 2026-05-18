import { boundaryLessonA6 } from "@/content/onboarding/moduleA";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { ScenarioBox } from "@/components/onboarding/ScenarioBox";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * A6 · Límites institucionales — "Lo que no es negociable en THO"
 *
 * Premisa → 5 cláusulas no negociables (cada una con statement/body/closing
 * opcional) → escenario de tensión → protocolo en pasos numerados → síntesis.
 */
export function LessonA6({
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
      label={boundaryLessonA6.label}
      title={boundaryLessonA6.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
    >
      <LessonIntro paragraphs={boundaryLessonA6.premise} keyPrefix="a6-premise" />

      <section className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">Cláusulas no negociables</h3>
        {boundaryLessonA6.clauses.map((clause) => (
          <div key={clause.title} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{clause.title}</p>
            <p className="mt-2 text-[16px] font-semibold leading-relaxed text-slate-900">{clause.statement}</p>
            <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{clause.body}</p>
            {clause.closing ? <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{clause.closing}</p> : null}
          </div>
        ))}
      </section>

      <ScenarioBox
        heading={boundaryLessonA6.tension.heading}
        lines={boundaryLessonA6.tension.lines}
        keyPrefix="a6-tension"
      />

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-xl font-semibold text-slate-900">{boundaryLessonA6.protocol.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{boundaryLessonA6.protocol.intro}</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {boundaryLessonA6.protocol.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <SynthesisBox lines={boundaryLessonA6.synthesis} keyPrefix="a6-synth" />
    </LessonShell>
  );
}
