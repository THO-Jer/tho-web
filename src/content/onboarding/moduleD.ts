/**
 * Lecciones hand-crafted del Módulo D (Operación Asesorías en THO).
 *
 * Lecciones editorializadas:
 *  - D1 (advisingMeaningLessonD1): Qué significa asesorar en THO.
 *  - D2 (conceptualBasesLessonD2): Fundamentos conceptuales mínimos.
 *  - D3 (interventionStructureLessonD3): Estructura de una intervención.
 *  - D4 (diagnosisLessonD4): Diagnóstico interpretativo.
 *  - D5 (strategicDesignLessonD5): Diseño estratégico.
 *  - D6 (dodAdvisoryLessonD6): Estándar mínimo de entregables (DoD en asesorías).
 *  - D7 (traceabilityLessonD7): Documentación y trazabilidad.
 *  - D8 (ethicsAdvisoryLessonD8): Ética en asesorías.
 *  - D9 (advancedFormationLessonD9): Formación avanzada.
 *  - D10 (alertSignsLessonD10): Señales de alerta en asesoría.
 *  - DCierre (closingModuleDLesson): Cierre del módulo.
 *
 * Módulo D completo en cobertura hand-crafted.
 */

// ─── Tipos compartidos ─────────────────────────────────────────────────────

export type AdvisoryBulletBlock = {
  heading: string;
  intro?: string;
  bullets: string[];
  closing?: string;
};

export type AdvisoryRuleCallout = {
  label: string;
  statement: string;
  body?: string[];
};

// ─── D1 · Qué significa asesorar en THO ──────────────────────────────────

export type AdvisingMeaningLesson = {
  label: string;
  title: string;
  premise: string[];
  whatIsNot: AdvisoryBulletBlock;
  whatItIs: AdvisoryBulletBlock;
  complexityRule: AdvisoryRuleCallout;
  implications: AdvisoryBulletBlock;
  synthesis: string[];
};

export const advisingMeaningLessonD1: AdvisingMeaningLesson = {
  label: "LECCIÓN D1 · Qué significa asesorar en THO",
  title: "Asesoría: intervención sobre sistemas complejos",
  premise: [
    "Asesorar en THO no es ejecutar tareas ni validar decisiones ya tomadas.",
    "Es intervenir sistemas organizacionales complejos: estructuras donde participan personas con intereses distintos, historias acumuladas, tensiones no resueltas y entornos en movimiento.",
    "Esta distinción no es semántica. Define qué se entrega, cómo se trabaja y cuál es la responsabilidad de THO frente al cliente.",
  ],
  whatIsNot: {
    heading: "Lo que asesorar NO es",
    intro: "Tres confusiones frecuentes que afectan la calidad del trabajo:",
    bullets: [
      "Ejecutar tareas: producir entregables sin marco interpretativo no es asesoría. Es producción. THO puede entregar documentos, pero la asesoría está en el criterio que los orienta, no en el objeto producido.",
      "Validar lo ya decidido: si el cliente ya tomó la decisión y solo busca respaldo, THO debe explicitarlo. Actuar como legitimador de decisiones ajenas sin análisis independiente compromete la integridad del trabajo.",
      "Opinar sin método: las opiniones informadas no son asesoría. La asesoría requiere diagnóstico, evidencia, marcos conceptuales explícitos y criterio documentado.",
    ],
    closing: "La confusión sobre qué se está haciendo genera expectativas mal encuadradas y entregables que no resuelven el problema real.",
  },
  whatItIs: {
    heading: "Lo que asesorar sí implica",
    intro: "Asesorar en THO implica intervenir sistemas organizacionales considerando seis dimensiones simultáneas:",
    bullets: [
      "Cultura: las prácticas no escritas que regulan comportamiento real, más allá de los organigramas.",
      "Poder: quién decide efectivamente, quién tiene veto informal, qué jerarquías coexisten con las formales.",
      "Incentivos: qué comportamientos el sistema premia o penaliza, con independencia de lo que se declara.",
      "Emociones: cómo los estados afectivos del equipo afectan la capacidad de cambio y la recepción del trabajo.",
      "Historia: qué decisiones pasadas condicionan las opciones disponibles hoy.",
      "Entorno: qué factores externos (regulatorios, territoriales, sectoriales) operan sobre el sistema.",
    ],
    closing: "Ignorar cualquiera de estas dimensiones produce análisis incompleto y recomendaciones que no pueden implementarse.",
  },
  complexityRule: {
    label: "Principio de complejidad",
    statement: "Los sistemas organizacionales no se comportan como máquinas: no tienen soluciones únicas, no responden de forma lineal a las intervenciones.",
    body: [
      "Una misma recomendación produce efectos distintos según el momento, el equipo y el contexto en que se aplica.",
      "El rol de THO es hacer visible esa complejidad, no simplificarla artificialmente para que las conclusiones sean más cómodas.",
      "La claridad no se logra eliminando variables; se logra estructurando el análisis para que el cliente pueda decidir con mejor información.",
    ],
  },
  implications: {
    heading: "Implicaciones prácticas para el trabajo en THO",
    intro: "Esta definición de asesoría tiene tres consecuencias directas:",
    bullets: [
      "Antes de proponer: diagnosticar. No se llega a la reunión con la solución; se llega con el encuadre del problema.",
      "Las recomendaciones llevan contexto: toda propuesta incluye los supuestos que la sostienen y los riesgos que implica.",
      "El trabajo termina cuando el cliente puede decidir mejor, no cuando THO entregó un documento.",
    ],
    closing: "La calidad de la asesoría se mide por la calidad de las decisiones que habilita, no por el volumen de lo producido.",
  },
  synthesis: [
    "Asesorar es intervenir sistemas complejos con método, marco y responsabilidad ética.",
    "No es ejecutar, no es validar, no es opinar: es estructurar diagnóstico y habilitar decisiones de mejor calidad.",
    "La complejidad se hace visible, no se elimina.",
  ],
};

// ─── D2 · Fundamentos conceptuales mínimos ────────────────────────────────

