"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BrandLoader } from "@/components/BrandLoader";

type Unit = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  content: string[];
  resources?: Array<{ label: string; href: string }>;
};

type QuizQuestion = { id: string; prompt: string; options: string[]; topic: string };
type ModuleStatus = { moduleKey: string; status: "locked" | "in_progress" | "validated" | "failed_max_attempts"; attempts: number; maxAttempts: number };
type Onboarding = {
  completed_units: string[];
  progress: number;
  last_saved_at?: string;
  module_status?: ModuleStatus[];
};

type Lesson = { id: string; label: string; title: string; subtitle: string; bullets: string[] };

const moduleVisuals: Record<string, { cover: string; accent: string }> = {
  A: { cover: "/ilustraciones/1.png", accent: "text-sky-700" },
  B: { cover: "/ilustraciones/4.png", accent: "text-indigo-700" },
  C: { cover: "/ilustraciones/7.png", accent: "text-violet-700" },
  D: { cover: "/ilustraciones/10.png", accent: "text-emerald-700" },
};

const foundationalLessonA0 = {
  label: "LECCIÓN 1 · Marco institucional",
  title: "¿Qué es el onboarding y por qué existe?",
  strategicFrame: [
    "No es una inducción administrativa.",
    "Es un mecanismo de coherencia institucional.",
    "El onboarding en THO no está diseñado para informar. Está diseñado para alinear criterio.",
    "Cuando una organización crece sin estándares explícitos, cada persona comienza a definir calidad, ética y método según su propio marco. Eso genera fricción invisible, inconsistencias y riesgos acumulativos.",
    "El onboarding existe para evitar eso.",
  ],
  blocks: [
    {
      heading: "1. Qué protege",
      intro: "El onboarding protege tres cosas:",
      bullets: [
        "Coherencia interna en decisiones.",
        "Estándar mínimo de calidad operativa.",
        "Reputación institucional frente a clientes y aliados.",
      ],
      closing: "No es formación genérica. Es una capa de protección organizacional.",
    },
    {
      heading: "2. Qué evita",
      intro: "Sin onboarding:",
      bullets: [
        "La calidad se vuelve subjetiva.",
        "La trazabilidad desaparece.",
        "Las decisiones se toman por intuición aislada.",
        "La cultura se fragmenta.",
      ],
      closing: "El costo no es inmediato, pero es acumulativo.",
    },
    {
      heading: "3. Qué instala",
      intro: "El onboarding instala un marco común:",
      bullets: [
        "Cómo entendemos calidad.",
        "Qué significa trabajo terminado.",
        "Cuándo escalar.",
        "Qué no es negociable.",
      ],
      closing: "No es contenido teórico. Es arquitectura operativa.",
    },
  ],
  tension: {
    heading: "Tensión real",
    intro: "Siempre habrá tensión entre:",
    bullets: [
      "Velocidad y método.",
      "Urgencia y trazabilidad.",
      "Resultado y estándar.",
    ],
    closing: "El onboarding no elimina esa tensión. Define cómo se resuelve.",
  },
  practice: {
    heading: "Traducción práctica",
    intro: "En la práctica, esto significa:",
    bullets: [
      "No ejecutar sin entender estándar mínimo.",
      "No asumir criterios implícitos.",
      "No cerrar entregas sin contexto documentado.",
      "No improvisar procesos críticos.",
    ],
  },
  reflection: "Antes de continuar: ¿En tu experiencia previa, dónde viste que la falta de estándar generó problemas evitables?",
};


const architecturalLessonA1 = {
  label: "LECCIÓN 2 · Arquitectura estratégica",
  title: "Propósito organizacional",
  definition: [
    "El propósito no es un mensaje.",
    "Es un criterio de decisión.",
    "THO existe para fortalecer organizaciones y conectarlas con su entorno, asegurando viabilidad, legitimidad y coherencia estratégica.",
    "Pero eso no es una frase inspiradora. Es un marco operativo.",
  ],
  sections: [
    {
      heading: "1. Qué NO es propósito",
      intro: "No es:",
      bullets: [
        "Un slogan.",
        "Una narrativa de marketing.",
        "Una declaración aspiracional desconectada de decisiones reales.",
        "Una excusa para aceptar cualquier proyecto.",
      ],
      closing: "Cuando el propósito se convierte en discurso, pierde capacidad de orientar.",
    },
    {
      heading: "2. Qué SÍ es propósito",
      intro: "Es un filtro. Define:",
      bullets: [
        "Qué proyectos aceptamos.",
        "Qué riesgos estamos dispuestos a asumir.",
        "Qué tensiones debemos explicitar.",
        "Qué decisiones priorizamos cuando hay conflicto.",
      ],
      closing: "El propósito no motiva. Ordena.",
    },
    {
      heading: "3. Cómo opera en la práctica",
      intro: "El propósito interviene cuando hay tensión entre:",
      bullets: [
        "Ingreso y coherencia.",
        "Velocidad y calidad.",
        "Relación comercial y estándar profesional.",
        "Oportunidad y riesgo reputacional.",
      ],
      closing: "Cuando no hay tensión, el propósito no se nota. Cuando hay tensión, el propósito decide.",
    },
  ],
  scenario: {
    heading: "Escenario aplicado",
    text: [
      "Un proyecto es rentable y técnicamente viable, pero implica minimizar públicamente un riesgo socioambiental relevante.",
      "La pregunta no es: ¿Podemos hacerlo?",
      "La pregunta es: ¿Es coherente con fortalecer organizaciones y conectar con su entorno de manera legítima?",
    ],
  },
  translation: {
    heading: "Traducción operativa",
    intro: "En THO, propósito significa:",
    bullets: [
      "No aceptar proyectos incoherentes con legitimidad institucional.",
      "No omitir riesgos críticos por conveniencia.",
      "No separar rentabilidad de responsabilidad estratégica.",
      "No reducir complejidad para hacerlo más vendible.",
    ],
  },
  synthesis: "Si no puedes explicar cómo tu decisión fortalece organización y entorno al mismo tiempo, probablemente estás operando fuera del propósito.",
};


