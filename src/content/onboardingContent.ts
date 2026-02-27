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
    title: "Módulo B · Ventas en THO",
    summary: "Venta consultiva, rutas de servicio, pricing en UF, diagnóstico de cliente, CRM comercial-financiero y ética comercial.",
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
      "B6 — Ética comercial: en THO no se promete rapidez sin método, no se ofrece profundidad no sostenible y no se ocultan riesgos. Vender también es cuidar coherencia estratégica.",
    ],
  },
  {
    slug: "operacion-creativa",
    title: "Módulo C · Operación Creativa en THO",
    summary: "Marco Scrum adaptado, estructura documental en Teams, Excel anual, producción con método y resguardo de información sensible.",
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
