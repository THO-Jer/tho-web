import Image from "next/image";

import type { LessonGuide } from "@/content/onboarding/lessonGuides";
import type { Lesson, ModuleVisual } from "@/lib/onboarding";

/**
 * Fallback genérico para lecciones que aún no tienen render hand-crafted.
 *
 * Estructura: dos columnas con prosa + bullets a la izquierda, ilustración del
 * módulo a la derecha. Bajo el contenido principal se muestra la guía lateral
 * con "Por qué importa / Cómo proceder / Error frecuente / Aprendizajes clave".
 *
 * Es el render por defecto para todo el Módulo C y D, y para las lecciones de B
 * que aún no se han profundizado.
 */
export function GenericLesson({
  lesson,
  lessonIndex,
  visual,
  lessonGuide,
  moduleKey,
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  lesson: Lesson;
  lessonIndex: number;
  visual: ModuleVisual;
  lessonGuide: LessonGuide | null;
  moduleKey: string;
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  return (
    <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lección {lessonIndex + 1}</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">{lesson.title}</h2>
        <p className={`mt-2 text-base font-medium ${visual.accent}`}>{lesson.subtitle}</p>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Puntos de clarificación</p>
          {lesson.bullets.length ? (
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              {lesson.bullets.map((bullet, idx) => (
                <li key={`${lesson.id}-bullet-${idx}`}>{bullet}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600">No hay aclaraciones adicionales en esta lección.</p>
          )}
        </div>

        {lessonGuide ? (
          <div className="mt-4 space-y-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Por qué importa</p>
              <p className="mt-1 text-sm text-slate-700">{lessonGuide.whyItMatters}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Cómo proceder</p>
              <p className="mt-1 text-sm text-slate-700">{lessonGuide.whatToDo}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Error frecuente</p>
              <p className="mt-1 text-sm text-slate-700">{lessonGuide.commonMistake}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Aprendizajes clave</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {lessonGuide.keyLearnings.slice(0, 3).map((item) => (
                  <li key={`${lesson.id}-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <p className="mt-4 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
        <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
      </div>
      <div className="relative min-h-44 bg-slate-50">
        <Image src={visual.cover} alt={`Ilustración módulo ${moduleKey}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
    </div>
  );
}
