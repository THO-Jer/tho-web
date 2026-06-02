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
    "En THO no aplicamos Scrum como framework rígido.",
    "Lo usamos como sistema de principios para asegurar orden, visibilidad y control de riesgo operativo en proyectos creativos.",
    "La diferencia no es menor: aplicar el ritual sin el principio genera burocracia. Aplicar el principio sin el ritual genera caos.",
  ],
  scrumPrinciples: {
    heading: "Principios Scrum que sí aplicamos",
    intro: "Estos cinco principios son operativos en THO, independientemente del tamaño del proyecto:",
    bullets: [
      "Ciclos cortos: el trabajo se organiza en entregas parciales verificables, no en bloques monolíticos.",
      "Roles definidos: cada persona sabe qué decide, qué ejecuta y qué facilita.",
      "Priorización explícita: el backlog es visible y ordenado. Lo urgente y lo importante no son lo mismo.",
      "Revisión constante: se itera sobre el trabajo, no se entrega todo al final.",
      "Transparencia: el estado del proyecto es visible para el equipo, no solo para quien lo lidera.",
    ],
    closing: "Un proyecto sin estos principios opera con opacidad. Y la opacidad acumula riesgo.",
  },
  rolesTable: {
    heading: "Roles Scrum de referencia",
    intro: "Antes de la adaptación, es necesario conocer los roles originales y su función:",
    rows: [
      {
        role: "Product Owner",
        function: "Prioriza el backlog y consolida decisiones sobre qué producir y en qué orden.",
        thoEquivalent: "Representa al cliente; consolida feedback y valida dirección estratégica.",
      },
      {
        role: "Scrum Master",
        function: "Cuida el proceso, elimina obstáculos y protege al equipo de interrupciones externas.",
        thoEquivalent: "Coordinación interna THO: asegura método, facilita y escala bloqueos.",
      },
      {
        role: "Equipo de desarrollo",
        function: "Ejecución técnica autónoma según prioridades definidas.",
        thoEquivalent: "Equipo creativo: diseño, audiovisual, contenidos — ejecución según brief.",
      },
    ],
  },
  thoAdaptation: {
    heading: "Adaptación a THO",
    intro: "En la práctica, los roles se traducen así:",
    bullets: [
      "Product Owner → cliente consolidado: una persona por cliente que aprueba y consolida. Sin Product Owner funcional, el proyecto no puede avanzar de forma ordenada.",
      "Scrum Master → coordinación interna: cuida que el proceso se respete, escala bloqueos y protege calidad metodológica.",
      "Equipo creativo → ejecución autónoma dentro del brief definido. La autonomía creativa opera dentro del marco estratégico, no fuera de él.",
    ],
    closing: "Objetivo: roles claros, decisiones consolidadas, Kanban visible y cero ambigüedad sobre quién aprueba qué.",
  },
  kanbanRule: {
    label: "Regla operativa · Kanban",
    statement: "El tablero Kanban no es opcional; es parte del método.",
    body: [
      "Cada pieza en producción debe tener un estado visible: pendiente, en producción, en revisión interna, en revisión cliente, aprobada o publicada.",
      "Si una pieza no aparece en el tablero, operativamente no existe.",
      "El Kanban protege al equipo de ambigüedades sobre qué está en curso y qué espera decisión del cliente.",
    ],
  },
  translation: {
    heading: "Traducción operativa",
    intro: "Antes de iniciar cualquier proyecto creativo, verifica:",
    bullets: [
      "¿Hay un Product Owner definido del lado del cliente?",
      "¿El equipo conoce su rol y su scope de decisión?",
      "¿Existe un tablero Kanban activo con todas las piezas en curso?",
      "¿Los ciclos de revisión están agendados o hay protocolo claro para feedback?",
    ],
    closing: "Si alguno de estos cuatro elementos falta, el proyecto opera sin estructura suficiente.",
  },
  synthesis: [
    "Scrum en THO no es proceso; es disciplina metodológica.",
    "Roles claros + Kanban visible + ciclos cortos = control de riesgo operativo.",
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
    "Cada pieza creativa deriva del brief general del cliente.",
    "No se producen piezas desde briefs aislados, interpretaciones propias ni pedidos informales.",
    "El Kickoff no es una reunión de bienvenida: es el momento en que se validan todos los parámetros operativos antes de producir.",
  ],
  briefRule: {
    label: "Regla · Brief general primero",
    statement: "Ninguna pieza se produce sin haber validado el brief general del cliente.",
    body: [
      "El brief general define: objetivo estratégico del período, lineamientos de marca, tono editorial, restricciones y referencias aprobadas.",
      "Producir sin brief genera trabajo que no puede aprobarse o que requiere revisión completa.",
      "Si el cliente no tiene brief general definido, ese es el primer entregable del proyecto, no el diseño.",
    ],
  },
  kickoffChecklist: {
    heading: "Checklist de Kickoff",
    intro: "Antes de comenzar a producir, valida cada uno de estos puntos:",
    items: [
      {
        item: "Objetivo estratégico del período validado con el cliente",
        why: "Sin objetivo claro, el criterio de aprobación es subjetivo e inestable.",
      },
      {
        item: "Coherencia de marca verificada (manual, paleta, tipografía, tono)",
        why: "La coherencia de marca no se negocia pieza a pieza; se establece al inicio.",
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
        item: "Responsable interno identificado",
        why: "Quién aprueba, quién ejecuta y quién hace seguimiento deben estar definidos antes de producir.",
      },
      {
        item: "Product Owner del cliente confirmado",
        why: "Sin Product Owner funcional, el feedback será fragmentado e inconsistente.",
      },
    ],
  },
  redFlags: {
    heading: "Señales de alerta en el Kickoff",
    intro: "Si detectas alguna de estas señales, detente y resuelve antes de producir:",
    bullets: [
      "El cliente quiere piezas antes de validar lineamientos de marca.",
      "No hay un responsable interno del lado del cliente para consolidar feedback.",
      "El objetivo del período cambia después de que ya se inició la producción sin acuerdo formal.",
      "Se pide producir sin brief escrito con el argumento de 'lo vemos en la marcha'.",
      "No hay claridad sobre quién aprueba la versión final.",
    ],
    closing: "Cada red flag ignorada en el Kickoff se convierte en un conflicto durante la producción.",
  },
  synthesis: [
    "El Kickoff define las condiciones del trabajo; no es opcional.",
    "Una producción sin Kickoff correcto es una producción que empieza en deuda metodológica.",
    "Validar antes es más eficiente que corregir después.",
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
    "Es trabajar sobre los insumos correctos, sostener coherencia estratégica, documentar el proceso y aplicar criterio de calidad antes de mostrar cualquier pieza.",
    "La revisión interna no es opcional: protege al equipo y al cliente de entregar trabajo incorrecto.",
  ],
  productionRules: {
    heading: "Reglas de producción",
    bullets: [
      "Trabajar siempre sobre los archivos en 01_recursos: logos, paleta, tipografía, referencias aprobadas.",
      "No usar versiones de archivos fuera de Teams ni materiales no validados por el cliente.",
      "Sostener coherencia estratégica: cada decisión estética debe poder justificarse contra el brief.",
      "Nombrar archivos con nomenclatura clara desde el inicio: evita versiones 'final_2_ultimo_real'.",
      "Guardar trabajo en progreso en la carpeta correcta del post correspondiente desde el primer guardado.",
    ],
    closing: "El trabajo en progreso también vive en el sistema. No hay archivos flotantes.",
  },
  internalReview: {
    heading: "Checklist de revisión interna (antes de enviar al cliente)",
    intro: "Antes de enviar cualquier pieza al cliente, verifica:",
    checklist: [
      "¿La pieza está numerada correctamente y coincide con el Excel?",
      "¿Está guardada en la carpeta correcta (02_publicaciones/Post X)?",
      "¿La versión es clara: 'v1_interna', 'v2_cliente', 'aprobada'?",
      "¿Está registrada en el Excel con estado actualizado?",
      "¿Mantiene coherencia con el brief general y los lineamientos de marca?",
      "¿Cumple con el estándar técnico del canal (resolución, formato, proporciones)?",
    ],
  },
  clientFeedbackRule: {
    label: "Regla · Feedback del cliente",
    statement: "El feedback del cliente siempre lo consolida el Product Owner.",
    body: [
      "No se recibe feedback directo de múltiples personas del cliente sin consolidación previa.",
      "Feedback fragmentado genera versiones contradictorias y trabajo perdido.",
      "Si el cliente envía feedback por fuera del canal definido (WhatsApp, mail informal), se solicita consolidación antes de aplicar cambios.",
    ],
  },
  versionControl: {
    heading: "Control de versiones",
    bullets: [
      "v1_interna: primera versión para revisión interna, nunca se envía al cliente directamente.",
      "v1_cliente: primera versión enviada para aprobación del cliente.",
      "v2_cliente: segunda versión con ajustes según feedback consolidado.",
      "aprobada: versión final aprobada formalmente, lista para publicar.",
    ],
    closing: "La etiqueta de versión va en el nombre del archivo, no solo en la mente de quien lo creó.",
  },
  synthesis: [
    "Producir bien = brief correcto + insumos correctos + revisión interna antes de mostrar.",
    "El feedback fragmentado es tan dañino como no tener feedback.",
    "La nomenclatura de versiones no es formalismo: es trazabilidad real.",
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
    "Una pieza no está terminada cuando se ve bien. Está terminada cuando cumple todos los criterios de la Definición de Hecho.",
    "Esta distinción protege la calidad, la continuidad y la reputación del equipo.",
  ],
  dodCriteria: {
    heading: "Los 7 criterios de la DoD creativa",
    intro: "Una pieza está Done cuando cumple los siguientes 7 criterios, sin excepción:",
    criteria: [
      {
        criterion: "Alineación al brief general",
        question: "¿La pieza responde al objetivo estratégico del período y los lineamientos de marca del cliente?",
      },
      {
        criterion: "Estándar técnico cumplido",
        question: "¿Cumple con los requerimientos técnicos del canal: resolución, formato, proporciones, colores en perfil correcto?",
      },
      {
        criterion: "Numeración correcta",
        question: "¿El número de pieza coincide con el Excel y con el nombre de la carpeta?",
      },
      {
        criterion: "Almacenamiento correcto",
        question: "¿Está guardada en 02_publicaciones/Post X dentro de la estructura de Teams?",
      },
      {
        criterion: "Registro en Excel actualizado",
        question: "¿El Excel refleja el estado actual de la pieza con todos los campos completados?",
      },
      {
        criterion: "Responsable identificable",
        question: "¿Está claro quién produjo la pieza, quién la revisó y quién la aprobó?",
      },
      {
        criterion: "Aprobación consolidada",
        question: "¿La aprobación vino del Product Owner del cliente de forma explícita y registrada?",
      },
    ],
  },
  aestheticsVsMethod: {
    heading: "La trampa de la estética como sustituto del método",
    aesthetic: [
      "'Se ve bien' no es criterio de entrega.",
      "'El cliente lo va a amar' no reemplaza la aprobación formal.",
      "'Siempre lo hemos hecho así' no es documentación.",
    ],
    method: [
      "El criterio de entrega es la DoD, no la opinión estética.",
      "La aprobación formal protege tanto al equipo como al cliente.",
      "El método documenta, la intuición no.",
    ],
  },
  halfDoneRisk: {
    label: "Riesgo · La pieza a medias",
    statement: "Una pieza 'casi lista' que no cumple la DoD no está lista.",
    body: [
      "Entregar sin DoD completa transfiere riesgo al cliente: si algo falla, no hay registro de qué fue aprobado.",
      "Una pieza sin número en el Excel no puede ser rastreada si hay un problema posterior.",
      "Una pieza sin aprobación formal registrada no tiene cobertura metodológica.",
    ],
  },
  synthesis: [
    "Done no es subjetivo: es una lista de verificación.",
    "La estética no reemplaza el método; lo complementa.",
    "Aplicar la DoD protege al equipo, al cliente y a la reputación institucional.",
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
    "El cierre requiere registrar el enlace, verificar el estado final en el Excel y confirmar el orden documental.",
    "Los aprendizajes que no se documentan se repiten como errores.",
  ],
  closingSteps: {
    heading: "Pasos de cierre de una pieza",
    steps: [
      {
        step: "Publicar",
        detail: "Verificar que la versión publicada es exactamente la versión aprobada (sin ajustes de último minuto no documentados).",
      },
      {
        step: "Registrar enlace en Excel",
        detail: "El enlace de la publicación va en la columna correspondiente del Excel. Sin enlace, el ciclo no está cerrado.",
      },
      {
        step: "Verificar carpeta",
        detail: "Confirmar que 02_publicaciones/Post X contiene la versión aprobada y que no hay archivos temporales o borradores sin etiquetar.",
      },
      {
        step: "Actualizar estado en Excel",
        detail: "El estado de la pieza debe cambiar a 'publicada'. Un estado desactualizado genera confusión en el siguiente período.",
      },
      {
        step: "Confirmar orden documental",
        detail: "Revisar que la estructura general de la carpeta del mes sigue siendo correcta después del cierre.",
      },
    ],
  },
  learningProtocol: {
    heading: "Documentación de aprendizajes",
    intro: "No todos los aprendizajes merecen documentación formal. Los que sí deben documentarse:",
    bullets: [
      "Decisiones que generaron fricción: qué pasó, por qué y cómo se resolvió.",
      "Cambios de criterio del cliente que impactaron el flujo: para anticiparlos en el siguiente período.",
      "Soluciones creativas a problemas técnicos recurrentes.",
      "Lineamientos que el cliente aprobó implícitamente pero que no estaban en el brief (actualizar el brief).",
    ],
    closing: "El canal formal de documentación de aprendizajes es el acordado internamente, no el chat informal.",
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
    "Publicar no es cerrar: el cierre incluye registro, verificación y documentación.",
    "Los aprendizajes documentados son el activo operativo más subestimado.",
    "La continuidad no se improvisa: se construye con orden documental consistente.",
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
      "¿Puede un nuevo integrante del equipo entender el estado actual del proyecto solo leyendo lo que hay en Teams?",
      "¿El Excel refleja con precisión qué se publicó, qué está en revisión y qué está pendiente?",
      "¿Están todos los archivos en la carpeta correcta con nomenclatura clara?",
      "¿Hay registro de las decisiones importantes tomadas con el cliente (cambios de brief, aprobaciones, cambios de criterio)?",
      "¿Los accesos a las plataformas del cliente están documentados y bajo control?",
    ],
  },
  whatBreaksContinuity: {
    heading: "Qué destruye la continuidad",
    bullets: [
      "Archivos en el escritorio personal o fuera de Teams.",
      "Estados del Excel desactualizados.",
      "Decisiones tomadas por chat informal sin registro en Teams.",
      "Nomenclatura de archivos inconsistente o dependiente del contexto personal.",
      "Brief o lineamientos solo en la cabeza de quien los recibió, sin documento.",
      "Aprobaciones verbales sin respaldo escrito.",
    ],
  },
  whatBuildsContinuity: {
    heading: "Qué construye la continuidad",
    bullets: [
      "Estructura de carpetas consistente con la metodología del equipo.",
      "Excel actualizado al cierre de cada pieza.",
      "Decisiones importantes registradas en el documento o canal formal correspondiente.",
      "Nomenclatura de archivos estandarizada y predecible.",
      "Aprobaciones siempre por escrito en el canal acordado.",
      "Accesos documentados y revisados al inicio y al cierre de cada proyecto.",
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
    "La continuidad no es un check al final: es una disciplina que se construye pieza a pieza.",
    "El test de continuidad es simple: ¿puede otra persona retomar esto mañana?",
    "Trabajo bueno + trazabilidad = trabajo institucional. Sin trazabilidad, es trabajo personal.",
  ],
};
