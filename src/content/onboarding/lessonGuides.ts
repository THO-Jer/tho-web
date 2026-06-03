/**
 * Guías de "Por qué importa / Cómo proceder / Error frecuente / Aprendizajes clave"
 * que se renderizan en el panel lateral del render genérico de lecciones (B/C/D
 * y cualquier lección sin render dedicado).
 */

export type LessonGuide = {
  whyItMatters: string;
  whatToDo: string;
  commonMistake: string;
  keyLearnings: string[];
};

export const topicReviewLabel: Record<string, string> = {
  // Módulo A
  adaptabilidad_ordenada: "Adaptabilidad ordenada",
  definition_of_done: "Definition of Done",
  metodo_sobre_costumbre: "Método sobre costumbre",
  limites_institucionales: "Límites institucionales",
  protocolo_etico: "Protocolo ético",
  escalamiento: "Escalamiento",
  marco_agile: "Marco Agile",
  coherencia: "Coherencia institucional",
  integridad_territorial: "Integridad territorial",
  trazabilidad: "Trazabilidad",
  // Módulo B
  ventas_consultiva: "Venta consultiva",
  ventas_motores: "Motores comerciales",
  ventas_funnel: "Funnel Ticket → Key Account",
  ventas_uf: "Pricing en UF y congelamiento",
  ventas_pricing: "Negociación de precio",
  ventas_calificacion: "Calificación y retirada",
  ventas_crm: "Disciplina del CRM",
  ventas_etica: "Tres no fundamentales",
  ventas_objeciones: "Manejo ético de objeciones",
  ventas_cierre: "Cierre y formalización",
  // Módulo C
  creativa_scrum: "Scrum adaptado a THO",
  // Módulo D (se añade aquí para topicReviewLabel)
  operacion_asesorias_que_es: "Qué significa asesorar en THO",
  operacion_asesorias_marcos: "Marcos conceptuales mínimos",
  operacion_asesorias_estructura: "Estructura de una intervención",
  operacion_asesorias_diagnostico: "Diagnóstico interpretativo",
  operacion_asesorias_diseno: "Diseño estratégico",
  operacion_asesorias_dod: "DoD en asesorías",
  operacion_asesorias_trazabilidad: "Documentación y trazabilidad",
  operacion_asesorias_etica: "Ética en asesorías",
  operacion_asesorias_formacion: "Formación avanzada",
  operacion_asesorias_alertas: "Señales de alerta",
  creativa_estructura: "Estructura documental en Teams",
  creativa_excel: "Excel anual como eje organizador",
  creativa_kickoff: "Kickoff y brief general",
  creativa_produccion: "Producción y revisión interna",
  creativa_dod: "Definición de Hecho creativa",
  creativa_cierre: "Cierre de piezas y aprendizaje",
  creativa_sensible: "Información sensible",
  creativa_continuidad: "Estándar de continuidad",
};

