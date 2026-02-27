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
    summary: "Qué es THO, cómo se posiciona y cuáles son sus estándares operativos no negociables.",
    durationMinutes: 30,
    content: [
      "A0 — ¿Qué es un onboarding y por qué existe?: No es una inducción administrativa; es un proceso de alineación cultural y operativa para asegurar coherencia interna, reducir ambigüedades y proteger calidad + reputación.",
      "A1 — Propósito organizacional: THO existe para fortalecer organizaciones y conectarlas con su entorno, asegurando viabilidad, legitimidad y coherencia estratégica. Esto implica mejorar decisiones, reducir riesgos y explicitar tensiones antes de crisis.",
      "A2 — Propuesta de valor: propósito ≠ propuesta de valor. En THO, generamos valor con diagnóstico riguroso, diseño estratégico, acompañamiento estructurado, trazabilidad y gestión de riesgos. No vendemos optimismo; vendemos estructura, claridad y método.",
      "A3 — Qué significa ‘trabajo bueno’ en THO: problema delimitado, decisiones explícitas, riesgos identificados, responsables + próximos pasos y registro trazable. Definition of Done: contexto, evidencia, decisión, riesgos, próximos pasos con responsable y fecha.",
      "A4 — Valores organizacionales: Humanidad (cuidado del lenguaje y no exposición innecesaria), Colaboración (documentación compartida y feedback estructurado) y Adaptabilidad (ajustar estrategia según evidencia, no por orgullo).",
      "A5 — Límites y no negociables: no prometer lo que no se puede sostener con método, no trabajar sin trazabilidad mínima, no usar información sensible sin protocolo y no improvisar procesos críticos. Los límites protegen a la organización y al equipo.",
      "A6 — Ética operativa: registro adecuado, confidencialidad, declaración temprana de conflictos y uso de canales formales como el Canal Confidencial. Ante duda: documentar, consultar y limitar acceso cuando hay sensibilidad.",
      "Reflexión guiada sugerida: ¿cómo se traduce este propósito en tu rol? ¿qué proyectos no serían coherentes? ¿dónde sería difícil aplicar estos valores y qué harías para sostenerlos?",
    ],
    resources: [
      { label: "Código de Ética THO", href: "/etica" },
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