export type ConceptualBasesLesson = {
  label: string;
  title: string;
  premise: string[];
  whyFrames: AdvisoryBulletBlock;
  frameworks: Array<{
    id: string;
    name: string;
    coreIdea: string;
    thoApplication: string;
    keyRisk: string;
  }>;
  integrationNote: AdvisoryRuleCallout;
  synthesis: string[];
};

export const conceptualBasesLessonD2: ConceptualBasesLesson = {
  label: "LECCIÓN D2 · Fundamentos conceptuales mínimos",
  title: "Marcos explícitos, no intuición aislada",
  premise: [
    "THO asesora desde marcos conceptuales explícitos. Esto significa que el criterio usado para diagnosticar y recomendar es identificable, comunicable y cuestionable.",
    "La intuición profesional tiene valor, pero solo cuando está anclada en marcos que la estructuran y permiten al cliente comprender la lógica detrás de las conclusiones.",
    "Este módulo instala cuatro bases mínimas. La profundización ocurre en módulos avanzados.",
  ],
  whyFrames: {
    heading: "Por qué trabajar con marcos explícitos",
    intro: "Tres razones operativas, no filosóficas:",
    bullets: [
      "Trazabilidad: si el criterio es explícito, es auditable. El cliente sabe por qué THO llegó a esa conclusión y puede cuestionarla con información.",
      "Protección institucional: un diagnóstico sin marco conceptual claro es una opinión. Una opinión impugnada deja a THO sin respaldo.",
      "Calidad del análisis: los marcos fuerzan a considerar variables que la intuición omite. Reducen el sesgo de confirmación.",
    ],
    closing: "Operar sin marco no es más flexible; es más frágil.",
  },
  frameworks: [
    {
      id: "cambio",
      name: "Gestión del cambio",
      coreIdea:
        "Las organizaciones no cambian solo porque alguien escribe una estrategia nueva. Cambian cuando evolucionan los incentivos, las prácticas cotidianas y las narrativas que dan sentido al trabajo.",
      thoApplication:
        "En asesoría THO: antes de proponer un cambio, identificar qué incentivos sostienen el estado actual. Si los incentivos no se modifican, el cambio se implementa superficialmente y revierte.",
      keyRisk:
        "Riesgo frecuente: proponer cambio estructural sin diagnóstico de resistencias. El resultado es un documento bien escrito que nadie implementa.",
    },
    {
      id: "comunitario",
      name: "Relacionamiento comunitario",
      coreIdea:
        "Toda organización opera dentro de una red de actores territoriales: comunidades, vecinos, autoridades locales, organizaciones civiles. Ignorar esa red incrementa el conflicto y compromete la viabilidad de proyectos.",
      thoApplication:
        "En asesoría THO: mapear actores territoriales antes de diseñar intervenciones que tengan impacto externo. La legitimidad social de un proyecto no se gestiona al final; se construye desde el inicio.",
      keyRisk:
        "Riesgo frecuente: omitir actores críticos porque 'no son parte formal del proyecto'. Los conflictos territoriales más costosos emergen de actores que no se mapearon.",
    },
    {
      id: "materialidad",
      name: "Doble materialidad",
      coreIdea:
        "Las decisiones empresariales impactan el entorno (materialidad de impacto), y el entorno impacta la empresa (materialidad financiera). Ambas direcciones importan y deben analizarse simultáneamente.",
      thoApplication:
        "En asesoría THO: al evaluar una decisión estratégica, preguntar no solo qué le conviene a la organización, sino qué efectos genera sobre su entorno y cómo esos efectos pueden retornar como riesgo o reputación.",
      keyRisk:
        "Riesgo frecuente: analizar solo la lógica interna de la decisión y descubrir tardíamente que genera externalidades que afectan la operación.",
    },
    {
      id: "poder",
      name: "Teoría de actores y poder",
      coreIdea:
        "Toda decisión distribuye efectos: favorece a algunos actores y perjudica a otros. El poder nunca es neutro. Analizar quién gana, quién pierde y qué capacidad tiene cada actor para incidir en el resultado es condición básica del diagnóstico.",
      thoApplication:
        "En asesoría THO: el mapa de poder precede al diseño de soluciones. Una recomendación que ignora la distribución de poder real fracasa independientemente de su calidad técnica.",
      keyRisk:
        "Riesgo frecuente: diseñar intervenciones técnicamente correctas que un actor con poder de veto bloquea porque no fue considerado en el análisis.",
    },
  ],
  integrationNote: {
    label: "Nota de integración",
    statement: "Estos cuatro marcos no operan en compartimentos separados; se superponen y se informan mutuamente en el diagnóstico real.",
    body: [
      "Un proceso de cambio organizacional activa resistencias (gestión del cambio), afecta actores internos y externos (teoría de poder), genera impactos en la comunidad (relacionamiento comunitario) y tiene consecuencias bidireccionales con el entorno (doble materialidad).",
      "La competencia del asesor está en saber cuál marco es más relevante en cada momento del análisis, no en aplicarlos todos mecánicamente.",
    ],
  },
  synthesis: [
    "Marcos explícitos = criterio auditable, protección institucional, análisis más robusto.",
    "Gestión del cambio: los incentivos sostienen el estado actual. Cambio estructural sin diagnóstico de resistencias falla.",
    "Relacionamiento comunitario: los actores no mapeados generan los conflictos más costosos.",
    "Doble materialidad: las decisiones tienen dos caras; el entorno impacta la empresa y la empresa impacta el entorno.",
    "Teoría de poder: sin mapa de poder, la mejor recomendación técnica puede ser bloqueada.",
  ],
};

// ─── D3 · Estructura de una intervención ─────────────────────────────────

export type InterventionStructureLesson = {
  label: string;
  title: string;
  premise: string[];
  phases: Array<{
    number: string;
    name: string;
    description: string;
    keyQuestion: string;
    commonError: string;
  }>;
  structureRule: AdvisoryRuleCallout;
  synthesis: string[];
};

