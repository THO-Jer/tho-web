/**
 * Bloque de párrafos introductorios al inicio de una lección.
 *
 * Mantiene el estilo editorial del Módulo A: párrafos cortos, alto contraste,
 * con margen superior generoso para separarse del título de la lección.
 */
export function LessonIntro({
  paragraphs,
  keyPrefix,
  className = "mt-6",
}: {
  paragraphs: string[];
  /** Prefijo único para keys de React. */
  keyPrefix: string;
  /** Permite override del margen superior. A7 usa mt-5; el resto, mt-6. */
  className?: string;
}) {
  return (
    <div className={`${className} space-y-3 text-[16px] leading-relaxed text-slate-700`}>
      {paragraphs.map((paragraph, idx) => (
        <p key={`${keyPrefix}-${idx}`}>{paragraph}</p>
      ))}
    </div>
  );
}
