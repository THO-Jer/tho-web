/**
 * Lecciones hand-crafted del Módulo C (Operación Creativa en THO).
 *
 * Lecciones editorializadas:
 *  - C1 (scrumAdaptationLessonC1): Marco metodológico — Scrum adaptado a THO.
 *  - C2 (docStructureLessonC2): Estructura documental en Teams.
 *  - C3 (annualExcelLessonC3): Excel anual como eje organizador.
 *  - C4 (kickoffLessonC4): Inicio — Kickoff.
 *  - C5 (productionReviewLessonC5): Producción y revisión.
 *  - C6 (dodCreativeLessonC6): Definición de Hecho (DoD) creativa.
 *  - C7 (closingLearningLessonC7): Cierre y aprendizaje.
 *  - C8 (sensitiveInfoLessonC8): Información sensible.
 *  - C9 (continuityCLessonC9): Estándar de continuidad.
 *
 * Módulo C completo en cobertura hand-crafted.
 */

// ─── Tipo compartido para secciones simples ────────────────────────────────

export type CreativeBulletBlock = {
  heading: string;
  intro?: string;
  bullets: string[];
  closing?: string;
};

export type CreativeRuleCallout = {
  label: string;
  statement: string;
  body?: string[];
};

// ─── C1 · Marco metodológico (Scrum adaptado) ─────────────────────────────

export type ScrumAdaptationLesson = {
  label: string;
  title: string;
  premise: string[];
  scrumPrinciples: CreativeBulletBlock;
  rolesTable: {
    heading: string;
    intro: string;
    rows: Array<{ role: string; function: string; thoEquivalent: string }>;
  };
  thoAdaptation: CreativeBulletBlock;
  kanbanRule: CreativeRuleCallout;
  translation: CreativeBulletBlock;
  synthesis: string[];
};

export const scrumAdaptationLessonC1: ScrumAdaptationLesson = {
  label: "LECCIÓN C1 · Marco metodológico",
  title: "Scrum adaptado a THO",
  premise: [
    "Scrum es un framework ágil que nació en desarrollo de software para organizar trabajo complejo en equipos pequeños.",
    "Su lógica central: ciclos cortos de trabajo, roles con funciones claras, revisión constante y transparencia sobre el estado del proyecto.",
    "En THO no aplicamos Scrum como ritual rígido. Lo adaptamos como sistema de principios para asegurar orden, visibilidad y control de riesgo operativo en proyectos creativos.",
    "La diferencia importa: aplicar el ritual sin el principio genera burocracia. Aplicar el principio sin estructura genera caos.",
  ],
  scrumPrinciples: {
    heading: "Principios que sí aplicamos",
    intro: "Estos cinco principios son operativos en THO, independientemente del tamaño del proyecto:",
    bullets: [
      "Ciclos cortos: el trabajo se organiza en entregas parciales verificables, no en bloques monolíticos.",
      "Roles definidos: cada persona sabe qué decide, qué ejecuta y qué facilita.",
      "Backlog visible: hay una lista de todo lo que hay que hacer, accesible para el equipo.",
      "Revisión constante: se itera sobre el trabajo, no se entrega todo al final.",
      "Transparencia: el estado del proyecto es visible para el equipo, no solo para quien lo lidera.",
    ],
    closing: "Un proyecto sin estos principios opera con opacidad. Y la opacidad acumula riesgo.",
  },
  rolesTable: {
    heading: "Roles de referencia y su lógica en THO",
    intro: "Scrum define tres roles. En THO los tres existen aunque aún no seamos suficientemente grandes para cumplir el marco completo. El PO y el SM son roles internos de THO — no del cliente:",
    rows: [
      {
        role: "Product Owner (PO)",
        function: "Consolida decisiones sobre qué producir. Administra el backlog y es el puente entre la contraparte del cliente y el equipo.",
        thoEquivalent: "Hoy: director de THO. Consolida feedback de la contraparte, aprueba dirección, protege al equipo. Nota: 'contraparte' es el contacto del cliente; el PO es siempre interno THO.",
      },
      {
        role: "Scrum Master (SM)",
        function: "Cuida el proceso, elimina obstáculos y protege al equipo de interrupciones externas.",
        thoEquivalent: "Hoy: también el director de THO. A medida que el equipo crece, esta función puede distribuirse.",
      },
      {
        role: "Equipo creativo",
        function: "Ejecución técnica autónoma dentro de las prioridades definidas.",
        thoEquivalent: "Diseño, audiovisual, contenidos — ejecutan dentro del brief y las prioridades del backlog.",
      },
    ],
  },
  thoAdaptation: {
    heading: "Por qué los roles se superponen hoy",
    intro: "Que PO y SM recaigan en una sola persona es una realidad de escala, no un error metodológico:",
    bullets: [
      "La lógica de los roles existe en el equipo aunque aún no se haya formalizado en personas distintas.",
      "A medida que THO crezca, estas responsabilidades se distribuirán de forma natural.",
      "Lo que no cambia con el tamaño: el equipo creativo ejecuta, alguien consolida el feedback del cliente y alguien cuida el proceso.",
    ],
    closing: "Objetivo: roles claros según las posibilidades del equipo actual, decisiones consolidadas, y Kanban visible.",
  },
  kanbanRule: {
    label: "Kanban en THO · Planner de Teams",
    statement: "El tablero Kanban vive en el Planner de Teams y tiene 3 depósitos fijos.",
    body: [
      "Backlog: todo lo que hay que hacer. No tiene jerarquía interna — está el trabajo disponible para planificar.",
      "Producción/Revisión: piezas activamente en trabajo o en proceso de revisión interna o con el cliente.",
      "Aprobado/Publicado: piezas cerradas. Una vez aquí, no se retrocede.",
      "El Planner permite adjuntar archivos, dejar notas y establecer subtareas directamente en cada tarjeta.",
    ],
  },
  translation: {
    heading: "Traducción operativa",
    intro: "Antes de iniciar cualquier proyecto creativo, verifica:",
    bullets: [
      "¿Está el backlog en el Planner con las piezas del período?",
      "¿El equipo sabe qué depósito corresponde al estado de cada tarea?",
      "¿Hay claridad sobre quién consolida el feedback del cliente?",
    ],
    closing: "Si el tablero no está activo, el proyecto opera sin visibilidad sobre qué está en curso.",
  },
  synthesis: [
    "Scrum en THO no es proceso rígido; es disciplina de visibilidad y roles.",
    "Backlog visible + Kanban en Planner + roles claros (aunque se superpongan hoy) = control operativo.",
    "Sin estructura explícita, la creatividad genera ambigüedad, no valor.",
  ],
};

