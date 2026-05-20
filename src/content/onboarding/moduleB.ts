/**
 * Lecciones hand-crafted del Módulo B (Ventas en THO).
 *
 * Lecciones ya editorializadas:
 *  - B1 (consultiveSalesLessonB1): Qué significa vender en THO.
 *  - B2 (dualEngineLessonB2): Arquitectura comercial — los dos motores.
 *  - B3 (pricingLessonB3): Pricing en THO.
 *  - B4 (qualificationLessonB4): Calificación de cliente.
 *  - B5 (crmLessonB5): CRM en THO.
 *  - B6 (commercialEthicsLessonB6): Ética comercial.
 *  - B7 (commercialClosingLessonB7): Cierre y formalización.
 *
 * Módulo B completo en cobertura hand-crafted.
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

export type DualEngineLesson = {
  label: string;
  title: string;
  premise: string[];
  keyAccounts: {
    heading: string;
    tagline: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  tickets: {
    heading: string;
    tagline: string;
    intro: string;
    bullets: string[];
    functionStatement: string;
    priorityHeading: string;
    priorityTickets: string[];
    notTicketsIntro: string;
    notTickets: string[];
  };
  funnel: {
    heading: string;
    body: string[];
    targetLine: string;
    pitchTiming: string;
  };
  digital: {
    heading: string;
    intro: string;
    statement: string;
    context: string;
    rule: string;
    operationalIntro: string;
    operationalBullets: string[];
    caution: string;
  };
  translation: {
    heading: string;
    intro: string;
    bullets: string[];
  };
  synthesis: string[];
};

export const dualEngineLessonB2: DualEngineLesson = {
  label: "LECCIÓN B2 · Arquitectura comercial",
  title: "Los dos motores comerciales de THO",
  premise: [
    "THO opera con dos motores comerciales distintos.",
    "No son alternativas. Son funciones diferentes dentro del mismo método.",
    "Confundirlos genera fricción operativa, propuestas mal calibradas y desgaste innecesario.",
    "Saber qué motor activa cada situación es parte del criterio profesional.",
  ],
  keyAccounts: {
    heading: "1. Motor Key Accounts",
    tagline: "Foco estratégico",
    intro: "Venta consultiva profunda para clientes con problemas estructurales y disposición a una relación de largo plazo.",
    bullets: [
      "Rango: 75–120 UF/mes.",
      "Ciclo de venta: 2–4 meses (preparación → primera reunión → maduración → segunda reunión → cierre).",
      "Duración del contrato: 6–12 meses o más.",
      "Relación: consultiva, co-creada, con equipo asignado.",
      "Clientes típicos: gremios sectoriales, cámaras regionales, fundaciones consolidadas (5+ años), ONGs medianas (10–50 personas), empresas con operaciones territoriales.",
    ],
    closing: "Es el negocio principal de THO.",
  },
  tickets: {
    heading: "2. Motor Tickets",
    tagline: "Puerta de entrada",
    intro: "Servicios empaquetados de alcance fijo, duración acotada y precio cerrado.",
    bullets: [
      "Rango: 15–40 UF totales (no mensuales).",
      "Duración: 2–4 meses.",
      "Ciclo de venta: 1–2 semanas.",
      "Relación: transaccional, cordial, sin compromiso de largo plazo.",
    ],
    functionStatement:
      "Función estratégica: calificar prospectos nuevos, diversificar cartera, validar necesidad antes de comprometer un Key Account, escalar a relaciones más profundas, generar casos y contenido.",
    priorityHeading: "Tres Tickets prioritarios 2026",
    priorityTickets: [
      "Mapa de Riesgos Socioambientales (30 UF, 2 meses).",
      "Scan de Liderazgo y Cultura (25 UF, 2 meses).",
      "Flash Audit ESG (30 UF, 3 meses).",
    ],
    notTicketsIntro: "Lo que los Tickets no son",
    notTickets: [
      "Soluciones completas.",
      "Acompañamiento continuo.",
      "Reemplazo de Key Accounts.",
      "Trabajo de urgencia.",
    ],
  },
  funnel: {
    heading: "3. Cómo se relacionan: el funnel",
    body: [
      "Los Tickets no son fin terminal. Son puerta de entrada.",
      "Funnel ideal: Ticket exitoso → confianza construida + diagnóstico claro → siguiente nivel (Nivel 2 o Key Account).",
    ],
    targetLine: "Meta realista: 30–40% de los Tickets escalan a Nivel 1–2; 10–20% se vuelven Key Accounts.",
    pitchTiming:
      "El pitch de escalamiento se hace al final del Ticket (en la entrega de resultados), nunca al principio. Hacerlo antes erosiona confianza.",
  },
  digital: {
    heading: "4. Línea complementaria: servicios digitales",
    intro:
      "THO también tiene una línea de servicios digitales (presencia, narrativa, ecosistema), con tres niveles base mensuales recurrentes (desde 10, 20 y 30 UF/mes) y módulos complementarios activables.",
    statement: "No es el foco estratégico.",
    context:
      "Estos servicios entran principalmente por recomendación y los tomamos porque generan liquidez.",
    rule: "No se prospectan activamente.",
    operationalIntro: "Operativamente:",
    operationalBullets: [
      "Niveles 1–2 (Presencia y Narrativa) entran ligero, con lógica cercana a un retainer mensual de bajo compromiso.",
      "Nivel 3 (Ecosistema) implica community management activo y articulación con aliados — más cercano a una relación de Key Account.",
    ],
    caution:
      "Atención conceptual: los montos digitales son mensuales recurrentes, no totales como un Ticket. Mezclarlos confunde el modelo.",
  },
  translation: {
    heading: "5. Traducción operativa",
    intro: "Antes de proponer, identifica el motor que aplica.",
    bullets: [
      "No atiendas a un Key Account con lógica de Ticket: rebajas el estándar.",
      "No atiendas a un Ticket con lógica de Key Account: sobre-inviertes tiempo en una venta que no lo justifica.",
      "Si un cliente llega buscando digital, no le vendas asesoría sin que él muestre interés. Y al revés también aplica.",
      "Si tienes dudas sobre qué motor aplica: consulta antes de proponer.",
    ],
  },
  synthesis: [
    "Tickets venden el método.",
    "Key Accounts escalan la relación.",
    "Digital es liquidez, no foco.",
    "Confundir motor confunde criterio.",
  ],
};

export type PricingLesson = {
  label: string;
  title: string;
  premise: string[];
  whyUF: {
    heading: string;
    intro: string;
    bullets: string[];
    rule: {
      label: string;
      statement: string;
      body: string[];
    };
  };
  whatDefinesPrice: {
    heading: string;
    bullets: string[];
    closing: string;
  };
  bands: {
    heading: string;
    tickets: {
      heading: string;
      tagline: string;
      bullets: string[];
      priorityHeading: string;
      priorityTickets: string[];
      rule: string;
    };
    keyAccounts: {
      heading: string;
      tagline: string;
      tableHeaders: { banda: string; range: string; entrega: string };
      rows: Array<{ banda: string; range: string; entrega: string }>;
      note: string;
    };
    digital: {
      heading: string;
      tagline: string;
      bullets: string[];
      modules: string;
      note: string;
    };
  };
  presentation: {
    heading: string;
    bullets: string[];
  };
  negotiation: {
    heading: string;
    objectionLabel: string;
    objection: string;
    rules: string[];
    operatingRule: string;
    ticketRule: string;
    packExample: {
      heading: string;
      body: string;
    };
  };
  nonNegotiables: {
    heading: string;
    bullets: string[];
  };
  translation: {
    heading: string;
    intro: string;
    bullets: string[];
  };
  synthesis: string[];
};

export const pricingLessonB3: PricingLesson = {
  label: "LECCIÓN B3 · Estructura de precios",
  title: "Pricing en THO",
  premise: [
    "El precio en THO no se calcula por hora ni por entregable.",
    "Se calcula por el compromiso que se está asumiendo.",
    "Un precio bien construido sostiene calidad, protege al equipo y educa al cliente sobre el valor real del trabajo.",
    "Un precio mal construido erosiona estándar antes de empezar.",
  ],
  whyUF: {
    heading: "1. Por qué se cobra en UF, no en pesos",
    intro: "Cotizamos en UF por cuatro razones:",
    bullets: [
      "Estándar profesional de servicios chilenos: consultoría seria se cotiza en UF.",
      "Estabilidad presupuestaria para el cliente: el monto en UF queda explícito, trazable y proyectable.",
      "Protección inflacionaria al momento de cotizar: cada propuesta nueva refleja el valor actual del trabajo.",
      "Claridad contractual: deja menos espacio para disputas a futuro.",
    ],
    rule: {
      label: "Regla operativa",
      statement: "La UF se congela al cierre del contrato.",
      body: [
        "Al firmar, la UF queda fijada según el día de elaboración del contrato. Si un cliente cierra a 75 UF/mes cuando la UF está en $38.000, paga 75 × 38.000 = $2.850.000 mensuales durante toda la vigencia, aunque la UF suba o baje en el período.",
        "Esto le da al cliente predictibilidad presupuestaria; a THO le obliga a calcular bien al momento de cerrar. No se renegocia mes a mes.",
        "Aplica a todos los servicios de THO: Tickets, Key Accounts y Digital.",
      ],
    },
  },
  whatDefinesPrice: {
    heading: "2. Qué define el precio en THO",
    bullets: [
      "Profundidad del servicio (no es lo mismo un diagnóstico que un acompañamiento).",
      "Tiempo requerido para hacerlo bien.",
      "Nivel de responsabilidad institucional asumida.",
      "Exposición al riesgo (reputacional, legal, técnico).",
      "Dedicación operativa necesaria del equipo.",
    ],
    closing:
      "El precio no es una negociación arbitraria. Es la traducción cuantitativa del compromiso que THO asume con el proyecto.",
  },
  bands: {
    heading: "3. Las bandas reales",
    tickets: {
      heading: "Motor Tickets",
      tagline: "Precio total, alcance fijo",
      bullets: ["Rango: 15–40 UF totales."],
      priorityHeading: "Tickets prioritarios 2026",
      priorityTickets: [
        "Mapa de Riesgos Socioambientales (30 UF, 2 meses).",
        "Scan de Liderazgo y Cultura (25 UF, 2 meses).",
        "Flash Audit ESG (30 UF, 3 meses).",
      ],
      rule: "El alcance del Ticket no se negocia. Si el cliente necesita algo distinto, se cotiza aparte como otro servicio.",
    },
    keyAccounts: {
      heading: "Motor Key Accounts",
      tagline: "Banda mensual, alcance co-creado",
      tableHeaders: { banda: "Banda", range: "Rango", entrega: "Qué se entrega" },
      rows: [
        { banda: "ALTO", range: "100–120 UF/mes", entrega: "Alcance completo, equipo senior, reportes ejecutivos" },
        { banda: "MEDIO", range: "75–90 UF/mes", entrega: "Alcance estándar, equipo mixto, reportes regulares" },
        { banda: "BAJO", range: "50–65 UF/mes", entrega: "Alcance básico, equipo junior, reportes mínimos" },
        { banda: "MUY BAJO", range: "<50 UF/mes", entrega: "Ya no es Key Account → ofrecer Ticket o servicio digital" },
      ],
      note: "El rango objetivo es 75–120 UF/mes. La banda BAJO es un ajuste defensivo, no aspiracional.",
    },
    digital: {
      heading: "Línea digital",
      tagline: "Recurrente mensual, no foco",
      bullets: [
        "Base 1 · Presencia: desde 10 UF/mes.",
        "Base 2 · Narrativa: desde 20 UF/mes.",
        "Base 3 · Ecosistema: desde 30 UF/mes.",
      ],
      modules:
        "Módulos complementarios activables (Manuales, Análisis, Campañas, Talleres): 3–30 UF según módulo.",
      note: "'Desde' significa piso, no precio cerrado. Si el volumen real lo justifica, se ajusta hacia arriba.",
    },
  },
  presentation: {
    heading: "4. Cómo se presenta un precio",
    bullets: [
      'No es "costo". Es "inversión para lograr [objetivo específico que el cliente declaró]".',
      "Se presenta con criterio, no con tabla impresa.",
      "No se justifica defensivamente. Si hay que justificar mucho el precio, lo que falló es la propuesta, no el monto.",
      "El precio no se menciona en la primera reunión salvo que el cliente pregunte directamente. Antes hay que validar que entiende el valor.",
    ],
  },
  negotiation: {
    heading: "5. Negociación profesional",
    objectionLabel: "Objeción típica",
    objection: '"Es muy caro."',
    rules: [
      "No bajar el precio inmediatamente. Es la peor reacción posible.",
      "No compararse con consultoras más baratas. No competimos por precio.",
      'Preguntar primero: "¿Cuál es el presupuesto que tienen disponible?"',
      'Replantear alcance: "Con ese presupuesto, esto es lo que podemos hacer: [alcance reducido]. ¿Eso les sirve?"',
      'Ofrecer fases: "Si necesitan el alcance completo, podemos trabajar por fases. Fase 1: 3 meses por [precio]. Si funciona, seguimos con Fase 2."',
    ],
    operatingRule: "Regla operativa: el alcance se ajusta antes que el monto.",
    ticketRule:
      "Para Tickets: el alcance no se ajusta. Si el cliente quiere algo distinto, se cotiza aparte. Mantener la integridad del producto empaquetado.",
    packExample: {
      heading: "Sobre packs",
      body: "Cuando un cliente contrata dos servicios simultáneamente — por ejemplo RC (75 UF/mes) e Instagram (20 UF/mes) — se cierra como pack a 85 UF/mes en lugar de 95 UF/mes. El ahorro de 10 UF no es un descuento comercial: refleja la eficiencia real de coordinar ambos servicios bajo un mismo equipo.",
    },
  },
  nonNegotiables: {
    heading: "6. No-negociables del pricing",
    bullets: [
      "No se promete profundidad sin la dedicación que corresponde.",
      'No se baja el precio para "ganar el proyecto". Ganar mal es perder mejor.',
      "No se cobra menos de lo que requiere sostener calidad.",
      'Si un cliente quiere lo que THO no puede sostener al precio que ofrece, decir "no" también es una decisión profesional.',
    ],
  },
  translation: {
    heading: "7. Traducción operativa",
    intro: "Antes de proponer un precio:",
    bullets: [
      "Identifica el motor que aplica (Ticket / Key Account / Digital).",
      "Ubica al cliente en la banda que corresponde según presupuesto, alcance esperado y exposición al riesgo.",
      "Si el cliente está bajo la banda mínima del motor: cambia el motor, no bajes el precio.",
      "Si pide descuento sin reducir alcance: discute explícitamente qué se reduce. Sin contraparte no hay descuento.",
      "Registra toda propuesta de precio en el CRM: qué se ofreció, qué se cerró, con qué ajuste, por qué.",
    ],
  },
  synthesis: [
    "El precio no se justifica. Se sostiene.",
    "El alcance se ajusta antes que el monto.",
    '"Muy caro" suele ser un problema de propuesta, no de precio.',
    "Cobrar mal hoy es perder estándar mañana.",
  ],
};

export type QualificationTier = "IDEAL" | "VIABLE" | "NO CALIFICADO";

export type QualificationLesson = {
  label: string;
  title: string;
  premise: string[];
  whyQualify: {
    heading: string;
    intro: string;
    listIntro: string;
    listBullets: string[];
  };
  culturalFilter: {
    heading: string;
    intro: string;
    questions: Array<{ name: string; question: string }>;
    warningOne: string;
    warningMany: string;
  };
  motorProfiles: {
    heading: string;
    intro: string;
    keyAccounts: {
      heading: string;
      tagline: string;
      tiers: Array<{ name: QualificationTier; profile: string }>;
    };
    tickets: {
      heading: string;
      tagline: string;
      tiers: Array<{ name: QualificationTier; profile: string }>;
    };
  };
  redFlags: {
    heading: string;
    intro: string;
    phases: Array<{ heading: string; bullets: string[] }>;
    closing: string;
  };
  exit: {
    heading: string;
    intro: string;
    indicators: string[];
    framing: string;
    quote: string;
    closing: string;
  };
  translation: {
    heading: string;
    bullets: string[];
  };
  synthesis: string[];
};

export const qualificationLessonB4: QualificationLesson = {
  label: "LECCIÓN B4 · Diagnóstico de cliente",
  title: "Calificación: calidad antes que volumen",
  premise: [
    "THO no busca cualquier cliente. Busca cliente compatible.",
    "Vender mal cliente erosiona estándar, equipo y reputación más rápido que no vender.",
    "Calificar antes de proponer no es elitismo. Es protección operativa.",
    'Decir "no" también es una decisión profesional.',
  ],
  whyQualify: {
    heading: "1. Por qué calificar antes de vender",
    intro:
      'Cada propuesta cuesta tiempo, energía y atención que no se recuperan. Si el cliente no es compatible, el costo no es solo perder la venta: es desgastar al equipo y deteriorar el estándar institucional al intentar "hacerlo funcionar".',
    listIntro: "Calificar bien hace tres cosas:",
    listBullets: [
      "Protege la viabilidad operativa del equipo.",
      "Sostiene el estándar profesional en cada contrato.",
      "Permite priorizar el tiempo entre los prospectos que sí van a cerrar bien.",
    ],
  },
  culturalFilter: {
    heading: "2. Las 5 preguntas mínimas (fit cultural, todo cliente)",
    intro:
      "Antes de evaluar ajuste a un motor específico, todo cliente debe pasar el filtro cultural. Estas cinco condiciones aplican siempre:",
    questions: [
      {
        name: "Liderazgo claro",
        question:
          '¿Hay alguien que efectivamente decide y se compromete con el proceso, o todo se diluye en "lo vemos con el equipo"?',
      },
      {
        name: "Disposición a documentar",
        question:
          "¿Aceptan que las decisiones queden por escrito, o esperan acuerdos verbales que después se reinterpretan?",
      },
      {
        name: "Aceptación de trazabilidad",
        question:
          "¿Entienden que el trabajo se sostiene con evidencia y registro, o esperan resultados sin proceso visible?",
      },
      {
        name: "Foco en método sobre resultado rápido",
        question:
          '¿Valoran el cómo o solo el qué? Cliente que solo quiere "el deliverable ya" no es compatible con THO.',
      },
      {
        name: "Responsable interno definido",
        question:
          "¿Hay una contraparte clara con tiempo asignado, o nos van a dejar trabajando solos sin interlocutor?",
      },
    ],
    warningOne: "Si falla una: alerta amarilla.",
    warningMany: "Si fallan dos o más: el cliente no califica para THO en ningún motor.",
  },
  motorProfiles: {
    heading: "3. Perfiles por motor",
    intro:
      "Pasado el filtro cultural, el perfil se afina según el motor que aplica. Lo que es IDEAL en Tickets no es lo mismo que IDEAL en Key Accounts.",
    keyAccounts: {
      heading: "Motor Key Accounts",
      tagline: "Foco estratégico",
      tiers: [
        {
          name: "IDEAL",
          profile:
            "Presupuesto aprobado o flexible · decisor accesible y comprometido · problema urgente y costoso de no resolver · valoran expertise sobre precio · hay embajador interno que conoce y confía en THO.",
        },
        {
          name: "VIABLE",
          profile:
            "Presupuesto existe pero requiere aprobación · decisor identificado pero con intermediarios · problema reconocido pero no urgente · sensibles a precio pero entienden valor · contacto tibio (referencia de 2º grado).",
        },
        {
          name: "NO CALIFICADO",
          profile:
            '"Curiosidad" sin dolor real · presupuesto incierto o inexistente · no está claro quién decide · buscan "lo más barato" · contacto frío sin contexto compartido.',
        },
      ],
    },
    tickets: {
      heading: "Motor Tickets",
      tagline: "Puerta de entrada",
      tiers: [
        {
          name: "IDEAL",
          profile:
            "Problema específico y acotado · presupuesto pequeño pero real (20–40 UF disponibles) · decisión rápida posible (1–2 semanas) · entienden que es diagnóstico/fase 1, no solución completa · potencial de escalamiento a Nivel 1–2.",
        },
        {
          name: "VIABLE",
          profile:
            "Curiosidad genuina (no solo cotizar) · presupuesto probable pero no confirmado · necesitan validar internamente (2–3 semanas) · abiertos a discutir alcance.",
        },
        {
          name: "NO CALIFICADO",
          profile:
            "Buscan solución completa con presupuesto de Ticket · no tienen presupuesto · requieren licitación o proceso formal largo · expectativas poco realistas (estrategia + implementación en 2 meses por 20 UF).",
        },
      ],
    },
  },
  redFlags: {
    heading: "4. Red flags durante el ciclo",
    intro:
      "La calificación no es solo al inicio. El comportamiento durante el proceso también señala fit (o falta de fit).",
    phases: [
      {
        heading: "En Reunión 1",
        bullets: [
          "Solo curiosidad, sin dolor real articulable.",
          'No pueden describir qué significaría "éxito" para ellos.',
          'Mencionan "estamos viendo varias opciones" sin contexto (RFP encubierto).',
          "Decisor no está presente y tampoco vendrá.",
        ],
      },
      {
        heading: "En seguimiento",
        bullets: [
          "No contestan en 4+ semanas sin explicación.",
          "Piden ajustes constantes sin avanzar.",
          "Cambian de interlocutor sin contexto.",
          'Dicen "sí" a todo pero no avanzan.',
        ],
      },
      {
        heading: "En Reunión 2",
        bullets: [
          "Decisor sigue sin estar.",
          'Preguntan por "otras opciones más baratas".',
          "Cuestionan metodología básica.",
          "No tienen presupuesto claro a estas alturas.",
        ],
      },
    ],
    closing:
      "Un red flag aislado puede gestionarse. Tres o más concentrados: el cliente no va a cerrar bien.",
  },
  exit: {
    heading: "5. Cuándo retirarse",
    intro:
      "Hay momentos en que la decisión profesional es soltar el prospecto. Indicadores claros:",
    indicators: [
      "Han pasado 3+ meses sin avance real.",
      "El cliente te ve como commodity, no valora expertise.",
      "Su presupuesto es menos del 50% del mínimo viable para el motor que aplica.",
      'Tus tripas dicen "esto no va" — y suelen tener razón.',
    ],
    framing: "Retirarse no es portazo. Es pausa elegante:",
    quote:
      '"Agradezco mucho el tiempo que nos han dado. Siento que en este momento el timing o el fit no está del todo. Les propongo dejar esto en pausa y si más adelante tiene sentido, retomamos."',
    closing:
      "Mantener relación cordial con clientes no calificados es estratégico: pueden calificar después.",
  },
  translation: {
    heading: "6. Traducción operativa",
    bullets: [
      "Antes de invertir tiempo en una propuesta, califica.",
      '"No calificado" no es "rechazado": es "no es momento" o "no es fit con THO".',
      "Si el cliente está borderline (VIABLE bajo), define qué necesitarían cambiar para subir de tier antes de comprometer un Key Account. Para Tickets, VIABLE bajo es aceptable si entienden el alcance.",
      "Si las tripas y la evaluación se contradicen, gana lo que tenga más evidencia. Pero documenta la duda internamente para revisarla después.",
    ],
  },
  synthesis: [
    "Calificar protege más de lo que parece.",
    "Cliente incompatible erosiona estándar mucho antes del cierre.",
    'Decir "no" también es decisión profesional.',
    "El fit cultural es prerequisito; el fit por motor es ajuste fino.",
  ],
};

export type CRMLesson = {
  label: string;
  title: string;
  premise: string[];
  whatIsIt: {
    heading: string;
    body: string[];
  };
  whyExists: {
    heading: string;
    intro: string;
    bullets: string[];
    rule: {
      label: string;
      statement: string;
      body: string;
    };
  };
  twoSides: {
    heading: string;
    intro: string;
    commercial: {
      heading: string;
      tagline: string;
      tabs: string[];
    };
    accounting: {
      heading: string;
      tagline: string;
      tabs: Array<{ name: string; description: string }>;
    };
    closing: string;
  };
  pipelineStates: {
    heading: string;
    intro: string;
    activeStates: string[];
    leadOrigin: string;
    closureLabel: string;
    closure: string;
  };
  rules: {
    heading: string;
    bullets: string[];
  };
  translation: {
    heading: string;
    bullets: string[];
  };
  synthesis: string[];
};

export const crmLessonB5: CRMLesson = {
  label: "LECCIÓN B5 · Sistema operativo",
  title: "CRM en THO: memoria institucional",
  premise: [
    "El CRM en THO no es una herramienta. Es el sistema operativo de la organización.",
    "Atraviesa lo comercial, lo financiero y lo contable.",
    "Sin registro no hay continuidad, accountability ni base para decidir.",
    "Y la ley operativa es directa: si no está registrado, no existe.",
  ],
  whatIsIt: {
    heading: "1. Qué es el CRM en THO",
    body: [
      "No es una agenda de contactos. Tampoco una hoja de cálculo de pipeline.",
      "Es la memoria institucional: el lugar donde queda todo lo que la organización necesita recordar para operar, mejorar y sostenerse cuando alguien se ausenta o se va.",
      "Cuando una persona sale, sus relaciones, decisiones y proyectos no deben salir con ella. Eso es lo que el CRM protege.",
    ],
  },
  whyExists: {
    heading: "2. Por qué existe",
    intro: "Sin CRM:",
    bullets: [
      "No hay continuidad cuando alguien se ausenta o sale.",
      "No hay accountability sobre decisiones tomadas.",
      "No hay base para aprender (¿qué funcionó? ¿qué no?).",
      "La organización depende de la memoria personal de cada uno — y eso es frágil.",
    ],
    rule: {
      label: "Regla operativa",
      statement: "Si no está registrado, no existe.",
      body: "No es retórica. Es ley operativa. Una conversación que cambió el alcance de un contrato y no quedó en CRM, no ocurrió. Una propuesta que se mandó sin registrar el monto exacto, no se mandó. Un cobro que no entró al contable, no se hizo.",
    },
  },
  twoSides: {
    heading: "3. Los dos lados del CRM",
    intro: "El CRM en THO tiene dos lados que se complementan:",
    commercial: {
      heading: "Lado Comercial/Financiero",
      tagline: "Qué se vende y qué se ejecuta",
      tabs: [
        "Pipeline (prospectos en curso).",
        "Tickets actuales (en ejecución).",
        "Key Accounts (cuentas activas).",
        "Historial de cierres (ganados y perdidos).",
        "Reportes (gráficos por período consultado).",
      ],
    },
    accounting: {
      heading: "Lado Contable",
      tagline: "Qué se declara y formaliza",
      tabs: [
        {
          name: "EERR (Estado de Resultados)",
          description: "Alimentado por facturas emitidas, facturas recibidas, honorarios, retiros y caja chica.",
        },
        {
          name: "Conciliación",
          description: "Cruce contable-bancario.",
        },
      ],
    },
    closing:
      "Los dos lados se complementan: lo comercial/financiero muestra la actividad y el flujo; lo contable formaliza, ordena y deja la base para operación renta anual.",
  },
  pipelineStates: {
    heading: "4. Los estados del pipeline",
    intro: "Todo prospecto se mueve por una secuencia estándar de estados activos:",
    activeStates: [
      "Lead nuevo",
      "Contactado",
      "Reunión agendada",
      "Propuesta enviada",
      "Negociación",
    ],
    leadOrigin: "Los leads nuevos caen automáticamente desde los lead magnets de tho.cl.",
    closureLabel: "Cierre",
    closure:
      'Tras Negociación, el prospecto se cierra: ganado o perdido. En ambos casos pasa a "Historial de cierres" y deja de aparecer en pipeline activo.',
  },
  rules: {
    heading: "5. Reglas operativas",
    bullets: [
      "El estado del pipeline se actualiza después de cada interacción, no semanalmente.",
      "Toda propuesta enviada queda con su versión y monto exacto.",
      "El CRM debe estar siempre consultable. Cada persona es responsable de mantener al día su parte.",
      "Antes de las reuniones trimestrales de evaluación, el CRM debe reflejar el estado real — sin lagunas ni notas pendientes acumuladas.",
      "Cuando hay cambio de interlocutor con un prospecto, queda registrado con fecha y motivo.",
      "Las notas relevantes de cada reunión quedan en CRM, no en libretas personales.",
    ],
  },
  translation: {
    heading: "6. Traducción operativa",
    bullets: [
      "Antes de contactar a un prospecto, revisa CRM. ¿Hubo contacto previo? ¿Con quién? ¿Cómo quedó?",
      "Después de cada reunión, actualiza estado + próximo paso + notas relevantes el mismo día.",
      "Toda transacción (factura emitida, factura recibida, honorario, retiro, caja chica) entra al lado contable sin esperar.",
      "Si vas a tomar una decisión sobre un cliente, asegúrate de que la información en la que te basas esté en CRM, no solo en tu cabeza.",
      "Si tienes que justificar algo retroactivamente y no está en CRM, asume que vas a tener que reconstruirlo desde cero.",
    ],
  },
  synthesis: [
    "El CRM no es burocracia. Es memoria institucional.",
    '"Si no está registrado, no existe" es ley operativa.',
    "Lo comercial/financiero muestra el movimiento. Lo contable lo formaliza.",
    "Registrar no es trabajo extra. Es parte del trabajo.",
  ],
};

export type CommercialEthicsLesson = {
  label: string;
  title: string;
  premise: string[];
  fundamentals: {
    heading: string;
    intro: string;
    items: Array<{ statement: string; explanation: string }>;
    closing: string;
  };
  whyEthicsProtects: {
    heading: string;
    intro: string;
    bullets: string[];
  };
  objections: {
    heading: string;
    intro: string;
    trapLabel: string;
    ethicalLabel: string;
    items: Array<{ objection: string; trap: string; ethical: string }>;
  };
  neverDo: {
    heading: string;
    intro: string;
    bullets: string[];
  };
  whenToDecline: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  translation: {
    heading: string;
    bullets: string[];
  };
  synthesis: string[];
};

export const commercialEthicsLessonB6: CommercialEthicsLesson = {
  label: "LECCIÓN B6 · Límites en la venta",
  title: "Ética comercial en THO",
  premise: [
    "En THO la venta no se separa del método.",
    "Lo que se promete tiene que ser sostenible con el estándar interno, sin atajos, sin fricción oculta, sin compromisos que el equipo no puede cumplir.",
    "La ética comercial no es un valor decorativo. Es lo que diferencia una venta que escala de una venta que destruye relaciones.",
  ],
  fundamentals: {
    heading: '1. Los tres "no" fundamentales',
    intro: "Toda venta en THO se sostiene sobre tres negativas explícitas:",
    items: [
      {
        statement: "No se promete rapidez sin método.",
        explanation:
          "Acelerar entregables comprometiendo etapas críticas erosiona el resultado y expone al equipo a fallar.",
      },
      {
        statement: "No se ofrece profundidad no sostenible.",
        explanation:
          "Si el alcance ofrecido requiere capacidad que no tenemos o supuestos que no podemos verificar, no se ofrece — se acota.",
      },
      {
        statement: "No se ocultan riesgos.",
        explanation:
          "Si durante la conversación detectamos tensiones críticas (regulatorias, reputacionales, operativas), se explicitan. Cerrar omitiendo es cerrar mal.",
      },
    ],
    closing:
      "Estas tres negativas existen porque protegen lo mismo: la viabilidad del trabajo después de la firma. Vender bien es vender lo que se puede sostener.",
  },
  whyEthicsProtects: {
    heading: "2. Por qué la ética comercial protege más de lo que parece",
    intro: 'No es un asunto de imagen ni de "ser buena gente". La ética comercial es operativa:',
    bullets: [
      "Protege la relación con el cliente: la confianza ganada en la venta sostiene los conflictos inevitables de la ejecución.",
      "Protege al equipo: no acepta compromisos que destruyan capacidad o moral.",
      "Protege la reputación institucional: el mercado de consultoría es chico, especialmente en regiones — todo se sabe.",
      "Protege la integridad del método: si vendemos mal, ejecutamos mal. La venta es la primera entrega.",
    ],
  },
  objections: {
    heading: "3. Manejo ético de objeciones",
    intro:
      "Las objeciones tácticas ya están cubiertas en B3 (cómo responder). Aquí está la dimensión ética: la trampa típica que hay que evitar y la respuesta coherente con el estándar.",
    trapLabel: "Trampa",
    ethicalLabel: "Respuesta ética",
    items: [
      {
        objection: '"Es muy caro."',
        trap: "Bajar el precio defensivamente para ganar el proyecto.",
        ethical:
          "Ajustar alcance antes que monto. Si el presupuesto del cliente está fuera de banda, cambiar de motor o pausar conversación.",
      },
      {
        objection: '"Necesitamos pensarlo."',
        trap: 'Forzar la decisión con tácticas de urgencia ("solo esta semana", "tenemos otros clientes esperando").',
        ethical:
          "Aceptar el espacio. Preguntar si hay algo específico que aclarar; si no, agendar reconexión sin presionar.",
      },
      {
        objection: '"Ya trabajamos con otra consultora."',
        trap: "Descalificar al competidor o sugerir que están mal acompañados.",
        ethical:
          "Preguntar genuinamente cómo les ha ido. Si están conformes, no insistir. Si hay vacíos, ofrecer complementariedad, no reemplazo agresivo.",
      },
      {
        objection: '"No es el momento."',
        trap: "Insistir con argumentos diseñados para que reconsideren.",
        ethical:
          "Aceptar la respuesta. Preguntar si tiene sentido reconectar en una fecha específica y registrarlo.",
      },
      {
        objection: '"Necesitamos aprobación de [superior]."',
        trap:
          'Presionar al interlocutor para que "convenza" internamente, o forzar el contacto directo con el superior sin permiso.',
        ethical:
          "Preguntar qué necesita el interlocutor para facilitar esa aprobación (documento ejecutivo, reunión adicional, ajuste de alcance). Trabajar con su proceso interno, no contra él.",
      },
    ],
  },
  neverDo: {
    heading: "4. Lo que nunca se hace en venta THO",
    intro: "Aunque hayan razones aparentes, estas prácticas están fuera del estándar:",
    bullets: [
      'Crear urgencia artificial ("oferta solo esta semana", "tenemos pocas vacantes").',
      "Prometer resultados garantizados que dependen del cliente como si fueran del consultor.",
      "Inflar entregables o exagerar capacidad operativa real.",
      "Usar comparaciones desleales con competidores nombrados o implícitos.",
      "Usar al cliente como caso de éxito antes de tiempo. Antes de mencionar testimonios, casos o citas en propuestas o redes, el permiso del cliente debe ser explícito (formulario de satisfacción completado, autorización verbal explícita o grabación con consentimiento).",
      "Aceptar compromisos que destruyen al equipo: timelines imposibles, alcance ambiguo, dedicación incompatible con la capacidad real.",
    ],
  },
  whenToDecline: {
    heading: "5. Cuándo declinar una venta",
    intro:
      "Hay condiciones en las que la decisión profesional es no cerrar, aunque la venta esté disponible:",
    bullets: [
      "Cuando el cliente exige que ocultemos un riesgo relevante (regulatorio, comunitario, reputacional).",
      "Cuando el alcance pedido es inviable al precio ofrecido y el cliente no flexibiliza ni en alcance ni en plazo.",
      "Cuando el cliente pretende usar el contrato para legitimar algo que no creemos (greenwashing, narrativa engañosa, validación cosmética).",
      "Cuando hay conflicto de interés que no podemos resolver con transparencia interna.",
    ],
    closing: "Declinar bien es parte del trabajo, no un fracaso comercial.",
  },
  translation: {
    heading: "6. Traducción operativa",
    bullets: [
      "Antes de cerrar, pregúntate: ¿esta promesa la puedo sostener con método?",
      "Si la respuesta es no, ajusta alcance, plazo o precio. No cierres mal.",
      "Si el cliente presiona por un compromiso inviable, explicítalo. Es mejor perder la venta que cerrarla mal.",
      "Después de cada cierre, deja constancia de qué se prometió exactamente — para que ejecución no tenga que adivinar.",
      "Si después de cerrado detectas una promesa difícil de sostener, plantéalo internamente lo antes posible.",
    ],
  },
  synthesis: [
    "Vender ético es vender sostenible.",
    'El "no" que protege estándar vale más que el "sí" que lo erosiona.',
    "Ganar mal es perder mejor.",
    "La reputación se construye en cómo se vende, no solo en cómo se entrega.",
  ],
};

export type CommercialClosingLesson = {
  label: string;
  title: string;
  premise: string[];
  threeDocuments: {
    heading: string;
    intro: string;
    documents: Array<{ name: string; tagline: string; body: string[] }>;
  };
  contractContents: {
    heading: string;
    intro: string;
    bullets: string[];
    closing: string;
  };
  byMotor: {
    heading: string;
    keyAccounts: {
      heading: string;
      tagline: string;
      bullets: string[];
    };
    tickets: {
      heading: string;
      tagline: string;
      bullets: string[];
    };
    digital: {
      heading: string;
      tagline: string;
      bullets: string[];
    };
  };
  kickoff: {
    heading: string;
    intro: string;
    coversHeading: string;
    covers: string[];
    prepHeading: string;
    prep: string[];
    closing: string;
  };
  renewal: {
    heading: string;
    intro: string;
    annual: {
      heading: string;
      timeline: Array<{ month: string; action: string }>;
    };
    short: {
      heading: string;
      body: string;
    };
    ticketsLine: string;
    digitalLine: string;
    upsell: {
      heading: string;
      yesIntro: string;
      yes: string[];
      noIntro: string;
      no: string[];
      how: string;
    };
  };
  commonErrors: {
    heading: string;
    intro: string;
    bullets: string[];
  };
  translation: {
    heading: string;
    bullets: string[];
  };
  synthesis: string[];
};

export const commercialClosingLessonB7: CommercialClosingLesson = {
  label: "LECCIÓN B7 · Cierre y formalización",
  title: "Cierre profesional en THO",
  premise: [
    "El cierre es la primera entrega.",
    "Lo que queda explícito al formalizar define cómo se ejecuta; lo que queda implícito se vuelve conflicto.",
    "Un cierre claro reduce más fricción operativa que cualquier protocolo posterior.",
  ],
  threeDocuments: {
    heading: "1. Los tres documentos de formalización",
    intro:
      "Cerrar bien implica saber qué documento usar en cada momento. THO trabaja con tres documentos distintos, con propósitos y niveles de explicitud diferentes:",
    documents: [
      {
        name: "Propuesta",
        tagline: "Orientación de valor",
        body: [
          "Comunica qué valor entrega THO y da una idea del alcance, sin entrar en granularidad.",
          "Esa contención es deliberada y operativa: clientes con malas prácticas han tomado propuestas de THO para apretar a otros consultores en precio. La propuesta orienta, no es manual de implementación.",
        ],
      },
      {
        name: "Cotización",
        tagline: "Detalle comercial acotado",
        body: [
          "Más enfocada que una propuesta. Sirve para servicios puntuales o solicitudes específicas donde lo que importa es precio, alcance específico y plazo.",
          "Más concreta en términos comerciales, sin la arquitectura completa de una propuesta estratégica.",
        ],
      },
      {
        name: "Contrato / Acuerdo de Trabajo",
        tagline: "Documento vinculante",
        body: [
          "Es el único de los tres con detalle granular y compromiso legal.",
          "Si el cliente extiende contrato, lo usamos. Si no, THO extiende un Acuerdo de Trabajo. Aquí entra todo el detalle que la propuesta deja en alto nivel.",
        ],
      },
    ],
  },
  contractContents: {
    heading: "2. Qué incluye un contrato (no una propuesta)",
    intro: "El detalle explícito vive en el contrato/acuerdo, no en la propuesta. El documento no debería firmarse si le falta alguno de estos elementos:",
    bullets: [
      "Alcance detallado: qué se hace, con qué profundidad, en qué tiempo.",
      "Supuestos y exclusiones explícitas.",
      "Hitos y entregables con fechas.",
      "Responsables por cada lado, con nombre.",
      "Formato de seguimiento: frecuencia de reuniones, cómo se comunican cambios.",
      "Precio en UF, congelado al día de firma.",
      "Duración y condiciones de renovación.",
      "Condiciones de término: qué pasa si alguna parte necesita salir.",
      "Firmas del decisor real, no de intermediario.",
    ],
    closing:
      "Si algún elemento queda ambiguo o pendiente, el documento no está listo. La ambigüedad de hoy es el conflicto de mañana.",
  },
  byMotor: {
    heading: "3. Reglas por motor",
    keyAccounts: {
      heading: "Motor Key Accounts",
      tagline: "Contrato robusto, fee mensual",
      bullets: [
        "El contrato puede venir del cliente o ser extendido por THO si el cliente no ofrece uno.",
        "Puede firmarse incluso después de iniciar operaciones, pero siempre se notifica al cliente la necesidad de formalizarlo. Trabajar sin contrato eventualmente debe evitarse.",
        "Forma de pago según el sistema del cliente (Orden de Compra, Hoja de Entrada de Servicio, etc.) — siempre contra factura. THO emite, cliente paga.",
        "Aceptamos ciclos de pago del cliente, pero preferimos fee mensual (incluso prorrateando el valor total dividido en los meses de asesoría).",
        "THO jamás acepta boleta de honorarios como modalidad de cobro. THO es empresa y extiende factura exenta.",
        "Kick-off siempre, sin excepciones.",
      ],
    },
    tickets: {
      heading: "Motor Tickets",
      tagline: "Acuerdo de trabajo simple, pago fraccionado",
      bullets: [
        "Si el cliente no ofrece contrato, THO extiende un Acuerdo de Trabajo.",
        "Para Tickets que corresponden al Nivel 1 de la ruta de servicios (ESG, DO, RC), el cobro se fracciona: entre 20% y 50% al inicio y lo que reste al cierre del proceso.",
        "Inicia con kick-off; termina con reunión de entrega de reporte al cliente.",
      ],
    },
    digital: {
      heading: "Línea digital",
      tagline: "Acuerdo de trabajo recurrente",
      bullets: [
        "THO extiende un Acuerdo de Trabajo con renovación automática a menos que el cliente notifique la suspensión dentro del plazo acordado.",
        "Forma de pago según el ciclo del cliente, manteniendo siempre ciclo mensual (algunos pagan al contado, otros a 30 días — no es ideal, pero así operan algunas empresas).",
        "Siempre se extiende factura — sin excepciones.",
        "Siempre hay reunión de planificación de contenidos al inicio del primer mes y revisión periódica del paquete.",
      ],
    },
  },
  kickoff: {
    heading: "4. El kick-off",
    intro:
      "El kick-off no es ceremonia. Es el momento donde la propuesta se vuelve operación. Aplica a los tres motores.",
    coversHeading: "Tiene que cubrir",
    covers: [
      "Presentación formal del equipo THO que va a trabajar con el cliente.",
      "Recapitular objetivos y alcance acordados — que todos estemos en la misma página.",
      "Definir metodología de trabajo concreta.",
      "Acordar canales de comunicación (qué va por mail, qué por reunión, qué por chat).",
      "Calendarizar las próximas reuniones del primer mes.",
      "Definir primeros pasos concretos.",
    ],
    prepHeading: "Preparación previa",
    prep: [
      "Cronograma detallado del proyecto.",
      "Plan de trabajo del primer mes.",
      "Materiales de diagnóstico iniciales si aplican (especialmente para Tickets de diagnóstico).",
    ],
    closing:
      "Un kick-off bien hecho da el tono de toda la relación. Un kick-off improvisado predice una ejecución improvisada.",
  },
  renewal: {
    heading: "5. Renovación y crecimiento",
    intro: "El ciclo de renovación se anticipa, no se espera.",
    annual: {
      heading: "Key Accounts anuales",
      timeline: [
        {
          month: "Mes 9",
          action:
            "Evaluación interna THO: ¿cómo ha ido? ¿cumplimos lo prometido? ¿hay base real para continuar? Preparar propuesta de continuidad.",
        },
        {
          month: "Mes 10",
          action:
            "Reunión de evaluación con cliente. Presentar resultados, aprendizajes, riesgos residuales. Sondear interés en renovar.",
        },
        {
          month: "Mes 11",
          action:
            "Propuesta de renovación ajustada al nuevo contexto. Negociación (generalmente más rápida que venta inicial porque ya hay confianza).",
        },
        {
          month: "Mes 12",
          action: "Cierre de renovación y definición de objetivos para el año 2.",
        },
      ],
    },
    short: {
      heading: "Key Accounts cortas (6 meses o menos)",
      body: "Se conversa la renovación en el último mes y luego antes de cerrar. No se atosiga con preguntas antes — parecemos desesperados.",
    },
    ticketsLine: "Tickets no se renuevan: se escalan (a Nivel 1–2 o Key Account) o terminan al entregar el reporte.",
    digitalLine:
      "Digital se renueva automáticamente salvo notificación. La revisión sustantiva del paquete (cambio de nivel, módulos adicionales) se acuerda explícitamente, no es automática.",
    upsell: {
      heading: "Upsell y cross-sell",
      yesIntro: "Cuándo sí ofrecer",
      yes: [
        "Cuando el cliente pregunta por otros servicios.",
        "Cuando identificas una necesidad complementaria con hallazgos concretos del trabajo.",
        "Cuando se cumplieron los objetivos del contrato vigente y hay base para profundizar.",
      ],
      noIntro: "Cuándo no",
      no: [
        "Al inicio del contrato, antes de demostrar valor.",
        "Cuando hay tensiones operativas pendientes.",
        "Cuando el cliente todavía no entiende qué se está haciendo.",
      ],
      how:
        'Cómo: presentar como "siguiente fase natural" basado en hallazgos concretos. Si hay pack, ofrecer ahorro por eficiencia operativa, no por descuento comercial.',
    },
  },
  commonErrors: {
    heading: "6. Errores frecuentes en el cierre",
    intro: "Patrones que generan problemas evitables:",
    bullets: [
      'Dejar campos abiertos ("a definir más adelante") en alcance, precio o plazos en el contrato.',
      "Olvidar exclusiones explícitas en el contrato — generan conflicto durante la ejecución.",
      'Saltarse el kick-off "porque el cliente está apurado".',
      "Iniciar trabajo sin documentar por mail que se está iniciando y que se formalizará un contrato o acuerdo en paralelo. La lógica THO es de confianza, pero la documentación mínima protege a ambas partes.",
      "Enviar contrato a un email genérico (info@) en lugar del decisor que firma.",
      "Aceptar boleta de honorarios como modalidad de cobro: THO siempre extiende factura.",
    ],
  },
  translation: {
    heading: "7. Traducción operativa",
    bullets: [
      "La propuesta da el marco; la cotización aterriza; el contrato/acuerdo vincula. Cada documento tiene su nivel propio de explicitud.",
      "Antes de iniciar trabajo, deja constancia por mail de que se está iniciando y que se formalizará contrato/acuerdo en paralelo.",
      "El kick-off es no-negociable. Sin kick-off, no se empieza la ejecución sustantiva.",
      "Toda promesa hecha durante la venta queda explícita en el contrato/acuerdo. Si no se puede explicitar, se renegocia o se retira.",
      "Para Key Accounts anuales, agenda la conversación de renovación al mes 9. Para KA cortas (6 meses o menos), al último mes — sin atosigar antes.",
      "Si detectas durante la ejecución una ambigüedad relevante en el contrato, plantéala antes de que se vuelva problema.",
    ],
  },
  synthesis: [
    "La formalización es la primera entrega.",
    "Propuesta, cotización y contrato son tres documentos distintos. No los confundas.",
    "Un contrato claro reduce más fricción que cualquier protocolo posterior.",
    "La confianza permite iniciar; el documento protege a todos.",
    "La renovación se anticipa, pero no se atosiga.",
  ],
};
