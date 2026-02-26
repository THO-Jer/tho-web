export type OnboardingUnit = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  content: string[];
  resources?: Array<{ label: string; href: string }>;
};

export type OnboardingQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  topic: string;
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

export const defaultOnboardingQuiz: OnboardingQuizQuestion[] = [
  { id: "q1", prompt: "¿Qué combina el enfoque THO?", options: ["Rigor + Cercanía", "Sólo velocidad", "Sólo creatividad"], correctIndex: 0, topic: "identidad" },
  { id: "q2", prompt: "¿Cuál valor implica iterar según contexto?", options: ["Humanidad", "Adaptabilidad", "Rentabilidad"], correctIndex: 1, topic: "identidad" },
  { id: "q3", prompt: "En ventas THO, la ruta correcta es:", options: ["Implementación → Ticket", "Ticket → Estrategia → Implementación", "Estrategia → Ticket"], correctIndex: 1, topic: "ventas" },
  { id: "q4", prompt: "¿Qué requiere siempre trazabilidad comercial?", options: ["Decisiones relevantes", "Sólo reuniones", "Nada"], correctIndex: 0, topic: "ventas" },
  { id: "q5", prompt: "En operación creativa, la fuente principal de coordinación es:", options: ["WhatsApp", "Teams", "Correo personal"], correctIndex: 1, topic: "operacion_creativa" },
  { id: "q6", prompt: "¿Qué elemento es obligatorio en piezas audiovisuales/gráficas?", options: ["Versionamiento", "Publicar inmediato", "No documentar"], correctIndex: 0, topic: "operacion_creativa" },
  { id: "q7", prompt: "Un entregable mínimo de asesoría debe incluir:", options: ["Sólo diseño", "Evidencia y próximos pasos", "Sólo presupuesto"], correctIndex: 1, topic: "operacion_asesorias" },
  { id: "q8", prompt: "Información sensible se maneja con:", options: ["Acceso abierto", "Mínimo acceso y resguardo", "Sin reglas"], correctIndex: 1, topic: "seguridad" },
  { id: "q9", prompt: "¿Cuál es el rol esperado en comunicación con cliente?", options: ["Product Owner + equipo técnico", "Sin responsables", "Sólo ventas"], correctIndex: 0, topic: "operacion" },
  { id: "q10", prompt: "La evaluación final de onboarding es:", options: ["Punitiva", "Formativa y de alineación", "Opcional sin registro"], correctIndex: 1, topic: "onboarding" },
];
