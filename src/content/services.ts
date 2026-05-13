// ============================================================================
// TYPES
// ============================================================================

export type Pillar = "esg" | "comunidad" | "do";

export type ServiceSlug =
  | "sostenibilidad-corporativa"
  | "relacionamiento-comunitario"
  | "desarrollo-organizacional";

/**
 * Un párrafo del bloque "Qué está cambiando", representado como segmentos.
 * Los items en índices impares (1, 3, 5...) se renderizan con <strong> para resaltar.
 * Ej: ["Las gerencias piden ", "trazabilidad", " real."]
 *   → "Las gerencias piden <strong>trazabilidad</strong> real."
 */
export type ParagraphSegments = string[];

export type ServiceAccent = "emerald" | "orange" | "indigo";
export type CardVariant = "green" | "orange" | "pink";

export type PageLevel = {
  variant: "primary" | "secondary" | "tertiary";
  kicker: string;              // pill / eyebrow text
  name: string;
  summary?: string;            // sólo nivel 1
  bullets: string[];
  deliverables?: string[];     // niveles 2 y 3
  closingTagline?: string;     // niveles 2 y 3
};

export type FaqItem = { q: string; a: string };

export type DiagnosticCheckKey =
  | "noMaterialityMap"
  | "investorPressure"
  | "governanceGaps"
  | "shortDeadline"
  | "alreadyExecuting";

export type DiagnosticCheck = { key: DiagnosticCheckKey; label: string };

export type LevelRecommendation = { level: string; hint: string };

export type Recommendations = {
  empty: LevelRecommendation;
  implementation: LevelRecommendation;
  strategy: LevelRecommendation;
  diagnostic: LevelRecommendation;
};

export type ServicePageContent = {
  accent: ServiceAccent;
  cardClass: CardVariant;

  // Hero
  heroImage: string;
  heroAlt: string;
  heroTitleLines: string[];     // ej: ["Servicio de", "Sostenibilidad", "Corporativa"]
  heroSubtitle: string;

  // Context block
  contextEyebrow: string;
  contextParagraphs: ParagraphSegments[];

  // Risk panel
  riskHeadline: string;
  riskBullets: string[];
  riskTagline: string;

  // Levels (3)
  levels: PageLevel[];

  // FAQ
  faqStartTitle: string;
  faqs: FaqItem[];

  // Diagnostic checklist + recommendation
  diagnosticEyebrow: string;
  diagnosticChecks: DiagnosticCheck[];
  recommendations: Recommendations;

  // Contact section
  contactSectionId: string;
  contactIntro: string;

  // Analytics — exacto al payload original para no romper correlación de eventos.
  brochureEventLabel: string;
  brochureSource: string;
  brochureResourceId: string;
  brochureResourceName: string;
  brochureLevelId: string;
  brochureLevelName: string;
  contactEventLabel: string;
  contactSource: string;
  contactResourceId: string;
  contactResourceName: string;
};

export type Service = {
  slug: ServiceSlug;
  navLabel: string;
  menuLabel: string;
  pillar: Pillar;
  leadTicketSlug: string;
  /** Resumen del problema, usado en las cards de home. */
  problem: string;
  /** Bullets cortos del teaser, usados en las cards de home. */
  teaser: string[];
  /** Path al PDF del brochure de nivel 1. Servido desde /public/downloads/. */
  brochureFile: string;
  /** Contenido completo de la service page (hero, niveles, FAQ, etc.). */
  pageContent: ServicePageContent;
};

// ============================================================================
// PAGE CONTENT — Sostenibilidad Corporativa
// ============================================================================

