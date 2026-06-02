import { ethicsAdvisoryLessonD8 } from "@/content/onboarding/moduleD";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D8 · Ética en asesorías — "La legitimidad de THO se sostiene en la claridad"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Los tres "No" éticos (cards con prohibición, descripción, consecuencia).
 *  3. Callout fundamento de la legitimidad THO.
 *  4. Condiciones que obligan a declinar (BulletSection).
 *  5. Síntesis.
 */
export function LessonD8({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = ethicsAdvisoryLessonD8;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d8-premise" />

      {/* Los tres "No" éticos */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">
          Las tres prohibiciones éticas
        </h3>
        <div className="mt-4 space-y-4">
          {d.threeNos.map((item, i) => (
            <div
              key={`d8-no-${i}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="border-b border-slate-100 bg-rose-50 px-4 py-3">
                <p className="text-[15px] font-semibold text-rose-900">{item.prohibition}</p>
              </div>
              <div className="px-4 py-4 space-y-3">
                <p className="text-[15px] leading-relaxed text-slate-700">{item.description}</p>
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Consecuencia
                  </p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-slate-800">
                    {item.consequence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Callout legitimidad */}
      <div className="mt-8 rounded-xl border border-emerald-300 bg-emerald-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.legitimacyRule.label}
        </p>
        <p className="mt-1 text-[18px] font-semibold leading-snug text-slate-900">
          {d.legitimacyRule.statement}
        </p>
        {d.legitimacyRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.legitimacyRule.body.map((line, i) => (
              <p key={`d8-legit-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <BulletSection
        className="mt-8"
        heading={d.obligatoryDecline.heading}
        intro={d.obligatoryDecline.intro}
        bullets={d.obligatoryDecline.bullets}
        closing={d.obligatoryDecline.closing}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="d8-synth" />
    </LessonShell>
  );
}