export const interventionStructureLessonD3: InterventionStructureLesson = {
  label: "LECCIÓN D3 · Estructura de una intervención",
  title: "Seis fases para intervenir con método",
  premise: [
    "Una intervención de asesoría en THO no improvisa su estructura: sigue una secuencia lógica que permite trazar el razonamiento desde el problema hasta la recomendación.",
    "La secuencia no es rígida —el trabajo real requiere iterar— pero cada fase tiene un propósito específico y produce un insumo para la siguiente.",
    "Saltarse fases no acelera el trabajo; acumula riesgos que aparecen más tarde, cuando el costo de corregir es mayor.",
  ],
  phases: [
    {
      number: "01",
      name: "Delimitación del problema",
      description:
        "Establecer con precisión qué problema se va a trabajar: cuáles son sus límites, qué está dentro y qué está fuera del alcance de la intervención.",
      keyQuestion: "¿Cuál es exactamente el problema que THO va a abordar, y qué no va a abordar?",
      commonError:
        "Iniciar el diagnóstico sin haber delimitado: el análisis se expande sin control y la recomendación final es demasiado genérica para ser útil.",
    },
    {
      number: "02",
      name: "Diagnóstico interpretativo",
      description:
        "Recopilar evidencia y analizarla con los marcos conceptuales disponibles. El diagnóstico no es una descripción de hechos; es una interpretación estructurada que produce hipótesis sobre las causas y dinámicas del problema.",
      keyQuestion: "¿Por qué existe este problema? ¿Qué lo sostiene y qué lo agrava?",
      commonError:
        "Acumular información sin interpretarla. Un diagnóstico descriptivo deja al cliente con más datos pero sin mayor claridad.",
    },
    {
      number: "03",
      name: "Identificación de riesgos",
      description:
        "Mapear los riesgos asociados al problema y a las posibles respuestas: riesgos reputacionales, operativos, relacionales, territoriales.",
      keyQuestion: "¿Qué puede salir mal? ¿Qué actores o dinámicas pueden complicar la intervención?",
      commonError:
        "Omitir riesgos porque generan incomodidad o porque el cliente no quiere escucharlos. La omisión no elimina el riesgo; solo lo hace invisible hasta que ocurre.",
    },
    {
      number: "04",
      name: "Diseño de alternativas",
      description:
        "Proponer dos o más cursos de acción con sus supuestos, ventajas y limitaciones explícitos. Las alternativas permiten que el cliente decida con información, no que THO decida por él.",
      keyQuestion: "¿Cuáles son las opciones reales disponibles y qué implica cada una?",
      commonError:
        "Presentar una sola alternativa 'óptima'. Esto desplaza la decisión de quien debe tomarla y expone a THO si la implementación no funciona.",
    },
    {
      number: "05",
      name: "Toma de decisión",
      description:
        "La decisión corresponde al cliente, con la información estructurada que THO ha provisto. THO puede acompañar el proceso deliberativo pero no reemplazar al decisor.",
      keyQuestion: "¿Quién decide, con qué información y en qué plazo?",
      commonError:
        "Asumir que la recomendación de THO es la decisión. El cliente puede no implementarla, modificarla o rechazarla: ese es su rol. El de THO es mejorar la calidad de esa decisión.",
    },
    {
      number: "06",
      name: "Acompañamiento (cuando corresponde)",
      description:
        "En algunos casos, THO acompaña la implementación: monitorea, ajusta y registra aprendizajes. Este rol debe estar pactado explícitamente; no surge por defecto.",
      keyQuestion: "¿THO acompaña la implementación? Si es así, ¿con qué alcance y bajo qué condiciones?",
      commonError:
        "Asumir rol de acompañamiento sin contrato o acuerdo explícito. Genera expectativas no gestionadas y trabajo no remunerado.",
    },
  ],
  structureRule: {
    label: "Regla de secuencia",
    statement: "No se diagnostica sin haber delimitado. No se diseña sin haber diagnosticado. No se recomienda sin haber identificado riesgos.",
    body: [
      "La secuencia protege la calidad del trabajo y la posición de THO frente al cliente.",
      "Cuando el cliente presiona para acelerar fases, la respuesta de THO es explicitar el riesgo de hacerlo, no ceder en silencio.",
    ],
  },
  synthesis: [
    "Seis fases: delimitación → diagnóstico → riesgos → alternativas → decisión → acompañamiento.",
    "Cada fase produce un insumo para la siguiente; saltarlas acumula riesgo.",
    "La decisión final siempre corresponde al cliente. El rol de THO es mejorar la calidad de esa decisión.",
  ],
};

// ─── D4 · Diagnóstico interpretativo ─────────────────────────────────────

export type DiagnosisLesson = {
  label: string;
  title: string;
  premise: string[];
  notAccumulation: AdvisoryRuleCallout;
  tools: AdvisoryBulletBlock;
  interpretiveCriteria: AdvisoryBulletBlock;
  diagnosisOutput: {
    heading: string;
    intro: string;
    elements: Array<{ name: string; description: string }>;
  };
  synthesis: string[];
};

