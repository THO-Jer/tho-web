export type OnboardingUnit = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  content: string[];
  resources?: Array<{ label: string; href: string }>;
};

export const defaultOnboardingUnits: OnboardingUnit[] = [
  {
    slug: "identidad-tho",
    title: "Módulo A · Identidad THO",
    summary: "Propósito, propuesta de valor, valores y límites de lo que sí/no promete THO.",
    durationMinutes: 12,
    content: [
      "THO combina rigor con cercanía: decidimos con evidencia y comunicamos con humanidad.",
      "Valores en práctica: Humanidad (escucha activa), Colaboración (decisiones compartidas) y Adaptabilidad (iteración con contexto).",
      "Enfoque THO: claridad incómoda cuando hace falta para proteger resultados y relaciones.",
      "Límites: no prometemos resultados sin trazabilidad, ni hacemos bypass de protocolos de ética y calidad.",
    ],
  },
  {
    slug: "ventas-tho",
    title: "Módulo B · Ventas THO",
    summary: "Mapa comercial y decisiones clave: Ticket → Estrategia → Implementación.",
    durationMinutes: 14,
    content: [
      "Ruta de profundidad comercial: Entrada (Ticket), Diseño Estratégico (Estrategia), Acompañamiento (Implementación).",
      "Cada etapa exige decisiones explícitas: problema, alcance, responsables, riesgo y próximos hitos.",
      "CRM obligatorio: registro actualizado, estados claros y responsable asignado.",
      "Toda decisión comercial relevante debe ser trazable y justificable.",
    ],
  },
  {
    slug: "operacion-creativa",
    title: "Módulo C · Operación Creativa",
    summary: "Equipos, flujos de aprobación/versionamiento y comunicación con cliente.",
    durationMinutes: 15,
    content: [
      "Teams es la fuente de coordinación: canales por proyecto, acuerdos y documentación centralizada.",
      "Piezas audiovisuales/gráficas: ciclo mínimo de revisión, aprobación, versionamiento y envío con evidencia.",
      "Proyectos: kickoff, seguimiento y cierre con actas de decisiones.",
      "Cliente: Kanban en Teams + rol Product Owner + equipo técnico bajo estructura Scrum adaptada.",
      "Información sensible: principio de mínimo acceso y manejo responsable.",
    ],
  },
  {
    slug: "operacion-asesorias",
    title: "Módulo D · Operación Asesorías",
    summary: "Estándar THO de consultoría, entregables y protocolo de comunicación.",
    durationMinutes: 15,
    content: [
      "Asesorar en THO implica transformar contexto en decisiones accionables y trazables.",
      "Teams: canales y acuerdos operativos como base documental del servicio.",
      "Entregables mínimos: claridad, evidencia, decisiones y próximos pasos.",
      "Proyectos: kickoff, seguimiento y cierre con continuidad metodológica.",
      "Cliente: Kanban en Teams + Product Owner + equipo técnico (Scrum adaptado).",
      "Información sensible: resguardo, necesidad de acceso y manejo ético.",
    ],
  },
];
