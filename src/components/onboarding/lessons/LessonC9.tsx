import { continuityCLessonC9 } from "@/content/onboarding/moduleC";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C9 · Estándar de continuidad — "Continuidad operativa: el trabajo que permite que otros trabajen"
 *
 * Estructura:
 *  1. Premisa.
 *  2. El test de continuidad (lista numerada en card).
 *  3. Grid 2 columnas: Qué destruye / Qué construye continuidad.
 *  4. Callout regla final Módulo C.
 *  5. Síntesis.
 */
export function LessonC9({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = continuityCLessonC9;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c9-premise" />

      {/* Test de continuidad */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-xl font-semibold text-slate-900">{d.continuityTest.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.continuityTest.intro}</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[16px] leading-relaxed text-slate-700">
          {d.continuityTest.questions.map((q, i) => (
            <li key={`c9-q-${i}`}>{q}</li>
          ))}
        </ol>
      </section>

      {/* Grid destruye / construye */}
      <section className="mt-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
              {d.whatBreaksContinuity.heading}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
              {d.whatBreaksContinuity.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              {d.whatBuildsContinuity.heading}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
              {d.whatBuildsContinuity.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Callout regla final */}
      <div className="mt-8 rounded-xl border border-violet-300 bg-violet-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{d.continuityRule.label}</p>
        <p className="mt-1 text-[18px] font-semibold leading-snug text-slate-900">{d.continuityRule.statement}</p>
        {d.continuityRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.continuityRule.body.map((line, i) => (
              <p key={`c9-rule-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="c9-synth" />
    </LessonShell>
  );
}
