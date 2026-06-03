/**
 * Helpers compartidos por la UI del onboarding de Studio.
 *
 * - Tipos comunes (Lesson, Unit, etc.).
 * - parseLessons: convierte el content[] crudo de cada unidad en lecciones
 *   estructuradas (id, label, title, subtitle, bullets) para el render genérico.
 * - getModuleKeyFromSlug / unitTopicMap / topicToLesson: mapeos entre slugs,
 *   tópicos del quiz y lecciones.
 * - moduleVisuals: colores y assets de portada por módulo.
 * - getLessonGuide: devuelve la guía lateral ("por qué importa / cómo proceder")
 *   para una lección, usando moduleALessonGuides como base.
 */

import { moduleALessonGuides, moduleCLessonGuides, moduleDLessonGuides, type LessonGuide } from "@/content/onboarding/lessonGuides";

export type Lesson = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  bullets: string[];
};

export type ModuleVisual = {
  cover: string;
  accent: string;
  hero: string;
  heroBorder: string;
  progress: string;
};

export const moduleVisuals: Record<string, ModuleVisual> = {
  A: {
    cover: "/ilustraciones/1.png",
    accent: "text-sky-700",
    hero: "bg-gradient-to-r from-sky-50 via-white to-cyan-50",
    heroBorder: "border-sky-100",
    progress: "bg-sky-700",
  },
  B: {
    cover: "/ilustraciones/4.png",
    accent: "text-indigo-700",
    hero: "bg-gradient-to-r from-indigo-50 via-white to-blue-50",
    heroBorder: "border-indigo-100",
    progress: "bg-indigo-700",
  },
  C: {
    cover: "/ilustraciones/7.png",
    accent: "text-violet-700",
    hero: "bg-gradient-to-r from-violet-50 via-white to-fuchsia-50",
    heroBorder: "border-violet-100",
    progress: "bg-violet-700",
  },
  D: {
    cover: "/ilustraciones/10.png",
    accent: "text-emerald-700",
    hero: "bg-gradient-to-r from-emerald-50 via-white to-teal-50",
    heroBorder: "border-emerald-100",
    progress: "bg-emerald-700",
  },
};

export function parseLessons(content: string[]): Lesson[] {
  return content.map((paragraph, index) => {
    const normalized = paragraph.replace(/\s+/g, " ").trim();
    const match = normalized.match(/^([A-Z]\d+|Reflexión guiada sugerida|Venta consultiva en THO|Cierre del módulo)\s*[—:-]\s*(.+)$/i);
    const id = match ? String(match[1]).trim() : `L${index + 1}`;
    const label = match ? String(match[1]).trim() : `Lección ${index + 1}`;
    const body = match ? String(match[2]).trim() : normalized;
    const colonIdx = body.indexOf(":");
    const title = colonIdx > 0 ? body.slice(0, colonIdx).trim() : body.split(/\.\s+/)[0].trim();
    const remainder = colonIdx > 0 ? body.slice(colonIdx + 1).trim() : body;
    const segments = remainder.split(/\.\s+/).map((segment) => segment.trim()).filter(Boolean);
    const subtitle = segments[0] || remainder || title;
    const bullets = segments.slice(1).map((segment) => segment.replace(/\.$/, ""));
    return { id, label, title, subtitle, bullets };
  });
}

export function getModuleKeyFromSlug(slug: string) {
  if (slug === "identidad-tho") return "A";
  if (slug === "ventas-tho") return "B";
  if (slug === "operacion-creativa") return "C";
  if (slug === "operacion-asesorias") return "D";
  return "A";
}

export function unitTopicMap(slug: string, topic: string) {
  const t = topic.toLowerCase();
  const byUnit: Record<string, string[]> = {
    "identidad-tho": [
      "identidad",
      "onboarding",
      "adaptabilidad_ordenada",
      "definition_of_done",
      "metodo_sobre_costumbre",
      "limites_institucionales",
      "protocolo_etico",
      "escalamiento",
      "marco_agile",
      "coherencia",
      "integridad_territorial",
      "trazabilidad",
    ],
    "ventas-tho": ["ventas"],
    "operacion-creativa": ["operacion_creativa", "creativa", "operacion"],
    "operacion-asesorias": ["operacion_asesorias", "seguridad"],
  };
  return (byUnit[slug] || []).some((prefix) => t.startsWith(prefix));
}

