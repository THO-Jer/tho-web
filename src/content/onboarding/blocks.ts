/**
 * Esquema unificado de lecciones del onboarding (data-driven).
 *
 * Una lección es un `LessonDoc`: label + title + una secuencia de bloques.
 * Cada bloque es un tipo discriminado por `kind` y se renderiza en
 * src/components/onboarding/LessonRenderer.tsx.
 *
 * Este esquema reemplaza los 34 componentes hand-crafted (LessonA0..DCierre):
 * el contenido editorial sigue viviendo en moduleA-D.ts y se adapta a bloques
 * en lessonDocs.ts, por lo que editar contenido solo requiere tocar moduleX.ts.
 */

/** Tono de énfasis para callouts y celdas. */
export type BlockTone = "accent" | "strong" | "warning" | "danger" | "neutral" | "success";

export type CardField = {
  label: string;
  text: string;
  tone?: BlockTone;
};

export type CardItem = {
  /** Título de la card (o label uppercase si `labelStyle`). */
  title?: string;
  /** Estiliza el título como label uppercase pequeño (cláusulas A6). */
  labelStyle?: boolean;
  /** Chip/tagline a la derecha del título (cards de motor en B). */
  tagline?: string;
  /** Tono de la franja de encabezado (frameworks D2, alertas D10, etc.). */
  headerTone?: BlockTone;
  /** Prefijo de ícono en el encabezado (ej. "⚠" en D10). */
  icon?: string;
  /** Número de secuencia (fases D3). */
  number?: string;
  /** Badge coloreado sobre el contenido (tiers B4). */
  badge?: { text: string; tone: BlockTone };
  /** Frase destacada en bold antes del body (statements B6/A6). */
  statement?: string;
  /** Cita en blockquote antes del body (objeciones B6). */
  quote?: string;
  body?: string[];
  bullets?: string[];
  /** Sub-bloques etiquetados (Pregunta clave / Error frecuente en D3...). */
  fields?: CardField[];
  closing?: string;
};

export type ColumnItem = {
  title: string;
  tone?: BlockTone;
  body?: string[];
  bullets?: string[];
  closing?: string;
};

export type StepItem = {
  /** Etiqueta destacada (tag de protocolo A7, mes B7). */
  tag?: string;
  title?: string;
  detail?: string;
};

export type TableColStyle = "default" | "strong" | "accent" | "mono" | "arrow";

export type LessonBlock =
  | { kind: "paragraphs"; text: string[]; emphasis?: boolean; muted?: boolean }
  | { kind: "heading"; text: string; intro?: string[] }
  | {
      kind: "bullets";
      heading?: string;
      intro?: string[];
      bullets: string[];
      closing?: string;
      tone?: "plain" | "callout" | "card";
      ordered?: boolean;
    }
  | { kind: "labeledList"; label: string; bullets: string[]; boxed?: boolean }
  | { kind: "rule"; label?: string; statement?: string; body?: string[]; tone?: BlockTone }
  | { kind: "scenario"; heading: string; lines: string[] }
  | { kind: "quote"; text: string; label?: string }
  | { kind: "chips"; heading?: string; items: string[]; closing?: string; boxed?: boolean }
  | {
      kind: "table";
      heading?: string;
      intro?: string[];
      columns?: string[];
      rows: string[][];
      colStyles?: TableColStyle[];
      /** Clases de grid para las columnas (default: partes iguales). */
      gridCols?: string;
      /** Renderiza el heading dentro de la caja de la tabla (matriz A7). */
      headerInBox?: boolean;
      note?: string;
    }
  | {
      kind: "cards";
      heading?: string;
      /** Label uppercase pequeño sobre las cards (ej. "Pestañas" en B5). */
      label?: string;
      intro?: string[];
      items: CardItem[];
      closing?: string;
      /** Columnas de grid en desktop (default 1). */
      columns?: 1 | 2 | 3;
      /** Variante compacta sin franja de encabezado. */
      flat?: boolean;
    }
  | {
      kind: "columns";
      heading?: string;
      intro?: string[];
      items: ColumnItem[];
      closing?: string;
      /** Columnas de grid en desktop (default 2). */
      cols?: 2 | 3;
    }
  | {
      kind: "steps";
      heading?: string;
      intro?: string[];
      items: StepItem[];
      variant?: "plain" | "cards" | "numbered" | "badge";
      boxed?: boolean;
    }
  | { kind: "checklist"; heading: string; intro?: string; items: string[]; closing?: string }
  | {
      kind: "panel";
      heading: string;
      tagline?: string;
      variant?: "solid" | "dashed";
      blocks: LessonBlock[];
    }
  | { kind: "synthesis"; lines: string[]; heading?: string }
  | { kind: "reflection"; text: string; heading?: string }
  // --- Bloques interactivos (gatean el avance de la lección) ---
  | {
      kind: "check";
      /** Pregunta de comprensión con feedback inmediato. No afecta el quiz. */
      question: string;
      options: Array<{ text: string; correct?: boolean; feedback: string }>;
    }
  | {
      kind: "decision";
      /** Escenario de decisión: eliges una respuesta y ves su consecuencia. */
      scenario?: string[];
      prompt: string;
      options: Array<{
        text: string;
        verdict: "correcto" | "riesgoso" | "incorrecto";
        outcome: string;
      }>;
    }
  | {
      kind: "reveal";
      /** Pregunta para pensar; el botón revela el criterio institucional. */
      prompt: string;
      hint?: string;
      answer: string[];
    };

/** Kinds de bloque que requieren interacción del usuario. */
const INTERACTIVE_KINDS = new Set(["check", "decision", "reveal"]);

/**
 * Cuenta los bloques interactivos de una lección (recursivo en panels).
 * Lo usa el cliente para el gating y el servidor para validar el avance.
 */
export function countInteractions(blocks: LessonBlock[]): number {
  let count = 0;
  for (const block of blocks) {
    if (INTERACTIVE_KINDS.has(block.kind)) count += 1;
    if (block.kind === "panel") count += countInteractions(block.blocks);
  }
  return count;
}

export type LessonDoc = {
  label: string;
  title: string;
  /** Ancho máximo opcional del shell (default max-w-[720px]). */
  wide?: boolean;
  blocks: LessonBlock[];
};
