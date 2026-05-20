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
    summary: "Sistema comercial THO: venta consultiva, dos motores (Key Accounts y Tickets), pricing en UF, calificación de cliente, CRM, ética comercial y proceso de cierre.",
    durationMinutes: 60,
    content: [
      "B1 — Qué significa vender en THO: no es empujar volumen; es construir relaciones sostenibles con clientes compatibles con nuestro método. Vender implica diagnosticar antes de ofrecer, encuadrar expectativas, explicar límites y proteger reputación institucional.",
      "B2 — Arquitectura comercial: THO opera con dos motores comerciales distintos. Key Accounts (75–120 UF/mes, foco estratégico) y Tickets (15–40 UF totales, puerta de entrada). Existe además una línea complementaria de servicios digitales que no es foco estratégico. Confundir motor confunde criterio.",
      "B3 — Pricing en THO: se cotiza en UF por estándar profesional, estabilidad presupuestaria, protección inflacionaria al momento de cotizar y claridad contractual. La UF se congela al cierre del contrato y aplica a todos los servicios. El precio se calcula por compromiso asumido (profundidad, tiempo, responsabilidad, exposición al riesgo, dedicación operativa). Tickets 15–40 UF totales; Key Accounts en bandas 50–120 UF/mes (objetivo 75–120); Digital desde 10–30 UF/mes. El alcance se ajusta antes que el monto.",
      "B4 — Calificación: calidad antes que volumen. THO no busca cualquier cliente, busca cliente compatible. Filtro cultural mínimo (5 preguntas): liderazgo claro, disposición a documentar, aceptación de trazabilidad, foco en método sobre resultado rápido, responsable interno definido. Pasado el filtro, el perfil se afina según motor (Key Accounts o Tickets) en tres categorías: IDEAL, VIABLE o NO CALIFICADO. Red flags durante el ciclo: ausencia de decisor, ajustes sin avance, presupuesto incierto, cambio de interlocutor. Decir 'no' también es una decisión profesional en THO.",
      "B5 — CRM en THO (memoria institucional): tiene dos lados. Lado comercial/financiero con pestañas de pipeline, tickets actuales, key accounts, historial de cierres y reportes gráficos por período. Lado contable con pestañas de EERR (alimentado por facturas emitidas/recibidas, honorarios, retiros y caja chica) y conciliación. Estados de pipeline: Lead nuevo → Contactado → Reunión agendada → Propuesta enviada → Negociación → Cerrado (ganado o perdido) → Historial. Regla base: si no está registrado, no existe.",
      "B6 — Ética comercial: la venta no se separa del método. Tres no fundamentales: no se promete rapidez sin método, no se ofrece profundidad no sostenible, no se ocultan riesgos. Manejo ético de objeciones (es muy caro, lo pensamos, ya tenemos consultora, no es el momento, requiere aprobación) requiere evitar trampas tácticas (presión, urgencia artificial, descalificar competidores). Hay condiciones que obligan a declinar: ocultar riesgos, alcance inviable, legitimar narrativa engañosa, conflicto de interés. Vender también es proteger la gobernanza de expectativas y la viabilidad del equipo.",
      "B7 — Cierre y formalización: el cierre es la primera entrega. Tres documentos distintos: Propuesta (orientación de valor, sin granularidad para protegerse de filtraciones), Cotización (detalle comercial acotado) y Contrato/Acuerdo de Trabajo (vinculante, con todo el detalle). Reglas por motor: Key Accounts contrato propio o del cliente, fee mensual preferente, siempre contra factura, nunca boleta; Tickets con Acuerdo de Trabajo y cobro fraccionado 20–50% inicial; Digital con renovación automática y reunión de planificación al inicio. Kick-off no-negociable. Renovación se anticipa (mes 9 en KA anuales; último mes en KA cortas) pero no se atosiga. La confianza permite iniciar; el documento protege a todos.",
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
  {
    id: "q1",
    prompt: "Un cliente solicita modificar completamente el enfoque metodológico a mitad del proceso porque \"cambió el contexto político\". ¿Qué refleja mejor el estándar THO?",
    options: [
      "Aceptar el cambio inmediato para mantener la relación.",
      "Evaluar el impacto metodológico antes de decidir.",
      "Rechazar el cambio por principio.",
      "Ajustar sin documentar para evitar fricción.",
    ],
    correctIndex: 1,
    topic: "adaptabilidad_ordenada",
  },
  {
    id: "q2",
    prompt: "Un entregable fue enviado a tiempo, pero no pasó por revisión crítica interna. ¿Está \"done\"?",
    options: [
      "Sí, porque se cumplió el plazo.",
      "Sí, si el cliente no reclama.",
      "No, porque falta validación interna.",
      "Depende del tamaño del cliente.",
    ],
    correctIndex: 2,
    topic: "definition_of_done",
  },
  {
    id: "q3",
    prompt: "Una etapa metodológica parece innecesaria en este caso específico. ¿Qué se hace?",
    options: [
      "Eliminarla para ahorrar tiempo.",
      "Revisar si su propósito sigue siendo válido.",
      "Mantenerla aunque no tenga sentido.",
      "Preguntar al cliente qué prefiere.",
    ],
    correctIndex: 1,
    topic: "metodo_sobre_costumbre",
  },
  {
    id: "q4",
    prompt: "Un cliente pide suavizar hallazgos críticos para no generar conflicto interno. ¿Qué corresponde?",
    options: [
      "Ajustar redacción sin alterar fondo.",
      "Eliminar hallazgos sensibles.",
      "Explicitar riesgos y sostener evidencia.",
      "Evitar el tema.",
    ],
    correctIndex: 2,
    topic: "limites_institucionales",
  },
  {
    id: "q5",
    prompt: "Detectas presión para omitir una fase clave del proceso. Primer paso correcto:",
    options: [
      "Aceptar y compensar después.",
      "Escalar directamente.",
      "Nombrar y explicitar la tensión.",
      "Guardarlo para revisión final.",
    ],
    correctIndex: 2,
    topic: "protocolo_etico",
  },
  {
    id: "q6",
    prompt: "Una decisión puede afectar reputación institucional. ¿Qué corresponde?",
    options: [
      "Resolver individualmente para ser eficiente.",
      "Escalar según protocolo.",
      "Posponer decisión.",
      "Consultar solo si hay conflicto visible.",
    ],
    correctIndex: 1,
    topic: "escalamiento",
  },
  {
    id: "q7",
    prompt: "¿Cuál diferencia mejor adaptabilidad de improvisación?",
    options: [
      "Adaptabilidad responde sin plan.",
      "Adaptabilidad ajusta con estructura.",
      "Son lo mismo.",
      "Improvisar es más ágil.",
    ],
    correctIndex: 1,
    topic: "marco_agile",
  },
  {
    id: "q8",
    prompt: "¿Cuál afirmación es coherente con THO?",
    options: [
      "El cliente siempre tiene la razón.",
      "La rentabilidad justifica ajustes metodológicos.",
      "La coherencia institucional precede a la conveniencia.",
      "Los límites pueden negociarse caso a caso.",
    ],
    correctIndex: 2,
    topic: "coherencia",
  },
  {
    id: "q9",
    prompt: "En una asesoría detectas que una comunidad fue incluida solo para \"validar narrativa\". ¿Qué acción es coherente?",
    options: [
      "Mantenerlo si el cliente lo pidió.",
      "Redefinir diseño participativo.",
      "No intervenir en decisiones estratégicas.",
      "Ajustar informe sin cuestionar proceso.",
    ],
    correctIndex: 1,
    topic: "integridad_territorial",
  },
  {
    id: "q10",
    prompt: "Si tienes dudas técnicas pero presión por entregar:",
    options: [
      "Entregas y corriges después.",
      "Documentas y consultas segundo criterio.",
      "Entregas versión preliminar como final.",
      "Dejas que el cliente decida el estándar.",
    ],
    correctIndex: 1,
    topic: "trazabilidad",
  },
];
