import { dodAdvisoryLessonD6 } from "@/content/onboarding/moduleD";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D6 · DoD en asesorías — "Piso mínimo universal + DoD pactada en la propuesta"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Piso mínimo universal — 4 elementos (tabla).
 *  3. Tipos de entregable y su lógica de DoD (cards: analítico-decisional vs. instrumental).
 *  4. Callout regla central: el DoD se define en la propuesta.
 *  5. Callout recordatorio del piso.
 *  6. Síntesis.
 */
export function LessonD6({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = dodAdvisoryLessonD6;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d6-premise" />

      {/* Piso mínimo universal */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.universalFloor.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.universalFloor.intro}</p>
        <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
          {d.universalFloor.elements.map((el) => (
            <div key={el.name} className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-3">
              <p className="text-[15px] font-semibold text-slate-900">{el.name}</p>
              <p className="text-[15px] leading-relaxed text-slate-700 sm:col-span-2">
                {el.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600 italic">
          {d.universalFloor.closing}
        </p>
      </section>

      {/* Tipos de entregable */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.deliverableTypes.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.deliverableTypes.intro}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {d.deliverableTypes.types.map((type, i) => (
            <div
              key={`d6-type-${i}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className={`border-b px-4 py-3 ${i === 0 ? "border-emerald-100 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
                <p className={`text-[14px] font-semibold ${i === 0 ? "text-emerald-900" : "text-slate-800"}`}>
                  {type.name}
                </p>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Ejemplos
                  </p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-slate-600">{type.examples}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Lógica de DoD
                  </p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-slate-700">{type.dodNote}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Callout regla central */}
      <div className="mt-8 rounded-xl border border-emerald-300 bg-emerald-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.negotiationRule.label}
        </p>
        <p className="mt-1 text-[18px] font-semibold leading-snug text-slate-900">
          {d.negotiationRule.statement}
        </p>
        {d.negotiationRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.negotiationRule.body.map((line, i) => (
              <p key={`d6-neg-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Callout recordatorio del piso */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {d.floorRule.label}
        </p>
        <p className="mt-1 text-[16px] font-semibold leading-snug text-slate-800">
          {d.floorRule.statement}
        </p>
        {d.floorRule.body && (
          <div className="mt-2 space-y-1 text-[15px] leading-relaxed text-slate-600">
            {d.floorRule.body.map((line, i) => (
              <p key={`d6-floor-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="d6-synth" />
    </LessonShell>
  );
}
