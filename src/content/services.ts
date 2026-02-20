export type ServiceLevel = {
  id: "nivel-1" | "nivel-2" | "nivel-3";
  name: string;
  summary: string;
  bullets: string[];
  cta?: {
    label: string;
    hint?: string;
  };
};

export type Service = {
  slug: "sostenibilidad-corporativa" | "relacionamiento-comunitario" | "desarrollo-organizacional";
  navLabel: string;
  menuLabel: string;
  heroTitle: string;
  problem: string;
  promise: string;
  pillar: "esg" | "comunidad" | "do";
  leadTicketSlug: string;
  levels: ServiceLevel[];
};

export const SERVICES: Service[] = [
  {
    slug: "sostenibilidad-corporativa",
    navLabel: "Sostenibilidad Corporativa",
    menuLabel: "Sostenibilidad Corporativa",
    heroTitle: "Sostenibilidad corporativa con foco en decisión",
    problem:
      "Cuando ESG se vuelve una lista de compliance, se pierde foco en riesgo real, reputación y viabilidad del negocio.",
    promise:
      "Convertimos exigencias ESG en una ruta clara, defendible y accionable para directorio y operación.",
    pillar: "esg",
    leadTicketSlug: "flash-audit-esg",
    levels: [
      {
        id: "nivel-1",
        name: "Nivel 1 · Diagnóstico",
        summary:
          "Flash Audit ESG para ordenar prioridades, cerrar brechas críticas y definir primeros movimientos.",
        bullets: [
          "Mapeo rápido de riesgos y oportunidades ESG",
          "Priorización ejecutiva con criterio de negocio",
          "Recomendaciones inmediatas para comité y gerencia",
        ],
        cta: {
          label: "Descargar brochure",
          hint: "Comienza por aquí",
        },
      },
      {
        id: "nivel-2",
        name: "Nivel 2 · Desarrollo de estrategia",
        summary:
          "Diseño de hoja de ruta ESG con gobernanza, KPI y secuencia de implementación.",
        bullets: [
          "Objetivos estratégicos por materialidad",
          "Modelo de gobernanza y responsables",
          "Plan de trabajo trimestral con hitos",
        ],
      },
      {
        id: "nivel-3",
        name: "Nivel 3 · Acompañamiento anual e implementación",
        summary:
          "Soporte continuo para ejecutar, ajustar y sostener resultados ESG durante el año.",
        bullets: [
          "Acompañamiento a líderes y equipos",
          "Seguimiento de avances y bloqueos",
          "Ajustes por contexto regulatorio y social",
        ],
      },
    ],
  },
  {
    slug: "relacionamiento-comunitario",
    navLabel: "Relacionamiento comunitario",
    menuLabel: "Relacionamiento Comunitario",
    heroTitle: "Relacionamiento comunitario para asegurar viabilidad territorial",
    problem:
      "Los proyectos se frenan cuando la lectura territorial llega tarde y la estrategia social no conversa con la operación.",
    promise:
      "Integramos riesgo socioambiental, actores clave y decisiones de negocio para proteger continuidad operativa.",
    pillar: "comunidad",
    leadTicketSlug: "mapa-riesgos-socioambientales",
    levels: [
      {
        id: "nivel-1",
        name: "Nivel 1 · Diagnóstico",
        summary: "Mapa inicial de actores y riesgos para anticipar focos de tensión en territorio.",
        bullets: [
          "Identificación de actores críticos",
          "Detección de riesgos reputacionales y sociales",
          "Recomendaciones tempranas de vinculación",
        ],
      },
      {
        id: "nivel-2",
        name: "Nivel 2 · Desarrollo de estrategia",
        summary: "Diseño de estrategia territorial con narrativa, protocolos y coordinación interna.",
        bullets: [
          "Plan de relacionamiento por segmentos",
          "Definición de mensajes y vocerías",
          "Matriz de compromisos y trazabilidad",
        ],
      },
      {
        id: "nivel-3",
        name: "Nivel 3 · Acompañamiento anual e implementación",
        summary: "Implementación guiada con seguimiento continuo para sostener confianza y licencia social.",
        bullets: [
          "Acompañamiento en terreno y mesa interna",
          "Monitoreo de señales y ajustes tácticos",
          "Reporte de avances para gobernanza del proyecto",
        ],
      },
    ],
  },
  {
    slug: "desarrollo-organizacional",
    navLabel: "Desarrollo organizacional",
    menuLabel: "Desarrollo Organizacional",
    heroTitle: "Desarrollo organizacional para ejecutar el cambio sin perder tracción",
    problem:
      "Muchas estrategias fallan porque cultura, liderazgo y operación avanzan desalineados.",
    promise:
      "Traducimos la estrategia en prácticas de liderazgo y gestión que se sostienen en la realidad del equipo.",
    pillar: "do",
    leadTicketSlug: "scan-cultura-liderazgo",
    levels: [
      {
        id: "nivel-1",
        name: "Nivel 1 · Diagnóstico",
        summary: "Scan de cultura y liderazgo para detectar brechas que bloquean ejecución.",
        bullets: [
          "Lectura de cultura actual y cultura objetivo",
          "Mapa de capacidades de liderazgo",
          "Prioridades críticas para intervenir",
        ],
      },
      {
        id: "nivel-2",
        name: "Nivel 2 · Desarrollo de estrategia",
        summary: "Diseño de ruta de transformación con frentes de trabajo y métricas de adopción.",
        bullets: [
          "Arquitectura de cambio organizacional",
          "Plan de liderazgo y comunicación interna",
          "Indicadores de avance cultural",
        ],
      },
      {
        id: "nivel-3",
        name: "Nivel 3 · Acompañamiento anual e implementación",
        summary: "Acompañamiento para instalar hábitos de gestión y sostener resultados en el tiempo.",
        bullets: [
          "Coaching y soporte a líderes clave",
          "Rituales de seguimiento y aprendizaje",
          "Ajuste continuo según desempeño y contexto",
        ],
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}
