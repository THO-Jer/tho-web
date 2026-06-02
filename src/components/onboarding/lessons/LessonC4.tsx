import { kickoffLessonC4 } from "@/content/onboarding/moduleC";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C4 · Kickoff — "Cómo se inicia correctamente una operación creativa"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Callout regla Brief general primero.
 *  3. Checklist de Kickoff (tabla item + por qué).
 *  4. Señales de alerta (BulletSection callout con closing).
 *  5. Síntesis.
 */
export function LessonC4({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = kickoffLessonC4;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c4-premise" />

      {/* Callout regla brief */}
      <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{d.briefRule.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">{d.briefRule.statement}</p>
        {d.briefRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.briefRule.body.map((line, i) => (
              <p key={`c4-brief-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Checklist Kickoff */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.kickoffChecklist.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.kickoffChecklist.intro}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid sm:grid-cols-[1.2fr_1.5fr] sm:gap-2">
            <p>Punto a validar</p>
            <p>Por qué importa</p>
          </div>
          <div className="divide-y divide-slate-200">
            {d.kickoffChecklist.items.map((item, i) => (
              <div key={`c4-chk-${i}`} className="grid gap-1 px-3 py-3 sm:grid-cols-[1.2fr_1.5fr] sm:gap-2">
                <p className="text-[15px] font-semibold text-slate-900">{item.item}</p>
                <p className="text-[15px] leading-relaxed text-slate-700">{item.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Señales de alerta */}
      <BulletSection
        className="mt-8"
        tone="callout"
        heading={d.redFlags.heading}
        intro={d.redFlags.intro}
        bullets={d.redFlags.bullets}
        closing={d.redFlags.closing}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="c4-synth" />
    </LessonShell>
  );
}
