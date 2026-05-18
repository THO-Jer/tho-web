/**
 * Caja de cierre "Síntesis": borde y fondo blanco, encabezado discreto y
 * una serie de líneas en negrita que condensan el aprendizaje de la lección.
 *
 * Acepta una única línea (string) o múltiples (string[]).
 */
export function SynthesisBox({
  lines,
  keyPrefix,
  heading = "Síntesis",
}: {
  lines: string | string[];
  keyPrefix: string;
  heading?: string;
}) {
  const items = Array.isArray(lines) ? lines : [lines];

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">{heading}</h3>
      <div className="mt-2 space-y-1 text-[16px] font-medium leading-relaxed text-slate-800">
        {items.map((line, idx) => (
          <p key={`${keyPrefix}-${idx}`}>{line}</p>
        ))}
      </div>
    </section>
  );
}
