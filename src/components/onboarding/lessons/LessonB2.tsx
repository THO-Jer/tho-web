import { dualEngineLessonB2 } from "@/content/onboarding/moduleB";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * B2 · Arquitectura comercial — "Los dos motores comerciales de THO"
 *
 * Premisa → Card "Motor Key Accounts" (foco estratégico) → Card "Motor Tickets"
 * (puerta de entrada, con priority list + notTickets callout) → Funnel
 * (cómo se relacionan, con target y pitch timing) → Card "Línea complementaria
 * digital" (border-dashed para marcar jerarquía secundaria) → Traducción
 * operativa → Síntesis.
 *
 * El layout vertical (cards stacked) está pensado porque las dos motores tienen
 * estructuras internas asimétricas: Tickets tiene priorityTickets + notTickets
 * que Key Accounts no usa. Un grid de dos columnas se vería irregular.
 */
export function LessonB2({
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
      label={dualEngineLessonB2.label}
      title={dualEngineLessonB2.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={dualEngineLessonB2.premise} keyPrefix="b2-premise" />

      {/* Card 1 · Motor Key Accounts */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold text-slate-900">{dualEngineLessonB2.keyAccounts.heading}</h3>
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {dualEngineLessonB2.keyAccounts.tagline}
          </span>
        </div>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{dualEngineLessonB2.keyAccounts.intro}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {dualEngineLessonB2.keyAccounts.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-3 text-[16px] font-semibold leading-relaxed text-slate-900">{dualEngineLessonB2.keyAccounts.closing}</p>
      </section>

      {/* Card 2 · Motor Tickets */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold text-slate-900">{dualEngineLessonB2.tickets.heading}</h3>
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {dualEngineLessonB2.tickets.tagline}
          </span>
        </div>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{dualEngineLessonB2.tickets.intro}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {dualEngineLessonB2.tickets.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-3 text-[16px] leading-relaxed text-slate-700">{dualEngineLessonB2.tickets.functionStatement}</p>

        <div className="mt-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{dualEngineLessonB2.tickets.priorityHeading}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {dualEngineLessonB2.tickets.priorityTickets.map((ticket) => (
              <li key={ticket}>{ticket}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{dualEngineLessonB2.tickets.notTicketsIntro}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
            {dualEngineLessonB2.tickets.notTickets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Funnel */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{dualEngineLessonB2.funnel.heading}</h3>
        <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-slate-700">
          {dualEngineLessonB2.funnel.body.map((line, idx) => (
            <p key={`b2-funnel-${idx}`}>{line}</p>
          ))}
        </div>
        <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{dualEngineLessonB2.funnel.targetLine}</p>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{dualEngineLessonB2.funnel.pitchTiming}</p>
      </section>

      {/* Línea complementaria · servicios digitales (border-dashed para señalar jerarquía secundaria) */}
      <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
        <h3 className="text-xl font-semibold text-slate-900">{dualEngineLessonB2.digital.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{dualEngineLessonB2.digital.intro}</p>
        <p className="mt-3 text-[16px] font-semibold leading-relaxed text-slate-900">{dualEngineLessonB2.digital.statement}</p>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{dualEngineLessonB2.digital.context}</p>
        <p className="mt-3 text-[16px] font-semibold leading-relaxed text-slate-900">{dualEngineLessonB2.digital.rule}</p>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">{dualEngineLessonB2.digital.operationalIntro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {dualEngineLessonB2.digital.operationalBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-800">{dualEngineLessonB2.digital.caution}</p>
      </section>

      {/* Traducción operativa */}
      <BulletSection
        className="mt-8"
        heading={dualEngineLessonB2.translation.heading}
        intro={dualEngineLessonB2.translation.intro}
        bullets={dualEngineLessonB2.translation.bullets}
      />

      <SynthesisBox lines={dualEngineLessonB2.synthesis} keyPrefix="b2-synth" />
    </LessonShell>
  );
}
