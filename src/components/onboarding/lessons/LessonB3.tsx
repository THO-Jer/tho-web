import { pricingLessonB3 } from "@/content/onboarding/moduleB";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * B3 · Estructura de precios — "Pricing en THO"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Por qué se cobra en UF + callout "Regla operativa: UF se congela".
 *  3. Qué define el precio (BulletSection con closing).
 *  4. Las bandas reales · tres cards stacked (Tickets / Key Accounts con tabla 3-col /
 *     Digital con border-dashed para señalar jerarquía secundaria).
 *  5. Cómo se presenta un precio (BulletSection).
 *  6. Negociación profesional · objeción típica destacada + rules + reglas
 *     operativas + pack example.
 *  7. No-negociables (BulletSection con tono callout).
 *  8. Traducción operativa (BulletSection).
 *  9. Síntesis.
 *
 * La tabla de bandas de Key Accounts usa el mismo patrón visual que la matriz
 * de A7: header en bg-slate-100, filas con divide-y, grid responsive 3 columnas.
 */
export function LessonB3({
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
      label={pricingLessonB3.label}
      title={pricingLessonB3.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={pricingLessonB3.premise} keyPrefix="b3-premise" />

      {/* 1. Por qué se cobra en UF */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{pricingLessonB3.whyUF.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{pricingLessonB3.whyUF.intro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {pricingLessonB3.whyUF.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {pricingLessonB3.whyUF.rule.label}
          </p>
          <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">
            {pricingLessonB3.whyUF.rule.statement}
          </p>
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {pricingLessonB3.whyUF.rule.body.map((line, idx) => (
              <p key={`b3-rule-${idx}`}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Qué define el precio */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{pricingLessonB3.whatDefinesPrice.heading}</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {pricingLessonB3.whatDefinesPrice.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">
          {pricingLessonB3.whatDefinesPrice.closing}
        </p>
      </section>

      {/* 3. Las bandas reales */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{pricingLessonB3.bands.heading}</h3>

        {/* Card Tickets */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{pricingLessonB3.bands.tickets.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {pricingLessonB3.bands.tickets.tagline}
            </span>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {pricingLessonB3.bands.tickets.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="mt-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              {pricingLessonB3.bands.tickets.priorityHeading}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
              {pricingLessonB3.bands.tickets.priorityTickets.map((ticket) => (
                <li key={ticket}>{ticket}</li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-800">
            {pricingLessonB3.bands.tickets.rule}
          </p>
        </div>

        {/* Card Key Accounts con tabla */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{pricingLessonB3.bands.keyAccounts.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {pricingLessonB3.bands.keyAccounts.tagline}
            </span>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid sm:grid-cols-[0.8fr_1fr_2fr] sm:gap-2">
              <p>{pricingLessonB3.bands.keyAccounts.tableHeaders.banda}</p>
              <p>{pricingLessonB3.bands.keyAccounts.tableHeaders.range}</p>
              <p>{pricingLessonB3.bands.keyAccounts.tableHeaders.entrega}</p>
            </div>
            <div className="divide-y divide-slate-200">
              {pricingLessonB3.bands.keyAccounts.rows.map((row) => (
                <div
                  key={row.banda}
                  className="grid gap-1 px-3 py-3 sm:grid-cols-[0.8fr_1fr_2fr] sm:gap-2"
                >
                  <p className="text-[15px] font-semibold text-slate-900">{row.banda}</p>
                  <p className="text-[15px] text-slate-700">{row.range}</p>
                  <p className="text-[15px] text-slate-700">{row.entrega}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-800">
            {pricingLessonB3.bands.keyAccounts.note}
          </p>
        </div>

        {/* Card Digital con border-dashed (jerarquía secundaria) */}
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{pricingLessonB3.bands.digital.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {pricingLessonB3.bands.digital.tagline}
            </span>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {pricingLessonB3.bands.digital.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="mt-3 text-[16px] leading-relaxed text-slate-700">{pricingLessonB3.bands.digital.modules}</p>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-800">
            {pricingLessonB3.bands.digital.note}
          </p>
        </div>
      </section>

      {/* 4. Cómo se presenta un precio */}
      <BulletSection
        className="mt-8"
        heading={pricingLessonB3.presentation.heading}
        bullets={pricingLessonB3.presentation.bullets}
      />

      {/* 5. Negociación profesional */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{pricingLessonB3.negotiation.heading}</h3>

        <div className="mt-3 rounded-lg border-l-4 border-slate-400 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {pricingLessonB3.negotiation.objectionLabel}
          </p>
          <p className="mt-1 text-[17px] italic text-slate-800">{pricingLessonB3.negotiation.objection}</p>
        </div>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-slate-700">
          {pricingLessonB3.negotiation.rules.map((rule, idx) => (
            <li key={`b3-neg-${idx}`}>{rule}</li>
          ))}
        </ul>

        <p className="mt-4 text-[16px] font-semibold leading-relaxed text-slate-900">
          {pricingLessonB3.negotiation.operatingRule}
        </p>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          {pricingLessonB3.negotiation.ticketRule}
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            {pricingLessonB3.negotiation.packExample.heading}
          </p>
          <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
            {pricingLessonB3.negotiation.packExample.body}
          </p>
        </div>
      </section>

      {/* 6. No-negociables */}
      <BulletSection
        className="mt-8"
        tone="callout"
        heading={pricingLessonB3.nonNegotiables.heading}
        bullets={pricingLessonB3.nonNegotiables.bullets}
      />

      {/* 7. Traducción operativa */}
      <BulletSection
        className="mt-8"
        heading={pricingLessonB3.translation.heading}
        intro={pricingLessonB3.translation.intro}
        bullets={pricingLessonB3.translation.bullets}
      />

      <SynthesisBox lines={pricingLessonB3.synthesis} keyPrefix="b3-synth" />
    </LessonShell>
  );
}
