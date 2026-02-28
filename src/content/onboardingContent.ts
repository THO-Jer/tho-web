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
    summary: "Fundamentos institucionales de THO: propósito, estándar profesional, ética aplicada y criterios operativos no negociables para actuar con consistencia.",
    durationMinutes: 30,
    content: [
      "A0 — ¿Qué es un onboarding y por qué existe?: No es una inducción administrativa; es un proceso de alineación cultural y operativa para asegurar coherencia interna, reducir ambigüedades y proteger calidad + reputación.",
      "A1 — Propósito organizacional: THO existe para fortalecer organizaciones y conectarlas con su entorno, asegurando viabilidad, legitimidad y coherencia estratégica. Esto implica mejorar decisiones, reducir riesgos y explicitar tensiones antes de crisis.",
      "A2 — Propuesta de valor: propósito ≠ propuesta de valor. En THO, generamos valor con diagnóstico riguroso, diseño estratégico, acompañamiento estructurado, trazabilidad y gestión de riesgos. No vendemos optimismo; vendemos estructura, claridad y método.",
      "A3 — Qué significa ‘trabajo bueno’ en THO: problema delimitado, decisiones explícitas, riesgos identificados, responsables + próximos pasos y registro trazable. Definition of Done: contexto, evidencia, decisión, riesgos, próximos pasos con responsable y fecha.",
      "A4 — Valores organizacionales: Humanidad (cuidado del lenguaje y no exposición innecesaria), Colaboración (documentación compartida y feedback estructurado) y Adaptabilidad (ajustar estrategia según evidencia, no por orgullo).",
      "A5 — Límites y no negociables: no prometer lo que no se puede sostener con método, no trabajar sin trazabilidad mínima, no usar información sensible sin protocolo y no improvisar procesos críticos. Los límites protegen a la organización y al equipo.",
      "A6 — Ética operativa: registrar decisiones con contexto suficiente, proteger confidencialidad, declarar conflictos de interés en forma temprana y usar canales formales (ej. Canal Confidencial). Ante duda: documentar, consultar y aplicar principio de mínimo acceso.",
      "A7 — Criterio de escalamiento: cuando haya tensión entre urgencia y calidad, prima el método. Escala riesgos reputacionales, legales o de confidencialidad a liderazgo y deja registro del criterio usado.",
      "Reflexión guiada sugerida: ¿cómo se traduce este propósito en tu rol? ¿qué proyectos no serían coherentes? ¿dónde sería difícil aplicar estos valores y qué harías para sostenerlos?",
    ],
    resources: [
      { label: "Código de Ética THO", href: "/etica" },
    ],
  },
  {
    slug: "ventas-tho",
    title: "Módulo B · Ventas en THO",
    summary: "Sistema comercial THO: diagnóstico consultivo, diseño de oferta, criterios de calificación, pricing en UF, CRM y estándar ético de cierre.",
    durationMinutes: 50,
    content: [
      "B1 — Qué significa vender en THO: no es empujar volumen; es construir relaciones sostenibles con clientes compatibles con nuestro método. Vender implica diagnosticar antes de ofrecer, encuadrar expectativas, explicar límites y proteger reputación institucional.",
      "Venta consultiva en THO: parte escuchando, busca problema real (no solo síntoma), identifica riesgos antes de comprometer resultados y prioriza coherencia sobre urgencia. Se diferencia de la venta transaccional por ritmos más largos, cierres menos impulsivos y mayor ajuste estratégico.",
      "B2 — Rutas de servicios en THO (Ruta CORE): Entrada → Diseño → Acompañamiento. Entrada: servicios acotados con problema delimitado y cierre definido. Diseño: proceso estratégico con redefinición de problema, riesgos, hoja de ruta y gobernanza. Acompañamiento: implementación sostenida con monitoreo, iteración, control de riesgos y ajustes estratégicos.",
      "Ruta Contenidos / Instagram: Nivel 1 (4 contenidos/mes), Nivel 2 (8–10 contenidos/mes), Nivel 3 (12+ contenidos/mes, cuenta clave, ~30 UF). Esta ruta prioriza continuidad operacional y puede escalar a diseño estratégico según complejidad.",
      "Diferenciación clave de rutas: evaluar cuándo un cliente de contenidos requiere evolucionar a Diseño Estratégico, cuándo corresponde solo gestión de cuenta y cómo detectar problemas estructurales detrás de la demanda de contenido.",
      "B3 — Pricing en THO: se cobra en UF por protección inflacionaria, estabilidad presupuestaria, estándar de servicios profesionales en Chile y claridad contractual.",
      "Estructura de precios: depende de profundidad del servicio, tiempo requerido, nivel de responsabilidad, exposición al riesgo y dedicación operativa. Cuenta clave implica compromiso mensual relevante (~30 UF) y exigencia real de capacidad interna.",
      "B4 — Diagnóstico de cliente (calidad antes que volumen): THO no busca cualquier cliente, busca cliente compatible. Preguntas mínimas: liderazgo claro, disposición a documentar, aceptación de trazabilidad, foco en método (vs resultado rápido), responsable interno definido.",
      "Criterio profesional: si no hay condiciones mínimas, aumenta riesgo operativo, desgaste y riesgo reputacional. Decir 'no' también es una decisión profesional en THO.",
      "B5 — CRM en THO (corazón operativo): componente comercial (pipeline, etapas, historial, dashboard de cierres, conversión, tiempo de cierre, estado de cuentas ticket/cuenta clave). Regla base: si no está registrado, no existe.",
      "Componente financiero/contable del CRM: registro de facturas emitidas/recibidas, boletas de honorarios y gastos menores (caja chica), con dashboard financiero, estado de resultados, soporte a contabilidad y base para operación renta.",
      "B6 — Ética comercial: en THO no se promete rapidez sin método, no se ofrece profundidad no sostenible y no se ocultan riesgos. Vender también es proteger la gobernanza de expectativas y la viabilidad del equipo.",
      "B7 — Cierre profesional: toda propuesta debe cerrar con alcance, supuestos, exclusiones, hitos, responsables y formato de seguimiento. Un cierre de calidad reduce fricción operativa y reclamos posteriores.",
    ],
  },
  {
    slug: "operacion-creativa",
    title: "Módulo C · Operación Creativa en THO",
    summary: "Modelo de operación creativa en THO: gobernanza de flujo, trazabilidad documental, control de calidad y resguardo profesional de activos.",
    durationMinutes: 55,
    content: [
      "C1 — Marco metodológico: Scrum adaptado a THO. No se aplica como framework rígido, pero sí sus principios (ciclos cortos, roles definidos, priorización explícita, revisión constante y transparencia) para asegurar orden, visibilidad y control de riesgo operativo.",
      "Roles de referencia en Scrum: Product Owner (prioriza y consolida decisiones), Scrum Master (cuida proceso y elimina obstáculos) y equipo de desarrollo (ejecución técnica autónoma según prioridades definidas).",
      "Adaptación a THO: el Product Owner representa al cliente y consolida feedback; la coordinación interna cumple función equivalente a Scrum Master; el equipo creativo (diseño, audiovisual, contenidos) ejecuta. Objetivo: roles claros, decisiones consolidadas, Kanban visible y cero ambigüedad.",
      "C2 — Estructura documental en Teams: es parte del método, no una convención. Nivel cliente: carpeta del año activo (ej. 2026) + 99_archivo para históricos. Nunca mezclar años activos e históricos.",
      "Dentro del año activo: carpetas por servicio con numeración estructurada (ej. 01_Instagram, 02_Relacionamiento comunitario, 03_Desarrollo organizacional, 04_Sostenibilidad corporativa). En operación creativa, el foco está en XX_Instagram salvo acuerdo explícito.",
      "Estructura obligatoria de XX_Instagram: 01_recursos (manuales, propuesta gráfica, logos, GCs, guiones, lineamientos, referencias, fotos e insumos estratégicos), 02_publicaciones (Post 1, Post 2, ... según numeración Excel), 03_planificación (Excel anual, calendarios y planificación mensual).",
      "C3 — Excel anual como eje organizador: no es apoyo secundario. Campos mínimos: número de pieza, fecha de publicación, caption, tema, quién propuso la pieza y enlace publicado. La correspondencia Excel-carpeta es obligatoria.",
      "C4 — Inicio (Kickoff): cada pieza deriva del brief general del cliente, no parte de brief aislado por pieza. Validar objetivo estratégico, coherencia de marca, número en Excel, fecha y responsable interno antes de producir.",
      "C5 — Producción y revisión: trabajar sobre 01_recursos, sostener coherencia estratégica y calidad técnica. Antes de enviar al cliente: pieza numerada, carpeta correcta, versión clara y registro en Excel. Feedback del cliente siempre consolidado por Product Owner.",
      "C6 — Definición de Hecho (DoD) creativa: alineación al brief general, estándar técnico cumplido, numeración correcta, almacenamiento correcto, registro en Excel, responsable identificable y aprobación consolidada. La estética no reemplaza método.",
      "C7 — Cierre y aprendizaje: publicar, registrar enlace en Excel, verificar carpeta y confirmar orden documental. Aprendizajes relevantes deben documentarse en canal formal para continuidad operativa.",
      "C8 — Información sensible: almacenar en carpeta correspondiente, no circular por canales informales y no distribuir fuera de Teams sin control. El cuidado de información es responsabilidad profesional.",
      "C9 — Estándar de continuidad: cada entrega debe permitir que otra persona retome el trabajo sin perder contexto. Si no hay trazabilidad para continuidad, el trabajo no está terminado.",
    ],
  },
  {
    slug: "operacion-asesorias",
    title: "Módulo D · Operación Asesorías en THO",
    summary: "Arquitectura de asesoría THO: marco conceptual, diseño de intervención, estándar de entregables y criterio ético para decisiones complejas.",
    durationMinutes: 55,
    content: [
      "D1 — Qué significa asesorar en THO: no es ejecutar tareas ni validar decisiones tomadas. Es intervenir sistemas organizacionales complejos con método, considerando cultura, poder, incentivos, emociones, historia y entorno.",
      "D2 — Fundamentos conceptuales mínimos: THO asesora desde marcos explícitos, no desde intuición aislada. Bases mínimas: gestión del cambio, relacionamiento comunitario, doble materialidad y teoría de actores/poder.",
      "Gestión del cambio: las organizaciones no cambian solo por estrategia escrita; cambian cuando evolucionan incentivos, prácticas y narrativas. Relacionamiento comunitario: ignorar la red territorial de actores incrementa conflicto.",
      "Doble materialidad y poder: las decisiones empresariales impactan el entorno y el entorno impacta la empresa; además, toda decisión distribuye efectos y nunca es neutra. Este módulo instala base conceptual; la profundización ocurre en módulos avanzados.",
      "D3 — Estructura de una intervención: delimitación de problema, diagnóstico interpretativo, identificación de riesgos, diseño de alternativas, toma de decisión y acompañamiento cuando corresponda.",
      "D4 — Diagnóstico: interpretar con criterio, no acumular información. Puede incluir entrevistas, revisión documental, análisis de gobernanza, análisis territorial e identificación de tensiones internas. Debe producir claridad, no más complejidad.",
      "D5 — Diseño estratégico: explicitar supuestos, presentar escenarios, evaluar riesgos secundarios y proponer alternativas claras. Una buena asesoría no elimina la incertidumbre: la hace visible.",
      "D6 — Estándar mínimo de entregables (DoD en asesorías): contexto, evidencia o hipótesis explícita, análisis estructurado, decisión/recomendación concreta, riesgos asociados y próximos pasos con responsable + plazo.",
      "D7 — Documentación y trazabilidad: toda decisión relevante debe registrarse y poder reconstruirse. La trazabilidad protege frente a conflictos, cambios de criterio y malentendidos.",
      "D8 — Ética en asesorías: no exagerar conclusiones, no omitir riesgos para agradar, no ajustar diagnóstico para que sea políticamente cómodo. La legitimidad de THO se sostiene en la claridad.",
      "D9 — Formación avanzada: profundizaciones posteriores en gestión del cambio, doble materialidad, relacionamiento comunitario, análisis organizacional y metodologías participativas.",
      "D10 — Señales de alerta en asesoría: cambios abruptos de alcance sin decisión explícita, recomendaciones sin evidencia mínima y omisión de actores críticos son indicadores de riesgo metodológico.",
      "Cierre del módulo: asesorar en THO es intervenir con método, marco conceptual y responsabilidad ética; no es producir documentos, es mejorar la calidad de decisiones organizacionales.",
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
