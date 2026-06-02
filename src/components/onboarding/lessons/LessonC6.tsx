import { dodCreativeLessonC6 } from "@/content/onboarding/moduleC";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C6 · DoD creativa — "Qué significa que una pieza está terminada"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Criterios DoD (tabla criterio + pregunta de validación).
 *  3. Grid 2 columnas: Sin método vs. Con método.
 *  4. Callout riesgo pieza a medias (con referencia explícita a Kanban y Excel).
 *  5. Síntesis.
 */
export function LessonC6({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = dodCreativeLessonC6;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c6-premise" />

      {/* Criterios DoD */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.dodCriteria.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.dodCriteria.intro}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid sm:grid-cols-[1fr_2fr] sm:gap-2">
            <p>Criterio</p>
            <p>Pregunta de validación</p>
          </div>
          <div className="divide-y divide-slate-200">
            {d.dodCriteria.criteria.map((c, i) => (
              <div key={`c6-dod-${i}`} className="grid gap-1 px-3 py-3 sm:grid-cols-[1fr_2fr] sm:gap-2">
                <p className="text-[15px] font-semibold text-slate-900">{c.criterion}</p>
                <p className="text-[15px] leading-relaxed text-slate-700">{c.question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Sin método / Con método */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.aestheticsVsMethod.heading}</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Sin método</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
              {d.aestheticsVsMethod.aesthetic.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-violet-100 bg-white p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Con método</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
              {d.aestheticsVsMethod.method.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Callout riesgo pieza a medias */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{d.halfDoneRisk.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">{d.halfDoneRisk.statement}</p>
        {d.halfDoneRisk.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.halfDoneRisk.body.map((line, i) => (
              <p key={`c6-risk-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="c6-synth" />
    </LessonShell>
  );
}
