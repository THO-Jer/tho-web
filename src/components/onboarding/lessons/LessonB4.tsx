import { qualificationLessonB4, type QualificationTier } from "@/content/onboarding/moduleB";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * B4 · Diagnóstico de cliente — "Calificación: calidad antes que volumen"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Por qué calificar (intro + lista de 3 beneficios).
 *  3. Filtro cultural: 5 preguntas mínimas como cards con nombre + pregunta +
 *     callout de warning amarillo al cierre.
 *  4. Perfiles por motor: dos cards stacked (KA y Tickets), cada una con tres
 *     tier-blocks coloreados (IDEAL emerald / VIABLE amber / NO CALIFICADO rose).
 *  5. Red flags por fase del ciclo (Reunión 1 / Seguimiento / Reunión 2) como
 *     tres cards con bullets cada una.
 *  6. Cuándo retirarse: indicators + quote-block con borde izquierdo.
 *  7. Traducción operativa (BulletSection inline para no romper el flujo).
 *  8. Síntesis.
 *
 * No usa BulletSection en la traducción porque preferimos consistencia visual
 * con el resto del componente (toda la lección es JSX inline con cards).
 */

function tierBadgeClasses(tier: QualificationTier) {
  const base = "inline-block rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide";
  if (tier === "IDEAL") return `${base} bg-emerald-100 text-emerald-800`;
  if (tier === "VIABLE") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-rose-100 text-rose-800`;
}

export function LessonB4({
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
      label={qualificationLessonB4.label}
      title={qualificationLessonB4.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={qualificationLessonB4.premise} keyPrefix="b4-premise" />

      {/* 1. Por qué calificar */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{qualificationLessonB4.whyQualify.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualificationLessonB4.whyQualify.intro}</p>
        <p className="mt-3 text-[16px] leading-relaxed text-slate-700">{qualificationLessonB4.whyQualify.listIntro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {qualificationLessonB4.whyQualify.listBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>

      {/* 2. Filtro cultural · 5 preguntas mínimas */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{qualificationLessonB4.culturalFilter.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualificationLessonB4.culturalFilter.intro}</p>
        <div className="mt-4 space-y-3">
          {qualificationLessonB4.culturalFilter.questions.map((q) => (
            <div key={q.name} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-[16px] font-semibold text-slate-900">{q.name}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{q.question}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border-l-4 border-amber-400 bg-amber-50/60 px-4 py-3">
          <p className="text-[15px] font-medium text-slate-800">{qualificationLessonB4.culturalFilter.warningOne}</p>
          <p className="mt-1 text-[15px] font-medium text-slate-800">{qualificationLessonB4.culturalFilter.warningMany}</p>
        </div>
      </section>

      {/* 3. Perfiles por motor */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{qualificationLessonB4.motorProfiles.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualificationLessonB4.motorProfiles.intro}</p>

        {/* Card Key Accounts */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{qualificationLessonB4.motorProfiles.keyAccounts.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {qualificationLessonB4.motorProfiles.keyAccounts.tagline}
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {qualificationLessonB4.motorProfiles.keyAccounts.tiers.map((tier) => (
              <div key={tier.name} className="rounded-lg border border-slate-200 bg-white p-3">
                <span className={tierBadgeClasses(tier.name)}>{tier.name}</span>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{tier.profile}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card Tickets */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{qualificationLessonB4.motorProfiles.tickets.heading}</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {qualificationLessonB4.motorProfiles.tickets.tagline}
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {qualificationLessonB4.motorProfiles.tickets.tiers.map((tier) => (
              <div key={tier.name} className="rounded-lg border border-slate-200 bg-white p-3">
                <span className={tierBadgeClasses(tier.name)}>{tier.name}</span>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{tier.profile}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Red flags durante el ciclo */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{qualificationLessonB4.redFlags.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualificationLessonB4.redFlags.intro}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {qualificationLessonB4.redFlags.phases.map((phase) => (
            <div key={phase.heading} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">{phase.heading}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-slate-700">
                {phase.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[16px] font-medium leading-relaxed text-slate-800">{qualificationLessonB4.redFlags.closing}</p>
      </section>

      {/* 5. Cuándo retirarse */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{qualificationLessonB4.exit.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualificationLessonB4.exit.intro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {qualificationLessonB4.exit.indicators.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">{qualificationLessonB4.exit.framing}</p>
        <blockquote className="mt-2 rounded-lg border-l-4 border-slate-400 bg-slate-50 px-4 py-3 text-[16px] italic leading-relaxed text-slate-800">
          {qualificationLessonB4.exit.quote}
        </blockquote>
        <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{qualificationLessonB4.exit.closing}</p>
      </section>

      {/* 6. Traducción operativa */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{qualificationLessonB4.translation.heading}</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {qualificationLessonB4.translation.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>

      <SynthesisBox lines={qualificationLessonB4.synthesis} keyPrefix="b4-synth" />
    </LessonShell>
  );
}