export const diagnosisLessonD4: DiagnosisLesson = {
  label: "LECCIÓN D4 · Diagnóstico interpretativo",
  title: "Interpretar con criterio, no acumular información",
  premise: [
    "El diagnóstico es la fase más crítica de la intervención: define qué problema se está resolviendo realmente.",
    "Un diagnóstico deficiente produce recomendaciones que resuelven el síntoma pero no la causa, o que atacan la causa equivocada.",
    "El error más frecuente no es falta de información; es exceso de descripción sin interpretación.",
  ],
  notAccumulation: {
    label: "Distinción central",
    statement: "Diagnóstico ≠ acumulación de información. Diagnóstico = interpretación estructurada que produce hipótesis sobre causas y dinámicas.",
    body: [
      "Un diagnóstico descriptivo dice: 'el equipo tiene alta rotación, baja satisfacción y conflictos frecuentes'.",
      "Un diagnóstico interpretativo dice: 'la rotación y los conflictos son síntomas de un sistema de incentivos que premia el resultado individual sobre la colaboración, agravado por ausencia de criterio claro para escalar decisiones'.",
      "La diferencia define si el cliente puede actuar sobre las causas o solo gestionar los síntomas.",
    ],
  },
  tools: {
    heading: "Herramientas disponibles para el diagnóstico",
    intro: "El diagnóstico puede incluir una o varias de estas herramientas según el contexto:",
    bullets: [
      "Entrevistas semiestructuradas: conversaciones con actores clave para capturar perspectivas, tensiones y narrativas no documentadas.",
      "Revisión documental: análisis de registros, actas, informes, contratos y documentos internos para verificar coherencia entre lo declarado y lo operado.",
      "Análisis de gobernanza: evaluación de cómo se toman las decisiones, quién participa, qué criterios se usan y dónde hay vacíos o bloqueos.",
      "Análisis territorial: mapeo del entorno de actores externos relevantes para la organización (comunidades, autoridades, competidores, aliados).",
      "Identificación de tensiones internas: reconocimiento de conflictos entre áreas, roles o liderazgos que afectan la capacidad organizacional.",
    ],
    closing: "La selección de herramientas depende del problema delimitado, no de las preferencias metodológicas del asesor.",
  },
  interpretiveCriteria: {
    heading: "Criterios para una interpretación sólida",
    intro: "Una hipótesis diagnóstica de calidad cumple cuatro condiciones:",
    bullets: [
      "Está anclada en evidencia: no es especulación; se sostiene en datos observados o declaraciones registradas.",
      "Usa marcos explícitos: la lógica interpretativa es visible (gestión del cambio, poder, materialidad, etc.).",
      "Distingue causa de síntoma: no toma la manifestación visible por el problema de fondo.",
      "Es falseable: puede cuestionarse con nueva evidencia. Si no puede cuestionarse, no es hipótesis; es sesgo presentado como análisis.",
    ],
    closing: "Un diagnóstico que el cliente no puede cuestionar es un diagnóstico que el cliente no puede usar.",
  },
  diagnosisOutput: {
    heading: "Qué debe producir un diagnóstico",
    intro: "Al finalizar la fase diagnóstica, THO debe tener:",
    elements: [
      {
        name: "Hipótesis principal",
        description: "Una interpretación clara sobre cuál es el problema real y qué lo sostiene.",
      },
      {
        name: "Evidencia de respaldo",
        description: "Los datos, citas o documentos que fundamentan la hipótesis.",
      },
      {
        name: "Tensiones identificadas",
        description: "Los conflictos o contradicciones en el sistema que el cliente debe conocer.",
      },
      {
        name: "Actores críticos",
        description: "Quiénes tienen poder de bloqueo o de impulso sobre cualquier intervención futura.",
      },
      {
        name: "Incertidumbres explícitas",
        description: "Qué no se pudo diagnosticar por falta de acceso a información o tiempo.",
      },
    ],
  },
  synthesis: [
    "Diagnóstico = interpretación estructurada, no acumulación de datos.",
    "La hipótesis sobre causas es el producto central del diagnóstico.",
    "Buena evidencia + marcos explícitos + distinción causa/síntoma = diagnóstico útil.",
  ],
};

// ─── D5 · Diseño estratégico ──────────────────────────────────────────────

export type StrategicDesignLesson = {
  label: string;
  title: string;
  premise: string[];
  coreDistinction: AdvisoryRuleCallout;
  designPrinciples: AdvisoryBulletBlock;
  alternativesStructure: {
    heading: string;
    intro: string;
    components: Array<{ name: string; description: string }>;
  };
  riskLayer: AdvisoryBulletBlock;
  synthesis: string[];
};

export const strategicDesignLessonD5: StrategicDesignLesson = {
  label: "LECCIÓN D5 · Diseño estratégico",
  title: "Hacer visible la incertidumbre, no eliminarla",
  premise: [
    "El diseño estratégico es la fase donde THO estructura las alternativas de respuesta al problema diagnosticado.",
    "Su propósito no es eliminar la incertidumbre del cliente ni entregar 'la solución'; es organizar la información para que el cliente pueda decidir con mejor criterio.",
    "Un buen diseño estratégico no hace que la decisión sea obvia; hace que sus implicaciones sean claras.",
  ],
  coreDistinction: {
    label: "Distinción central",
    statement: "THO no decide por el cliente. THO estructura las condiciones para que el cliente decida mejor.",
    body: [
      "Esta distinción protege a THO: si el cliente modifica la recomendación o elige una alternativa distinta, es su derecho. La responsabilidad de THO está en la calidad del análisis, no en el resultado de la implementación.",
      "Cuando THO presenta solo una alternativa 'óptima', está tomando la decisión por el cliente y asumiendo la responsabilidad de sus consecuencias.",
    ],
  },
  designPrinciples: {
    heading: "Principios del diseño estratégico en THO",
    intro: "Cinco principios que guían la elaboración de alternativas:",
    bullets: [
      "Supuestos explícitos: cada alternativa descansa sobre supuestos. Nombrarlos permite al cliente validarlos o cuestionarlos antes de decidir.",
      "Escenarios con consecuencias: no basta con describir qué haría cada alternativa; hay que proyectar qué pasaría si se implementa cada una.",
      "Riesgos secundarios: toda intervención genera efectos no buscados. El diseño debe anticiparlos, no descubrirlos durante la implementación.",
      "Viabilidad real: las alternativas deben ser implementables con los recursos, capacidades y cultura del cliente. Una solución técnicamente correcta pero organizacionalmente inviable no es útil.",
      "Claridad de decisión: el cliente debe poder leer el documento y saber exactamente qué está eligiendo cuando selecciona cada alternativa.",
    ],
    closing: "Un diseño que solo el asesor entiende es un diseño que solo sirve al asesor.",
  },
  alternativesStructure: {
    heading: "Estructura de cada alternativa",
    intro: "Cada alternativa presentada debe incluir cinco elementos:",
    components: [
      {
        name: "Descripción",
        description: "Qué implica esta alternativa: qué se hace, qué no se hace, en qué plazo.",
      },
      {
        name: "Supuestos",
        description: "Qué debe ser verdad para que esta alternativa funcione.",
      },
      {
        name: "Ventajas",
        description: "Qué resuelve bien esta alternativa y bajo qué condiciones es superior a las otras.",
      },
      {
        name: "Limitaciones",
        description: "Qué no resuelve, qué sacrifica o qué exige al cliente.",
      },
      {
        name: "Riesgos asociados",
        description: "Qué puede fallar y qué consecuencias tendría.",
      },
    ],
  },
  riskLayer: {
    heading: "La capa de riesgo en el diseño",
    intro: "Evaluar riesgos secundarios no es ser pesimista; es ser completo:",
    bullets: [
      "Riesgo de implementación: ¿tiene el cliente la capacidad operativa para ejecutar esto?",
      "Riesgo de resistencia: ¿qué actores internos o externos pueden bloquear la implementación?",
      "Riesgo reputacional: ¿cómo se verá esta decisión desde afuera de la organización?",
      "Riesgo de efecto secundario: ¿qué otros sistemas de la organización se verán afectados?",
    ],
    closing: "Presentar riesgos no debilita la recomendación; la hace creíble.",
  },
  synthesis: [
    "El diseño estratégico estructura alternativas, no impone soluciones.",
    "Supuestos explícitos + escenarios + riesgos secundarios = diseño completo.",
    "La calidad del diseño se mide por la calidad de la decisión que habilita, no por la elegancia del documento.",
  ],
};

