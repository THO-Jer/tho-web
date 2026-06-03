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
      "C1 — Marco metodológico: Scrum adaptado a THO. Framework ágil de origen tecnológico que THO usa como sistema de principios (no como ritual rígido) para asegurar orden, visibilidad y control de riesgo operativo. Tres roles de referencia: Product Owner (consolida decisiones y feedback del cliente), Scrum Master (cuida el proceso y elimina obstáculos) y equipo creativo (ejecuta). En THO hoy, PO y SM recaen en el director; la lógica de roles existe aunque aún no seamos suficientemente grandes para cumplir el marco completo. Kanban en Planner de Teams con 3 depósitos: Backlog, Producción/Revisión, Aprobado/Publicado.",
      "C2 — Estructura documental en Teams: es parte del método, no una convención. Nivel cliente: carpeta del año activo (ej. 2026) + 99_archivo para históricos. Dentro del año activo: carpetas por servicio numeradas (ej. 01_Instagram). Estructura obligatoria de XX_Instagram: 01_recursos (manuales, propuesta gráfica, logos, GCs, guiones, lineamientos, referencias, fotos e insumos estratégicos), 02_publicaciones (Post 1, Post 2, ... según numeración Excel), 03_planificación (Excel anual en SharePoint/Teams, calendarios y planificación mensual).",
      "C3 — Excel anual como eje organizador: no es apoyo secundario. Campos mínimos: número de pieza, fecha de publicación, caption, tema, quién propuso la pieza y enlace publicado. Registro colaborativo: quien produce, quien hace el copy y quien publica suman su info. Se ordena a cierre de mes. La correspondencia Excel-carpeta es obligatoria.",
      "C4 — Inicio (Kickoff): cada pieza deriva del brief general del cliente, no parte de brief aislado por pieza. Validar objetivo estratégico, coherencia de marca, número en Excel, fecha y responsable interno antes de producir.",
      "C5 — Producción y revisión: trabajar sobre 01_recursos, sostener coherencia estratégica y calidad técnica. Antes de enviar al cliente: pieza numerada, carpeta correcta, versión clara y registro en Excel. Feedback de la contraparte siempre consolidado por el PO interno de THO.",
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
      "D3 — Estructura de una intervención: delimitación de problema, diagnóstico interpretativo, identificación de riesgos, diseño de alternativas, toma de decisión y acompañamiento cuando corresponda.",
      "D4 — Diagnóstico: interpretar con criterio, no acumular información. Puede incluir entrevistas, revisión documental, análisis de gobernanza, análisis territorial e identificación de tensiones internas. Debe producir claridad, no más complejidad.",
      "D5 — Diseño estratégico: explicitar supuestos, presentar escenarios, evaluar riesgos secundarios y proponer alternativas claras. Una buena asesoría no elimina la incertidumbre: la hace visible.",
      "D6 — DoD en asesorías: piso mínimo universal (identificación, responsable, almacenamiento, trazabilidad de origen) aplicable a todo entregable; criterios específicos de 'hecho' se pactan en la propuesta según tipo de entregable.",
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

  // =====================================================
  // MÓDULO B — Ventas en THO (10 preguntas)
  // =====================================================
  // Todos los topics empiezan con "ventas_*" para que el unitTopicMap los
  // enganche al slug "ventas-tho". Cada topic mapea a una lección específica
  // del módulo B vía topicToLesson() en src/lib/onboarding.ts.
  {
    id: "b-q1",
    prompt:
      "Un cliente llega con una solicitud específica de servicios y pide propuesta rápida. ¿Qué refleja mejor el estándar de venta consultiva en THO?",
    options: [
      "Enviar la propuesta lo más rápido posible sin más matices, para no perder oportunidad.",
      "Entregar la propuesta con el contexto disponible, explicitando la necesidad de un diagnóstico inicial para afinarla.",
      "Ofrecer un descuento por respuesta rápida.",
      "Derivar el pedido al ticket más cercano.",
    ],
    correctIndex: 1,
    topic: "ventas_consultiva",
  },
  {
    id: "b-q2",
    prompt:
      "Un prospecto tiene presupuesto pequeño pero real y pide una intervención de Relacionamiento Comunitario acotada. ¿Qué motor activa?",
    options: [
      "Key Account, aunque el presupuesto esté por debajo de la banda mínima.",
      "Ticket de Mapa de Riesgos Socioambientales como puerta de entrada.",
      "Servicio digital Base 1.",
      "Declinar sin ofrecer alternativa.",
    ],
    correctIndex: 1,
    topic: "ventas_motores",
  },
  {
    id: "b-q3",
    prompt: "¿En qué momento se hace el pitch de escalamiento (Ticket → Key Account) con un cliente?",
    options: [
      "Desde la primera reunión de venta del Ticket.",
      "En el primer mes de ejecución del Ticket.",
      "Al final del Ticket, en la entrega de resultados.",
      "Cuando el cliente lo pida sin que THO lo proponga.",
    ],
    correctIndex: 2,
    topic: "ventas_funnel",
  },
  {
    id: "b-q4",
    prompt:
      "Un cliente firma un contrato Key Account a 75 UF/mes en marzo. Para junio, la UF subió 3%. ¿Qué paga el cliente?",
    options: [
      "La nueva UF mensual ajustada al alza.",
      "El valor en pesos calculado al día de firma del contrato, sin ajuste.",
      "Renegociación obligatoria al cambiar la UF.",
      "Promedio entre la UF de firma y la UF actual.",
    ],
    correctIndex: 1,
    topic: "ventas_uf",
  },
  {
    id: "b-q5",
    prompt: "Un cliente dice que la propuesta está fuera de su presupuesto. ¿Qué corresponde según el estándar THO?",
    options: [
      "Bajar el precio inmediatamente para asegurar el cierre.",
      "Compararse con consultoras más baratas para justificar.",
      "Ajustar alcance antes que monto, o cambiar de motor.",
      "Mantener el precio sin discutir nada.",
    ],
    correctIndex: 2,
    topic: "ventas_pricing",
  },
  {
    id: "b-q6",
    prompt:
      "Han pasado 3 meses con un prospecto sin avance real, el cliente te ve como commodity y su presupuesto es menos del 50% del mínimo viable. ¿Qué acción profesional corresponde?",
    options: [
      "Insistir con argumentos de urgencia para forzar el cierre.",
      "Bajar el precio al mínimo viable para no perder la venta.",
      "Pausar o cerrar elegantemente la conversación.",
      "Trabajar gratis los primeros meses para construir relación.",
    ],
    correctIndex: 2,
    topic: "ventas_calificacion",
  },
  {
    id: "b-q7",
    prompt:
      "Tuviste una conversación con un cliente que cambió el alcance del contrato, pero no quedó en CRM. ¿Qué refleja mejor el estándar THO?",
    options: [
      "Si fue una conversación informal, no es necesario registrarla.",
      "La conversación, para efectos de análisis, no ocurrió.",
      "Basta con recordarla mentalmente.",
      "Se puede registrar después si surge un conflicto.",
    ],
    correctIndex: 1,
    topic: "ventas_crm",
  },
  {
    id: "b-q8",
    prompt:
      "Un cliente exige que ocultemos un riesgo regulatorio relevante en la propuesta para acelerar la aprobación interna. ¿Qué corresponde?",
    options: [
      "Omitir el riesgo y avanzar con el cierre.",
      "Explicitar el riesgo aunque eso pueda significar perder la venta.",
      "Mencionarlo en términos vagos para no perder al cliente.",
      "Ajustar la propuesta al lenguaje del cliente sin alterar contenido.",
    ],
    correctIndex: 1,
    topic: "ventas_etica",
  },
  {
    id: "b-q9",
    prompt: 'Un prospecto dice "ya trabajamos con otra consultora". ¿Cuál es la respuesta éticamente coherente?',
    options: [
      "Descalificar al competidor mencionando que cobra menos por menos calidad.",
      "Sugerir que están mal acompañados sin conocer el contexto.",
      "Preguntar genuinamente cómo les ha ido, compartir un recurso de valor (lead magnet, contenido relevante) y ofrecer complementariedad si detectas vacíos.",
      "Esperar a que terminen ese contrato para volver a contactar.",
    ],
    correctIndex: 2,
    topic: "ventas_objeciones",
  },
  {
    id: "b-q10",
    prompt:
      "Un cliente Key Account propone pagar mediante boleta de honorarios para simplificar el trámite. ¿Qué corresponde?",
    options: [
      "Aceptar para facilitar el cierre.",
      "Aceptar solo el primer mes y después emitir factura.",
      "Declinar: THO siempre emite factura (exenta), nunca boleta de honorarios.",
      "Pedir orden de compra adicional.",
    ],
    correctIndex: 2,
    topic: "ventas_cierre",
  },

  // =====================================================
  // MÓDULO C — Operación Creativa
  // =====================================================
  {
    id: "c-q1",
    prompt: "En THO, ¿cuál es el propósito real de aplicar principios Scrum en operación creativa?",
    options: [
      "Tener reuniones diarias de sincronización obligatorias.",
      "Asegurar orden, visibilidad y control de riesgo operativo con ciclos cortos y roles definidos.",
      "Usar el tablero Kanban solo cuando el proyecto es grande.",
      "Cumplir con una exigencia metodológica formal sin impacto práctico.",
    ],
    correctIndex: 1,
    topic: "creativa_scrum",
  },
  {
    id: "c-q2",
    prompt: "Un cliente pide producir piezas de Instagram antes de validar los lineamientos de marca. ¿Qué corresponde?",
    options: [
      "Producir igual para no perder tiempo, ajustando después si hay cambios.",
      "Producir una pieza de prueba para que el cliente vea el estilo.",
      "Detener la producción: validar el brief general es el primer paso obligatorio.",
      "Usar referencias del trabajo anterior del cliente como base suficiente.",
    ],
    correctIndex: 2,
    topic: "creativa_kickoff",
  },
  {
    id: "c-q3",
    prompt: "El Excel anual tiene un Post 7 registrado, pero no hay carpeta 'Post 7' en 02_publicaciones. ¿Qué situación describe esto?",
    options: [
      "Error menor: se puede buscar el archivo en el escritorio del diseñador.",
      "Quiebre de la correspondencia obligatoria Excel–carpeta: el ciclo operativo no está cerrado.",
      "Situación normal si la pieza aún está en producción.",
      "Solo es problema si el cliente pregunta por la pieza.",
    ],
    correctIndex: 1,
    topic: "creativa_excel",
  },
  {
    id: "c-q4",
    prompt: "¿Cuál de estas acciones quiebra el estándar de la estructura documental en Teams?",
    options: [
      "Crear una carpeta 02_publicaciones dentro de XX_Instagram.",
      "Guardar archivos finales en el escritorio del computador para trabajar más rápido.",
      "Actualizar el Excel anual al publicar cada pieza.",
      "Nombrar la carpeta del año activo como '2026'.",
    ],
    correctIndex: 1,
    topic: "creativa_estructura",
  },
  {
    id: "c-q5",
    prompt: "Una pieza tiene excelente calidad estética, está aprobada por el cliente, pero no tiene número en el Excel ni está en la carpeta correcta. Según la DoD creativa, ¿está terminada?",
    options: [
      "Sí, porque el cliente la aprobó.",
      "Sí, si se publica en el plazo acordado.",
      "No: no cumple los criterios de numeración correcta ni almacenamiento correcto.",
      "Depende de si hay urgencia de publicación.",
    ],
    correctIndex: 2,
    topic: "creativa_dod",
  },
  {
    id: "c-q6",
    prompt: "El cliente envía feedback sobre una pieza por WhatsApp a tres personas distintas del equipo, con comentarios contradictorios. ¿Qué corresponde según el estándar THO?",
    options: [
      "Aplicar el feedback de quien tiene más jerarquía en el cliente.",
      "Hacer un promedio de los comentarios y aplicar los más repetidos.",
      "Solicitar al PO interno de THO que obtenga feedback consolidado de la contraparte antes de aplicar cambios.",
      "Responder a todos por WhatsApp confirmando los cambios que corresponden.",
    ],
    correctIndex: 2,
    topic: "creativa_produccion",
  },
  {
    id: "c-q7",
    prompt: "Una pieza se publicó correctamente. ¿Cuál es el siguiente paso obligatorio según el protocolo de cierre?",
    options: [
      "Comenzar inmediatamente la siguiente pieza para mantener el ritmo.",
      "Registrar el enlace publicado en el Excel y verificar el orden documental de la carpeta.",
      "Enviar el enlace al cliente por WhatsApp para confirmación.",
      "Archivar la carpeta del post en 99_archivo.",
    ],
    correctIndex: 1,
    topic: "creativa_cierre",
  },
  {
    id: "c-q8",
    prompt: "Un integrante del equipo necesita trabajar desde casa y sube fotos no publicadas del cliente a su Google Drive personal. ¿Cómo describe mejor el estándar THO esta situación?",
    options: [
      "Aceptable si el acceso es solo temporal y la información no se comparte.",
      "Quiebre del protocolo de información sensible: el material debe estar solo en Teams.",
      "Aceptable si el integrante usa su correo corporativo.",
      "Solo es problema si el cliente se entera.",
    ],
    correctIndex: 1,
    topic: "creativa_sensible",
  },
  {
    id: "c-q9",
    prompt: "Un nuevo integrante se incorpora a un proyecto activo. Al entrar a Teams, no puede entender el estado del proyecto ni qué piezas están aprobadas. ¿Qué indica esto?",
    options: [
      "Que el nuevo integrante necesita más tiempo de adaptación.",
      "Que el proyecto no tiene continuidad operativa suficiente.",
      "Que Teams no es una herramienta adecuada para ese tipo de proyecto.",
      "Que falta una reunión de traspaso presencial.",
    ],
    correctIndex: 1,
    topic: "creativa_continuidad",
  },
  {
    id: "c-q10",
    prompt: "Al inicio de un proyecto creativo nuevo no hay contraparte definida del cliente. ¿Qué refleja mejor el estándar THO?",
    options: [
      "Se puede iniciar la producción y definir la contraparte en la primera revisión.",
      "Se puede avanzar con feedback de varias personas del cliente hasta que nombren a una.",
      "Es una señal de alerta: sin contraparte definida no hay a quién consolidar el feedback y no se debe iniciar producción.",
      "El PO interno de THO asume también el rol de contraparte.",
    ],
    correctIndex: 2,
    topic: "creativa_kickoff",
  },

  // =====================================================
  // MÓDULO D — Operación Asesorías
  // =====================================================
  {
    id: "d-q1",
    prompt: "Un cliente pide a THO que ejecute un plan de comunicación que él mismo ya diseñó. ¿Cómo describe mejor el estándar de asesoría en THO esta situación?",
    options: [
      "Es asesoría válida: THO aporta capacidad de ejecución.",
      "Es producción, no asesoría: THO ejecutaría sin intervenir el sistema ni el criterio.",
      "Depende del presupuesto acordado.",
      "Es asesoría si THO agrega valor en la implementación.",
    ],
    correctIndex: 1,
    topic: "operacion_asesorias_que_es",
  },
  {
    id: "d-q2",
    prompt: "Una organización quiere cambiar su estructura interna. El nuevo organigrama ya está diseñado, pero el equipo directivo está fracturado y los incentivos no han cambiado. ¿Qué marco conceptual es más relevante para diagnosticar por qué el cambio probablemente fracasará?",
    options: [
      "Doble materialidad: el cambio afecta el entorno.",
      "Gestión del cambio: los incentivos sostienen el estado actual.",
      "Relacionamiento comunitario: hay actores externos involucrados.",
      "Teoría de actores: hay múltiples partes con intereses distintos.",
    ],
    correctIndex: 1,
    topic: "operacion_asesorias_marcos",
  },
  {
    id: "d-q3",
    prompt: "Un cliente quiere pasar directamente al diseño de alternativas sin haber completado el diagnóstico. ¿Qué corresponde según el estándar THO?",
    options: [
      "Aceptar: el cliente conoce mejor su organización.",
      "Diseñar alternativas con los supuestos disponibles y aclarar las limitaciones.",
      "Explicitar el riesgo: sin diagnóstico, el diseño se basa en hipótesis no verificadas.",
      "Proponer un diagnóstico exprés de una hora.",
    ],
    correctIndex: 2,
    topic: "operacion_asesorias_estructura",
  },
  {
    id: "d-q4",
    prompt: "Al finalizar la fase de diagnóstico, THO entrega un informe con muchos datos ordenados por área. El cliente dice que la información es correcta pero no sabe qué hacer con ella. ¿Qué indica esto?",
    options: [
      "Que el cliente necesita más tiempo para procesar.",
      "Que el diagnóstico fue descriptivo pero no interpretativo: falta la hipótesis central.",
      "Que se necesita una reunión adicional de presentación.",
      "Que el cliente no es el público correcto para el informe.",
    ],
    correctIndex: 1,
    topic: "operacion_asesorias_diagnostico",
  },
  {
    id: "d-q5",
    prompt: "THO presenta al cliente una sola recomendación, presentada como 'la solución óptima'. ¿Cuál es el principal problema metodológico de este enfoque?",
    options: [
      "Ninguno, si la recomendación está bien fundamentada.",
      "Puede agotar al cliente con demasiadas opciones.",
      "Desplaza la decisión del cliente hacia THO, asumiendo THO la responsabilidad de las consecuencias.",
      "Es aceptable si el cliente pidió una recomendación directa.",
    ],
    correctIndex: 2,
    topic: "operacion_asesorias_diseno",
  },
  {
    id: "d-q6",
    prompt: "THO entrega a un cliente un organigrama sin número de versión, sin nombre de quien lo revisó y guardado en el escritorio del diseñador. ¿Qué condición del estándar THO incumple?",
    options: [
      "El DoD específico acordado en la propuesta.",
      "El piso mínimo universal: falta identificación, responsable y almacenamiento correcto.",
      "El estándar de entregables analítico-decisionales.",
      "Solo incumple si el cliente lo solicita formalmente.",
    ],
    correctIndex: 1,
    topic: "operacion_asesorias_dod",
  },
  {
    id: "d-q7",
    prompt: "Tres semanas después de una reunión clave, surge un conflicto con el cliente sobre qué se acordó. No hay registro de la reunión. ¿Qué establece el estándar de trazabilidad THO sobre esta situación?",
    options: [
      "Se reconstruye lo acordado con las memorias del equipo.",
      "El cliente tiene razón por defecto si no hay registro.",
      "Lo que no quedó registrado, en caso de conflicto, no existió.",
      "Se busca el mail más cercano a la fecha como respaldo.",
    ],
    correctIndex: 2,
    topic: "operacion_asesorias_trazabilidad",
  },
  {
    id: "d-q8",
    prompt: "Durante una asesoría, THO detecta que sus conclusiones incomodarán a un actor clave del cliente. El cliente sugiere suavizar el diagnóstico para facilitar la implementación. ¿Qué corresponde?",
    options: [
      "Suavizar la redacción manteniendo el fondo.",
      "Ajustar el diagnóstico: la implementación exitosa es el objetivo final.",
      "Sostener las conclusiones: ajustar el diagnóstico por comodidad política destruye la independencia de criterio.",
      "Presentar dos versiones del informe, una para circulación interna y otra oficial.",
    ],
    correctIndex: 2,
    topic: "operacion_asesorias_etica",
  },
  {
    id: "d-q9",
    prompt: "En el mes 3 de una asesoría, el cliente pide incorporar análisis de doble materialidad, que no estaba en el alcance original. ¿Cuál es la señal de alerta que activa esto y la respuesta correcta?",
    options: [
      "Señal de confianza; incorporarlo sin más trámite para fortalecer la relación.",
      "Señal de alerta de cambio de alcance sin decisión explícita; pausar y formalizar si se incorpora.",
      "No es señal de alerta: el cliente puede pedir cambios en cualquier momento.",
      "Señal de oportunidad comercial; cotizar el nuevo alcance informalmente.",
    ],
    correctIndex: 1,
    topic: "operacion_asesorias_alertas",
  },
  {
    id: "d-q10",
    prompt: "Un asesor de THO termina su participación en un proyecto. El siguiente integrante que retoma el trabajo no puede reconstruir el estado de la asesoría ni las decisiones tomadas. ¿Qué establece el estándar THO sobre esto?",
    options: [
      "Es normal: hay una curva de adaptación al retomar proyectos.",
      "Se resuelve con una reunión de traspaso presencial.",
      "El trabajo no cumplió el estándar de trazabilidad: cualquier integrante debe poder retomar sin intervención de quien lo inició.",
      "El cliente debe proveer contexto para facilitar el traspaso.",
    ],
    correctIndex: 2,
    topic: "operacion_asesorias_trazabilidad",
  },
];
