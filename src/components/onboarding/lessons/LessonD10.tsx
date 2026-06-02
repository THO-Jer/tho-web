import { alertSignsLessonD10 } from "@/content/onboarding/moduleD";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * D10 · Señales de alerta en asesoría — "Indicadores de riesgo metodológico"
 *
 * Estructura:
 *  1. Premisa.
 *  2. 5 señales (señal, descripción, respuesta correcta).
 *  3. Callout principio de alerta temprana.
 *  4. Síntesis.
 */
export function LessonD10({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = alertSignsLessonD10;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="d10-premise" />

      {/* 5 señales de alerta */}
      <section className="mt-8 space-y-4">
        {d.alerts.map((alert, i) => (
          <div
            key={`d10-alert-${i}`}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-100 bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-600">⚠</span>
                <p className="text-[15px] font-semibold text-amber-900">{alert.signal}</p>
              </div>
            </div>
            <div className="px-4 py-4 space-y-3">
              <p className="text-[15px] leading-relaxed text-slate-700">{alert.description}</p>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Respuesta correcta
                </p>
                <p className="mt-0.5 text-[14px] leading-relaxed text-slate-800">
                  {alert.correctResponse}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Callout alerta temprana */}
      <div className="mt-8 rounded-xl border border-emerald-300 bg-emerald-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {d.alertRule.label}
        </p>
        <p className="mt-1 text-[18px] font-semibold leading-snug text-slate-900">
          {d.alertRule.statement}
        </p>
        {d.alertRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.alertRule.body.map((line, i) => (
              <p key={`d10-rule-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      <SynthesisBox lines={d.synthesis} keyPrefix="d10-synth" />
    </LessonShell>
  );
}
