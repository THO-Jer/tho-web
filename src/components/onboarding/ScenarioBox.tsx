/**
 * Caja tipo "Escenario aplicado" o "Tensión": fondo gris claro, heading destacado
 * y un conjunto de líneas/párrafos como contenido principal.
 *
 * Usada por A1, A2, A4, A6 (tension) y similares. Las líneas se renderizan como
 * párrafos sucesivos para conservar el ritmo de lectura del Módulo A.
 */
export function ScenarioBox({
  heading,
  lines,
  keyPrefix,
}: {
  heading: string;
  lines: string[];
  /** Prefijo único para keys de React. */
  keyPrefix: string;
}) {
  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>
      <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-slate-700">
        {lines.map((line, idx) => (
          <p key={`${keyPrefix}-${idx}`}>{line}</p>
        ))}
      </div>
    </section>
  );
}
