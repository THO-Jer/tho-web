/**
 * Lecciones hand-crafted del Módulo A (Identidad THO).
 *
 * Cada constante define la estructura editorial de una lección de A.
 * El render correspondiente vive en src/components/onboarding/lessons/.
 *
 * No modificar el contenido sin pasar por revisión editorial.
 */

export type StrategicFrameLesson = {
  label: string;
  title: string;
  strategicFrame: string[];
  blocks: Array<{
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  }>;
  tension: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  practice: {
    heading: string;
    intro: string;
    bullets: string[];
  };
  reflection: string;
};

export const foundationalLessonA0: StrategicFrameLesson = {
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

export type ArchitecturalLesson = {
  label: string;
  title: string;
  definition: string[];
  sections: Array<{
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  }>;
  scenario: {
    heading: string;
    text: string[];
  };
  translation: {
    heading: string;
    intro: string;
    bullets: string[];
  };
  synthesis: string;
};

export const architecturalLessonA1: ArchitecturalLesson = {
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

export type ContrastLesson = {
  label: string;
  title: string;
  hook: string[];
  purpose: {
    heading: string;
    question: string;
    answer: string;
    bullets: string[];
    closing: string;
  };
  value: {
    heading: string;
    question: string;
    answer: string;
    bullets: string[];
    closing: string;
  };
  crossing: {
    heading: string;
    intro: string;
    body: string;
    bullets: string[];
    closing: string;
  };
  scenario: {
    heading: string;
    lines: string[];
  };
  translation: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  synthesis: string[];
};

export const contrastLessonA2: ContrastLesson = {
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
    answer: "Construir un ecosistema empresarial más humano y sostenible, donde cada proyecto contribuya, mediante su éxito, al bienestar colectivo impulsando un cambio real y significativo en las organizaciones y sus comunidades.",
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

export type OperationalLesson = {
  label: string;
  title: string;
  premise: string[];
  sections: Array<{
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  }>;
  cycle: {
    heading: string;
    stages: string[];
    closing: string;
  };
  principles: {
    heading: string;
    bullets: string[];
  };
  synthesis: string[];
};

export const operationalLessonA3: OperationalLesson = {
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

export type QualityLesson = {
  label: string;
  title: string;
  premise: string[];
  whatIs: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  whatIsNot: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  criteria: {
    heading: string;
    items: Array<{ title: string; description: string }>;
  };
  scenario: {
    heading: string;
    lines: string[];
  };
  checklist: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  synthesis: string[];
};

export const qualityLessonA4: QualityLesson = {
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

export type CulturalLesson = {
  label: string;
  title: string;
  premise: string[];
  sections: Array<{
    heading: string;
    protects: string[];
    requires: string[];
    standard: string;
    invalidates: string[];
  }>;
  tension: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  synthesis: string[];
};

export const culturalLessonA5: CulturalLesson = {
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

export type BoundaryLesson = {
  label: string;
  title: string;
  premise: string[];
  clauses: Array<{
    title: string;
    statement: string;
    body: string;
    closing: string;
  }>;
  tension: {
    heading: string;
    lines: string[];
  };
  protocol: {
    heading: string;
    intro: string;
    steps: string[];
  };
  synthesis: string[];
};

export const boundaryLessonA6: BoundaryLesson = {
  label: "LECCIÓN 7 · Límites institucionales",
  title: "Lo que no es negociable en THO",
  premise: [
    "Toda organización define lo que hace.",
    "Las organizaciones maduras definen también lo que no hacen.",
    "Los límites no restringen.",
    "Protegen coherencia, reputación y estándar.",
  ],
  clauses: [
    {
      title: "Cláusula 1",
      statement: "No prometemos lo que no podemos sostener con método.",
      body: "Si un cliente espera resultados que no pueden justificarse con diagnóstico o evidencia, no se prometen.",
      closing: "La presión comercial no redefine el estándar.",
    },
    {
      title: "Cláusula 2",
      statement: "No ocultamos riesgos relevantes.",
      body: "Si durante un proceso detectamos tensiones críticas, deben explicitarse.",
      closing: "Silenciar riesgos para evitar incomodidad erosiona legitimidad.",
    },
    {
      title: "Cláusula 3",
      statement: "No instrumentalizamos actores territoriales.",
      body: "Las comunidades no son recursos narrativos.",
      closing: "El vínculo territorial es sustantivo, no cosmético.",
    },
    {
      title: "Cláusula 4",
      statement: "No cerramos entregables sin revisión crítica.",
      body: "La prisa no sustituye el control de calidad.",
      closing: "",
    },
    {
      title: "Cláusula 5",
      statement: "No operamos sin trazabilidad mínima.",
      body: "Decisiones relevantes deben poder explicarse retrospectivamente.",
      closing: "",
    },
  ],
  tension: {
    heading: "Escenario de tensión",
    lines: [
      "Un cliente presiona por acortar etapas metodológicas para cumplir plazos políticos.",
      "La pregunta no es:",
      "¿Podemos hacerlo?",
      "La pregunta es:",
      "¿Podemos sostenerlo profesionalmente si algo falla?",
    ],
  },
  protocol: {
    heading: "Protocolo ante conflicto de límites",
    intro: "Cuando un límite institucional se tensiona:",
    steps: [
      "Se explicita internamente.",
      "Se documenta la decisión.",
      "Se escala si afecta coherencia estratégica.",
      "Se prioriza estándar sobre comodidad.",
    ],
  },
  synthesis: [
    "Los límites no hacen rígida a una organización.",
    "La hacen confiable.",
  ],
};

export type EthicsLesson = {
  label: string;
  title: string;
  premise: string[];
  risk: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  alerts: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  protocol: {
    heading: string;
    intro: string;
    steps: Array<{ tag: string; detail: string }>;
  };
  escalation: {
    heading: string;
    intro: string;
    triggersIntro: string;
    bullets: string[];
    closing: string;
  };
  matrix: {
    heading: string;
    rows: Array<{ condition: string; action: string }>;
  };
  synthesis: string[];
};

export const ethicsLessonA7: EthicsLesson = {
  label: "LECCIÓN 8 · Ética operativa",
  title: "Cómo actuar ante tensiones críticas",
  premise: [
    "Los problemas éticos no aparecen como dilemas filosóficos.",
    "Aparecen como decisiones prácticas bajo presión.",
    "En THO, la ética no es declarativa.",
    "Es operativa.",
  ],
  risk: {
    heading: "1. Qué es un riesgo ético operativo",
    intro: "Es una situación donde:",
    bullets: [
      "Una decisión puede afectar legitimidad institucional.",
      "Existe tensión entre estándar y conveniencia.",
      "El impacto puede no ser inmediato, pero sí acumulativo.",
    ],
    closing: "No todos los desacuerdos son riesgos éticos. Pero todos los riesgos éticos deben tratarse explícitamente.",
  },
  alerts: {
    heading: "2. Señales de alerta",
    intro: "Si aparece alguna de estas señales, se activa revisión:",
    bullets: [
      "Presión por omitir información relevante.",
      "Ajuste narrativo para suavizar impacto real.",
      "Reducción metodológica sin fundamento técnico.",
      "Decisiones que “se sienten incómodas” pero no están justificadas.",
      "Falta de trazabilidad en decisiones críticas.",
    ],
    closing: "La incomodidad no es suficiente. Pero ignorarla sistemáticamente es riesgoso.",
  },
  protocol: {
    heading: "3. Protocolo de acción (4 pasos)",
    intro: "Cuando detectes una tensión crítica:",
    steps: [
      { tag: "1️⃣ Explicitar", detail: "Nombrar el problema. No asumir que es menor." },
      { tag: "2️⃣ Documentar", detail: "Registrar la situación y las alternativas consideradas." },
      { tag: "3️⃣ Consultar", detail: "Involucrar al menos un segundo criterio interno." },
      { tag: "4️⃣ Decidir con estándar", detail: "Resolver priorizando método y coherencia institucional." },
    ],
  },
  escalation: {
    heading: "4. Escalamiento",
    intro: "Escalar no es dramatizar. Es proteger calidad y legitimidad.",
    triggersIntro: "Se escala cuando:",
    bullets: [
      "La decisión puede afectar reputación.",
      "El impacto excede el alcance individual.",
      "Existe conflicto entre rentabilidad y estándar.",
    ],
    closing: "El escalamiento no es debilidad. Es responsabilidad compartida.",
  },
  matrix: {
    heading: "Matriz simple de decisión",
    rows: [
      { condition: "Bajo impacto + Bajo riesgo", action: "Resolver localmente" },
      { condition: "Alto impacto + Alto riesgo", action: "Escalar" },
      { condition: "Alto impacto + Incertidumbre", action: "Documentar y consultar" },
    ],
  },
  synthesis: [
    "La ética operativa no busca perfección.",
    "Busca coherencia bajo presión.",
  ],
};

export type IntegrationLesson = {
  label: string;
  title: string;
  summary: string[];
  selfAssessment: Array<{
    id: string;
    prompt: string;
    question: string;
  }>;
  assessmentClosing: string;
  declaration: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string[];
  };
  confirmationLabel: string;
  actionLabel: string;
};

export const integrationLessonA8: IntegrationLesson = {
  label: "LECCIÓN 9 · Integración",
  title: "Qué significa operar bajo el estándar THO",
  summary: [
    "Qué es una organización adaptable.",
    "Cómo funcionan las metodologías ágiles en nuestro contexto.",
    "Qué entendemos por “done”.",
    "Qué valores sostienen nuestra práctica.",
    "Cuáles son nuestros límites institucionales.",
    "Cómo actuar ante tensiones éticas.",
  ],
  selfAssessment: [
    {
      id: "pressure",
      prompt: "Si mañana enfrentas una presión externa:",
      question: "¿Podrías explicar el estándar THO sin reducirlo a opinión?",
    },
    {
      id: "critical-tension",
      prompt: "Si detectas una tensión crítica:",
      question: "¿Sabes cuándo escalar y cuándo decidir localmente?",
    },
    {
      id: "method-cut",
      prompt: "Si un cliente pide acortar metodología:",
      question: "¿Podrías argumentar técnicamente por qué una etapa no debe omitirse?",
    },
    {
      id: "discomfort",
      prompt: "Si algo “no se siente correcto”:",
      question: "¿Sabes cómo activar el protocolo sin personalizar el conflicto?",
    },
  ],
  assessmentClosing: "No se trata de marcar todo “sí”. Se trata de tener claridad.",
  declaration: {
    heading: "Declaración operativa",
    intro: "Operar en THO implica:",
    bullets: [
      "Priorizar método sobre improvisación.",
      "Priorizar coherencia sobre conveniencia.",
      "Priorizar estándar sobre urgencia.",
    ],
    closing: [
      "Si completas este módulo, declaras que comprendes ese marco.",
      "No implica perfección. Implica responsabilidad.",
    ],
  },
  confirmationLabel: "He leído y comprendo el estándar institucional descrito en este módulo.",
  actionLabel: "Continuar a evaluación",
};
