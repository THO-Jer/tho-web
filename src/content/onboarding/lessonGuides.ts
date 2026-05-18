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
