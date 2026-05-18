import { consultiveSalesLessonB1 } from "@/content/onboarding/moduleB";
import { LessonShell } from "@/components/onboarding/LessonShell";

/**
 * B1 · Venta consultiva institucional — "Qué significa vender en THO"
 *
 * Es la primera lección hand-crafted del módulo B y sirve de plantilla para
 * las demás. Estructura: tensión inicial → intro → 4 secciones (marco
 * conceptual, diferencia transaccional/institucional a dos columnas, principio
 * rector, marco mental obligatorio).
 *
 * Sin caja de síntesis final por decisión editorial (el "principio rector"
 * funciona como cierre).
 */
export function LessonB1({
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
      label={consultiveSalesLessonB1.label}
      title={consultiveSalesLessonB1.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{consultiveSalesLessonB1.tension}</p>

      <div className="mt-6 space-y-2 text-[16px] leading-relaxed text-slate-700">
        {consultiveSalesLessonB1.intro.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-slate-900">{consultiveSalesLessonB1.conceptual.heading}</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{consultiveSalesLessonB1.conceptual.intro}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {consultiveSalesLessonB1.conceptual.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-slate-900">{consultiveSalesLessonB1.difference.heading}</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">Venta transaccional</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
                {consultiveSalesLessonB1.difference.transactional.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">Venta institucional THO</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
                {consultiveSalesLessonB1.difference.institutional.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-slate-900">{consultiveSalesLessonB1.rector.heading}</h3>
          <p className="mt-2 text-[16px] font-semibold text-slate-900">{consultiveSalesLessonB1.rector.statement}</p>
          <p className="mt-1 text-[16px] font-medium text-slate-800">{consultiveSalesLessonB1.rector.closing}</p>
          <p className="mt-2 text-[16px] leading-relaxed text-slate-700">Aceptar un cliente incompatible puede generar:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {consultiveSalesLessonB1.rector.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-xl font-semibold text-slate-900">{consultiveSalesLessonB1.mindset.heading}</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
            {consultiveSalesLessonB1.mindset.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
          <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{consultiveSalesLessonB1.mindset.closing}</p>
        </section>
      </div>
    </LessonShell>
  );
}
