import type {
  BlockTone,
  CardItem,
  LessonBlock,
  LessonDoc,
  TableColStyle,
} from "@/content/onboarding/blocks";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { ScenarioBox } from "@/components/onboarding/ScenarioBox";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * Renderer data-driven de lecciones del onboarding.
 *
 * Reemplaza los componentes hand-crafted LessonA0..DCierre: recibe un
 * `LessonDoc` (ver src/content/onboarding/blocks.ts) y renderiza su secuencia
 * de bloques con el lenguaje visual del onboarding, usando el color de acento
 * del módulo (A sky / B indigo / C violet / D emerald).
 */

type ModuleAccent = {
  labelText: string;
  softBorder: string;
  softBorderLight: string;
  softBg: string;
  strongBorder: string;
  strongBg: string;
  cellText: string;
  chipBg: string;
  chipText: string;
  numberBg: string;
};

/**
 * Clases completas por módulo (Tailwind v4 escanea literales; no componer
 * clases con template strings ni .replace()).
 */
const MODULE_ACCENTS: Record<string, ModuleAccent> = {
  A: {
    labelText: "text-sky-700",
    softBorder: "border-sky-200",
    softBorderLight: "border-sky-100",
    softBg: "bg-sky-50",
    strongBorder: "border-sky-300",
    strongBg: "bg-sky-100",
    cellText: "text-sky-800",
    chipBg: "bg-sky-100",
    chipText: "text-sky-800",
    numberBg: "bg-sky-700",
  },
  B: {
    labelText: "text-indigo-700",
    softBorder: "border-indigo-200",
    softBorderLight: "border-indigo-100",
    softBg: "bg-indigo-50",
    strongBorder: "border-indigo-300",
    strongBg: "bg-indigo-100",
    cellText: "text-indigo-800",
    chipBg: "bg-indigo-100",
    chipText: "text-indigo-800",
    numberBg: "bg-indigo-700",
  },
  C: {
    labelText: "text-violet-700",
    softBorder: "border-violet-200",
    softBorderLight: "border-violet-100",
    softBg: "bg-violet-50",
    strongBorder: "border-violet-300",
    strongBg: "bg-violet-100",
    cellText: "text-violet-800",
    chipBg: "bg-violet-100",
    chipText: "text-violet-800",
    numberBg: "bg-violet-700",
  },
  D: {
    labelText: "text-emerald-700",
    softBorderLight: "border-emerald-100",
    softBorder: "border-emerald-200",
    softBg: "bg-emerald-50",
    strongBorder: "border-emerald-300",
    strongBg: "bg-emerald-100",
    cellText: "text-emerald-800",
    chipBg: "bg-emerald-100",
    chipText: "text-emerald-800",
    numberBg: "bg-emerald-700",
  },
};

function toneClasses(tone: BlockTone | undefined, accent: ModuleAccent) {
  switch (tone) {
    case "strong":
      return { box: `${accent.strongBorder} ${accent.strongBg}`, label: accent.labelText, statement: "text-[18px]" };
    case "warning":
      return { box: "border-amber-200 bg-amber-50", label: "text-amber-700", statement: "text-[17px]" };
    case "danger":
      return { box: "border-rose-200 bg-rose-50", label: "text-rose-700", statement: "text-[17px]" };
    case "success":
      return { box: "border-emerald-200 bg-emerald-50", label: "text-emerald-700", statement: "text-[17px]" };
    case "neutral":
      return { box: "border-slate-200 bg-slate-50", label: "text-slate-600", statement: "text-[17px]" };
    default:
      return { box: `${accent.softBorder} ${accent.softBg}`, label: accent.labelText, statement: "text-[17px]" };
  }
}

function fieldToneClasses(tone: BlockTone | undefined, accent: ModuleAccent) {
  switch (tone) {
    case "danger":
      return { box: "bg-rose-50", label: "text-rose-700" };
    case "warning":
      return { box: "bg-amber-50", label: "text-amber-700" };
    case "success":
      return { box: "bg-emerald-50", label: "text-emerald-700" };
    case "neutral":
      return { box: "border border-slate-100 bg-slate-50", label: "text-slate-500" };
    case "accent":
      return { box: accent.softBg, label: accent.labelText };
    default:
      return { box: "", label: "text-slate-500" };
  }
}