const sostenibilidadPageContent: ServicePageContent = {
  accent: "emerald",
  cardClass: "green",

  heroImage: "/hero/7.png",
  heroAlt: "Equipo evaluando riesgos y estrategia",
  heroTitleLines: ["Servicio de", "Sostenibilidad", "Corporativa"],
  heroSubtitle:
    "Te ayudamos a traducir presión regulatoria, expectativas de inversionistas y escrutinio público en decisiones estratégicas claras, medibles y ejecutables.",

  contextEyebrow: "Qué está cambiando",
  contextParagraphs: [
    [
      "La conversación ESG dejó de ser reputacional y se volvió estratégica: hoy la ",
      "doble materialidad",
      " obliga a mirar impacto financiero e impacto externo al mismo tiempo.",
    ],
    [
      "",
      "Inversionistas",
      " y directorios piden ",
      "trazabilidad",
      " real, no solo narrativa.",
    ],
    [
      "Además, el ",
      "escrutinio público",
      " es más rápido y más exigente: si la organización no está alineada internamente, cualquier promesa externa se vuelve vulnerable.",
    ],
  ],

  riskHeadline: "ESG superficial expone más que ESG ausente.",
  riskBullets: ["Greenwashing.", "Compliance theater.", "Desalineación interna."],
  riskTagline: "Evitarlo requiere método, no discurso.",

  levels: [
    {
      variant: "primary",
      kicker: "● Punto de partida recomendado",
      name: "Flash Audit ESG",
      summary:
        "Revisión estratégica focalizada para organizaciones que necesitan claridad inmediata.",
      bullets: [
        "Diagnóstico express de materialidad.",
        "Identificación de riesgos reputacionales y regulatorios.",
        "Recomendaciones inmediatas.",
      ],
    },
    {
      variant: "secondary",
      kicker: "Escala de profundidad estratégica",
      name: "Hoja de Ruta y Gobernanza",
      bullets: [
        "Profundización de materialidad.",
        "Diseño de gobernanza.",
        "Indicadores y métricas.",
        "Plan de implementación.",
      ],
      deliverables: ["Hoja de Ruta ESG.", "Marco de gobernanza.", "Sistema de seguimiento."],
      closingTagline: "Ordena la estrategia y alinea áreas.",
    },
    {
      variant: "tertiary",
      kicker: "Escala de consolidación operativa",
      name: "Implementación y Consolidación",
      bullets: [
        "Acompañamiento en ejecución.",
        "Instalación de capacidades internas.",
        "Seguimiento de indicadores.",
        "Ajustes estratégicos.",
      ],
      deliverables: ["Sistema operativo ESG.", "Evaluaciones periódicas.", "Mejora continua."],
      closingTagline: "Convierte la estrategia en práctica real.",
    },
  ],

  faqStartTitle: "¿Qué implica partir por un Flash Audit ESG?",
  faqs: [
    {
      q: "¿Cuándo conviene partir por aquí?",
      a: "Cuando hay presión por definir prioridades rápidamente y aún no existe base común entre áreas para diseñar una ruta completa.",
    },
    {
      q: "¿Qué decisión habilita?",
      a: "Te permite decidir con evidencia si avanzar a una hoja de ruta integral o focalizar recursos en brechas críticas de corto plazo.",
    },
    {
      q: "¿Qué NO es?",
      a: "No es una versión \"ligera\" del servicio completo: es un instrumento estratégico para reducir incertidumbre y ordenar la conversación ejecutiva.",
    },
    {
      q: "¿Qué información necesito para iniciarlo?",
      a: "Basta con entrevistas clave, información regulatoria relevante y los principales riesgos/iniciativas ya identificados por la organización.",
    },
    {
      q: "¿Cómo se conecta con los siguientes niveles?",
      a: "El Flash Audit define prioridades y criterios de decisión. Desde ahí, se escala a gobernanza/roadmap o implementación según brechas y madurez.",
    },
  ],

  diagnosticEyebrow: "Diagnóstico rápido",
  diagnosticChecks: [
    { key: "noMaterialityMap", label: "No tenemos mapa de materialidad validado." },
    { key: "investorPressure", label: "Hay presión de inversionistas/directorio por trazabilidad ESG." },
    { key: "governanceGaps", label: "No existe gobernanza clara ni responsables definidos." },
    { key: "shortDeadline", label: "Debemos mostrar avances concretos en menos de 90 días." },
    { key: "alreadyExecuting", label: "Ya estamos ejecutando iniciativas pero falta coordinación." },
  ],
  recommendations: {
    empty: {
      level: "Completa las casillas para una recomendación",
      hint: "Marca 2 o más condiciones para sugerirte el mejor nivel de partida.",
    },
    implementation: {
      level: "Nivel sugerido: Implementación y Consolidación",
      hint: "Ya existe trabajo en marcha; conviene fortalecer ejecución, seguimiento y mejora continua.",
    },
    strategy: {
      level: "Nivel sugerido: Hoja de Ruta y Gobernanza",
      hint: "Necesitas ordenar priorización, definir gobierno ESG e instalar métricas de seguimiento.",
    },
    diagnostic: {
      level: "Nivel sugerido: Flash Audit ESG",
      hint: "Punto de entrada ideal para claridad rápida y definición de prioridades inmediatas.",
    },
  },

  contactSectionId: "esg-contacto",
  contactIntro:
    "Conversemos sobre la prioridad ESG más crítica de tu organización y definamos el punto de entrada con mayor impacto.",

  brochureEventLabel: "flash_audit_esg_brochure_download",
  brochureSource: "esg_level_card_modal",
  brochureResourceId: "flash-audit-esg-brochure",
  brochureResourceName: "Brochure Flash Audit ESG",
  brochureLevelId: "ticket-flash-audit-esg",
  brochureLevelName: "Flash Audit ESG",
  contactEventLabel: "esg_service_contact_form",
  contactSource: "sostenibilidad_service_footer_form",
  contactResourceId: "service-sostenibilidad-contact",
  contactResourceName: "Formulario servicio sostenibilidad",
};