// ─── D6 · Estándar mínimo de entregables (DoD en asesorías) ───────────────

export type DodAdvisoryLesson = {
  label: string;
  title: string;
  premise: string[];
  dodElements: Array<{
    number: string;
    name: string;
    description: string;
    failureExample: string;
  }>;
  dodRule: AdvisoryRuleCallout;
  synthesis: string[];
};

export const dodAdvisoryLessonD6: DodAdvisoryLesson = {
  label: "LECCIÓN D6 · Estándar mínimo de entregables",
  title: "Definición de Hecho en asesorías",
  premise: [
    "Todo entregable de asesoría en THO cumple un estándar mínimo antes de salir al cliente.",
    "Este estándar no es una lista de verificación burocrática; es la garantía de que el trabajo realmente habilita una decisión mejor.",
    "Un entregable que no cumple el estándar puede parecer completo y no serlo. La diferencia está en si el cliente puede usar lo que recibió.",
  ],
  dodElements: [
    {
      number: "01",
      name: "Contexto",
      description: "El entregable sitúa al lector: cuál es el problema abordado, desde qué encuadre y con qué alcance.",
      failureExample: "El cliente recibe un análisis sin saber exactamente qué pregunta está respondiendo.",
    },
    {
      number: "02",
      name: "Evidencia o hipótesis explícita",
      description: "Cada conclusión se apoya en datos observados o en hipótesis declaradas como tales. No hay afirmaciones presentadas como hechos sin respaldo.",
      failureExample: "El informe dice 'el equipo tiene baja moral' sin indicar en qué se basa esa afirmación.",
    },
    {
      number: "03",
      name: "Análisis estructurado",
      description: "El razonamiento sigue una lógica visible: de la evidencia a la interpretación, de la interpretación a la conclusión. El cliente puede seguir el hilo.",
      failureExample: "El documento tiene secciones pero no conecta cómo los datos llevan a las conclusiones.",
    },
    {
      number: "04",
      name: "Decisión o recomendación concreta",
      description: "El entregable termina en algo accionable: una recomendación clara, una decisión solicitada o una pregunta que el cliente debe responder.",
      failureExample: "El informe describe el problema con profundidad pero no dice qué hacer con esa información.",
    },
    {
      number: "05",
      name: "Riesgos asociados",
      description: "Las implicaciones negativas posibles están nombradas. El cliente sabe qué puede salir mal.",
      failureExample: "La recomendación se presenta sin mencionar sus limitaciones o escenarios de falla.",
    },
    {
      number: "06",
      name: "Próximos pasos con responsable y plazo",
      description: "El entregable especifica qué sigue, quién lo hace y en qué plazo. Sin esto, el trabajo termina en el documento.",
      failureExample: "El informe concluye con 'se recomienda avanzar' sin indicar quién, cómo ni cuándo.",
    },
  ],
  dodRule: {
    label: "Regla del DoD en asesorías",
    statement: "Un entregable que no cumple los seis elementos no está terminado. Puede estar avanzado; no está listo.",
    body: [
      "El estándar aplica independientemente del tamaño del entregable: una nota de una página y un informe de cuarenta deben cumplir el mismo DoD.",
      "La excepción son entregables internos de proceso (borradores, notas de trabajo), que están explícitamente marcados como tales.",
    ],
  },
  synthesis: [
    "DoD en asesorías: contexto + evidencia/hipótesis + análisis + recomendación + riesgos + próximos pasos.",
    "Un entregable sin estos seis elementos no habilita una decisión; solo informa parcialmente.",
    "El estándar aplica a todos los entregables que salen al cliente, independientemente del tamaño.",
  ],
};

// ─── D7 · Documentación y trazabilidad ───────────────────────────────────

export type TraceabilityLesson = {
  label: string;
  title: string;
  premise: string[];
  whyDocument: AdvisoryBulletBlock;
  whatToDocument: AdvisoryBulletBlock;
  traceabilityRule: AdvisoryRuleCallout;
  notABurden: AdvisoryBulletBlock;
  synthesis: string[];
};