// ─── C2 · Estructura documental en Teams ─────────────────────────────────

export type DocStructureLesson = {
  label: string;
  title: string;
  premise: string[];
  clientLevelRule: CreativeRuleCallout;
  folderTree: {
    heading: string;
    intro: string;
    levels: Array<{ level: string; description: string; example: string }>;
  };
  instagramStructure: {
    heading: string;
    intro: string;
    folders: Array<{ name: string; contains: string[] }>;
  };
  neverMix: CreativeBulletBlock;
  translation: CreativeBulletBlock;
  synthesis: string[];
};

export const docStructureLessonC2: DocStructureLesson = {
  label: "LECCIÓN C2 · Estructura documental",
  title: "Estructura documental en Teams",
  premise: [
    "La estructura de carpetas no es una convención de orden personal.",
    "Es parte del método. Garantiza continuidad, trazabilidad y que cualquier integrante del equipo pueda retomar un proyecto sin perder contexto.",
    "Un archivo en el lugar incorrecto no es un error menor: es un riesgo de continuidad.",
  ],
  clientLevelRule: {
    label: "Regla base · Nivel cliente",
    statement: "Cada cliente tiene una carpeta de año activo (ej. 2026) y una carpeta 99_archivo para históricos.",
    body: [
      "Nunca mezclar años activos e históricos en la misma carpeta raíz.",
      "El año activo contiene todo el trabajo corriente. El archivo es de solo lectura para referencia.",
      "Esta separación protege contra la confusión de versiones y permite auditorías limpias.",
    ],
  },
  folderTree: {
    heading: "Estructura por servicio",
    intro: "Dentro del año activo, cada servicio tiene carpeta numerada. La numeración es estructural, no decorativa:",
    levels: [
      {
        level: "Nivel 1 · Cliente",
        description: "Carpeta raíz del cliente en Teams",
        example: "Cliente_NombreCliente/",
      },
      {
        level: "Nivel 2 · Año activo",
        description: "Año en curso + 99_archivo para históricos",
        example: "2026/ · 99_archivo/",
      },
      {
        level: "Nivel 3 · Servicio",
        description: "Servicios numerados según alcance del contrato",
        example: "01_Instagram · 02_Relacionamiento_comunitario · 03_Desarrollo_organizacional",
      },
      {
        level: "Nivel 4 · Operación",
        description: "Subcarpetas operativas del servicio (ver detalle Instagram abajo)",
        example: "01_recursos · 02_publicaciones · 03_planificación",
      },
    ],
  },
  instagramStructure: {
    heading: "Estructura obligatoria de XX_Instagram",
    intro: "La carpeta de Instagram tiene tres subcarpetas fijas. No se improvisan ni se modifican sin acuerdo explícito:",
    folders: [
      {
        name: "01_recursos",
        contains: [
          "Manuales de marca y propuesta gráfica",
          "Logos en formatos de uso",
          "Guiones y lineamientos editoriales",
          "Referencias visuales aprobadas",
          "Fotos e insumos estratégicos del cliente",
        ],
      },
      {
        name: "02_publicaciones",
        contains: [
          "Una subcarpeta por pieza: Post 1, Post 2, ... (según numeración del Excel)",
          "Versiones internas y versión aprobada claramente diferenciadas",
          "Archivos de diseño editables + exports finales",
        ],
      },
      {
        name: "03_planificación",
        contains: [
          "Excel anual de publicaciones (eje central de operación)",
          "Calendarios de contenido mensuales",
          "Documentos de planificación estratégica de períodos",
        ],
      },
    ],
  },
  neverMix: {
    heading: "Errores que no se cometen",
    bullets: [
      "Guardar piezas finales y borradores en la misma carpeta sin diferenciación.",
      "Usar nomenclaturas personales (ej. 'versión_final_definitiva_2') en lugar de la numeración del Excel.",
      "Almacenar material de un cliente en la carpeta de otro.",
      "Dejar archivos en el escritorio o en Downloads; si está fuera de Teams, no existe institucionalmente.",
    ],
  },
  translation: {
    heading: "Traducción operativa",
    bullets: [
      "Antes de crear cualquier carpeta, verifica que sigue la estructura estándar.",
      "Ante duda sobre dónde guardar algo, consulta antes de crear una carpeta nueva.",
      "Al incorporarte a un proyecto activo, verifica la estructura antes de subir archivos.",
      "El nombre de cada carpeta y archivo debe ser descriptivo y seguir la nomenclatura del equipo.",
    ],
  },
  synthesis: [
    "La estructura documental es trazabilidad hecha carpeta.",
    "Orden correcto = continuidad garantizada = riesgo de pérdida de contexto minimizado.",
    "Si no está en Teams con la estructura correcta, no está.",
  ],
};