export const moduleALessonGuides: Record<string, LessonGuide> = {
  A0: {
    whyItMatters: "Define el estándar base: onboarding es alineación operativa para evitar ambigüedad, errores repetidos y daño reputacional.",
    whatToDo: "Antes de ejecutar, verifica propósito, criterio de calidad y trazabilidad mínima de tu trabajo.",
    commonMistake: "Tratar el onboarding como lectura pasiva sin traducirlo a decisiones concretas del rol.",
    keyLearnings: ["Entiendo qué protege este onboarding", "Sé qué evidencia dejar en cada entrega", "Identifico cuándo debo escalar dudas"],
  },
  A1: {
    whyItMatters: "El propósito institucional guía prioridades cuando hay tensión entre velocidad, calidad y riesgo.",
    whatToDo: "Conecta cada tarea con impacto organizacional: decisión, riesgo mitigado o legitimidad fortalecida.",
    commonMistake: "Ejecutar tareas aisladas sin evaluar coherencia estratégica.",
    keyLearnings: ["Puedo explicar para qué existe THO", "Relaciono mi rol con ese propósito", "Identifico riesgos de incoherencia"],
  },
  A2: {
    whyItMatters: "Diferenciar propósito y propuesta de valor evita promesas vagas y mejora posicionamiento profesional.",
    whatToDo: "Habla en términos de método: diagnóstico, diseño, acompañamiento, trazabilidad y gestión de riesgos.",
    commonMistake: "Vender entusiasmo o esfuerzo sin explicar estructura ni resultados verificables.",
    keyLearnings: ["Distingo propósito vs. propuesta de valor", "Puedo explicar el método THO", "Evito lenguaje ambiguo en propuestas"],
  },

  A3: {
    whyItMatters: "Eleva el estándar de entrega: calidad no es estética, es decisión trazable y ejecutable.",
    whatToDo: "Antes de cerrar cualquier pieza, valida contexto, evidencia, decisión, riesgos y próximos pasos con responsable.",
    commonMistake: "Dar por terminado algo “bonito” pero sin criterio ni accountability.",
    keyLearnings: ["Problema delimitado", "Decisión explícita", "Riesgos identificados", "Responsable y fecha definidos"],
  },
  A4: {
    whyItMatters: "Los valores son reglas operativas, no slogans. Definen cómo se trabaja bajo presión.",
    whatToDo: "Practica humanidad en el lenguaje, colaboración en documentación y adaptabilidad basada en evidencia.",
    commonMistake: "Invocar valores solo en discurso, pero decidir por conveniencia o orgullo.",
    keyLearnings: ["Cuidé forma y fondo de la comunicación", "Dejé documentación compartida", "Ajusté decisión ante evidencia"],
  },
  A5: {
    whyItMatters: "Los no negociables protegen al equipo, al cliente y a la reputación institucional.",
    whatToDo: "Ante presión por atajos, sostén método mínimo: trazabilidad, resguardo de datos y alcance realista.",
    commonMistake: "Aceptar compromisos inviables para “resolver rápido”.",
    keyLearnings: ["No prometí lo que no puedo sostener", "Resguardé información sensible", "No omití trazabilidad mínima"],
  },
  A6: {
    whyItMatters: "Ética operativa consistente evita conflictos, protege a personas y da legitimidad a la intervención.",
    whatToDo: "Registra decisiones con contexto, declara conflictos tempranamente y usa canales formales.",
    commonMistake: "Resolver por canal informal temas que requieren trazabilidad o control de acceso.",
    keyLearnings: ["Decisión registrada con contexto", "Conflictos declarados", "Canal formal utilizado"],
  },
  A7: {
    whyItMatters: "Escalar a tiempo reduce exposición legal, reputacional y operativa.",
    whatToDo: "Si detectas tensión crítica entre urgencia y calidad, documenta riesgo y escala con recomendación clara.",
    commonMistake: "Normalizar excepciones frecuentes hasta que se vuelven crisis.",
    keyLearnings: ["Riesgo identificado", "Escalamiento ejecutado", "Criterio de decisión documentado"],
  },
  "Reflexión guiada sugerida": {
    whyItMatters: "La reflexión transforma contenido en criterio aplicable al rol.",
    whatToDo: "Formula compromisos concretos: qué harás distinto, qué límites sostendrás y cuándo escalarás.",
    commonMistake: "Responder de forma genérica sin conexión con decisiones reales del trabajo.",
    keyLearnings: ["Definí 2 compromisos operativos", "Identifiqué 1 riesgo de incoherencia", "Definí cómo lo escalaría"],
  },
};