const contrastLessonA2 = {
  label: "LECCIÓN 3 · Arquitectura comercial",
  title: "Propósito vs Propuesta de Valor",
  hook: [
    "Confundir estos conceptos genera incoherencia comercial.",
    "Muchas organizaciones mezclan propósito y propuesta de valor. Eso produce mensajes confusos y decisiones inconsistentes.",
    "En THO están relacionados, pero no son lo mismo.",
  ],
  purpose: {
    heading: "1. Propósito",
    question: "¿Para qué existimos como organización?",
    answer: "Fortalecer organizaciones y conectarlas con su entorno de forma legítima y sostenible.",
    bullets: [
      "No cambia según cliente.",
      "No depende de mercado.",
      "No se adapta por conveniencia.",
    ],
    closing: "Es estructural.",
  },
  value: {
    heading: "2. Propuesta de valor",
    question: "¿Por qué un cliente debería elegirnos?",
    answer: "Aseguramos confianza en tu marca asesorando e implementando tu estrategia con método, criterio y claridad.",
    bullets: [
      "Es específica.",
      "Es comunicable.",
      "Es comercial.",
      "Puede evolucionar.",
    ],
    closing: "Es relacional.",
  },
  crossing: {
    heading: "3. Donde se cruzan",
    intro: "La propuesta de valor debe estar alineada con el propósito.",
    body: "Si vendemos algo que contradice nuestro propósito, estamos generando una brecha interna.",
    bullets: [
      "Se traduce en tensiones operativas.",
      "Se traduce en desgaste.",
      "Se traduce en pérdida de legitimidad.",
    ],
    closing: "La coherencia entre ambos es un activo invisible.",
  },
  scenario: {
    heading: "Escenario aplicado",
    lines: [
      "Un cliente pide una campaña de comunicación que maquilla un problema estructural.",
      "Propuesta de valor: Podríamos ejecutar técnicamente la campaña.",
      "Propósito: No podemos contribuir a debilitar legitimidad institucional.",
      "La decisión se resuelve alineando ambos planos.",
    ],
  },
  translation: {
    heading: "Traducción operativa",
    intro: "En THO:",
    bullets: [
      "No vendemos lo que no podemos defender.",
      "No diseñamos soluciones que erosionen confianza.",
      "No aceptamos encargos incoherentes con nuestro estándar.",
    ],
    closing: "La propuesta de valor no es una promesa comercial vacía. Es la expresión operativa del propósito.",
  },
  synthesis: [
    "Propósito define quiénes somos.",
    "Propuesta de valor define cómo aportamos.",
    "Cuando se alinean, la organización es consistente. Cuando se separan, aparece la disonancia.",
  ],
};

const operationalLessonA3 = {
  label: "LECCIÓN 4 · Método de trabajo",
  title: "Cómo trabajamos en THO",
  premise: [
    "El talento no es suficiente.",
    "El método es lo que hace replicable la calidad.",
    "En consultoría, la improvisación puede parecer creatividad. Pero sin estructura, la calidad se vuelve variable.",
    "THO trabaja bajo un modelo operativo explícito.",
  ],
  sections: [
    {
      heading: "1. Comprensión estratégica",
      intro: "Antes de proponer, entendemos.",
      bullets: [
        "Contexto institucional.",
        "Mapa de actores.",
        "Riesgos explícitos e implícitos.",
        "Tensiones estructurales.",
        "Alcance real del encargo.",
      ],
      closing: "No diseñamos soluciones sobre diagnósticos superficiales.",
    },
    {
      heading: "2. Diseño estructurado",
      intro: "Toda intervención tiene:",
      bullets: [
        "Objetivo claro.",
        "Hipótesis de impacto.",
        "Metodología definida.",
        "Cronograma realista.",
        "Entregables verificables.",
      ],
      closing: "No ejecutamos sin arquitectura.",
    },
    {
      heading: "3. Documentación y trazabilidad",
      intro: "Nada importante queda implícito.",
      bullets: [
        "Acuerdos se documentan.",
        "Versiones se guardan.",
        "Decisiones se justifican.",
        "Cambios se registran.",
      ],
      closing: "La trazabilidad protege al equipo y al cliente.",
    },
    {
      heading: "4. Cierre y evaluación",
      intro: "No basta con entregar.",
      bullets: [
        "Cumplimiento de objetivo.",
        "Aprendizajes.",
        "Riesgos residuales.",
        "Ajustes necesarios.",
      ],
      closing: "Cada proyecto deja aprendizaje institucional.",
    },
  ],
  cycle: {
    heading: "El ciclo operativo",
    stages: ["Comprender", "Diseñar", "Ejecutar", "Documentar", "Evaluar", "Ajustar"],
    closing: "Es un ciclo, no una línea recta.",
  },
  principles: {
    heading: "Principios no negociables",
    bullets: [
      "No ejecutar sin diagnóstico mínimo.",
      "No cerrar entregables sin revisión cruzada.",
      "No improvisar procesos críticos.",
      "No operar sin respaldo documental.",
    ],
  },
  synthesis: [
    "El método no restringe la creatividad.",
    "La encuadra.",
    "La calidad en THO no depende del ánimo del día.",
    "Depende del estándar.",
  ],
};


