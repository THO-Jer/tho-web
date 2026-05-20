import { commercialClosingLessonB7 } from "@/content/onboarding/moduleB";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * B7 · Cierre y formalización — "Cierre profesional en THO"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Tres documentos de formalización · 3 cards (Propuesta / Cotización /
 *     Contrato-Acuerdo) con tagline y body párrafos.
 *  3. Qué incluye un contrato (BulletSection con closing).
 *  4. Reglas por motor · 3 cards stacked (KA / Tickets / Digital).
 *  5. El kick-off · sub-secciones "cubre" + "preparación" + cierre.
 *  6. Renovación y crecimiento · timeline KA anual (4 cards con badge de mes),
 *     callout para KA cortas, líneas separadas para Tickets y Digital,
 *     sub-sección de upsell con contraste sí/no (emerald/rose, mismo lenguaje
 *     visual de B4 y B6).
 *  7. Errores frecuentes (BulletSection con tono callout).
 *  8. Traducción operativa (BulletSection).
 *  9. Síntesis.
 */
export function LessonB7({
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
      label={commercialClosingLessonB7.label}
      title={commercialClosingLessonB7.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={commercialClosingLessonB7.premise} keyPrefix="b7-premise" />

      {/* 1. Tres documentos de formalización */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{commercialClosingLessonB7.threeDocuments.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{commercialClosingLessonB7.threeDocuments.intro}</p>
        <div className="mt-4 space-y-3">
          {commercialClosingLessonB7.threeDocuments.documents.map((doc) => (
            <div key={doc.name} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-lg font-semibold text-slate-900">{doc.name}</h4>
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{doc.tagline}</span>
              </div>
              <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-slate-700">
                {doc.body.map((line, idx) => (
                  <p key={`b7-doc-${doc.name}-${idx}`}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Qué incluye un contrato */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{commercialClosingLessonB7.contractContents.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{commercialClosingLessonB7.contractContents.intro}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {commercialClosingLessonB7.contractContents.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">
          {commercialClosingLessonB7.contractContents.closing}
        </p>
      </section>

      {/* 3. Reglas por motor */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{commercialClosingLessonB7.byMotor.heading}</h3>

        {/* Card Key Accounts */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{commercialClosingLessonB7.byMotor.keyAccounts.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {commercialClosingLessonB7.byMotor.keyAccounts.tagline}
            </span>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
            {commercialClosingLessonB7.byMotor.keyAccounts.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        {/* Card Tickets */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{commercialClosingLessonB7.byMotor.tickets.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {commercialClosingLessonB7.byMotor.tickets.tagline}
            </span>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
            {commercialClosingLessonB7.byMotor.tickets.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        {/* Card Digital con border-dashed (jerarquía secundaria, consistente con B2/B3) */}
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{commercialClosingLessonB7.byMotor.digital.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {commercialClosingLessonB7.byMotor.digital.tagline}
            </span>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
            {commercialClosingLessonB7.byMotor.digital.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. El kick-off */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{commercialClosingLessonB7.kickoff.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{commercialClosingLessonB7.kickoff.intro}</p>

        <div className="mt-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{commercialClosingLessonB7.kickoff.coversHeading}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {commercialClosingLessonB7.kickoff.covers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{commercialClosingLessonB7.kickoff.prepHeading}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {commercialClosingLessonB7.kickoff.prep.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-[16px] font-semibold leading-relaxed text-slate-900">{commercialClosingLessonB7.kickoff.closing}</p>
      </section>

      {/* 5. Renovación y crecimiento */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{commercialClosingLessonB7.renewal.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{commercialClosingLessonB7.renewal.intro}</p>

        {/* Timeline KA anual */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <h4 className="text-lg font-semibold text-slate-900">{commercialClosingLessonB7.renewal.annual.heading}</h4>
          <div className="mt-3 space-y-2">
            {commercialClosingLessonB7.renewal.annual.timeline.map((step) => (
              <div key={step.month} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex shrink-0 items-center rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                  {step.month}
                </span>
                <p className="text-[15px] leading-relaxed text-slate-700">{step.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KA cortas */}
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{commercialClosingLessonB7.renewal.short.heading}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{commercialClosingLessonB7.renewal.short.body}</p>
        </div>

        {/* Tickets + Digital líneas */}
        <p className="mt-4 text-[15px] leading-relaxed text-slate-700">{commercialClosingLessonB7.renewal.ticketsLine}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{commercialClosingLessonB7.renewal.digitalLine}</p>

        {/* Upsell */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
          <h4 className="text-lg font-semibold text-slate-900">{commercialClosingLessonB7.renewal.upsell.heading}</h4>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                {commercialClosingLessonB7.renewal.upsell.yesIntro}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-slate-700">
                {commercialClosingLessonB7.renewal.upsell.yes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-800">
                {commercialClosingLessonB7.renewal.upsell.noIntro}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-slate-700">
                {commercialClosingLessonB7.renewal.upsell.no.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{commercialClosingLessonB7.renewal.upsell.how}</p>
        </div>
      </section>

      {/* 6. Errores frecuentes */}
      <BulletSection
        className="mt-8"
        tone="callout"
        heading={commercialClosingLessonB7.commonErrors.heading}
        intro={commercialClosingLessonB7.commonErrors.intro}
        bullets={commercialClosingLessonB7.commonErrors.bullets}
      />

      {/* 7. Traducción operativa */}
      <BulletSection
        className="mt-8"
        heading={commercialClosingLessonB7.translation.heading}
        bullets={commercialClosingLessonB7.translation.bullets}
      />

      <SynthesisBox lines={commercialClosingLessonB7.synthesis} keyPrefix="b7-synth" />
    </LessonShell>
  );
}