// ============================================================================
// PAGE CONTENT — Relacionamiento Comunitario
// ============================================================================

const relacionamientoPageContent: ServicePageContent = {
  accent: "orange",
  cardClass: "orange",

  heroImage: "/hero/8.png",
  heroAlt: "Equipo de proyecto y comunidades dialogando en territorio",
  heroTitleLines: ["Servicio de", "Relacionamiento", "Comunitario"],
  heroSubtitle:
    "Te ayudamos a traducir la complejidad territorial y social en decisiones estratégicas claras, medibles y ejecutables para proteger la continuidad operacional.",

  contextEyebrow: "Qué está cambiando",
  contextParagraphs: [
    [
      "La conversación territorial dejó de ser reactiva y se volvió estratégica: hoy los proyectos necesitan integrar desde el inicio a comunidades, actores críticos y riesgos socioambientales.",
    ],
    [
      "",
      "Equipos operacionales",
      ", gerencias y directorios piden ",
      "trazabilidad",
      " real de compromisos con comunidades, no solo narrativa.",
    ],
    [
      "Además, el ",
      "contexto local",
      " cambia rápido: si la organización no coordina mensaje, operación y decisiones, cualquier compromiso territorial se vuelve frágil.",
    ],
  ],

  riskHeadline: "Llegar tarde al territorio cuesta más que llegar a tiempo.",
  riskBullets: [
    "Conflictividad social evitable.",
    "Pérdida de confianza comunitaria.",
    "Desalineación entre terreno y gestión interna.",
  ],
  riskTagline: "Evitarlo requiere método territorial, no improvisación.",

  levels: [
    {
      variant: "primary",
      kicker: "● Punto de partida recomendado",
      name: "Mapa de Riesgos Socioambientales",
      summary:
        "Diagnóstico estratégico inicial para organizaciones que necesitan claridad territorial inmediata.",
      bullets: [
        "Mapeo inicial de actores y dinámicas territoriales.",
        "Identificación de riesgos sociales, reputacionales y operacionales.",
        "Recomendaciones tempranas de relacionamiento.",
      ],
    },
    {
      variant: "secondary",
      kicker: "Escala de profundidad estratégica",
      name: "Estrategia Territorial y Gobernanza",
      bullets: [
        "Diseño de estrategia por segmentos de actores.",
        "Protocolos de coordinación y vocerías.",
        "Indicadores de gestión territorial.",
        "Plan de implementación con hitos críticos.",
      ],
      deliverables: [
        "Hoja de ruta territorial.",
        "Marco de gobernanza comunitaria.",
        "Sistema de seguimiento de compromisos.",
      ],
      closingTagline: "Ordena la estrategia y alinea áreas.",
    },
    {
      variant: "tertiary",
      kicker: "Escala de consolidación operativa",
      name: "Implementación y Seguimiento",
      bullets: [
        "Acompañamiento en terreno y mesa interna.",
        "Instalación de capacidades de relacionamiento.",
        "Monitoreo de señales tempranas y acuerdos.",
        "Ajustes tácticos según evolución territorial.",
      ],
      deliverables: [
        "Sistema operativo de relacionamiento.",
        "Evaluaciones periódicas en territorio.",
        "Mejora continua.",
      ],
      closingTagline: "Convierte la estrategia en práctica real.",
    },
  ],

  faqStartTitle: "¿Qué implica partir por un Mapa de Riesgos Socioambientales?",
  faqs: [
    {
      q: "¿Cuándo conviene partir por aquí?",
      a: "Cuando hay conflictividad emergente o incertidumbre territorial y el proyecto necesita una lectura temprana para decidir con criterio.",
    },
    {
      q: "¿Qué decisión habilita?",
      a: "Permite definir si conviene abrir una estrategia territorial completa o intervenir primero en actores/riesgos críticos para proteger continuidad operativa.",
    },
    {
      q: "¿Qué NO es?",
      a: "No es una campaña comunicacional ni gestión reactiva de crisis: es una lectura estratégica para ordenar decisiones antes de escalar conflicto.",
    },
    {
      q: "¿Qué información necesito para iniciarlo?",
      a: "Se recomienda contar con contexto del proyecto, antecedentes de relacionamiento previo y actores/zonas sensibles ya detectados por el equipo.",
    },
    {
      q: "¿Cómo se conecta con los siguientes niveles?",
      a: "El mapa inicial entrega prioridades y criterios de acción. Desde ahí se escala a estrategia territorial o implementación en terreno según riesgo y madurez del proyecto.",
    },
  ],

  diagnosticEyebrow: "Diagnóstico territorial rápido",
  diagnosticChecks: [
    { key: "noMaterialityMap", label: "No tenemos mapa de materialidad validado." },
    { key: "investorPressure", label: "Hay presión por trazabilidad de compromisos territoriales y sociales." },
    { key: "governanceGaps", label: "No existe gobernanza clara ni responsables definidos." },
    { key: "shortDeadline", label: "Debemos mostrar avances concretos en menos de 90 días." },
    { key: "alreadyExecuting", label: "Ya estamos ejecutando iniciativas pero falta coordinación." },
  ],
  recommendations: {
    empty: {
      level: "Completa las casillas para una recomendación",
      hint: "Marca 2 o más condiciones para sugerirte el mejor nivel de partida.",
    },
    implementation: {
      level: "Nivel sugerido: Implementación y Seguimiento",
      hint: "Ya existe trabajo en marcha; conviene fortalecer ejecución, seguimiento y mejora continua.",
    },
    strategy: {
      level: "Nivel sugerido: Estrategia Territorial y Gobernanza",
      hint: "Necesitas ordenar priorización, definir gobernanza territorial e instalar métricas de seguimiento.",
    },
    diagnostic: {
      level: "Nivel sugerido: Mapa de Riesgos Socioambientales",
      hint: "Punto de entrada ideal para claridad rápida y definición de prioridades inmediatas.",
    },
  },

  contactSectionId: "relacionamiento-contacto",
  contactIntro:
    "Conversemos sobre la prioridad territorial más crítica de tu organización y definamos el punto de entrada con mayor impacto.",

  brochureEventLabel: "mapa_riesgos_socioambientales_brochure_download",
  brochureSource: "relacionamiento_level_card_modal",
  brochureResourceId: "mapa-riesgos-socioambientales-brochure",
  brochureResourceName: "Brochure Mapa de Riesgos Socioambientales",
  brochureLevelId: "ticket-mapa-riesgos-socioambientales",
  brochureLevelName: "Mapa de Riesgos Socioambientales",
  contactEventLabel: "relacionamiento_service_contact_form",
  contactSource: "relacionamiento_service_footer_form",
  contactResourceId: "service-relacionamiento-contact",
  contactResourceName: "Formulario servicio relacionamiento comunitario",
};