function headerToneClasses(tone: BlockTone | undefined, accent: ModuleAccent) {
  switch (tone) {
    case "danger":
      return { band: "border-slate-100 bg-rose-50", text: "text-rose-900" };
    case "warning":
      return { band: "border-slate-100 bg-amber-50", text: "text-amber-900" };
    case "neutral":
      return { band: "border-slate-100 bg-slate-50", text: "text-slate-800" };
    default:
      return { band: `border-slate-100 ${accent.softBg}`, text: "text-slate-900" };
  }
}

function badgeToneClasses(tone: BlockTone) {
  switch (tone) {
    case "success":
      return "bg-emerald-100 text-emerald-800";
    case "warning":
      return "bg-amber-100 text-amber-800";
    case "danger":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

function columnToneClasses(tone: BlockTone | undefined, accent: ModuleAccent) {
  switch (tone) {
    case "danger":
      return { box: "border-rose-100 bg-rose-50", label: "text-rose-700" };
    case "success":
      return { box: "border-emerald-100 bg-emerald-50", label: "text-emerald-700" };
    case "accent":
      return { box: `${accent.softBorderLight} bg-white`, label: accent.labelText };
    case "neutral":
      return { box: "border-slate-200 bg-slate-50", label: "text-slate-600" };
    default:
      return { box: "border-slate-200 bg-white", label: "text-slate-700" };
  }
}

function tableCellClasses(style: TableColStyle | undefined, accent: ModuleAccent) {
  switch (style) {
    case "strong":
      return "text-[15px] font-semibold text-slate-900";
    case "accent":
      return `text-[15px] leading-relaxed ${accent.cellText}`;
    case "mono":
      return `font-mono text-[13px] leading-relaxed ${accent.cellText}`;
    default:
      return "text-[15px] leading-relaxed text-slate-700";
  }
}

function Card({ item, accent, flat, keyPrefix }: { item: CardItem; accent: ModuleAccent; flat?: boolean; keyPrefix: string }) {
  const header = headerToneClasses(item.headerTone, accent);
  const hasBand = Boolean(!flat && item.title && (item.headerTone || item.number || item.icon || item.tagline));

  const titleEl = !item.title ? null : item.labelStyle ? (
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{item.title}</p>
  ) : (
    <p className={`text-[15px] font-semibold ${hasBand ? header.text : "text-slate-900"}`}>{item.title}</p>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {hasBand ? (
        <div className={`flex items-center justify-between gap-2 border-b px-4 py-3 ${header.band}`}>
          <div className="flex items-center gap-3">
            {item.number ? (
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${accent.numberBg}`}>
                {item.number}
              </span>
            ) : null}
            {item.icon ? <span className="text-amber-600">{item.icon}</span> : null}
            {titleEl}
          </div>
          {item.tagline ? (
            <span className={`text-xs font-semibold uppercase tracking-wide ${accent.labelText}`}>{item.tagline}</span>
          ) : null}
        </div>
      ) : null}
      <div className={`space-y-3 px-4 ${hasBand ? "py-4" : "py-3"}`}>
        {!hasBand && (titleEl || item.tagline) ? (
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            {titleEl}
            {item.tagline ? (
              <span className={`text-xs font-semibold uppercase tracking-wide ${accent.labelText}`}>{item.tagline}</span>
            ) : null}
          </div>
        ) : null}
        {item.badge ? (
          <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${badgeToneClasses(item.badge.tone)}`}>
            {item.badge.text}
          </span>
        ) : null}
        {item.statement ? (
          <p className="text-[16px] font-semibold leading-relaxed text-slate-900">{item.statement}</p>
        ) : null}
        {item.quote ? (
          <blockquote className="border-l-4 border-slate-400 pl-3 text-[16px] italic leading-relaxed text-slate-800">
            {item.quote}
          </blockquote>
        ) : null}
        {item.body?.map((line, idx) => (
          <p key={`${keyPrefix}-body-${idx}`} className="text-[15px] leading-relaxed text-slate-700">
            {line}
          </p>
        ))}
        {item.bullets?.length ? (
          <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
            {item.bullets.map((bullet, idx) => (
              <li key={`${keyPrefix}-b-${idx}`}>{bullet}</li>
            ))}
          </ul>
        ) : null}
        {item.fields?.map((field, idx) => {
          const ft = fieldToneClasses(field.tone, accent);
          return (
            <div key={`${keyPrefix}-f-${idx}`} className={`rounded-lg px-3 py-2 ${ft.box}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${ft.label}`}>{field.label}</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-slate-800">{field.text}</p>
            </div>
          );
        })}
        {item.closing ? (
          <p className="text-[15px] font-medium leading-relaxed text-slate-800">{item.closing}</p>
        ) : null}
      </div>
    </div>
  );
}

function SectionHeading({ text, intro, keyPrefix }: { text?: string; intro?: string[]; keyPrefix: string }) {
  if (!text && !intro?.length) return null;
  return (
    <>
      {text ? <h3 className="text-xl font-semibold text-slate-900">{text}</h3> : null}
      {intro?.map((line, idx) => (
        <p key={`${keyPrefix}-intro-${idx}`} className="mt-2 text-[16px] leading-relaxed text-slate-700">
          {line}
        </p>
      ))}
    </>
  );
}

export function BlockRenderer({
  block,
  accent,
  keyPrefix,
}: {
  block: LessonBlock;
  accent: ModuleAccent;
  keyPrefix: string;
}) {
  switch (block.kind) {
    case "paragraphs": {
      const textClass = block.emphasis
        ? "text-[16px] font-medium leading-relaxed text-slate-800"
        : block.muted
        ? "text-[15px] leading-relaxed text-slate-600"
        : "text-[16px] leading-relaxed text-slate-700";
      return (
        <div className={`space-y-3 ${textClass}`}>
          {block.text.map((paragraph, idx) => (
            <p key={`${keyPrefix}-${idx}`}>{paragraph}</p>
          ))}
        </div>
      );
    }

    case "heading":
      return (
        <section>
          <SectionHeading text={block.text} intro={block.intro} keyPrefix={keyPrefix} />
        </section>
      );

    case "bullets":
      return (
        <section className={
          block.tone === "callout"
            ? "rounded-xl border border-slate-200 bg-slate-50 p-4"
            : block.tone === "card"
            ? "rounded-xl border border-slate-200 bg-white p-4"
            : undefined
        }>
          {block.heading ? <h3 className="text-xl font-semibold text-slate-900">{block.heading}</h3> : null}
          {block.intro?.map((line, idx) => (
            <p key={`${keyPrefix}-intro-${idx}`} className="mt-2 text-[16px] leading-relaxed text-slate-700">
              {line}
            </p>
          ))}
          {block.ordered ? (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
              {block.bullets.map((bullet, idx) => (
                <li key={`${keyPrefix}-${idx}`}>{bullet}</li>
              ))}
            </ol>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
              {block.bullets.map((bullet, idx) => (
                <li key={`${keyPrefix}-${idx}`}>{bullet}</li>
              ))}
            </ul>
          )}
          {block.closing ? (
            <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{block.closing}</p>
          ) : null}
        </section>
      );

    case "labeledList":
      return (
        <div className={block.boxed ? "rounded-lg border border-slate-200 bg-slate-50 p-3" : undefined}>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{block.label}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
            {block.bullets.map((bullet, idx) => (
              <li key={`${keyPrefix}-${idx}`}>{bullet}</li>
            ))}
          </ul>
        </div>
      );

    case "rule": {
      const tone = toneClasses(block.tone, accent);
      return (
        <div className={`rounded-xl border p-4 ${tone.box}`}>
          {block.label ? (
            <p className={`text-xs font-semibold uppercase tracking-wide ${tone.label}`}>{block.label}</p>
          ) : null}
          {block.statement ? (
            <p className={`mt-1 font-semibold leading-snug text-slate-900 ${tone.statement}`}>{block.statement}</p>
          ) : null}
          {block.body?.length ? (
            <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
              {block.body.map((line, idx) => (
                <p key={`${keyPrefix}-${idx}`}>{line}</p>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    case "scenario":
      return <ScenarioBox heading={block.heading} lines={block.lines} keyPrefix={keyPrefix} />;

    case "quote":
      return (
        <div className="rounded-lg border-l-4 border-slate-400 bg-slate-50 px-4 py-3">
          {block.label ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{block.label}</p>
          ) : null}
          <p className="mt-1 text-[16px] italic leading-relaxed text-slate-800">{block.text}</p>
        </div>
      );

    case "chips":
      return (
        <section className={block.boxed ? "rounded-xl border border-slate-200 bg-slate-50 p-4" : undefined}>
          {block.heading ? <h3 className="text-xl font-semibold text-slate-900">{block.heading}</h3> : null}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-slate-700">
            {block.items.map((item, idx) => (
              <div key={`${keyPrefix}-${idx}`} className="flex items-center gap-2">
                <span className="rounded-md border border-slate-300 bg-white px-2 py-1">{item}</span>
                {idx < block.items.length - 1 ? <span className="text-slate-400">→</span> : null}
              </div>
            ))}
          </div>
          {block.closing ? (
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{block.closing}</p>
          ) : null}
        </section>
      );

    case "table": {
      const cols = block.columns?.length || block.rows[0]?.length || 1;
      const GRID_BY_COLS: Record<number, string> = {
        1: "sm:grid-cols-1",
        2: "sm:grid-cols-2",
        3: "sm:grid-cols-3",
        4: "sm:grid-cols-4",
      };
      const grid = block.gridCols || GRID_BY_COLS[cols] || "sm:grid-cols-2";
      return (
        <section>
          {!block.headerInBox ? (
            <SectionHeading text={block.heading} intro={block.intro} keyPrefix={keyPrefix} />
          ) : null}
          <div className={`overflow-hidden rounded-xl border border-slate-200 ${block.heading && !block.headerInBox ? "mt-4" : ""}`}>
            {block.headerInBox && block.heading ? (
              <h3 className="border-b border-slate-300 bg-slate-100 px-4 py-3 text-lg font-semibold text-slate-900">
                {block.heading}
              </h3>
            ) : null}
            {block.columns?.length ? (
              <div className={`hidden border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid sm:gap-2 ${grid}`}>
                {block.columns.map((col, idx) => (
                  <p key={`${keyPrefix}-h-${idx}`}>{col}</p>
                ))}
              </div>
            ) : null}
            <div className="divide-y divide-slate-200">
              {block.rows.map((row, rowIdx) => (
                <div key={`${keyPrefix}-r-${rowIdx}`} className={`grid gap-1 px-3 py-3 sm:gap-2 ${grid}`}>
                  {row.map((cell, cellIdx) => {
                    const style = block.colStyles?.[cellIdx] ?? (cellIdx === 0 ? "strong" : "default");
                    if (style === "arrow") {
                      return (
                        <p key={`${keyPrefix}-c-${rowIdx}-${cellIdx}`} className="text-[15px] leading-relaxed text-slate-700">
                          → {cell}
                        </p>
                      );
                    }
                    return (
                      <p key={`${keyPrefix}-c-${rowIdx}-${cellIdx}`} className={tableCellClasses(style, accent)}>
                        {cell}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {block.note ? (
            <p className="mt-3 text-[15px] italic leading-relaxed text-slate-600">{block.note}</p>
          ) : null}
        </section>
      );
    }

    case "cards": {
      const gridClass =
        block.columns === 2 ? "grid gap-4 md:grid-cols-2" : block.columns === 3 ? "grid gap-3 md:grid-cols-3" : "space-y-3";
      return (
        <section>
          <SectionHeading text={block.heading} intro={block.intro} keyPrefix={keyPrefix} />
          {block.label ? (
            <p className={`text-sm font-semibold uppercase tracking-wide text-slate-600 ${block.heading || block.intro?.length ? "mt-3" : ""}`}>
              {block.label}
            </p>
          ) : null}
          <div className={`${block.heading || block.intro?.length || block.label ? "mt-4" : ""} ${gridClass}`}>
            {block.items.map((item, idx) => (
              <Card key={`${keyPrefix}-${idx}`} item={item} accent={accent} flat={block.flat} keyPrefix={`${keyPrefix}-${idx}`} />
            ))}
          </div>
          {block.closing ? (
            <p className="mt-4 text-[16px] font-medium leading-relaxed text-slate-800">{block.closing}</p>
          ) : null}
        </section>
      );
    }

    case "columns":
      return (
        <section>
          <SectionHeading text={block.heading} intro={block.intro} keyPrefix={keyPrefix} />
          <div className={`grid gap-4 ${block.cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} ${block.heading || block.intro?.length ? "mt-3" : ""}`}>
            {block.items.map((item, idx) => {
              const tone = columnToneClasses(item.tone, accent);
              return (
                <div key={`${keyPrefix}-${idx}`} className={`rounded-xl border p-4 ${tone.box}`}>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${tone.label}`}>{item.title}</p>
                  {item.body?.map((line, bodyIdx) => (
                    <p key={`${keyPrefix}-${idx}-p-${bodyIdx}`} className="mt-2 text-[16px] leading-relaxed text-slate-700">
                      {line}
                    </p>
                  ))}
                  {item.bullets?.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
                      {item.bullets.map((bullet, bulletIdx) => (
                        <li key={`${keyPrefix}-${idx}-b-${bulletIdx}`}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {item.closing ? (
                    <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{item.closing}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
          {block.closing ? (
            <p className="mt-4 text-[16px] font-medium leading-relaxed text-slate-800">{block.closing}</p>
          ) : null}
        </section>
      );

    case "steps": {
      const body = (
        <>
          <SectionHeading text={block.heading} intro={block.intro} keyPrefix={keyPrefix} />
          {block.variant === "cards" ? (
            <ol className="mt-3 space-y-2 text-[15px] text-slate-700">
              {block.items.map((step, idx) => (
                <li key={`${keyPrefix}-${idx}`} className="rounded-md border border-slate-200 bg-white p-3">
                  {step.tag ? <p className="font-semibold text-slate-900">{step.tag}</p> : null}
                  {step.detail ? <p className="mt-1">{step.detail}</p> : null}
                </li>
              ))}
            </ol>
          ) : block.variant === "numbered" ? (
            <div className="mt-4 space-y-3">
              {block.items.map((step, idx) => (
                <div key={`${keyPrefix}-${idx}`} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${accent.chipBg} ${accent.chipText}`}>
                    {idx + 1}
                  </span>
                  <div>
                    {step.title ? <p className="text-[15px] font-semibold text-slate-900">{step.title}</p> : null}
                    {step.detail ? <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{step.detail}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : block.variant === "badge" ? (
            <div className="mt-3 space-y-2">
              {block.items.map((step, idx) => (
                <div key={`${keyPrefix}-${idx}`} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex shrink-0 items-center rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                    {step.tag}
                  </span>
                  <p className="text-[15px] leading-relaxed text-slate-700">{step.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
              {block.items.map((step, idx) => (
                <li key={`${keyPrefix}-${idx}`}>{step.detail || step.title || step.tag}</li>
              ))}
            </ol>
          )}
        </>
      );
      return block.boxed ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4">{body}</section>
      ) : (
        <section>{body}</section>
      );
    }

    case "checklist":
      return (
        <section className="rounded-xl border border-slate-300 bg-white p-4">
          <h3 className="text-xl font-semibold text-slate-900">{block.heading}</h3>
          {block.intro ? <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{block.intro}</p> : null}
          <ul className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {block.items.map((item, idx) => (
              <li key={`${keyPrefix}-${idx}`} className="flex items-start gap-2">
                <span className="mt-[3px] inline-block h-4 w-4 shrink-0 rounded border border-slate-400" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {block.closing ? (
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{block.closing}</p>
          ) : null}
        </section>
      );

    case "panel":
      return (
        <section
          className={
            block.variant === "dashed"
              ? "rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-5"
              : "rounded-xl border border-slate-200 bg-white p-5"
          }
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{block.heading}</h3>
            {block.tagline ? (
              <span className={`text-xs font-semibold uppercase tracking-wide ${accent.labelText}`}>{block.tagline}</span>
            ) : null}
          </div>
          <div className="mt-3 space-y-4">
            {block.blocks.map((child, idx) => (
              <BlockRenderer key={`${keyPrefix}-${idx}`} block={child} accent={accent} keyPrefix={`${keyPrefix}-${idx}`} />
            ))}
          </div>
        </section>
      );

    case "synthesis":
      return <SynthesisBox lines={block.lines} heading={block.heading} keyPrefix={keyPrefix} />;

    case "reflection":
      return (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{block.heading || "Micro-reflexión"}</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{block.text}</p>
        </section>
      );

    default:
      return null;
  }
}

export function LessonRenderer({
  doc,
  moduleKey,
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  doc: LessonDoc;
  moduleKey: string;
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const accent = MODULE_ACCENTS[moduleKey] || MODULE_ACCENTS.A;
  return (
    <LessonShell
      label={doc.label}
      title={doc.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth={doc.wide ? "max-w-[760px]" : "max-w-[720px]"}
    >
      <div className="mt-6 space-y-8">
        {doc.blocks.map((block, idx) => (
          <BlockRenderer key={idx} block={block} accent={accent} keyPrefix={`blk-${idx}`} />
        ))}
      </div>
    </LessonShell>
  );
}