export const traceabilityLessonD7: TraceabilityLesson = {
  label: "LECCIÓN D7 · Documentación y trazabilidad",
  title: "El registro como protección y continuidad",
  premise: [
    "En asesoría, toda decisión relevante debe registrarse de forma que pueda reconstruirse: qué se decidió, por qué y con qué información disponible en ese momento.",
    "La trazabilidad no es burocracia: es la infraestructura que permite a THO defender su criterio, proteger al cliente y asegurar continuidad cuando el equipo cambia.",
    "Un trabajo sin trazabilidad es un trabajo que no puede revisarse, aprenderse ni transferirse.",
  ],
  whyDocument: {
    heading: "Por qué documentar en asesorías",
    intro: "Cuatro razones con consecuencias distintas:",
    bullets: [
      "Protección frente a conflictos: cuando el cliente cuestiona una recomendación o sus consecuencias, el registro permite mostrar cuál fue el criterio usado y qué información estaba disponible.",
      "Continuidad operativa: si el equipo cambia, la persona que retoma el trabajo puede reconstruir el estado del proyecto sin depender de la memoria del anterior.",
      "Aprendizaje institucional: los registros acumulados permiten a THO identificar patrones, errores recurrentes y buenas prácticas entre distintos proyectos.",
      "Calidad del análisis en tiempo real: el acto de documentar obliga a explicitar el razonamiento. Lo que no puede escribirse con claridad, generalmente no está suficientemente pensado.",
    ],
    closing: "Documentar bien es pensar bien.",
  },
  whatToDocument: {
    heading: "Qué debe registrarse en una asesoría",
    intro: "No todo requiere el mismo nivel de detalle. Estos elementos son obligatorios:",
    bullets: [
      "Decisiones relevantes: toda decisión que afecte el curso del proyecto, la relación con el cliente o el alcance del trabajo.",
      "Criterio de la decisión: por qué se tomó esa decisión y no otra, con qué información.",
      "Cambios de alcance: toda modificación al alcance original, con la fecha y el acuerdo que la respalda.",
      "Riesgos identificados: los riesgos nombrados durante el proceso, aunque no se hayan materializado.",
      "Acuerdos con el cliente: lo que se comprometió en reuniones, incluyendo lo que no quedó en documentos formales.",
    ],
    closing: "Si un acuerdo no quedó registrado, en caso de conflicto no existió.",
  },
  traceabilityRule: {
    label: "Estándar de trazabilidad THO",
    statement: "Cualquier persona del equipo THO debe poder reconstruir el estado de un proyecto sin intervención de quien lo inició.",
    body: [
      "Esto implica que los registros son comprensibles para alguien que no estuvo presente.",
      "Las abreviaciones, referencias implícitas y notas personales que solo el autor entiende no cumplen el estándar.",
    ],
  },
  notABurden: {
    heading: "La documentación no es un paso adicional",
    intro: "Tres malentendidos frecuentes sobre el registro:",
    bullets: [
      "No es para el cliente: es para THO. El cliente puede no ver muchos de estos registros, pero THO los necesita para operar con continuidad.",
      "No es al final: se registra en tiempo real. Un registro hecho tres semanas después de la decisión pierde contexto y precisión.",
      "No requiere formalidad absoluta: la profundidad del registro se calibra según la relevancia de la decisión, no según un formato único.",
    ],
    closing: "El registro mínimo es: qué se decidió, por qué, quién y cuándo. Todo lo demás es valor agregado.",
  },
  synthesis: [
    "Trazabilidad = protección ante conflictos + continuidad operativa + aprendizaje institucional.",
    "Registrar en tiempo real, no al final. Lo que no se puede escribir con claridad, no está suficientemente pensado.",
    "Estándar: cualquier persona del equipo puede retomar el proyecto sin intervención de quien lo inició.",
  ],
};

// ─── D8 · Ética en asesorías ──────────────────────────────────────────────

export type EthicsAdvisoryLesson = {
  label: string;
  title: string;
  premise: string[];
  threeNos: Array<{
    prohibition: string;
    description: string;
    consequence: string;
  }>;
  legitimacyRule: AdvisoryRuleCallout;
  obligatoryDecline: AdvisoryBulletBlock;
  synthesis: string[];
};

export const ethicsAdvisoryLessonD8: EthicsAdvisoryLesson = {
  label: "LECCIÓN D8 · Ética en asesorías",
  title: "La legitimidad de THO se sostiene en la claridad",
  premise: [
    "La ética en asesoría no es un capítulo aparte del trabajo; es la condición que hace que el trabajo tenga valor.",
    "Un diagnóstico que exagera, omite o se ajusta para ser políticamente cómodo no protege al cliente; lo perjudica al ocultar información que necesita para decidir bien.",
    "THO construye reputación mediante la claridad de sus análisis, no mediante la comodidad de sus conclusiones.",
  ],
  threeNos: [
    {
      prohibition: "No exagerar conclusiones",
      description:
        "Las conclusiones deben estar respaldadas por la evidencia disponible. Amplificar hallazgos para que el diagnóstico parezca más impresionante o urgente distorsiona la realidad y lleva al cliente a decisiones basadas en información falsa.",
      consequence:
        "Cuando la realidad no confirma el diagnóstico exagerado, la credibilidad de THO colapsa. Y el cliente enfrenta las consecuencias de haber actuado sobre información incorrecta.",
    },
    {
      prohibition: "No omitir riesgos para agradar",
      description:
        "Si el análisis identifica riesgos que el cliente no quiere escuchar, se nombran. La omisión puede sentirse como protección al cliente en el corto plazo; en el largo plazo es traición a su capacidad de decidir informadamente.",
      consequence:
        "Un riesgo omitido que luego se materializa deja a THO sin respaldo y al cliente sin la posibilidad de haber actuado a tiempo.",
    },
    {
      prohibition: "No ajustar el diagnóstico para que sea políticamente cómodo",
      description:
        "Las conclusiones no se modifican para evitar incomodar a actores con poder dentro de la organización cliente. Un diagnóstico ajustado a las preferencias del interlocutor no analiza la realidad; la refleja con distorsión.",
      consequence:
        "Si THO ajusta el diagnóstico a la narrativa que el cliente prefiere, deja de ser un asesor independiente y se convierte en un validador de lo que ya se quería creer.",
    },
  ],
  legitimacyRule: {
    label: "Fundamento de la legitimidad THO",
    statement: "La independencia de criterio es el activo central de THO. Si se pierde, lo que queda no tiene valor diferencial.",
    body: [
      "Los clientes contratan a THO porque esperan un análisis que no podrían hacer solos, precisamente porque no está condicionado por las dinámicas internas de su organización.",
      "Cuando THO condiciona sus conclusiones a las preferencias del cliente, destruye exactamente lo que lo hace valioso.",
    ],
  },
  obligatoryDecline: {
    heading: "Condiciones que obligan a declinar o pausar",
    intro: "Hay situaciones donde continuar el trabajo comprometería la ética de THO:",
    bullets: [
      "El cliente solicita explícitamente que se omitan riesgos relevantes del informe final.",
      "El alcance de la asesoría implica legitimar una narrativa que THO sabe que es engañosa.",
      "Existe un conflicto de interés no declarado que afecta la independencia del análisis.",
      "El cliente presiona para que las conclusiones reflejen sus preferencias, independientemente de la evidencia.",
    ],
    closing: "En estas situaciones, la respuesta de THO es explicitarlo, no ceder. Si no es posible continuar con integridad, declinar es la decisión correcta.",
  },
  synthesis: [
    "Tres prohibiciones: no exagerar, no omitir riesgos para agradar, no ajustar el diagnóstico por comodidad política.",
    "La independencia de criterio es el activo central de THO. Sin ella, el trabajo pierde su valor diferencial.",
    "Cuando continuar comprometería la ética, declinar es la decisión profesionalmente correcta.",
  ],
};