// ============================================================================
// PAGE CONTENT — Desarrollo Organizacional
// ============================================================================

const desarrolloPageContent: ServicePageContent = {
  accent: "indigo",
  cardClass: "pink",

  heroImage: "/hero/3.png",
  heroAlt: "Equipo de liderazgo colaborando en una sesión de trabajo",
  heroTitleLines: ["Servicio de", "Desarrollo", "Organizacional"],
  heroSubtitle:
    "Te ayudamos a traducir la estrategia en capacidades reales de liderazgo, cultura y gestión para ejecutar cambios sin perder tracción.",

  contextEyebrow: "Qué está cambiando",
  contextParagraphs: [
    [
      "La transformación interna dejó de ser un proyecto paralelo: hoy el crecimiento y la ejecución dependen de alinear liderazgo, cultura y operación en una sola dirección.",
    ],
    [
      "",
      "Equipos de liderazgo",
      ", gerencias y directorios piden ",
      "trazabilidad",
      " real de prioridades estratégicas, no solo narrativa.",
    ],
    [
      "Además, el ",
      "entorno organizacional",
      " cambia rápido: si la organización no coordina mensaje, operación y decisiones, cualquier decisión de cambio se vuelve frágil.",
    ],
  ],

  riskHeadline: "Ejecutar el cambio sin capacidades es la fórmula más cara.",
  riskBullets: [
    "Fatiga organizacional y resistencia al cambio.",
    "Liderazgo desalineado entre áreas clave.",
    "Brecha entre diseño estratégico y ejecución diaria.",
  ],
  riskTagline: "Evitarlo requiere método organizacional, no improvisación.",

  levels: [
    {
      variant: "primary",
      kicker: "● Punto de partida recomendado",
      name: "Scan Cultura y Liderazgo",
      summary:
        "Diagnóstico estratégico inicial para identificar brechas culturales y de liderazgo que afectan la ejecución.",
      bullets: [
        "Lectura de cultura actual y cultura objetivo.",
        "Mapa de capacidades de liderazgo críticas.",
        "Recomendaciones tempranas de intervención.",
      ],
    },
    {
      variant: "secondary",
      kicker: "Escala de profundidad estratégica",
      name: "Ruta de Transformación y Gestión del Cambio",
      bullets: [
        "Diseño de frentes de transformación organizacional.",
        "Modelo de liderazgo y gobernanza del cambio.",
        "Indicadores de adopción y desempeño cultural.",
        "Plan de implementación por etapas y hitos críticos.",
      ],
      deliverables: [
        "Hoja de ruta de transformación.",
        "Marco de gobernanza del cambio.",
        "Sistema de seguimiento de adopción.",
      ],
      closingTagline: "Ordena la estrategia y alinea áreas.",
    },
    {
      variant: "tertiary",
      kicker: "Escala de consolidación operativa",
      name: "Implementación y Consolidación",
      bullets: [
        "Acompañamiento a líderes y equipos clave.",
        "Instalación de hábitos de liderazgo y gestión.",
        "Monitoreo de avance cultural y bloqueos.",
        "Ajustes tácticos según aprendizaje organizacional.",
      ],
      deliverables: [
        "Sistema operativo de transformación.",
        "Evaluaciones periódicas de madurez organizacional.",
        "Mejora continua.",
      ],
      closingTagline: "Convierte la estrategia en práctica real.",
    },
  ],

  faqStartTitle: "¿Qué implica partir por un Scan Cultura y Liderazgo?",
  faqs: [
    {
      q: "¿Cuándo conviene partir por aquí?",
      a: "Cuando existe urgencia por ejecutar cambios, pero aún no hay una lectura clara de capacidades, cultura y liderazgo disponible.",
    },
    {
      q: "¿Qué decisión habilita?",
      a: "Permite decidir con evidencia si avanzar a una transformación integral o focalizar recursos en brechas críticas de liderazgo y gestión.",
    },
    {
      q: "¿Qué NO es?",
      a: "No es una versión \"ligera\" del servicio completo: es un instrumento estratégico para reducir incertidumbre y ordenar decisiones de liderazgo.",
    },
    {
      q: "¿Qué información necesito para iniciarlo?",
      a: "Basta con entrevistas clave, información de estructura/equipos y los principales desafíos de ejecución ya identificados por la organización.",
    },
    {
      q: "¿Cómo se conecta con los siguientes niveles?",
      a: "El Scan define prioridades y criterios de decisión. Desde ahí, se escala a ruta de transformación o implementación según brechas y madurez.",
    },
  ],

  diagnosticEyebrow: "Diagnóstico organizacional rápido",
  diagnosticChecks: [
    { key: "noMaterialityMap", label: "No tenemos claridad sobre la cultura que necesitamos." },
    { key: "investorPressure", label: "Hay presión por resultados sin alinear liderazgo y equipos." },
    { key: "governanceGaps", label: "No existe gobernanza clara para liderar el cambio." },
    { key: "shortDeadline", label: "Debemos mostrar avances concretos en menos de 90 días." },
    { key: "alreadyExecuting", label: "Ya estamos ejecutando iniciativas, pero sin consistencia." },
  ],
  recommendations: {
    empty: {
      level: "Completa las casillas para una recomendación",
      hint: "Marca 2 o más condiciones para sugerirte el mejor nivel de partida.",
    },
    implementation: {
      level: "Nivel sugerido: Implementación y Consolidación",
      hint: "Ya existe trabajo en marcha; conviene fortalecer ejecución, seguimiento y mejora continua.",
    },
    strategy: {
      level: "Nivel sugerido: Ruta de Transformación y Gestión del Cambio",
      hint: "Necesitas ordenar priorización, definir gobernanza del cambio e instalar métricas de adopción.",
    },
    diagnostic: {
      level: "Nivel sugerido: Scan Cultura y Liderazgo",
      hint: "Punto de entrada ideal para claridad rápida y definición de prioridades inmediatas.",
    },
  },

  contactSectionId: "do-contacto",
  contactIntro:
    "Conversemos sobre la prioridad organizacional más crítica y definamos el punto de entrada con mayor impacto.",

  brochureEventLabel: "scan_cultura_liderazgo_brochure_download",
  brochureSource: "desarrollo_level_card_modal",
  brochureResourceId: "scan-cultura-liderazgo-brochure",
  brochureResourceName: "Brochure Scan Cultura y Liderazgo",
  brochureLevelId: "ticket-scan-cultura-liderazgo",
  brochureLevelName: "Scan Cultura y Liderazgo",
  contactEventLabel: "desarrollo_service_contact_form",
  contactSource: "desarrollo_service_footer_form",
  contactResourceId: "service-desarrollo-contact",
  contactResourceName: "Formulario servicio desarrollo organizacional",
};