// ─── C3 · Excel anual como eje organizador ────────────────────────────────

export type AnnualExcelLesson = {
  label: string;
  title: string;
  premise: string[];
  mandatoryFields: {
    heading: string;
    intro: string;
    fields: Array<{ field: string; why: string }>;
  };
  correspondenceRule: CreativeRuleCallout;
  howToUse: CreativeBulletBlock;
  neverDo: CreativeBulletBlock;
  synthesis: string[];
};

export const annualExcelLessonC3: AnnualExcelLesson = {
  label: "LECCIÓN C3 · Excel anual",
  title: "El Excel anual como eje organizador",
  premise: [
    "El Excel anual no es un apoyo secundario ni un reporte para el cliente.",
    "Es el eje central de la operación creativa. La correspondencia entre el Excel y las carpetas de Teams es obligatoria.",
    "Si una pieza está publicada pero no está en el Excel, operativamente no existe. Si está en el Excel pero no en la carpeta correcta, tampoco.",
  ],
  mandatoryFields: {
    heading: "Campos mínimos obligatorios",
    intro: "El Excel debe contener como mínimo los siguientes campos por cada pieza:",
    fields: [
      {
        field: "Número de pieza",
        why: "Identifica la pieza de forma unívoca y vincula el Excel con la carpeta 02_publicaciones.",
      },
      {
        field: "Fecha de publicación",
        why: "Permite planificación, seguimiento de cumplimiento y auditoría posterior.",
      },
      {
        field: "Caption",
        why: "Registro del texto publicado; permite revisión editorial y comparación versión aprobada vs. publicada.",
      },
      {
        field: "Tema / Eje editorial",
        why: "Trazabilidad estratégica: permite ver si la parrilla mantiene coherencia con los lineamientos del cliente.",
      },
      {
        field: "Quién propuso la pieza",
        why: "Accountability creativo: identifica origen de la idea para seguimiento y aprendizaje.",
      },
      {
        field: "Enlace publicado",
        why: "Cierre del ciclo: verifica que lo aprobado fue efectivamente publicado con el link correcto.",
      },
    ],
  },
  correspondenceRule: {
    label: "Regla de correspondencia obligatoria",
    statement: "Cada número de pieza en el Excel debe tener su subcarpeta equivalente en 02_publicaciones.",
    body: [
      "Post 1 en Excel → carpeta 'Post 1' en 02_publicaciones.",
      "Post 2 en Excel → carpeta 'Post 2' en 02_publicaciones.",
      "Esta correspondencia permite que cualquier integrante del equipo encuentre cualquier pieza sin preguntar.",
    ],
  },
  howToUse: {
    heading: "Cómo usar el Excel en el flujo de trabajo",
    bullets: [
      "Al inicio de cada mes: completar fechas, temas y número de piezas para el período.",
      "Durante producción: registrar estado de cada pieza (en producción / en revisión / aprobada).",
      "Al publicar: agregar enlace y verificar que el caption coincide con la versión aprobada.",
      "Al cierre de mes: revisar que todas las piezas tienen enlace y estado final registrado.",
    ],
  },
  neverDo: {
    heading: "Lo que no se hace con el Excel",
    bullets: [
      "No usar para comunicación informal con el cliente (no es un chat ni un log de feedback).",
      "No dejar filas en blanco o incompletas después de la publicación.",
      "No crear columnas adicionales sin acuerdo del equipo (el formato es institucional).",
      "No usar el Excel personal: el Excel del proyecto vive en 03_planificación en Teams.",
    ],
  },
  synthesis: [
    "Excel + carpetas = un solo sistema de trazabilidad.",
    "El Excel dice qué se hizo; la carpeta contiene cómo se hizo.",
    "Sin correspondencia entre ambos, la operación pierde continuidad.",
  ],
};