const qualityLessonA4 = {
  label: "LECCIÓN 5 · Estándar de calidad",
  title: "¿Qué significa que un trabajo esté \"Done\" en THO?",
  premise: [
    '"Hecho" no significa terminado.',
    "Significa validado.",
    "En metodologías ágiles, la Definition of Done (DoD) define cuándo un entregable cumple con el estándar mínimo de calidad.",
    'Sin una definición explícita, "hecho" se vuelve subjetivo.',
    'En THO, "done" no es percepción. Es cumplimiento verificable.',
  ],
  whatIs: {
    heading: "1. Qué es Definition of Done",
    intro: "Es un acuerdo explícito que responde:",
    bullets: [
      "¿Qué condiciones mínimas debe cumplir un entregable?",
      "¿Qué criterios determinan que puede cerrarse?",
      "¿Qué evidencia respalda su calidad?",
    ],
    closing: "No es burocracia. Es control de estándar.",
  },
  whatIsNot: {
    heading: "2. Qué NO es “Done”",
    intro: "No es:",
    bullets: [
      "“Ya lo envié.”",
      "“El cliente no reclamó.”",
      "“Cumple con lo pedido literal.”",
      "“Está suficientemente bueno.”",
    ],
    closing: "Eso es conformidad, no calidad.",
  },
  criteria: {
    heading: "3. En THO, un trabajo está “Done” cuando cumple al menos:",
    items: [
      { title: "1️⃣ Claridad conceptual", description: "El entregable refleja comprensión real del problema." },
      { title: "2️⃣ Coherencia metodológica", description: "La solución está alineada con el método definido." },
      { title: "3️⃣ Trazabilidad mínima", description: "Las decisiones relevantes están documentadas." },
      { title: "4️⃣ Revisión cruzada", description: "Otro miembro del equipo revisó el contenido crítico." },
      { title: "5️⃣ Riesgos explícitos", description: "No se ocultaron tensiones o riesgos relevantes." },
    ],
  },
  scenario: {
    heading: "Escenario aplicado",
    lines: [
      "Un informe está completo y cumple con el cronograma, pero no explicita un riesgo reputacional detectado durante el proceso.",
      "¿Está “Done”?",
      "Desde metodología ágil superficial, sí.",
      "Desde estándar THO, no.",
    ],
  },
  checklist: {
    heading: "Checklist ejecutivo antes de cerrar",
    intro: "Antes de marcar un trabajo como finalizado:",
    bullets: [
      "¿Está alineado con propósito?",
      "¿Cumple el estándar metodológico?",
      "¿Está respaldado documentalmente?",
      "¿Fue revisado por otro criterio?",
      "¿Explicita riesgos relevantes?",
    ],
    closing: "Si alguna respuesta es no, no está cerrado.",
  },
  synthesis: [
    "Agilidad no es rapidez.",
    "Es claridad estructurada.",
    "En THO, cerrar un trabajo es asumir responsabilidad sobre su calidad.",
  ],
};


const culturalLessonA5 = {
  label: "LECCIÓN 6 · Cultura organizacional",
  title: "Valores organizacionales en acción",
  premise: [
    "En THO los valores no son aspiraciones.",
    "Son criterios de comportamiento.",
    "No describen cómo nos gustaría ser.",
    "Definen cómo debemos actuar.",
  ],
  sections: [
    {
      heading: "1. Humanidad",
      protects: [
        "Dignidad de personas y comunidades.",
        "Integridad del relato institucional.",
        "Responsabilidad comunicacional.",
      ],
      requires: [
        "No instrumentalizar actores territoriales.",
        "No simplificar conflictos complejos por conveniencia.",
        "No usar datos sensibles sin criterio.",
      ],
      standard: "Humanidad no es amabilidad. Es responsabilidad.",
      invalidates: [
        "Narrativas manipuladoras.",
        "Omisiones estratégicas deliberadas.",
        "Lenguaje que minimiza impacto real.",
      ],
    },
    {
      heading: "2. Colaboración",
      protects: [
        "Calidad colectiva.",
        "Coherencia interdisciplinaria.",
        "Reducción de errores invisibles.",
      ],
      requires: [
        "Revisión cruzada real.",
        "Feedback explícito.",
        "Escucha activa entre roles.",
      ],
      standard: "Colaboración no es cordialidad. Es trabajo compartido.",
      invalidates: [
        "Trabajo en silo.",
        "Decisiones unilaterales en temas críticos.",
        "Cierre sin revisión externa.",
      ],
    },
    {
      heading: "3. Adaptabilidad",
      protects: [
        "Relevancia contextual.",
        "Capacidad de ajuste estratégico.",
        "Respuesta ante cambios reales.",
      ],
      requires: [
        "Revisar hipótesis.",
        "Ajustar cuando la evidencia cambia.",
        "No aferrarse al diseño original por orgullo.",
      ],
      standard: "Adaptabilidad no es improvisación. Es flexibilidad estructurada.",
      invalidates: [
        "Rigidez innecesaria.",
        "Cambios sin fundamento.",
        "Reacciones impulsivas.",
      ],
    },
  ],
  tension: {
    heading: "Tensión real",
    intro: "Los valores no siempre coinciden entre sí.",
    bullets: [
      "Adaptabilidad tensiona metodología.",
      "Colaboración ralentiza velocidad.",
      "Humanidad tensiona rentabilidad.",
    ],
    closing: "El estándar no elimina la tensión. Define cómo se navega.",
  },
  synthesis: [
    "Si un comportamiento contradice un valor, no es una variación estilística.",
    "Es una desviación cultural.",
  ],
};

