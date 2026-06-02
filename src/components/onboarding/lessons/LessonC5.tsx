import { productionReviewLessonC5 } from "@/content/onboarding/moduleC";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C5 · Producción y revisión — "Cómo se produce y se revisa en THO"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Reglas de producción (BulletSection con closing).
 *  3. Revisión interna — checklist en card numerada.
 *  4. Callout: feedback consolidado por PO · canal formal Teams.
 *  5. Versiones en carpeta (sin nomenclatura cerrada; estado en Kanban).
 *  6. Síntesis.
 */
export function LessonC5({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = productionReviewLessonC5;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c5-premise" />

      {/* Reglas de producción */}
      <BulletSection
        className="mt-8"
        heading={d.productionRules.heading}
        bullets={d.productionRules.bullets}
        closing={d.productionRules.closing}
      />

      {/* Checklist revisión interna */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-xl font-semibold text-slate-900">{d.internalReview.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.internalReview.intro}</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[16px] leading-relaxed text-slate-700">
          {d.internalReview.checklist.map((item, i) => (
            <li key={`c5-chk-${i}`}>{item}</li>
          ))}
        </ol>
      </section>

      {/* Callout feedback del cliente */}
      <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{d.clientFeedbackRule.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">{d.clientFeedbackRule.statement}</p>
        {d.clientFeedbackRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.clientFeedbackRule.body.map((line, i) => (
              <p key={`c5-fb-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Versiones sin nomenclatura cerrada */}
      <BulletSection
        className="mt-8"
        tone="card"
        heading={d.versionControl.heading}
        bullets={d.versionControl.bullets}
        closing={d.versionControl.closing}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="c5-synth" />
    </LessonShell>
  );
}
