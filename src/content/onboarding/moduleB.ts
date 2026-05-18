/**
 * Lecciones hand-crafted del Módulo B (Ventas en THO).
 *
 * Por ahora solo B1 está editorializada al nivel del Módulo A.
 * Las demás lecciones de B caen al render genérico hasta que se profundicen.
 */

export type ConsultiveSalesLesson = {
  label: string;
  title: string;
  tension: string;
  intro: string[];
  conceptual: {
    heading: string;
    intro: string;
    bullets: string[];
  };
  difference: {
    heading: string;
    transactional: string[];
    institutional: string[];
  };
  rector: {
    heading: string;
    statement: string;
    closing: string;
    bullets: string[];
  };
  mindset: {
    heading: string;
    questions: string[];
    closing: string;
  };
};

export const consultiveSalesLessonB1: ConsultiveSalesLesson = {
  label: "LECCIÓN B1 · Venta consultiva institucional",
  title: "Qué significa vender en THO",
  tension: "En THO operamos bajo un modelo de venta consultiva.",
  intro: [
    "No vendemos servicios prediseñados.",
    "Diagnosticamos antes de proponer.",
  ],
  conceptual: {
    heading: "Sección 1 · Marco conceptual",
    intro: "La venta consultiva implica:",
    bullets: [
      "Escuchar antes de ofrecer.",
      "Identificar problema estructural, no solo síntoma.",
      "Evaluar compatibilidad con método.",
      "Explicitar riesgos.",
      "Ajustar alcance según realidad.",
      "Rechazar si no existen condiciones mínimas.",
    ],
  },
  difference: {
    heading: "Sección 2 · Diferencia clave",
    transactional: [
      "Prioriza urgencia.",
      "Promete antes de entender.",
      "Ajusta discurso según presión.",
      "Cierra aunque existan riesgos no resueltos.",
    ],
    institutional: [
      "Diagnostica antes de proponer.",
      "Declara límites explícitamente.",
      "Protege al equipo de compromisos inviables.",
      "Entiende que decir “no” también es una decisión comercial profesional.",
    ],
  },
  rector: {
    heading: "Sección 3 · Principio rector",
    statement: "Vender en THO no es maximizar volumen.",
    closing: "Es proteger coherencia estratégica.",
    bullets: [
      "Sobrecarga operativa.",
      "Fricción contractual.",
      "Riesgo reputacional.",
      "Erosión del estándar profesional.",
    ],
  },
  mindset: {
    heading: "Sección 4 · Marco mental obligatorio",
    questions: [
      "¿Este cliente es compatible con nuestro método?",
      "¿Estamos prometiendo algo que el sistema no puede sostener?",
      "¿El cierre protege al equipo o lo expone?",
      "¿Esta venta fortalece o debilita la reputación institucional?",
    ],
    closing: "Si no puedes responder con claridad, aún no es momento de cerrar.",
  },
};
