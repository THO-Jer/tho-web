import { ethicsLessonA7 } from "@/content/onboarding/moduleA";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * A7 · Ética operativa — "Cómo actuar ante tensiones críticas"
 *
 * Premisa → 4 bloques (riesgo / alertas / protocolo numerado / escalamiento)
 * con borde lateral izquierdo → matriz simple de decisión → síntesis.
 *
 * Tipografía 15px (más densa que el resto de A) y max-width 760px.
 * Todos los bloques son bespoke en este caso por el estilo de borde lateral
 * y el formato de tabla simple en la matriz.
 */
export function LessonA7({
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
      label={ethicsLessonA7.label}
      title={ethicsLessonA7.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={ethicsLessonA7.premise} keyPrefix="a7-premise" className="mt-5" />

      <div className="mt-8 space-y-6">
        <section className="border-l-2 border-slate-300 pl-4">
          <h3 className="text-lg font-semibold text-slate-900">{ethicsLessonA7.risk.heading}</h3>
          <p className="mt-2 text-[15px] text-slate-700">{ethicsLessonA7.risk.intro}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
            {ethicsLessonA7.risk.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="mt-2 text-[15px] font-medium text-slate-800">{ethicsLessonA7.risk.closing}</p>
        </section>

        <section className="border-l-2 border-slate-300 pl-4">
          <h3 className="text-lg font-semibold text-slate-900">{ethicsLessonA7.alerts.heading}</h3>
          <p className="mt-2 text-[15px] text-slate-700">{ethicsLessonA7.alerts.intro}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
            {ethicsLessonA7.alerts.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="mt-2 text-[15px] font-medium text-slate-800">{ethicsLessonA7.alerts.closing}</p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{ethicsLessonA7.protocol.heading}</h3>
          <p className="mt-2 text-[15px] text-slate-700">{ethicsLessonA7.protocol.intro}</p>
          <ol className="mt-3 space-y-2 text-[15px] text-slate-700">
            {ethicsLessonA7.protocol.steps.map((step) => (
              <li key={step.tag} className="rounded-md border border-slate-200 bg-white p-3">
                <p className="font-semibold text-slate-900">{step.tag}</p>
                <p className="mt-1">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-l-2 border-slate-300 pl-4">
          <h3 className="text-lg font-semibold text-slate-900">{ethicsLessonA7.escalation.heading}</h3>
          <p className="mt-2 text-[15px] text-slate-700">{ethicsLessonA7.escalation.intro}</p>
          <p className="mt-2 text-[15px] text-slate-700">{ethicsLessonA7.escalation.triggersIntro}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
            {ethicsLessonA7.escalation.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="mt-2 text-[15px] font-medium text-slate-800">{ethicsLessonA7.escalation.closing}</p>
        </section>
      </div>

      <section className="mt-8 overflow-hidden rounded-lg border border-slate-300">
        <h3 className="border-b border-slate-300 bg-slate-100 px-4 py-3 text-lg font-semibold text-slate-900">{ethicsLessonA7.matrix.heading}</h3>
        <div className="divide-y divide-slate-200">
          {ethicsLessonA7.matrix.rows.map((row) => (
            <div key={row.condition} className="grid gap-2 px-4 py-3 sm:grid-cols-[1.5fr_1fr]">
              <p className="text-[15px] font-medium text-slate-800">{row.condition}</p>
              <p className="text-[15px] text-slate-700">→ {row.action}</p>
            </div>
          ))}
        </div>
      </section>

      <SynthesisBox lines={ethicsLessonA7.synthesis} keyPrefix="a7-synth" />
    </LessonShell>
  );
}