// ─── C4 · Inicio (Kickoff) ────────────────────────────────────────────────

export type KickoffLesson = {
  label: string;
  title: string;
  premise: string[];
  briefRule: CreativeRuleCallout;
  kickoffChecklist: {
    heading: string;
    intro: string;
    items: Array<{ item: string; why: string }>;
  };
  redFlags: CreativeBulletBlock;
  synthesis: string[];
};

export const kickoffLessonC4: KickoffLesson = {
  label: "LECCIÓN C4 · Inicio",
  title: "Kickoff: cómo se inicia correctamente una operación creativa",
  premise: [
    "El Kickoff no es una reunión de bienvenida: es el momento de establecer criterios de trabajo antes de producir.",
    "No todos los clientes tienen contratado un proceso formal de alineación de marca. Algunos llegan con lineamientos claros; otros los van construyendo 'sobre la marcha'.",
    "En ambos casos, THO desarrolla criterios internos que orienten la producción. El brief general es el ideal; la ausencia de uno no paraliza, pero sí exige más rol activo del PO.",
  ],
  briefRule: {
    label: "El brief general y los briefs específicos",
    statement: "No todo vive en el brief general: hay piezas que requieren su propio brief.",
    body: [
      "El brief general define la estrategia, tono y personalidad del cliente. Todo tributa a él.",
      "Videos (reels) y gráficas complejas (carruseles, piezas de múltiple formato) pueden tener un brief específico según la complejidad del producto.",
      "El brief específico no reemplaza al general: lo complementa. El criterio creativo siempre responde a estrategia, tono y personalidad del cliente.",
      "El PO (rol interno de THO) es quien lleva la alineación de elementos gráficos con la contraparte del cliente, consolida criterios y protege al equipo de correcciones contradictorias.",
    ],
  },
  kickoffChecklist: {
    heading: "Criterios mínimos de inicio",
    intro: "Antes de producir, verifica que existen criterios suficientes para tomar decisiones creativas:",
    items: [
      {
        item: "Objetivo estratégico del período con el cliente",
        why: "Sin objetivo claro, el criterio de aprobación es subjetivo e inestable.",
      },
      {
        item: "Criterios de marca disponibles (aunque sea en construcción)",
        why: "Puede ser un manual formal, referencias aprobadas o lineamientos en desarrollo — lo que exista orienta.",
      },
      {
        item: "Número de pieza asignado en el Excel",
        why: "Sin número, la pieza no tiene lugar en el sistema y no puede ser rastreada.",
      },
      {
        item: "Fecha de publicación confirmada",
        why: "Define el tiempo disponible para producción, revisión y aprobación.",
      },
      {
        item: "PO interno de THO activo y contraparte del cliente identificada",
        why: "El PO (THO) consolida el feedback de la contraparte. Sin esta cadena clara, el feedback llega fragmentado y genera trabajo contradictorio.",
      },
    ],
  },
  redFlags: {
    heading: "Señales de alerta en el inicio",
    intro: "Estas situaciones no paralizan necesariamente, pero requieren gestión activa antes de producir:",
    bullets: [
      "No hay ningún criterio de marca disponible: el PO debe construir o consensuar uno mínimo antes de producir.",
      "El objetivo del período cambia después de iniciada la producción sin registro del cambio.",
      "El cliente da feedback por múltiples canales sin que nadie lo consolide.",
      "Se pide producir antes de definir quién aprueba la versión final.",
    ],
    closing: "El PO (interno THO) es quien gestiona estas tensiones con la contraparte del cliente. El equipo creativo produce; el PO consolida y protege.",
  },
  synthesis: [
    "El inicio establece criterios; el brief general es el ideal pero no siempre existe desde el día uno.",
    "Hay piezas con brief propio: siempre tributando al brief general, pero con mayor detalle específico.",
    "El PO conduce la alineación con el cliente y protege al equipo de ambigüedad.",
  ],
};

