export type Ticket = {
  slug: string;
  name: string;
  short: string;
  forWho: string;
  outcome: string;
  duration: string; // "2 a 3 meses"
  deliverables: string[];
  tags: string[];
  pillar: "esg" | "comunidad" | "do";
};

export const TICKETS: Ticket[] = [
  {
    slug: "flash-audit-esg",
    name: "Flash Audit ESG",
    short: "Ordena tu sostenibilidad sin perder foco estratégico.",
    forWho: "Empresas que necesitan claridad ESG accionable y priorizada.",
    outcome: "Hoja de ruta ESG a medida con próximos pasos claros.",
    duration: "2 a 3 meses",
    deliverables: [
      "Diagnóstico ESG con hallazgos y priorización",
      "Hoja de ruta estratégica (entregables y próximos pasos)",
      "Sesión de devolución para acuerdos y continuidad",
    ],
    tags: ["ESG", "Riesgos", "Hoja de ruta"],
    pillar: "esg",
  },
  {
    slug: "scan-cultura-liderazgo",
    name: "Scan de Cultura y Liderazgo",
    short: "Cultura real y decisiones con evidencia.",
    forWho: "Organizaciones con brechas de liderazgo, clima o alineamiento cultural.",
    outcome: "Panorama accionable para fortalecer liderazgo y coherencia organizacional.",
    duration: "2 a 3 meses",
    deliverables: [
      "Informe breve con insights estratégicos",
      "Taller de trabajo con gerencia (presencial u online)",
      "Síntesis de acuerdos, compromisos y ruta sugerida",
    ],
    tags: ["Cultura", "Liderazgo", "Cambio"],
    pillar: "do",
  },
  {
    slug: "mapa-riesgos-socioambientales",
    name: "Mapa de Riesgos Socioambientales",
    short: "Anticipa tensiones territoriales antes de que exploten.",
    forWho: "Proyectos expuestos a conflicto socioambiental o tensiones con comunidades.",
    outcome: "Mapa de actores y riesgos + recomendaciones accionables para la vinculación.",
    duration: "2 a 3 meses",
    deliverables: [
      "Mapa de actores clave y riesgos del territorio",
      "Diagnóstico breve con análisis y hallazgos",
      "Recomendaciones claras para plan de vinculación",
    ],
    tags: ["Territorio", "Riesgos", "Licencia social"],
    pillar: "comunidad",
  },
];
