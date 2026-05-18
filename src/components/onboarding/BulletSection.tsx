/**
 * Sección con la forma: heading + (intro opcional) + bullets + (closing opcional).
 *
 * Es el patrón visual más repetido en las lecciones hand-crafted del onboarding.
 *
 * El prop `tone` controla el envoltorio:
 *  - `plain` (default): sin caja, encaja con el flujo de prosa.
 *  - `callout`: con fondo `bg-slate-50` y borde, para énfasis (escenarios, tensiones).
 *  - `card`: con fondo blanco y borde, similar a callout pero sin gris.
 *
 * El prop `ordered` cambia el listado a numerado (ol vs ul).
 */
export function BulletSection({
  heading,
  intro,
  bullets,
  closing,
  tone = "plain",
  ordered = false,
  className,
}: {
  heading: string;
  intro?: string;
  bullets: string[];
  closing?: string;
  tone?: "plain" | "callout" | "card";
  ordered?: boolean;
  className?: string;
}) {
  const toneClass =
    tone === "callout"
      ? "rounded-xl border border-slate-200 bg-slate-50 p-4"
      : tone === "card"
      ? "rounded-xl border border-slate-200 bg-white p-4"
      : "";
  const ListTag = ordered ? "ol" : "ul";
  const listClass = ordered
    ? "mt-2 list-decimal space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700"
    : "mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700";

  return (
    <section className={[toneClass, className].filter(Boolean).join(" ")}>
      <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>
      {intro ? <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{intro}</p> : null}
      <ListTag className={listClass}>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ListTag>
      {closing ? <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{closing}</p> : null}
    </section>
  );
}