// ─── C5 · Producción y revisión ──────────────────────────────────────────

export type ProductionReviewLesson = {
  label: string;
  title: string;
  premise: string[];
  productionRules: CreativeBulletBlock;
  internalReview: {
    heading: string;
    intro: string;
    checklist: string[];
  };
  clientFeedbackRule: CreativeRuleCallout;
  versionControl: CreativeBulletBlock;
  synthesis: string[];
};

export const productionReviewLessonC5: ProductionReviewLesson = {
  label: "LECCIÓN C5 · Producción y revisión",
  title: "Cómo se produce y se revisa en THO",
  premise: [
    "Producir bien no es solo tener buen gusto.",
    "Es trabajar sobre los insumos correctos, sostener coherencia estratégica y aplicar criterio de calidad antes de mostrar cualquier pieza.",
    "La revisión interna no es opcional: protege al equipo y al cliente de entregar trabajo incorrecto.",
  ],
  productionRules: {
    heading: "Reglas de producción",
    bullets: [
      "Trabajar siempre sobre los archivos en 01_recursos: logos, paleta, tipografía, referencias aprobadas.",
      "No usar versiones de archivos fuera de Teams ni materiales no validados.",
      "Sostener coherencia estratégica: cada decisión estética debe poder justificarse contra el brief (general o específico).",
      "Guardar el trabajo en la carpeta del post correspondiente desde el primer guardado: no hay archivos flotantes.",
    ],
    closing: "El trabajo en progreso también vive en el sistema.",
  },
  internalReview: {
    heading: "Revisión interna antes de enviar al cliente",
    intro: "Antes de enviar cualquier pieza al cliente, verifica:",
    checklist: [
      "¿La pieza está numerada correctamente y coincide con el Excel?",
      "¿Está guardada en la carpeta correcta (02_publicaciones/Post X)?",
      "¿Mantiene coherencia con el brief aplicable (general o específico)?",
      "¿Cumple con el estándar técnico del canal (resolución, formato, proporciones)?",
    ],
  },
  clientFeedbackRule: {
    label: "Regla · Feedback del cliente",
    statement: "El feedback de la contraparte siempre lo consolida el PO (interno THO).",
    body: [
      "No se aplican cambios desde feedback fragmentado de múltiples personas del cliente.",
      "El PO filtra, consolida y comunica al equipo creativo. Esto protege de versiones contradictorias.",
      "El canal formal de coordinación es el chat del cliente en Teams o, si es una coordinación específica, el chat de Teams correspondiente.",
    ],
  },
  versionControl: {
    heading: "Versiones en la carpeta del post",
    bullets: [
      "Las versiones se guardan numeradas dentro de la carpeta Post X.",
      "No hay una nomenclatura cerrada (_interna, _cliente, etc.) — la última versión en la carpeta es la versión aprobada.",
      "El estado de aprobación vive en la tarjeta Kanban del Planner en Teams, no en el nombre del archivo.",
    ],
    closing: "Simplicidad en la carpeta; trazabilidad del estado en el tablero Kanban.",
  },
  synthesis: [
    "Producir bien = insumos correctos + revisión interna antes de mostrar.",
    "El feedback consolidado por el PO protege al equipo de trabajo contradictorio.",
    "Versiones en la carpeta, estados en Kanban: dos sistemas distintos para dos tipos de información.",
  ],
};

// ─── C6 · Definición de Hecho (DoD) creativa ─────────────────────────────

