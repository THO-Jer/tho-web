import { foundationalLessonA0 } from "@/content/onboarding/moduleA";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";

/**
 * A0 · Marco institucional — "¿Qué es el onboarding y por qué existe?"
 *
 * Estructura editorial:
 *  1. Marco estratégico (párrafos introductorios).
 *  2. Tres bloques "Qué protege / evita / instala" con bullets y cierre.
 *  3. Bloque de tensión.
 *  4. Bloque de traducción práctica.
 *  5. Micro-reflexión final.
 */
export function LessonA0({
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
      label={foundationalLessonA0.label}
      title={foundationalLessonA0.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
    >
      <LessonIntro paragraphs={foundationalLessonA0.strategicFrame} keyPrefix="a0-frame" />

      <div className="mt-8 space-y-7">
        {foundationalLessonA0.blocks.map((block) => (
          <BulletSection
            key={block.heading}
            heading={block.heading}
            intro={block.intro}
            bullets={block.bullets}
            closing={block.closing}
          />
        ))}
      </div>

      <BulletSection
        className="mt-8"
        heading={foundationalLessonA0.tension.heading}
        intro={foundationalLessonA0.tension.intro}
        bullets={foundationalLessonA0.tension.bullets}
        closing={foundationalLessonA0.tension.closing}
      />

      <BulletSection
        className="mt-8"
        heading={foundationalLessonA0.practice.heading}
        intro={foundationalLessonA0.practice.intro}
        bullets={foundationalLessonA0.practice.bullets}
      />

      <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Micro-reflexión</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{foundationalLessonA0.reflection}</p>
      </section>
    </LessonShell>
  );
}
