import { strategicDesignLessonD5 } from "@/content/onboarding/moduleD";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D5 · Diseño estratégico — "Hacer visible la incertidumbre, no eliminarla"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Callout distinción central.
 *  3. Principios del diseño estratégico (BulletSection).
 *  4. Estructura de cada alternativa (tabla).
 *  5. Capa de riesgo (BulletSection).
 *  6. Síntesis.
 */
export function LessonD5({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = strategicDesignLessonD5;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d5-premise" />

      {/* Callout distinción central */}
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.coreDistinction.label}
        </p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">
          {d.coreDistinction.statement}
        </p>
        {d.coreDistinction.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.coreDistinction.body.map((line, i) => (
              <p key={`d5-distinction-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <BulletSection
        className="mt-8"
        heading={d.designPrinciples.heading}
        intro={d.designPrinciples.intro}
        bullets={d.designPrinciples.bullets}
        closing={d.designPrinciples.closing}
      />

      {/* Estructura de cada alternativa */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">
          {d.alternativesStructure.heading}
        </h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          {d.alternativesStructure.intro}
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid sm:grid-cols-3 sm:gap-3">
            <p>Elemento</p>
            <p className="sm:col-span-2">Descripción</p>
          </div>
          <div className="divide-y divide-slate-200">
            {d.alternativesStructure.components.map((comp) => (
              <div key={comp.name} className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-3">
                <p className="text-[15px] font-semibold text-slate-900">{comp.name}</p>
                <p className="text-[15px] leading-relaxed text-slate-700 sm:col-span-2">
                  {comp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BulletSection
        className="mt-8"
        heading={d.riskLayer.heading}
        intro={d.riskLayer.intro}
        bullets={d.riskLayer.bullets}
        closing={d.riskLayer.closing}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="d5-synth" />
    </LessonShell>
  );
}