export type DodCreativeLesson = {
  label: string;
  title: string;
  premise: string[];
  dodCriteria: {
    heading: string;
    intro: string;
    criteria: Array<{ criterion: string; question: string }>;
  };
  aestheticsVsMethod: {
    heading: string;
    aesthetic: string[];
    method: string[];
  };
  halfDoneRisk: CreativeRuleCallout;
  synthesis: string[];
};

export const dodCreativeLessonC6: DodCreativeLesson = {
  label: "LECCIÓN C6 · Definición de Hecho",
  title: "DoD creativa: qué significa que una pieza está terminada",
  premise: [
    "En operación creativa, 'terminado' tiene una definición precisa.",
    "Una pieza no está terminada cuando se ve bien. Está terminada cuando cumple los criterios de la Definición de Hecho.",
    "Esta distinción protege la calidad, la continuidad y la reputación del equipo.",
  ],
  dodCriteria: {
    heading: "Criterios de la DoD creativa",
    intro: "Una pieza está Done cuando cumple lo siguiente:",
    criteria: [
      {
        criterion: "Alineación al brief aplicable",
        question: "¿La pieza responde al brief general del cliente o al brief específico de la pieza si lo tiene?",
      },
      {
        criterion: "Estándar técnico cumplido",
        question: "¿Cumple con los requerimientos del canal: resolución, formato, proporciones, perfil de color?",
      },
      {
        criterion: "Numeración y almacenamiento correctos",
        question: "¿El número de pieza coincide con el Excel y está guardada en 02_publicaciones/Post X?",
      },
      {
        criterion: "Aprobación en Kanban",
        question: "¿La tarjeta de la pieza en el Planner está en el depósito Aprobado/Publicado?",
      },
      {
        criterion: "Registro colaborativo en Excel",
        question: "¿Quien produjo, quien hizo el copy y quien publicó registraron su información en el Excel?",
      },
      {
        criterion: "Responsable identificable",
        question: "¿Está claro quién produjo la pieza y quién la aprobó, ya sea en la tarjeta Kanban o en el Excel?",
      },
    ],
  },
  aestheticsVsMethod: {
    heading: "La trampa de la estética como sustituto del método",
    aesthetic: [
      "'Se ve bien' no es criterio de entrega.",
      "'El cliente lo va a amar' no reemplaza la aprobación en Kanban.",
      "Una pieza brillante sin registro no tiene cobertura institucional.",
    ],
    method: [
      "El criterio de entrega es la DoD, no la opinión estética.",
      "La aprobación vive en Teams: tarjeta en el depósito Aprobado/Publicado.",
      "El Excel traza lo publicado; el Kanban traza el estado del proceso.",
    ],
  },
  halfDoneRisk: {
    label: "Riesgo · La pieza a medias",
    statement: "Una pieza 'casi lista' que no cumple la DoD no está lista.",
    body: [
      "Si la tarjeta no está en Aprobado/Publicado, el proceso no está cerrado.",
      "Si el Excel no tiene el enlace publicado, no hay trazabilidad de que se publicó.",
      "El proceso completo vive en Teams: lista de tareas en el backlog, detalles en la tarjeta Kanban, estados en los depósitos.",
    ],
  },
  synthesis: [
    "Done no es subjetivo: es una lista de verificación con criterios concretos.",
    "Kanban traza el estado del proceso; Excel traza lo aprobado y publicado.",
    "La estética no reemplaza el método; lo complementa.",
  ],
};

// ─── C7 · Cierre y aprendizaje ───────────────────────────────────────────

export type ClosingLearningLesson = {
  label: string;
  title: string;
  premise: string[];
  closingSteps: {
    heading: string;
    steps: Array<{ step: string; detail: string }>;
  };
  learningProtocol: CreativeBulletBlock;
  continuityRule: CreativeRuleCallout;
  synthesis: string[];
};