export const moduleCLessonGuides: Record<string, LessonGuide> = {
  C1: {
    whyItMatters: "Sin roles claros y Kanban visible, la producción creativa acumula ambigüedad y riesgo operativo.",
    whatToDo: "Verifica al inicio de cada proyecto: Product Owner definido, equipo con rol claro y tablero Kanban activo.",
    commonMistake: "Aplicar rituales Scrum (reuniones, tablero) sin internalizar el principio de transparencia y roles.",
    keyLearnings: ["Entiendo los tres roles adaptados a THO", "Sé cuándo el Kanban es obligatorio", "Identifico qué genera ambigüedad operativa"],
  },
  C2: {
    whyItMatters: "La estructura documental garantiza que cualquier integrante del equipo pueda retomar un proyecto sin perder contexto.",
    whatToDo: "Antes de crear carpetas, verifica que sigues la estructura estándar. Ante duda, consulta antes de improvisar.",
    commonMistake: "Guardar archivos en escritorios o servicios externos porque 'es temporal'.",
    keyLearnings: ["Conozco la estructura obligatoria de XX_Instagram", "Sé dónde va cada tipo de archivo", "No mezclo años activos e históricos"],
  },
  C3: {
    whyItMatters: "El Excel es el eje de trazabilidad de la operación creativa. Sin él, no hay continuidad ni accountability.",
    whatToDo: "Actualiza el Excel en cada etapa: al iniciar la pieza, al enviar para revisión, al publicar y al cerrar.",
    commonMistake: "Completar el Excel al final del mes en lugar de actualizarlo en tiempo real.",
    keyLearnings: ["Conozco los 6 campos mínimos obligatorios", "Mantengo la correspondencia Excel–carpeta", "Actualizo el estado en cada etapa"],
  },
  C4: {
    whyItMatters: "Un Kickoff incompleto genera producción sin criterio claro, lo que resulta en revisiones circulares y trabajo perdido.",
    whatToDo: "Antes de producir, completa el checklist de Kickoff. Si algún punto falta, detente y resuélvelo.",
    commonMistake: "Empezar a producir antes de tener un Product Owner funcional del lado del cliente.",
    keyLearnings: ["Conozco el checklist de Kickoff", "Identifico señales de alerta antes de producir", "No produzco sin brief general validado"],
  },
  C5: {
    whyItMatters: "Producir sin revisión interna transfiere riesgo al cliente y expone al equipo a feedback destructivo.",
    whatToDo: "Antes de enviar cualquier pieza al cliente, aplica el checklist de revisión interna sin excepciones.",
    commonMistake: "Enviar directamente al cliente sin revisión interna porque 'se ve bien' o 'hay urgencia'.",
    keyLearnings: ["Aplico el checklist de revisión antes de cada envío", "Uso nomenclatura de versiones correcta", "Solo acepto feedback consolidado del Product Owner"],
  },
  C6: {
    whyItMatters: "Sin DoD, el criterio de entrega es subjetivo y cada entrega puede interpretarse de forma diferente.",
    whatToDo: "Antes de marcar una pieza como lista, verifica los 7 criterios de la DoD. Si falta uno, no está done.",
    commonMistake: "Considerar una pieza terminada porque 'se ve bien' o 'el cliente la va a amar'.",
    keyLearnings: ["Conozco los 7 criterios de la DoD creativa", "Distingo estética de método", "No marco como done sin cumplir la DoD completa"],
  },
  C7: {
    whyItMatters: "El cierre incompleto acumula deuda documental que se paga como confusión en el siguiente período.",
    whatToDo: "Al publicar, sigue los 5 pasos de cierre sin excepción. Documenta aprendizajes en el canal formal.",
    commonMistake: "Considerar cerrado el ciclo en el momento de la publicación, sin registrar enlace ni verificar carpeta.",
    keyLearnings: ["Sigo los 5 pasos de cierre", "Documento aprendizajes relevantes", "Verifico continuidad al cerrar cada pieza"],
  },
  C8: {
    whyItMatters: "Un error de manejo de información sensible puede comprometer la confianza del cliente y la reputación institucional.",
    whatToDo: "Ante cualquier duda sobre si algo es sensible, trátalo como sensible. Usa siempre Teams, no canales informales.",
    commonMistake: "Compartir material del cliente por WhatsApp para pedir opinión rápida o para trabajar desde otro dispositivo.",
    keyLearnings: ["Identifico qué es información sensible en operación creativa", "Conozco las reglas de manejo", "Reconozco los escenarios de riesgo más comunes"],
  },
  C9: {
    whyItMatters: "La dependencia de una sola persona es un riesgo operativo. La continuidad protege al equipo y al cliente.",
    whatToDo: "Al cerrar cada pieza y cada período, aplica el test de continuidad. Si falla, el trabajo no está terminado.",
    commonMistake: "Confundir compromiso personal con continuidad institucional: el trabajo debe funcionar sin la persona que lo hizo.",
    keyLearnings: ["Conozco el test de continuidad", "Sé qué construye y qué destruye continuidad", "Aplico la regla final: sin trazabilidad no está done"],
  },
};

