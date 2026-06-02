import { annualExcelLessonC3 } from "@/content/onboarding/moduleC";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C3 · Excel anual — "El Excel anual como eje organizador"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Tabla de campos mínimos obligatorios (campo + por qué).
 *  3. Callout regla de correspondencia.
 *  4. Cómo usar el Excel en el flujo (BulletSection ordered).
 *  5. Lo que no se hace (BulletSection callout).
 *  6. Síntesis.
 */
export function LessonC3({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = annualExcelLessonC3;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c3-premise" />

      {/* Tabla campos mínimos */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.mandatoryFields.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.mandatoryFields.intro}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid sm:grid-cols-[1fr_2fr] sm:gap-2">
            <p>Campo</p>
            <p>Por qué es obligatorio</p>
          </div>
          <div className="divide-y divide-slate-200">
            {d.mandatoryFields.fields.map((f) => (
              <div key={f.field} className="grid gap-1 px-3 py-3 sm:grid-cols-[1fr_2fr] sm:gap-2">
                <p className="text-[15px] font-semibold text-slate-900">{f.field}</p>
                <p className="text-[15px] leading-relaxed text-slate-700">{f.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Callout correspondencia */}
      <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{d.correspondenceRule.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">{d.correspondenceRule.statement}</p>
        {d.correspondenceRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.correspondenceRule.body.map((line, i) => (
              <p key={`c3-rule-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Cómo usar el Excel */}
      <BulletSection
        className="mt-8"
        heading={d.howToUse.heading}
        bullets={d.howToUse.bullets}
        ordered
      />

      {/* Lo que no se hace */}
      <BulletSection
        className="mt-8"
        tone="callout"
        heading={d.neverDo.heading}
        bullets={d.neverDo.bullets}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="c3-synth" />
    </LessonShell>
  );
}
