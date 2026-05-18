/**
 * Lecciones hand-crafted del Módulo B (Ventas en THO).
 *
 * Lecciones ya editorializadas:
 *  - B1 (consultiveSalesLessonB1): Qué significa vender en THO.
 *  - B2 (dualEngineLessonB2): Arquitectura comercial — los dos motores.
 *
 * Las demás lecciones (B3–B7) caen al render genérico hasta que se profundicen.
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