export const moduleDLessonGuides: Record<string, LessonGuide> = {
  D1: {
    whyItMatters: "Define el encuadre completo del trabajo de asesoría en THO: no ejecutar tareas, no validar decisiones ya tomadas, sino intervenir sistemas complejos con método.",
    whatToDo: "Antes de cada asesoría, verifica: ¿estás diagnosticando o validando? ¿Tu recomendación considera cultura, poder e incentivos o solo la lógica formal del problema?",
    commonMistake: "Tratar la asesoría como producción de documentos. El valor está en el criterio aplicado, no en el objeto entregado.",
    keyLearnings: ["Distingo asesorar de ejecutar o validar", "Identifico las 6 dimensiones de un sistema organizacional", "Sé qué significa 'hacer visible la complejidad'"],
  },
  D2: {
    whyItMatters: "Sin marcos explícitos, el criterio es no auditable. Los marcos protegen institucionalmente y mejoran la calidad del análisis.",
    whatToDo: "Al iniciar un diagnóstico, identifica cuál de los cuatro marcos es más relevante para el contexto. Nómbralo en el documento.",
    commonMistake: "Aplicar los cuatro marcos mecánicamente en lugar de seleccionar el más pertinente según el tipo de problema.",
    keyLearnings: ["Puedo explicar los 4 marcos base", "Sé cuándo es más relevante cada uno", "Entiendo cómo se superponen en la práctica"],
  },
  D3: {
    whyItMatters: "La secuencia protege la calidad del trabajo. Saltarse fases acumula riesgos que aparecen más tarde.",
    whatToDo: "Al iniciar una intervención, mapea en qué fase estás y qué produce esa fase. No avances a la siguiente sin el insumo correspondiente.",
    commonMistake: "Saltarse el diagnóstico por presión de tiempo y llegar al diseño sin saber cuál es el problema real.",
    keyLearnings: ["Conozco las 6 fases y qué produce cada una", "Sé cuándo el cliente está en cada fase", "Identifico la pregunta clave de cada etapa"],
  },
  D4: {
    whyItMatters: "Un diagnóstico descriptivo acumula datos pero no produce claridad. Solo la interpretación estructura la información para que el cliente pueda actuar.",
    whatToDo: "Al finalizar el diagnóstico, verifica que tienes una hipótesis sobre causas, evidencia que la respalde y actores críticos identificados.",
    commonMistake: "Presentar al cliente un informe lleno de información sin una hipótesis central que la articule.",
    keyLearnings: ["Distingo diagnóstico descriptivo de interpretativo", "Conozco las herramientas disponibles", "Sé qué debe producir un diagnóstico completo"],
  },
  D5: {
    whyItMatters: "El diseño que presenta solo una alternativa desplaza la decisión de quien debe tomarla y expone a THO si la implementación no funciona.",
    whatToDo: "Presenta siempre dos o más alternativas con supuestos, ventajas, limitaciones y riesgos explícitos. Deja la decisión al cliente.",
    commonMistake: "Presentar 'la solución óptima' en lugar de alternativas con implicaciones claras.",
    keyLearnings: ["Conozco los 5 principios del diseño estratégico", "Sé estructurar cada alternativa con sus 5 componentes", "Identifico los 4 tipos de riesgo a evaluar"],
  },
  D6: {
    whyItMatters: "Sin DoD acordada previamente, las revisiones son potencialmente infinitas y el criterio de 'hecho' queda en manos del cliente al momento de recibir, no de THO al momento de producir.",
    whatToDo: "Al cerrar la propuesta de cada proyecto, define explícitamente el DoD de cada entregable comprometido. Verifica siempre el piso mínimo antes de enviar cualquier documento.",
    commonMistake: "Asumir que 'el cliente sabrá cuando está listo'. Sin DoD acordada, el criterio de calidad es siempre subjetivo.",
    keyLearnings: ["Distingo piso mínimo universal de DoD específica", "Entiendo la diferencia entre entregables analíticos e instrumentales", "Sé cuándo y cómo pactar el DoD en la propuesta"],
  },
  D7: {
    whyItMatters: "Sin trazabilidad, THO no puede defender su criterio ante conflictos ni garantizar continuidad cuando el equipo cambia.",
    whatToDo: "Registra en tiempo real: decisiones con criterio, cambios de alcance, riesgos identificados y acuerdos con el cliente.",
    commonMistake: "Documentar al final del proyecto cuando el contexto y los detalles ya se perdieron.",
    keyLearnings: ["Sé qué registrar en una asesoría", "Conozco el estándar de trazabilidad THO", "Distingo documentación obligatoria de valor agregado"],
  },
  D8: {
    whyItMatters: "La independencia de criterio es el activo central de THO. Sin ella, el trabajo pierde su valor diferencial.",
    whatToDo: "Si sientes presión para exagerar, omitir o ajustar conclusiones, nómbralo explícitamente antes de ceder.",
    commonMistake: "Omitir riesgos porque el cliente no quiere escucharlos, justificándolo como 'proteger la relación'.",
    keyLearnings: ["Conozco las 3 prohibiciones éticas", "Sé identificar cuándo debo declinar", "Entiendo por qué la independencia es el activo central de THO"],
  },
  D9: {
    whyItMatters: "La base instalada en este módulo es condición necesaria pero no suficiente. La profundización define la capacidad de THO para abordar proyectos de mayor complejidad.",
    whatToDo: "Identifica qué track es más relevante para tus proyectos actuales y coordina la profundización con el director.",
    commonMistake: "Asumir que la formación avanzada es optativa o diferible indefinidamente.",
    keyLearnings: ["Conozco los 5 tracks de profundización", "Sé cuál es más relevante para mi rol", "Entiendo la lógica de especialización gradual en THO"],
  },
  D10: {
    whyItMatters: "Una señal de alerta ignorada no desaparece; se acumula y escala. El costo de nombrarla a tiempo siempre es menor.",
    whatToDo: "Al detectar cualquiera de las 5 señales, nómbrala explícitamente al cliente o al equipo. No continúes en silencio.",
    commonMistake: "Racionalizar señales de alerta como 'parte del proceso' para evitar conversaciones difíciles.",
    keyLearnings: ["Conozco las 5 señales de riesgo metodológico", "Sé cuál es la respuesta correcta ante cada una", "Entiendo que nombrar lo incómodo es parte del estándar profesional"],
  },
  "Cierre del módulo": {
    whyItMatters: "El cierre consolida el criterio del módulo: asesorar es mejorar decisiones organizacionales, no producir documentos.",
    whatToDo: "Identifica en qué proyectos actuales puedes aplicar el DoD, la trazabilidad y los marcos conceptuales de este módulo.",
    commonMistake: "Completar el módulo sin traducir el contenido en compromisos operativos concretos para el trabajo real.",
    keyLearnings: ["Tengo claro qué significa asesorar en THO", "Sé qué aplico desde el día uno y qué viene en formación avanzada", "Identifico mi próximo paso de desarrollo en asesorías"],
  },
};