export function topicToLesson(topic: string, lessons: Array<{ id: string; label: string }>) {
  const t = topic.toLowerCase();
  const findById = (id: string) => lessons.find((l) => l.id === id);
  const firstOfModule = (prefix: string) => lessons.find((l) => l.id.startsWith(prefix));

  // Módulo A — topics existentes
  if (t.startsWith("adaptabilidad_ordenada") || t.startsWith("marco_agile")) return findById("A5") || findById("A4") || lessons[0];
  if (t.startsWith("definition_of_done") || t.startsWith("metodo_sobre_costumbre")) return findById("A3") || lessons[0];
  if (t.startsWith("limites_institucionales")) return findById("A6") || lessons[0];
  if (t.startsWith("protocolo_etico") || t.startsWith("escalamiento")) return findById("A7") || lessons[0];
  if (t.startsWith("coherencia") || t.startsWith("integridad_territorial") || t.startsWith("trazabilidad")) return findById("Reflexión guiada sugerida") || lessons[0];
  if (t.startsWith("identidad") || t.startsWith("onboarding")) return firstOfModule("A") || lessons[0];

  // Módulo B — mapeo específico por topic (refinado tras editorialización)
  if (t === "ventas_consultiva") return findById("B1") || firstOfModule("B") || lessons[0];
  if (t === "ventas_motores" || t === "ventas_funnel") return findById("B2") || firstOfModule("B") || lessons[0];
  if (t === "ventas_uf" || t === "ventas_pricing") return findById("B3") || firstOfModule("B") || lessons[0];
  if (t === "ventas_calificacion") return findById("B4") || firstOfModule("B") || lessons[0];
  if (t === "ventas_crm") return findById("B5") || firstOfModule("B") || lessons[0];
  if (t === "ventas_etica" || t === "ventas_objeciones") return findById("B6") || firstOfModule("B") || lessons[0];
  if (t === "ventas_cierre") return findById("B7") || firstOfModule("B") || lessons[0];
  if (t.startsWith("ventas")) return firstOfModule("B") || lessons[0];

  // Módulo C — mapeo específico por topic
  if (t === "creativa_scrum") return findById("C1") || firstOfModule("C") || lessons[0];
  if (t === "creativa_estructura") return findById("C2") || firstOfModule("C") || lessons[0];
  if (t === "creativa_excel") return findById("C3") || firstOfModule("C") || lessons[0];
  if (t === "creativa_kickoff") return findById("C4") || firstOfModule("C") || lessons[0];
  if (t === "creativa_produccion") return findById("C5") || firstOfModule("C") || lessons[0];
  if (t === "creativa_dod") return findById("C6") || firstOfModule("C") || lessons[0];
  if (t === "creativa_cierre") return findById("C7") || firstOfModule("C") || lessons[0];
  if (t === "creativa_sensible") return findById("C8") || firstOfModule("C") || lessons[0];
  if (t === "creativa_continuidad") return findById("C9") || firstOfModule("C") || lessons[0];
  if (t.startsWith("creativa") || t.startsWith("operacion_creativa") || t.startsWith("operacion")) return firstOfModule("C") || lessons[0];

  // Módulo D — mapeo específico por topic
  if (t === "operacion_asesorias_que_es") return findById("D1") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_marcos") return findById("D2") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_estructura") return findById("D3") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_diagnostico") return findById("D4") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_diseno") return findById("D5") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_dod") return findById("D6") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_trazabilidad") return findById("D7") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_etica") return findById("D8") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_formacion") return findById("D9") || firstOfModule("D") || lessons[0];
  if (t === "operacion_asesorias_alertas") return findById("D10") || firstOfModule("D") || lessons[0];
  if (t.startsWith("operacion_asesorias") || t.startsWith("seguridad")) return firstOfModule("D") || lessons[0];

  return lessons[0];
}

export function getLessonGuide(moduleKey: string, lesson: Lesson): LessonGuide {
  if (moduleKey === "A" && moduleALessonGuides[lesson.id]) return moduleALessonGuides[lesson.id];
  if (moduleKey === "C" && moduleCLessonGuides[lesson.id]) return moduleCLessonGuides[lesson.id];
  if (moduleKey === "D" && moduleDLessonGuides[lesson.id]) return moduleDLessonGuides[lesson.id];
  return {
    whyItMatters: `Esta lección define criterio operativo para ${moduleKey}.`,
    whatToDo: "Traduce el contenido en una acción concreta, registra decisión y responsable.",
    commonMistake: "Leer y seguir avanzando sin convertir el contenido en criterio aplicable.",
    keyLearnings: [
      lesson.subtitle || "Identifica la idea principal",
      lesson.bullets[0] || "Define una acción aplicable a tu rol",
      "Documenta el criterio para continuidad del equipo",
    ],
  };
}