type LessonGuide = {
  whyItMatters: string;
  whatToDo: string;
  commonMistake: string;
  keyLearnings: string[];
};

const moduleALessonGuides: Record<string, LessonGuide> = {
  A0: {
    whyItMatters: "Define el estándar base: onboarding es alineación operativa para evitar ambigüedad, errores repetidos y daño reputacional.",
    whatToDo: "Antes de ejecutar, verifica propósito, criterio de calidad y trazabilidad mínima de tu trabajo.",
    commonMistake: "Tratar el onboarding como lectura pasiva sin traducirlo a decisiones concretas del rol.",
    keyLearnings: ["Entiendo qué protege este onboarding", "Sé qué evidencia dejar en cada entrega", "Identifico cuándo debo escalar dudas"],
  },
  A1: {
    whyItMatters: "El propósito institucional guía prioridades cuando hay tensión entre velocidad, calidad y riesgo.",
    whatToDo: "Conecta cada tarea con impacto organizacional: decisión, riesgo mitigado o legitimidad fortalecida.",
    commonMistake: "Ejecutar tareas aisladas sin evaluar coherencia estratégica.",
    keyLearnings: ["Puedo explicar para qué existe THO", "Relaciono mi rol con ese propósito", "Identifico riesgos de incoherencia"],
  },
  A2: {
    whyItMatters: "Diferenciar propósito y propuesta de valor evita promesas vagas y mejora posicionamiento profesional.",
    whatToDo: "Habla en términos de método: diagnóstico, diseño, acompañamiento, trazabilidad y gestión de riesgos.",
    commonMistake: "Vender entusiasmo o esfuerzo sin explicar estructura ni resultados verificables.",
    keyLearnings: ["Distingo propósito vs. propuesta de valor", "Puedo explicar el método THO", "Evito lenguaje ambiguo en propuestas"],
  },

  A3: {
    whyItMatters: "Eleva el estándar de entrega: calidad no es estética, es decisión trazable y ejecutable.",
    whatToDo: "Antes de cerrar cualquier pieza, valida contexto, evidencia, decisión, riesgos y próximos pasos con responsable.",
    commonMistake: "Dar por terminado algo “bonito” pero sin criterio ni accountability.",
    keyLearnings: ["Problema delimitado", "Decisión explícita", "Riesgos identificados", "Responsable y fecha definidos"],
  },
  A4: {
    whyItMatters: "Los valores son reglas operativas, no slogans. Definen cómo se trabaja bajo presión.",
    whatToDo: "Practica humanidad en el lenguaje, colaboración en documentación y adaptabilidad basada en evidencia.",
    commonMistake: "Invocar valores solo en discurso, pero decidir por conveniencia o orgullo.",
    keyLearnings: ["Cuidé forma y fondo de la comunicación", "Dejé documentación compartida", "Ajusté decisión ante evidencia"],
  },
  A5: {
    whyItMatters: "Los no negociables protegen al equipo, al cliente y a la reputación institucional.",
    whatToDo: "Ante presión por atajos, sostén método mínimo: trazabilidad, resguardo de datos y alcance realista.",
    commonMistake: "Aceptar compromisos inviables para “resolver rápido”.",
    keyLearnings: ["No prometí lo que no puedo sostener", "Resguardé información sensible", "No omití trazabilidad mínima"],
  },
  A6: {
    whyItMatters: "Ética operativa consistente evita conflictos, protege a personas y da legitimidad a la intervención.",
    whatToDo: "Registra decisiones con contexto, declara conflictos tempranamente y usa canales formales.",
    commonMistake: "Resolver por canal informal temas que requieren trazabilidad o control de acceso.",
    keyLearnings: ["Decisión registrada con contexto", "Conflictos declarados", "Canal formal utilizado"],
  },
  A7: {
    whyItMatters: "Escalar a tiempo reduce exposición legal, reputacional y operativa.",
    whatToDo: "Si detectas tensión crítica entre urgencia y calidad, documenta riesgo y escala con recomendación clara.",
    commonMistake: "Normalizar excepciones frecuentes hasta que se vuelven crisis.",
    keyLearnings: ["Riesgo identificado", "Escalamiento ejecutado", "Criterio de decisión documentado"],
  },
  "Reflexión guiada sugerida": {
    whyItMatters: "La reflexión transforma contenido en criterio aplicable al rol.",
    whatToDo: "Formula compromisos concretos: qué harás distinto, qué límites sostendrás y cuándo escalarás.",
    commonMistake: "Responder de forma genérica sin conexión con decisiones reales del trabajo.",
    keyLearnings: ["Definí 2 compromisos operativos", "Identifiqué 1 riesgo de incoherencia", "Definí cómo lo escalaría"],
  },
};