export const closingLearningLessonC7: ClosingLearningLesson = {
  label: "LECCIÓN C7 · Cierre y aprendizaje",
  title: "Cierre de piezas y documentación de aprendizajes",
  premise: [
    "Publicar una pieza no cierra el ciclo operativo.",
    "El cierre requiere mover la tarjeta Kanban, registrar el enlace en el Excel y verificar el orden documental.",
    "Los aprendizajes que no se documentan se repiten como errores.",
  ],
  closingSteps: {
    heading: "Pasos de cierre de una pieza",
    steps: [
      {
        step: "Publicar",
        detail: "Verificar que la versión publicada es exactamente la versión aprobada en la tarjeta Kanban.",
      },
      {
        step: "Mover tarjeta a Aprobado/Publicado",
        detail: "El estado final de la pieza vive en el tablero Kanban del Planner. Sin este movimiento, el ciclo no está cerrado a nivel de proceso.",
      },
      {
        step: "Registrar enlace en Excel",
        detail: "El enlace publicado va en el Excel — este es el único dato que el Excel rastrea sobre el estado final de una pieza. Sin enlace, no hay trazabilidad de publicación.",
      },
      {
        step: "Verificar carpeta Post X",
        detail: "Confirmar que la carpeta contiene las versiones numeradas y que la última corresponde a la aprobada.",
      },
      {
        step: "Cierre colaborativo a fin de mes",
        detail: "A cierre de mes, el equipo ordena el Excel: quien produjo, quien hizo el copy, quien publicó completan la información que les corresponde. Si falta info o se movieron fechas, se resuelve en conjunto.",
      },
    ],
  },
  learningProtocol: {
    heading: "Documentación de aprendizajes",
    intro: "No todos los aprendizajes merecen documentación formal. Los que sí:",
    bullets: [
      "Cambios de criterio del cliente que impactaron el flujo: documenta para anticiparlos en el siguiente período.",
      "Decisiones importantes no capturadas en el brief, calendario o Excel: generar un acta que va a la carpeta 01_recursos.",
      "Problemas recurrentes que el equipo resolvió de forma nueva.",
    ],
    closing: "El canal formal es el chat del cliente en Teams o un chat específico de coordinación. Para lo que no cabe en un documento ya existente: acta en 01_recursos.",
  },
  continuityRule: {
    label: "Regla de continuidad",
    statement: "Cada entrega debe permitir que otra persona retome el trabajo sin perder contexto.",
    body: [
      "Si alguien del equipo entra al proyecto mañana, ¿puede entender el estado actual solo con lo que hay en Teams?",
      "Si la respuesta es no, el cierre no está completo.",
      "Esta regla protege al equipo de dependencias de personas individuales.",
    ],
  },
  synthesis: [
    "Publicar no es cerrar: el cierre incluye mover Kanban, registrar enlace y verificar carpeta.",
    "El Excel registra lo publicado; el Kanban registra el proceso. Ambos deben estar al día.",
    "Lo que no cabe en documentos existentes va en un acta a Recursos.",
  ],
};

// ─── C8 · Información sensible ───────────────────────────────────────────

export type SensitiveInfoLesson = {
  label: string;
  title: string;
  premise: string[];
  whatIsSensitive: CreativeBulletBlock;
  handlingRules: CreativeBulletBlock;
  breachScenarios: {
    heading: string;
    scenarios: Array<{ scenario: string; risk: string }>;
  };
  synthesis: string[];
};

export const sensitiveInfoLessonC8: SensitiveInfoLesson = {
  label: "LECCIÓN C8 · Información sensible",
  title: "Resguardo profesional de información sensible",
  premise: [
    "En operación creativa se maneja información sensible del cliente de forma cotidiana.",
    "Fotos no publicadas, estrategias en desarrollo, datos de audiencia, decisiones internas del cliente: todo eso tiene protocolo de manejo.",
    "El cuidado de información sensible es responsabilidad profesional, no burocrática.",
  ],
  whatIsSensitive: {
    heading: "¿Qué cuenta como información sensible en operación creativa?",
    bullets: [
      "Fotografías no publicadas del cliente (personas, instalaciones, productos en desarrollo).",
      "Estrategia editorial antes de su aprobación y publicación.",
      "Datos de desempeño y analytics de cuentas del cliente.",
      "Decisiones internas del cliente compartidas en contexto de trabajo.",
      "Contratos, propuestas y cotizaciones del cliente.",
      "Accesos a plataformas: redes sociales, CMS, herramientas de analítica.",
    ],
    closing: "Si genera duda, se trata como sensible.",
  },
  handlingRules: {
    heading: "Reglas de manejo",
    bullets: [
      "Almacenar en la carpeta correspondiente en Teams: no en dispositivos personales ni servicios no institucionales.",
      "No circular por canales informales (WhatsApp personal, correo personal, chats no institucionales).",
      "No distribuir fuera de Teams sin control explícito: ni siquiera para 'mostrar un ejemplo' a otro cliente.",
      "Accesos a plataformas del cliente: no compartir con personas fuera del equipo activo del proyecto.",
      "Al salir de un proyecto: reportar qué accesos se tienen y proceder al cierre de permisos.",
    ],
    closing: "Un error de manejo de información sensible no se repara con una disculpa.",
  },
  breachScenarios: {
    heading: "Escenarios de riesgo comunes",
    scenarios: [
      {
        scenario: "Compartir fotos del cliente en grupo de WhatsApp para 'pedir opinión rápida'",
        risk: "Distribución no controlada de material no publicado. Pérdida de confianza del cliente.",
      },
      {
        scenario: "Subir archivos del cliente a la nube personal para trabajar desde casa",
        risk: "Material fuera de control institucional. Riesgo de filtración.",
      },
      {
        scenario: "Mostrar analytics de un cliente a otro como 'benchmark'",
        risk: "Confidencialidad comprometida. Riesgo legal.",
      },
      {
        scenario: "No reportar accesos activos al terminar un proyecto",
        risk: "Permisos huérfanos que siguen activos sin supervisión.",
      },
    ],
  },
  synthesis: [
    "La información sensible no se maneja con buenas intenciones: se maneja con protocolo.",
    "El canal correcto siempre es Teams; los canales incorrectos siempre son informales.",
    "La seguridad de la información del cliente es parte de la calidad del servicio.",
  ],
};

