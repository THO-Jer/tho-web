import { advancedFormationLessonD9 } from "@/content/onboarding/moduleD";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D9 · Formación avanzada — "Profundizaciones que vienen después de este módulo"
 *
 * Estructura:
 *  1. Premisa.
 *  2. 5 tracks de formación (nombre, descripción, por qué importa).
 *  3. Callout cómo funciona la formación avanzada en THO.
 *  4. Síntesis.
 */
export function LessonD9({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = advancedFormationLessonD9;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d9-premise" />

      {/* 5 tracks */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">Tracks de profundización</h3>
        <div className="mt-4 space-y-4">
          {d.tracks.map((track, i) => (
            <div
              key={`d9-track-${i}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="border-b border-slate-100 bg-emerald-50 px-4 py-3">
                <p className="text-[15px] font-semibold text-emerald-900">{track.name}</p>
              </div>
              <div className="px-4 py-4 space-y-3">
                <p className="text-[15px] leading-relaxed text-slate-700">{track.description}</p>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Por qué importa
                  </p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-slate-800">
                    {track.whyItMatters}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Callout cómo funciona */}
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.formationNote.label}
        </p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">
          {d.formationNote.statement}
        </p>
        {d.formationNote.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.formationNote.body.map((line, i) => (
              <p key={`d9-note-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="d9-synth" />
    </LessonShell>
  );
}