function getLessonGuide(moduleKey: string, lesson: Lesson): LessonGuide {
  if (moduleKey === "A" && moduleALessonGuides[lesson.id]) return moduleALessonGuides[lesson.id];
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

function parseLessons(content: string[]): Lesson[] {
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


function unitTopicMap(slug: string, topic: string) {
  const t = topic.toLowerCase();
  const byUnit: Record<string, string[]> = {
    "identidad-tho": ["identidad", "onboarding"],
    "ventas-tho": ["ventas"],
    "operacion-creativa": ["operacion_creativa", "operacion"],
    "operacion-asesorias": ["operacion_asesorias", "seguridad"],
  };
  return (byUnit[slug] || []).some((prefix) => t.startsWith(prefix));
}

function topicToLesson(topic: string, lessons: Array<{ id: string; label: string }>) {
  const t = topic.toLowerCase();
  if (t.startsWith("identidad") || t.startsWith("onboarding")) return lessons.find((l) => l.id.startsWith("A")) || lessons[0];
  if (t.startsWith("ventas")) return lessons.find((l) => l.id.startsWith("B")) || lessons[0];
  if (t.startsWith("operacion_creativa") || t.startsWith("operacion")) return lessons.find((l) => l.id.startsWith("C")) || lessons[0];
  if (t.startsWith("operacion_asesorias") || t.startsWith("seguridad")) return lessons.find((l) => l.id.startsWith("D")) || lessons[0];
  return lessons[0];
}

export default function StudioOnboardingUnitPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [activeLesson, setActiveLesson] = useState(0);
  const [lessonStartAt, setLessonStartAt] = useState<number>(Date.now());
  const [reachedEnd, setReachedEnd] = useState(false);
  const [minLessonSeconds, setMinLessonSeconds] = useState(12);
  const [failedTopics, setFailedTopics] = useState<string[]>([]);
  const [tick, setTick] = useState(() => Date.now());
  const lessonRef = useRef<HTMLElement | null>(null);
  const lessonEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok) return router.replace("/studio");
        setUnits((data.units || []) as Unit[]);
        setQuiz((data.quiz || []) as QuizQuestion[]);
        setOnboarding(data.onboarding as Onboarding);
        setMinLessonSeconds(Number(data?.config?.minLessonTimeSeconds || 12));
      } catch {
        router.replace("/studio");
      } finally {
        setLoading(false);
      }
    };
    run().catch(() => undefined);
  }, [router]);

  const unit = useMemo(() => units.find((item) => item.slug === slug), [units, slug]);
  const currentIndex = unit ? units.findIndex((item) => item.slug === unit.slug) : -1;
  const moduleKey = ["A", "B", "C", "D"][currentIndex] || "A";
  const next = currentIndex >= 0 ? units[currentIndex + 1] : null;
  const unitQuiz = useMemo(() => (unit ? quiz.filter((q) => unitTopicMap(unit.slug, q.topic)) : []), [quiz, unit]);
  const lessons = useMemo(() => parseLessons(unit?.content || []), [unit]);


  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const completedSet = useMemo(() => new Set(onboarding?.completed_units || []), [onboarding]);
  const isLessonDone = (lessonId: string) => completedSet.has(`${moduleKey}:${lessonId}`);
  const completedLessonCount = lessons.filter((l) => isLessonDone(l.id)).length;
  const allLessonsDone = lessons.length > 0 && completedLessonCount >= lessons.length;
  const status = onboarding?.module_status?.find((item) => item.moduleKey === moduleKey);

  useEffect(() => {
    setLessonStartAt(Date.now());
    setReachedEnd(false);
  }, [activeLesson, moduleKey]);

  useEffect(() => {
    const marker = lessonEndRef.current;
    if (!marker) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setReachedEnd(true);
    }, { threshold: 0.25 });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [activeLesson, lessons.length]);

  const elapsedSeconds = Math.floor((tick - lessonStartAt) / 1000);
  const canMarkLesson = elapsedSeconds >= minLessonSeconds && reachedEnd;

  async function markLesson(lessonId: string) {
    if (!unit) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/studio/onboarding/progress", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ moduleKey, lessonId, unitSlug: unit.slug, elapsedSeconds, reachedEnd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar avance.");
      setOnboarding(data.onboarding as Onboarding);
      setActiveLesson((prev) => Math.min(prev + 1, Math.max(0, lessons.length - 1)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar avance.");
    } finally {
      setSaving(false);
    }
  }

  async function completeModule() {
    if (!unit) return;
    if (!allLessonsDone) return setMessage("Debes completar todas las lecciones antes de rendir el quiz del módulo.");
    if (unitQuiz.some((question) => answers[question.id] === undefined || answers[question.id] < 0)) {
      return setMessage("Responde todas las preguntas para completar el módulo.");
    }

    setSaving(true);
    setMessage("");
    try {
      const payload = unitQuiz.map((question) => ({ question_id: question.id, selected_index: answers[question.id] ?? -1 }));
      const res = await fetch("/api/studio/onboarding/quiz", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ moduleKey, answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar evaluación.");
      setOnboarding(data.onboarding as Onboarding);
      setFailedTopics(Array.isArray(data.topics_to_reinforce) ? data.topics_to_reinforce : []);
      if (data.passed) {
        setMessage("Módulo validado. Puedes continuar al siguiente.");
        if (next) router.push(`/studio/onboarding/${next.slug}`);
        else router.push("/studio/onboarding");
      } else {
        const attempts = data?.moduleStatus?.attempts ?? 0;
        const maxAttempts = data?.moduleStatus?.maxAttempts ?? 3;
        setMessage(`No alcanzaste el puntaje mínimo. Intento ${attempts}/${maxAttempts}.`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo completar módulo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando módulo..." /></main>;
  if (!unit) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><Link href="/studio/onboarding">Volver</Link></main>;

  const lesson = lessons[activeLesson];
  const visual = moduleVisuals[moduleKey] || moduleVisuals.A;
  const lessonProgressPct = lessons.length ? Math.round((completedLessonCount / lessons.length) * 100) : 0;
  const lessonGuide = lesson ? getLessonGuide(moduleKey, lesson) : null;
  const isFoundationalLesson = moduleKey === "A" && lesson?.id === "A0";
  const isArchitecturalLesson = moduleKey === "A" && lesson?.id === "A1";
  const isContrastLesson = moduleKey === "A" && lesson?.id === "A2";
  const isOperationalLesson = moduleKey === "A" && lesson?.id === "A3";
  const isQualityLesson = moduleKey === "A" && lesson?.id === "A4";
  const isCulturalLesson = moduleKey === "A" && lesson?.id === "A5";

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-sky-50 via-white to-violet-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Módulo {moduleKey} · {unit.durationMinutes} min</div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{unit.title}</h1>
              <p className="mt-2 text-sm text-slate-700">{unit.summary}</p>
              <p className="mt-2 text-xs text-slate-500">Lecciones completadas: {completedLessonCount}/{lessons.length} · Intentos quiz: {status?.attempts ?? 0}/{status?.maxAttempts ?? 3}</p>
              <div className="mt-3 max-w-md">
                <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span>Avance del módulo</span>
                  <span>{lessonProgressPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-slate-900" style={{ width: `${lessonProgressPct}%` }} />
                </div>
              </div>
            </div>
            <Image src="/brand/logo-negro.png" alt="THO" width={90} height={90} className="opacity-80" />
          </div>
        </div>

        {lesson ? (
          <article ref={lessonRef} className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {isFoundationalLesson ? (
              <div className="mx-auto max-w-[720px] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{foundationalLessonA0.label}</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{foundationalLessonA0.title}</h2>

                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-slate-700">
                  {foundationalLessonA0.strategicFrame.map((paragraph, idx) => (
                    <p key={`frame-${idx}`}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 space-y-7">
                  {foundationalLessonA0.blocks.map((block) => (
                    <section key={block.heading}>
                      <h3 className="text-xl font-semibold text-slate-900">{block.heading}</h3>
                      <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{block.intro}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                        {block.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{block.closing}</p>
                    </section>
                  ))}
                </div>

                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">{foundationalLessonA0.tension.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{foundationalLessonA0.tension.intro}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {foundationalLessonA0.tension.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{foundationalLessonA0.tension.closing}</p>
                </section>

                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">{foundationalLessonA0.practice.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{foundationalLessonA0.practice.intro}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {foundationalLessonA0.practice.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-lg font-semibold text-slate-900">Micro-reflexión</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{foundationalLessonA0.reflection}</p>
                </section>

                <p className="mt-6 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
                <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
              </div>
            ) : isArchitecturalLesson ? (
              <div className="mx-auto max-w-[720px] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{architecturalLessonA1.label}</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{architecturalLessonA1.title}</h2>

                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-slate-700">
                  {architecturalLessonA1.definition.map((paragraph, idx) => (
                    <p key={`a1-def-${idx}`}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 space-y-7">
                  {architecturalLessonA1.sections.map((section) => (
                    <section key={section.heading}>
                      <h3 className="text-xl font-semibold text-slate-900">{section.heading}</h3>
                      <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{section.intro}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{section.closing}</p>
                    </section>
                  ))}
                </div>

                <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xl font-semibold text-slate-900">{architecturalLessonA1.scenario.heading}</h3>
                  <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-slate-700">
                    {architecturalLessonA1.scenario.text.map((line, idx) => (
                      <p key={`a1-scenario-${idx}`}>{line}</p>
                    ))}
                  </div>
                </section>

                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">{architecturalLessonA1.translation.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{architecturalLessonA1.translation.intro}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {architecturalLessonA1.translation.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-lg font-semibold text-slate-900">Síntesis</h3>
                  <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{architecturalLessonA1.synthesis}</p>
                </section>

                <p className="mt-6 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
                <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
              </div>
            ) : isContrastLesson ? (
              <div className="mx-auto max-w-[720px] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{contrastLessonA2.label}</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{contrastLessonA2.title}</h2>

                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-slate-700">
                  {contrastLessonA2.hook.map((paragraph, idx) => (
                    <p key={`a2-hook-${idx}`}>{paragraph}</p>
                  ))}
                </div>

                <section className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.purpose.heading}</h3>
                    <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.purpose.question}</p>
                    <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.purpose.answer}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                      {contrastLessonA2.purpose.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                    <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.purpose.closing}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.value.heading}</h3>
                    <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.value.question}</p>
                    <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.value.answer}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                      {contrastLessonA2.value.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                    <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.value.closing}</p>
                  </div>
                </section>

                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.crossing.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.crossing.intro}</p>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.crossing.body}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {contrastLessonA2.crossing.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                  <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.crossing.closing}</p>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.scenario.heading}</h3>
                  <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-slate-700">
                    {contrastLessonA2.scenario.lines.map((line, idx) => <p key={`a2-scenario-${idx}`}>{line}</p>)}
                  </div>
                </section>

                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">{contrastLessonA2.translation.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{contrastLessonA2.translation.intro}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {contrastLessonA2.translation.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                  <p className="mt-2 text-[16px] font-medium text-slate-800">{contrastLessonA2.translation.closing}</p>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-lg font-semibold text-slate-900">Síntesis</h3>
                  <div className="mt-2 space-y-1 text-[16px] font-medium leading-relaxed text-slate-800">
                    {contrastLessonA2.synthesis.map((line, idx) => <p key={`a2-synth-${idx}`}>{line}</p>)}
                  </div>
                </section>

                <p className="mt-6 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
                <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
              </div>
            ) : isOperationalLesson ? (
              <div className="mx-auto max-w-[720px] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{operationalLessonA3.label}</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{operationalLessonA3.title}</h2>

                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-slate-700">
                  {operationalLessonA3.premise.map((paragraph, idx) => (
                    <p key={`a3-premise-${idx}`}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 space-y-7">
                  {operationalLessonA3.sections.map((section) => (
                    <section key={section.heading}>
                      <h3 className="text-xl font-semibold text-slate-900">{section.heading}</h3>
                      <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{section.intro}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{section.closing}</p>
                    </section>
                  ))}
                </div>

                <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xl font-semibold text-slate-900">{operationalLessonA3.cycle.heading}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-slate-700">
                    {operationalLessonA3.cycle.stages.map((stage, idx) => (
                      <div key={stage} className="flex items-center gap-2">
                        <span className="rounded-md border border-slate-300 bg-white px-2 py-1">{stage}</span>
                        {idx < operationalLessonA3.cycle.stages.length - 1 ? <span className="text-slate-400">→</span> : null}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{operationalLessonA3.cycle.closing}</p>
                </section>

                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">{operationalLessonA3.principles.heading}</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {operationalLessonA3.principles.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-lg font-semibold text-slate-900">Síntesis</h3>
                  <div className="mt-2 space-y-1 text-[16px] font-medium leading-relaxed text-slate-800">
                    {operationalLessonA3.synthesis.map((line, idx) => (
                      <p key={`a3-synthesis-${idx}`}>{line}</p>
                    ))}
                  </div>
                </section>

                <p className="mt-6 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
                <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
              </div>
            ) : isQualityLesson ? (
              <div className="mx-auto max-w-[720px] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{qualityLessonA4.label}</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{qualityLessonA4.title}</h2>

                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-slate-700">
                  {qualityLessonA4.premise.map((paragraph, idx) => (
                    <p key={`a4-premise-${idx}`}>{paragraph}</p>
                  ))}
                </div>

                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">{qualityLessonA4.whatIs.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualityLessonA4.whatIs.intro}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {qualityLessonA4.whatIs.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{qualityLessonA4.whatIs.closing}</p>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xl font-semibold text-slate-900">{qualityLessonA4.whatIsNot.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualityLessonA4.whatIsNot.intro}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {qualityLessonA4.whatIsNot.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{qualityLessonA4.whatIsNot.closing}</p>
                </section>

                <section className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">{qualityLessonA4.criteria.heading}</h3>
                  <div className="mt-3 space-y-2">
                    {qualityLessonA4.criteria.items.map((item) => (
                      <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xl font-semibold text-slate-900">{qualityLessonA4.scenario.heading}</h3>
                  <div className="mt-2 space-y-2 text-[16px] leading-relaxed text-slate-700">
                    {qualityLessonA4.scenario.lines.map((line, idx) => (
                      <p key={`a4-scenario-${idx}`}>{line}</p>
                    ))}
                  </div>
                </section>

                <section className="mt-8 rounded-xl border border-slate-300 bg-white p-4">
                  <h3 className="text-xl font-semibold text-slate-900">{qualityLessonA4.checklist.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{qualityLessonA4.checklist.intro}</p>
                  <ul className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
                    {qualityLessonA4.checklist.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[3px] inline-block h-4 w-4 shrink-0 rounded border border-slate-400" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[16px] font-medium leading-relaxed text-slate-800">{qualityLessonA4.checklist.closing}</p>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-lg font-semibold text-slate-900">Síntesis</h3>
                  <div className="mt-2 space-y-1 text-[16px] font-medium leading-relaxed text-slate-800">
                    {qualityLessonA4.synthesis.map((line, idx) => (
                      <p key={`a4-synth-${idx}`}>{line}</p>
                    ))}
                  </div>
                </section>

                <p className="mt-6 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
                <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
              </div>
            ) : isCulturalLesson ? (
              <div className="mx-auto max-w-[720px] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{culturalLessonA5.label}</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{culturalLessonA5.title}</h2>

                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-slate-700">
                  {culturalLessonA5.premise.map((paragraph, idx) => (
                    <p key={`a5-premise-${idx}`}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 space-y-8">
                  {culturalLessonA5.sections.map((section) => (
                    <section key={section.heading} className="space-y-3">
                      <h3 className="text-xl font-semibold text-slate-900">{section.heading}</h3>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Qué protege</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                          {section.protects.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Qué exige</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                          {section.requires.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-[16px] font-medium leading-relaxed text-slate-800">{section.standard}</p>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Qué invalida</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                          {section.invalidates.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  ))}
                </div>

                <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xl font-semibold text-slate-900">{culturalLessonA5.tension.heading}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{culturalLessonA5.tension.intro}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-slate-700">
                    {culturalLessonA5.tension.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[16px] font-medium leading-relaxed text-slate-800">{culturalLessonA5.tension.closing}</p>
                </section>

                <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-lg font-semibold text-slate-900">Síntesis</h3>
                  <div className="mt-2 space-y-1 text-[16px] font-medium leading-relaxed text-slate-800">
                    {culturalLessonA5.synthesis.map((line, idx) => (
                      <p key={`a5-synth-${idx}`}>{line}</p>
                    ))}
                  </div>
                </section>

                <p className="mt-6 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
                <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
              </div>
            ) : (
              <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lección {activeLesson + 1}</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{lesson.title}</h2>
                  <p className={`mt-2 text-base font-medium ${visual.accent}`}>{lesson.subtitle}</p>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Puntos de clarificación</p>
                    {lesson.bullets.length ? (
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                        {lesson.bullets.map((bullet, idx) => (
                          <li key={`${lesson.id}-bullet-${idx}`}>{bullet}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-slate-600">No hay aclaraciones adicionales en esta lección.</p>
                    )}
                  </div>

                  {lessonGuide ? (
                    <div className="mt-4 space-y-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Por qué importa</p>
                        <p className="mt-1 text-sm text-slate-700">{lessonGuide.whyItMatters}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Cómo proceder</p>
                        <p className="mt-1 text-sm text-slate-700">{lessonGuide.whatToDo}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Error frecuente</p>
                        <p className="mt-1 text-sm text-slate-700">{lessonGuide.commonMistake}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Aprendizajes clave</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                          {lessonGuide.keyLearnings.slice(0, 3).map((item) => (
                            <li key={`${lesson.id}-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}

                  <p className="mt-4 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
                  <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
                </div>
                <div className="relative min-h-44 bg-slate-50">
                  <Image src={visual.cover} alt={`Ilustración módulo ${moduleKey}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
              </div>
            )}
            <div ref={lessonEndRef} className="h-0 w-0" />
            <div className="border-t border-slate-200 bg-slate-50/60 p-4">
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-xs" onClick={() => setActiveLesson((v) => Math.max(0, v - 1))} disabled={activeLesson <= 0}>Anterior</button>
                <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-xs" onClick={() => setActiveLesson((v) => Math.min(lessons.length - 1, v + 1))} disabled={activeLesson >= lessons.length - 1}>Siguiente</button>
                {isLessonDone(lesson.id) ? (
                  <span className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">Lección completada</span>
                ) : canMarkLesson ? (
                  <button type="button" onClick={() => markLesson(lesson.id)} disabled={saving} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                    Marcar como completada
                  </button>
                ) : (
                  <span className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">Completa lectura + tiempo mínimo para habilitar</span>
                )}
              </div>
            </div>
          </article>
        ) : null}

        {unitQuiz.length && allLessonsDone ? (
          <div className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <h2 className="text-lg font-semibold text-indigo-900">Evaluación del módulo</h2>
            <p className="mt-1 text-sm text-indigo-900">Debes aprobar para validar este módulo.</p>
            <div className="mt-4 space-y-4">
              {unitQuiz.map((question, index) => (
                <fieldset key={question.id} className="rounded-lg border border-indigo-100 bg-white p-3">
                  <legend className="text-sm font-semibold text-slate-800">{index + 1}. {question.prompt}</legend>
                  <div className="mt-2 grid gap-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={`${question.id}-${optionIndex}`} className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))} />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
        ) : null}

        {unitQuiz.length && !allLessonsDone ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Evaluación del módulo bloqueada temporalmente</h2>
            <p className="mt-1 text-sm text-slate-700">
              El quiz aparece al finalizar y completar todas las lecciones del módulo ({completedLessonCount}/{lessons.length}).
            </p>
          </div>
        ) : null}

        {failedTopics.length ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-900">Tópicos a reforzar</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
              {failedTopics.map((topic, idx) => {
                const lessonRefItem = topicToLesson(topic, lessons);
                return (
                  <li key={`${topic}-${idx}`}>
                    {topic} · {lessonRefItem ? <button type="button" onClick={() => setActiveLesson(Math.max(0, lessons.findIndex((item) => item.id === lessonRefItem.id)))} className="underline underline-offset-2">ir a {lessonRefItem.label}</button> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {allLessonsDone ? (
            <button type="button" onClick={completeModule} disabled={saving || status?.status === "failed_max_attempts"} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              Completar módulo
            </button>
          ) : null}
          <Link href="/studio/onboarding" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver</Link>
        </div>

        {status?.status === "failed_max_attempts" ? <p className="mt-2 text-sm text-rose-700">Alcanzaste el máximo de intentos. Solicita reset a un superadmin.</p> : null}
        <p className="mt-4 text-xs text-slate-500">Progreso total: {onboarding?.progress ?? 0}% · Último guardado: {onboarding?.last_saved_at || "Sin registro"}</p>
        {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
