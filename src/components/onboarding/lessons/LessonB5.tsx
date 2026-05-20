import { crmLessonB5 } from "@/content/onboarding/moduleB";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * B5 · Sistema operativo — "CRM en THO: memoria institucional"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Qué es el CRM en THO (text-heavy, párrafos declarativos).
 *  3. Por qué existe + callout destacado "Si no está registrado, no existe".
 *  4. Los dos lados del CRM: card Comercial/Financiero (5 tabs) + card Contable
 *     (2 tabs con descripción, EERR + Conciliación).
 *  5. Estados del pipeline: chip flow horizontal con los 5 estados activos,
 *     nota sobre origen de leads desde tho.cl, callout sobre cierre/historial.
 *  6. Reglas operativas (BulletSection con tono callout).
 *  7. Traducción operativa (BulletSection).
 *  8. Síntesis.
 *
 * El chip flow del pipeline reusa el patrón visual de A3 (ciclo operativo).
 */
export function LessonB5({
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
      label={crmLessonB5.label}
      title={crmLessonB5.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={crmLessonB5.premise} keyPrefix="b5-premise" />

      {/* 1. Qué es el CRM en THO */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{crmLessonB5.whatIsIt.heading}</h3>
        <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-slate-700">
          {crmLessonB5.whatIsIt.body.map((line, idx) => (
            <p key={`b5-whatisit-${idx}`}>{line}</p>
          ))}
        </div>
      </section>

      {/* 2. Por qué existe + callout */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{crmLessonB5.whyExists.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{crmLessonB5.whyExists.intro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {crmLessonB5.whyExists.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {crmLessonB5.whyExists.rule.label}
          </p>
          <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">
            {crmLessonB5.whyExists.rule.statement}
          </p>
          <p className="mt-3 text-[16px] leading-relaxed text-slate-700">{crmLessonB5.whyExists.rule.body}</p>
        </div>
      </section>

      {/* 3. Los dos lados del CRM */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{crmLessonB5.twoSides.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{crmLessonB5.twoSides.intro}</p>

        {/* Card Comercial/Financiero */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{crmLessonB5.twoSides.commercial.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {crmLessonB5.twoSides.commercial.tagline}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Pestañas</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
            {crmLessonB5.twoSides.commercial.tabs.map((tab) => (
              <li key={tab}>{tab}</li>
            ))}
          </ul>
        </div>

        {/* Card Contable */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{crmLessonB5.twoSides.accounting.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {crmLessonB5.twoSides.accounting.tagline}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Pestañas</p>
          <div className="mt-2 space-y-2">
            {crmLessonB5.twoSides.accounting.tabs.map((tab) => (
              <div key={tab.name} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <p className="text-[15px] font-semibold text-slate-900">{tab.name}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-slate-700">{tab.description}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[16px] font-medium leading-relaxed text-slate-800">{crmLessonB5.twoSides.closing}</p>
      </section>

      {/* 4. Estados del pipeline */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{crmLessonB5.pipelineStates.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{crmLessonB5.pipelineStates.intro}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-slate-700">
          {crmLessonB5.pipelineStates.activeStates.map((state, idx) => (
            <div key={state} className="flex items-center gap-2">
              <span className="rounded-md border border-slate-300 bg-white px-2 py-1">{state}</span>
              {idx < crmLessonB5.pipelineStates.activeStates.length - 1 ? (
                <span className="text-slate-400">→</span>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{crmLessonB5.pipelineStates.leadOrigin}</p>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {crmLessonB5.pipelineStates.closureLabel}
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{crmLessonB5.pipelineStates.closure}</p>
        </div>
      </section>

      {/* 5. Reglas operativas */}
      <BulletSection
        className="mt-8"
        tone="callout"
        heading={crmLessonB5.rules.heading}
        bullets={crmLessonB5.rules.bullets}
      />

      {/* 6. Traducción operativa */}
      <BulletSection
        className="mt-8"
        heading={crmLessonB5.translation.heading}
        bullets={crmLessonB5.translation.bullets}
      />

      <SynthesisBox lines={crmLessonB5.synthesis} keyPrefix="b5-synth" />
    </LessonShell>
  );
}