// ─── D9 · Formación avanzada ──────────────────────────────────────────────

export type AdvancedFormationLesson = {
  label: string;
  title: string;
  premise: string[];
  tracks: Array<{
    name: string;
    description: string;
    whyItMatters: string;
  }>;
  formationNote: AdvisoryRuleCallout;
  synthesis: string[];
};

export const advancedFormationLessonD9: AdvancedFormationLesson = {
  label: "LECCIÓN D9 · Formación avanzada",
  title: "Profundizaciones que vienen después de este módulo",
  premise: [
    "Este módulo instala los fundamentos conceptuales y operativos para asesorar desde THO.",
    "La profundización real ocurre en módulos posteriores, donde cada marco se trabaja con mayor detalle, casos prácticos y herramientas específicas.",
    "Esta lección mapea esas profundizaciones para que sepas qué sigue y por qué cada una importa.",
  ],
  tracks: [
    {
      name: "Gestión del cambio organizacional",
      description:
        "Modelos de cambio (Kotter, ADKAR, teoría de sistemas), gestión de resistencias, comunicación del cambio, diseño de transición y métricas de adopción.",
      whyItMatters:
        "La mayoría de las intervenciones de asesoría THO implican alguna forma de cambio. Sin este marco profundizado, las recomendaciones de cambio quedan en el nivel declarativo.",
    },
    {
      name: "Doble materialidad aplicada",
      description:
        "Metodologías de análisis de impacto (GRI, ESRS), identificación de temas materiales, construcción de matrices de materialidad y comunicación de resultados a grupos de interés.",
      whyItMatters:
        "Cada vez más clientes operan bajo exigencias de reporte de sostenibilidad. THO necesita capacidad técnica para acompañarlos en este proceso.",
    },
    {
      name: "Relacionamiento comunitario avanzado",
      description:
        "Mapeo de actores, metodologías de diálogo (IAP2, consulta previa), gestión de conflictos territoriales y diseño de procesos participativos.",
      whyItMatters:
        "Los conflictos territoriales son fuente recurrente de crisis para empresas. Un equipo THO con capacidad en esta área puede acompañar en situaciones de alta complejidad y exposición.",
    },
    {
      name: "Análisis organizacional",
      description:
        "Diagnóstico de cultura organizacional, análisis de gobernanza, estructuras de poder formal e informal, evaluación de capacidades institucionales.",
      whyItMatters:
        "La calidad del diagnóstico depende directamente de la capacidad de analizar organizaciones. Este módulo profundiza las herramientas para hacerlo con rigor.",
    },
    {
      name: "Metodologías participativas",
      description:
        "Facilitación de procesos grupales, diseño de talleres, co-construcción de soluciones, gestión de dinámicas de grupo en contextos complejos.",
      whyItMatters:
        "Muchas intervenciones de asesoría requieren involucrar a múltiples actores en el proceso. La facilitación profesional mejora la calidad de las decisiones colectivas.",
    },
  ],
  formationNote: {
    label: "Cómo funciona la formación avanzada en THO",
    statement: "Los módulos avanzados se activan según el perfil del proyecto y el rol del integrante dentro de THO.",
    body: [
      "No todos los integrantes necesitan profundizar en todos los tracks: la especialización depende de las áreas de trabajo asignadas.",
      "La base instalada en este módulo es requisito previo para acceder a cualquier profundización.",
      "El ritmo y el orden de profundización se coordinan con el director.",
    ],
  },
  synthesis: [
    "Cinco tracks de profundización: gestión del cambio, doble materialidad, relacionamiento comunitario, análisis organizacional, metodologías participativas.",
    "Este módulo es el requisito previo; la profundización ocurre según rol y tipo de proyectos asignados.",
    "La formación es gradual y acumulativa: cada módulo avanzado construye sobre la base instalada aquí.",
  ],
};

// ─── D10 · Señales de alerta en asesoría ─────────────────────────────────

export type AlertSignsLesson = {
  label: string;
  title: string;
  premise: string[];
  alerts: Array<{
    signal: string;
    description: string;
    correctResponse: string;
  }>;
  alertRule: AdvisoryRuleCallout;
  synthesis: string[];
};