// ============================================================================
// SERVICES — array principal
// ============================================================================

export const SERVICES: Service[] = [
  {
    slug: "sostenibilidad-corporativa",
    navLabel: "Sostenibilidad Corporativa",
    menuLabel: "Sostenibilidad Corporativa",
    pillar: "esg",
    leadTicketSlug: "flash-audit-esg",
    problem:
      "Cuando ESG se vuelve una lista de compliance, se pierde foco en riesgo real, reputación y viabilidad del negocio.",
    teaser: [
      "Materialidad y priorización estratégica",
      "Roadmap, gobernanza e indicadores",
      "Acompañamiento de implementación",
    ],
    brochureFile: "/downloads/sc-brochure-v1.pdf",
    pageContent: sostenibilidadPageContent,
  },
  {
    slug: "relacionamiento-comunitario",
    navLabel: "Relacionamiento comunitario",
    menuLabel: "Relacionamiento Comunitario",
    pillar: "comunidad",
    leadTicketSlug: "mapa-riesgos-socioambientales",
    problem:
      "Los proyectos se frenan cuando la lectura territorial llega tarde y la estrategia social no conversa con la operación.",
    teaser: [
      "Mapa de actores y riesgos",
      "Diseño de estrategia territorial",
      "Implementación y seguimiento",
    ],
    brochureFile: "/downloads/rc-brochure-v1.pdf",
    pageContent: relacionamientoPageContent,
  },
  {
    slug: "desarrollo-organizacional",
    navLabel: "Desarrollo organizacional",
    menuLabel: "Desarrollo Organizacional",
    pillar: "do",
    leadTicketSlug: "scan-cultura-liderazgo",
    problem:
      "Muchas estrategias fallan porque cultura, liderazgo y operación avanzan desalineados.",
    teaser: [
      "Diagnóstico de cultura y liderazgo",
      "Ruta de transformación anual",
      "Acompañamiento de implementación",
    ],
    brochureFile: "/downloads/do-brochure-v1.pdf",
    pageContent: desarrolloPageContent,
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}
