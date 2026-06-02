import { conceptualBasesLessonD2 } from "@/content/onboarding/moduleD";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D2 · Fundamentos conceptuales mínimos — "Marcos explícitos, no intuición aislada"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Por qué marcos explícitos (BulletSection).
 *  3. Tabla de 4 marcos: gestión del cambio, relacionamiento comunitario, doble materialidad, poder.
 *  4. Callout nota de integración.
 *  5. Síntesis.
 */
export function LessonD2({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = conceptualBasesLessonD2;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d2-premise" />

      <BulletSection
        className="mt-8"
        heading={d.whyFrames.heading}
        intro={d.whyFrames.intro}
        bullets={d.whyFrames.bullets}
        closing={d.whyFrames.closing}
      />

      {/* Tabla de marcos conceptuales */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">
          Cuatro marcos conceptuales base
        </h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
          Cada marco aporta una lente de análisis distinta. Ninguno reemplaza a los otros.
        </p>
        <div className="mt-4 space-y-4">
          {d.frameworks.map((fw) => (
            <div
              key={fw.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="border-b border-slate-100 bg-emerald-50 px-4 py-3">
                <p className="text-[15px] font-semibold text-emerald-900">{fw.name}</p>
              </div>
              <div className="grid gap-3 px-4 py-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Idea central
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-700">
                    {fw.coreIdea}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Aplicación en THO
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-emerald-800">
                    {fw.thoApplication}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Riesgo frecuente
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-rose-700">
                    {fw.keyRisk}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Callout nota de integración */}
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.integrationNote.label}
        </p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">
          {d.integrationNote.statement}
        </p>
        {d.integrationNote.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.integrationNote.body.map((line, i) => (
              <p key={`d2-integration-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="d2-synth" />
    </LessonShell>
  );
}
