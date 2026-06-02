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