// ─── C9 · Estándar de continuidad ────────────────────────────────────────

export type ContinuityLesson = {
  label: string;
  title: string;
  premise: string[];
  continuityTest: {
    heading: string;
    intro: string;
    questions: string[];
  };
  whatBreaksContinuity: CreativeBulletBlock;
  whatBuildsContinuity: CreativeBulletBlock;
  continuityRule: CreativeRuleCallout;
  synthesis: string[];
};

export const continuityCLessonC9: ContinuityLesson = {
  label: "LECCIÓN C9 · Estándar de continuidad",
  title: "Continuidad operativa: el trabajo que permite que otros trabajen",
  premise: [
    "El estándar de continuidad es el criterio más exigente de la operación creativa.",
    "No basta con que el trabajo sea bueno: debe ser comprensible y retomable por cualquier integrante del equipo.",
    "La dependencia de una sola persona es un riesgo operativo, no una virtud de compromiso.",
  ],
  continuityTest: {
    heading: "El test de continuidad",
    intro: "Para validar si un proyecto tiene continuidad suficiente, responde estas preguntas:",
    questions: [
      "¿Puede un nuevo integrante del equipo saber qué piezas están en producción, cuáles en revisión y cuáles publicadas solo mirando el tablero Kanban en Planner?",
      "¿El Excel tiene el enlace de todas las piezas publicadas hasta ahora?",
      "¿Están todos los archivos en la carpeta correcta con las versiones numeradas dentro de cada Post?",
      "¿Las decisiones importantes con el cliente (cambios de brief, cambios de criterio) están registradas en el canal de Teams o en un acta en Recursos?",
      "¿Los accesos a las plataformas del cliente están documentados?",
    ],
  },
  whatBreaksContinuity: {
    heading: "Qué destruye la continuidad",
    bullets: [
      "Archivos en el escritorio personal o fuera de Teams.",
      "Tarjetas Kanban con estado desactualizado: el tablero no refleja la realidad.",
      "Excel sin los enlaces de publicaciones pasadas.",
      "Decisiones importantes del cliente acordadas por WhatsApp sin registro en Teams.",
      "Criterios o lineamientos que solo existen en la cabeza de quien los recibió.",
    ],
  },
  whatBuildsContinuity: {
    heading: "Qué construye la continuidad",
    bullets: [
      "Kanban en Planner actualizado: cada pieza en su depósito correcto.",
      "Excel con enlace de cada pieza publicada, completado por quien corresponde.",
      "Carpetas en Teams con archivos en su lugar y versiones numeradas.",
      "Canal del cliente en Teams como espacio formal de coordinación.",
      "Actas en 01_recursos para decisiones que no caben en documentos existentes.",
    ],
  },
  continuityRule: {
    label: "Regla final · Módulo C",
    statement: "Si no hay trazabilidad para continuidad, el trabajo no está terminado.",
    body: [
      "Esta regla aplica independientemente de cuán creativa o técnicamente excelente sea la pieza.",
      "Un trabajo brillante sin trazabilidad es un trabajo que solo puede continuar quien lo hizo.",
      "En THO, el trabajo es institucional, no individual.",
    ],
  },
  synthesis: [
    "La continuidad se construye pieza a pieza: Kanban actualizado, Excel con enlaces, carpetas ordenadas.",
    "El Excel no dice qué está en producción: eso lo dice el Kanban. El Excel dice qué se publicó.",
    "Trabajo bueno + trazabilidad = trabajo institucional. Sin trazabilidad, es trabajo personal.",
  ],
};
