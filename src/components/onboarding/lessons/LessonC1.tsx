import { scrumAdaptationLessonC1 } from "@/content/onboarding/moduleC";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C1 · Marco metodológico — "Scrum adaptado a THO"
 *
 * Estructura:
 *  1. Premisa (qué es Scrum + por qué THO lo adapta).
 *  2. Principios que sí aplicamos (BulletSection).
 *  3. Tabla de roles con equivalente THO actual (nota de escala incluida).
 *  4. Por qué los roles se superponen hoy (BulletSection con closing).
 *  5. Callout Kanban en Planner · 3 depósitos.
 *  6. Traducción operativa (BulletSection).
 *  7. Síntesis.
 */
export function LessonC1({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = scrumAdaptationLessonC1;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c1-premise" />

      {/* Principios Scrum */}
      <BulletSection
        className="mt-8"
        heading={d.scrumPrinciples.heading}
        intro={d.scrumPrinciples.intro}
        bullets={d.scrumPrinciples.bullets}
        closing={d.scrumPrinciples.closing}
      />

      {/* Tabla de roles */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.rolesTable.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.rolesTable.intro}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid sm:grid-cols-3 sm:gap-2">
            <p>Rol Scrum</p>
            <p>Función original</p>
            <p>En THO hoy</p>
          </div>
          <div className="divide-y divide-slate-200">
            {d.rolesTable.rows.map((row) => (
              <div key={row.role} className="grid gap-1 px-3 py-3 sm:grid-cols-3 sm:gap-2">
                <p className="text-[15px] font-semibold text-slate-900">{row.role}</p>
                <p className="text-[15px] leading-relaxed text-slate-700">{row.function}</p>
                <p className="text-[15px] leading-relaxed text-violet-800">{row.thoEquivalent}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué se superponen hoy */}
      <BulletSection
        className="mt-8"
        heading={d.thoAdaptation.heading}
        intro={d.thoAdaptation.intro}
        bullets={d.thoAdaptation.bullets}
        closing={d.thoAdaptation.closing}
      />

      {/* Callout Kanban · 3 depósitos */}
      <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{d.kanbanRule.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">{d.kanbanRule.statement}</p>
        {d.kanbanRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.kanbanRule.body.map((line, i) => (
              <p key={`c1-kanban-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Traducción operativa */}
      <BulletSection
        className="mt-8"
        heading={d.translation.heading}
        intro={d.translation.intro}
        bullets={d.translation.bullets}
        closing={d.translation.closing}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="c1-synth" />
    </LessonShell>
  );
}
