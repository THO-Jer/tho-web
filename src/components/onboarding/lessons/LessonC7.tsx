import { closingLearningLessonC7 } from "@/content/onboarding/moduleC";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C7 · Cierre y aprendizaje — "Cierre de piezas y documentación de aprendizajes"
 *
 * Estructura:
 *  1. Premisa (Kanban + Excel + carpeta).
 *  2. Pasos de cierre — cards numeradas (incluye paso Kanban y cierre colaborativo Excel).
 *  3. Protocolo de aprendizajes (canales formales: Teams chat + acta en Recursos).
 *  4. Callout regla de continuidad.
 *  5. Síntesis.
 */
export function LessonC7({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = closingLearningLessonC7;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c7-premise" />

      {/* Pasos de cierre */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.closingSteps.heading}</h3>
        <div className="mt-4 space-y-3">
          {d.closingSteps.steps.map((s, i) => (
            <div key={`c7-step-${i}`} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800">
                {i + 1}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-slate-900">{s.step}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Protocolo de aprendizajes */}
      <BulletSection
        className="mt-8"
        heading={d.learningProtocol.heading}
        intro={d.learningProtocol.intro}
        bullets={d.learningProtocol.bullets}
        closing={d.learningProtocol.closing}
      />

      {/* Callout regla de continuidad */}
      <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{d.continuityRule.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">{d.continuityRule.statement}</p>
        {d.continuityRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.continuityRule.body.map((line, i) => (
              <p key={`c7-cont-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="c7-synth" />
    </LessonShell>
  );
}
