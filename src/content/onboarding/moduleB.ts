/**
 * Lecciones hand-crafted del Módulo B (Ventas en THO).
 *
 * Lecciones ya editorializadas:
 *  - B1 (consultiveSalesLessonB1): Qué significa vender en THO.
 *  - B2 (dualEngineLessonB2): Arquitectura comercial — los dos motores.
 *  - B3 (pricingLessonB3): Pricing en THO.
 *  - B4 (qualificationLessonB4): Calificación de cliente.
 *
 * Las demás lecciones (B5–B7) caen al render genérico hasta que se profundicen.
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
      "Registra la calificación en el CRM con justificación breve (no solo la categoría).",
      '"No calificado" no es "rechazado": es "no es momento" o "no es fit con THO".',
      "Si el cliente está borderline (VIABLE bajo), define qué necesitarían cambiar para subir de tier antes de comprometer un Key Account. Para Tickets, VIABLE bajo es aceptable si entienden el alcance.",
      "Si las tripas y la evaluación se contradicen, gana lo que tenga más evidencia. Pero documenta la duda.",
    ],
  },
  synthesis: [
    "Calificar protege más de lo que parece.",
    "Cliente incompatible erosiona estándar mucho antes del cierre.",
    'Decir "no" también es decisión profesional.',
    "El fit cultural es prerequisito; el fit por motor es ajuste fino.",
  ],
};