export const alertSignsLessonD10: AlertSignsLesson = {
  label: "LECCIÓN D10 · Señales de alerta en asesoría",
  title: "Indicadores de riesgo metodológico",
  premise: [
    "En el curso de una asesoría, hay señales que indican que el trabajo está deslizándose hacia territorio de riesgo metodológico.",
    "Reconocerlas a tiempo permite corregir antes de que el daño —a la calidad del trabajo o a la relación con el cliente— sea mayor.",
    "Ignorarlas, o racionalizarlas como 'parte del proceso', es el origen de la mayoría de los problemas graves en asesoría.",
  ],
  alerts: [
    {
      signal: "Cambios abruptos de alcance sin decisión explícita",
      description:
        "El proyecto empieza a incluir temas, entregables o reuniones que no estaban en el acuerdo original, sin que nadie haya decidido explícitamente ampliar el alcance.",
      correctResponse:
        "Pausar y explicitar: 'Esto que estás pidiendo está fuera del alcance original. ¿Lo incorporamos con un acuerdo formal, o mantenemos el foco en lo acordado?' No continuar en silencio.",
    },
    {
      signal: "Recomendaciones sin evidencia mínima",
      description:
        "El equipo o el cliente comienza a operar sobre suposiciones presentadas como hechos, o a proponer soluciones antes de completar el diagnóstico.",
      correctResponse:
        "Nombrar la ausencia de evidencia: 'Esta recomendación está basada en una hipótesis, no en evidencia verificada. ¿Qué necesitamos para verificarla antes de actuar?'",
    },
    {
      signal: "Omisión de actores críticos",
      description:
        "El análisis o el proceso de intervención excluye actores que tienen poder de bloqueo, veto o impacto significativo sobre el problema, generalmente porque incluirlos es incómodo.",
      correctResponse:
        "Mapear actores explícitamente y señalar la exclusión: 'No hemos considerado a [actor]. Si no los incluimos en el análisis, corremos el riesgo de [consecuencia específica].'",
    },
    {
      signal: "Presión para 'llegar a la solución rápido'",
      description:
        "El cliente o el contexto presionan para saltarse fases del proceso —especialmente diagnóstico o identificación de riesgos— para llegar más rápido a la recomendación.",
      correctResponse:
        "Explicitar el riesgo de acelerar sin fundamento: 'Podemos acelerar, pero esto significa que la recomendación se basará en hipótesis no verificadas. ¿El cliente asume ese riesgo explícitamente?'",
    },
    {
      signal: "El diagnóstico confirma exactamente lo que el cliente esperaba",
      description:
        "Cuando el diagnóstico no produce ninguna sorpresa para el cliente, puede indicar que el análisis estuvo condicionado por las expectativas del interlocutor en lugar de seguir la evidencia.",
      correctResponse:
        "Revisar el proceso: '¿Qué información consideramos? ¿Hablamos con actores que podrían tener perspectivas distintas? ¿Qué hipótesis descartamos y por qué?' Un buen diagnóstico casi siempre produce alguna información que el cliente no tenía.",
    },
  ],
  alertRule: {
    label: "Principio de alerta temprana",
    statement: "Una señal de alerta ignorada no desaparece: se acumula y aparece más tarde, cuando el costo de corregir es mayor.",
    body: [
      "La incomodidad de nombrar una señal de alerta en el momento es casi siempre menor que el costo de enfrentar sus consecuencias cuando ya escaló.",
      "Parte de la profesionalidad en THO es la capacidad de nombrar lo incómodo con claridad y sin dramatismo.",
    ],
  },
  synthesis: [
    "Cinco señales: cambio de alcance sin acuerdo, recomendaciones sin evidencia, omisión de actores, presión por velocidad, diagnóstico sin sorpresas.",
    "Reconocer a tiempo permite corregir. Ignorar acumula riesgo.",
    "Nombrar lo incómodo con claridad es parte del estándar profesional de THO.",
  ],
};

// ─── Cierre del módulo D ──────────────────────────────────────────────────

export type ClosingModuleDLesson = {
  label: string;
  title: string;
  premise: string[];
  coreIdea: AdvisoryRuleCallout;
  whatYouNowHave: AdvisoryBulletBlock;
  goingForward: AdvisoryBulletBlock;
  synthesis: string[];
};

export const closingModuleDLesson: ClosingModuleDLesson = {
  label: "CIERRE · Módulo D",
  title: "Asesorar es mejorar decisiones, no producir documentos",
  premise: [
    "Este módulo instaló la base para trabajar asesorías en THO con método, marco conceptual y responsabilidad ética.",
    "La asesoría no se mide por el volumen de lo entregado, ni por la elegancia de los documentos, sino por la calidad de las decisiones que el cliente pudo tomar gracias al trabajo de THO.",
    "Eso requiere rigor en el diagnóstico, honestidad en el análisis, claridad en la comunicación y disposición a nombrar lo incómodo cuando es necesario.",
  ],
  coreIdea: {
    label: "La idea central del módulo",
    statement: "Intervenir sistemas complejos con método = diagnóstico riguroso + marcos explícitos + ética que no cede.",
    body: [
      "El método protege la calidad del trabajo.",
      "Los marcos explícitos hacen auditable el criterio.",
      "La ética mantiene la independencia que hace valioso el aporte de THO.",
    ],
  },
  whatYouNowHave: {
    heading: "Lo que tienes al completar este módulo",
    intro: "Al terminar el Módulo D, cuentas con:",
    bullets: [
      "Definición operativa de qué es asesorar y qué no es en el contexto de THO.",
      "Cuatro marcos conceptuales mínimos para fundamentar el análisis: gestión del cambio, relacionamiento comunitario, doble materialidad y teoría de actores/poder.",
      "La secuencia de seis fases de una intervención: desde la delimitación hasta el acompañamiento.",
      "Criterios para un diagnóstico interpretativo de calidad.",
      "Principios del diseño estratégico que habilita decisiones, no que las toma.",
      "Definición de Hecho para entregables de asesoría: seis elementos obligatorios.",
      "Estándar de trazabilidad y documentación.",
      "Tres prohibiciones éticas y criterios para declinar cuando corresponde.",
      "Mapa de formación avanzada para profundizar según rol y proyectos.",
      "Cinco señales de alerta que indican riesgo metodológico.",
    ],
  },
  goingForward: {
    heading: "Lo que sigue",
    intro: "Tres frentes de desarrollo a partir de aquí:",
    bullets: [
      "Aplicar el estándar DoD a todos los entregables de asesoría que produzcas, independientemente del tamaño.",
      "Registrar con trazabilidad desde el inicio de cada proyecto, no al final.",
      "Identificar qué tracks de formación avanzada son prioritarios según tu rol y los proyectos asignados.",
    ],
    closing: "La base está instalada. La profundización viene del trabajo real, aplicado con los marcos de este módulo.",
  },
  synthesis: [
    "Asesorar en THO = intervenir con método, marco y ética; no producir documentos.",
    "La calidad se mide por las decisiones que el cliente pudo tomar, no por el volumen entregado.",
    "Base instalada; profundización mediante formación avanzada y trabajo real.",
  ],
};
