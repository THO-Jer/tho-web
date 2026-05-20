import { commercialEthicsLessonB6 } from "@/content/onboarding/moduleB";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * B6 · Límites en la venta — "Ética comercial en THO"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Tres "no" fundamentales (3 cards con statement bold + explanation).
 *  3. Por qué la ética protege (BulletSection con intro).
 *  4. Manejo ético de objeciones: 5 cards, cada una con quote-block para la
 *     objeción + dos sub-bloques contrastados (Trampa rose / Respuesta ética
 *     emerald — mismo lenguaje de color de los tier badges de B4).
 *  5. Lo que nunca se hace (BulletSection con tono callout).
 *  6. Cuándo declinar una venta (BulletSection con closing).
 *  7. Traducción operativa (BulletSection).
 *  8. Síntesis.
 */
export function LessonB6({
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
      label={commercialEthicsLessonB6.label}
      title={commercialEthicsLessonB6.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={commercialEthicsLessonB6.premise} keyPrefix="b6-premise" />

      {/* 1. Tres "no" fundamentales */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{commercialEthicsLessonB6.fundamentals.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{commercialEthicsLessonB6.fundamentals.intro}</p>
        <div className="mt-4 space-y-3">
          {commercialEthicsLessonB6.fundamentals.items.map((item) => (
            <div key={item.statement} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[17px] font-semibold text-slate-900">{item.statement}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{item.explanation}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[16px] font-medium leading-relaxed text-slate-800">
          {commercialEthicsLessonB6.fundamentals.closing}
        </p>
      </section>

      {/* 2. Por qué la ética protege */}
      <BulletSection
        className="mt-8"
        heading={commercialEthicsLessonB6.whyEthicsProtects.heading}
        intro={commercialEthicsLessonB6.whyEthicsProtects.intro}
        bullets={commercialEthicsLessonB6.whyEthicsProtects.bullets}
      />

      {/* 3. Manejo ético de objeciones */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{commercialEthicsLessonB6.objections.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{commercialEthicsLessonB6.objections.intro}</p>
        <div className="mt-4 space-y-3">
          {commercialEthicsLessonB6.objections.items.map((item) => (
            <div key={item.objection} className="rounded-xl border border-slate-200 bg-white p-4">
              <blockquote className="border-l-4 border-slate-400 pl-3 text-[16px] italic leading-relaxed text-slate-800">
                {item.objection}
              </blockquote>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="inline-block rounded-md bg-rose-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-800">
                    {commercialEthicsLessonB6.objections.trapLabel}
                  </span>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{item.trap}</p>
                </div>
                <div>
                  <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                    {commercialEthicsLessonB6.objections.ethicalLabel}
                  </span>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{item.ethical}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Lo que nunca se hace */}
      <BulletSection
        className="mt-8"
        tone="callout"
        heading={commercialEthicsLessonB6.neverDo.heading}
        intro={commercialEthicsLessonB6.neverDo.intro}
        bullets={commercialEthicsLessonB6.neverDo.bullets}
      />

      {/* 5. Cuándo declinar */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{commercialEthicsLessonB6.whenToDecline.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{commercialEthicsLessonB6.whenToDecline.intro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
          {commercialEthicsLessonB6.whenToDecline.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">
          {commercialEthicsLessonB6.whenToDecline.closing}
        </p>
      </section>

      {/* 6. Traducción operativa */}
      <BulletSection
        className="mt-8"
        heading={commercialEthicsLessonB6.translation.heading}
        bullets={commercialEthicsLessonB6.translation.bullets}
      />

      <SynthesisBox lines={commercialEthicsLessonB6.synthesis} keyPrefix="b6-synth" />
    </LessonShell>
  );
}
