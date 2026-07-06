/**
 * Actividades interactivas del Módulo A (piloto de lecciones no pasivas).
 *
 * Cada lección A0-A7 tiene 2-3 actividades (checkpoint / escenario de decisión /
 * think-then-reveal) redactadas a partir del contenido editorial de moduleA.ts.
 * Se integran en los adaptadores de lessonDocs.ts en puntos específicos del
 * relato, y gatean el avance: la lección se puede completar solo al responderlas.
 *
 * No afectan el quiz del módulo: son refuerzo formativo con feedback inmediato.
 */

import type { LessonBlock } from "@/content/onboarding/blocks";

// ---------------------------------------------------------------------------
// A0 · ¿Qué es el onboarding y por qué existe?
// ---------------------------------------------------------------------------

export const checkA0: LessonBlock = {
  kind: "check",
  question: "¿Cuál es la función principal del onboarding en THO?",
  options: [
    {
      text: "Informar sobre la empresa y sus beneficios.",
      feedback: "El onboarding en THO no está diseñado para informar. Está diseñado para alinear criterio.",
    },
    {
      text: "Alinear criterio: instalar un marco común de calidad, ética y método.",
      correct: true,
      feedback: "Exacto. Sin estándares explícitos, cada persona define calidad y método según su propio marco, y eso genera fricción invisible y riesgos acumulativos.",
    },
    {
      text: "Cumplir un requisito administrativo de ingreso.",
      feedback: "No es una inducción administrativa: es un mecanismo de coherencia institucional.",
    },
  ],
};

export const revealA0: LessonBlock = {
  kind: "reveal",
  prompt: "Cuando choquen urgencia y trazabilidad, ¿qué hace el onboarding por ti?",
  hint: "Piensa en la sección de tensión real que acabas de leer.",
  answer: [
    "El onboarding no elimina esa tensión. Define cómo se resuelve.",
    "Siempre habrá tensión entre velocidad y método, urgencia y trazabilidad, resultado y estándar. Lo que instala el onboarding es el criterio para navegarla sin improvisar.",
  ],
};

// ---------------------------------------------------------------------------
// A1 · Propósito organizacional
// ---------------------------------------------------------------------------

export const checkA1: LessonBlock = {
  kind: "check",
  question: "En THO, el propósito opera principalmente como…",
  options: [
    {
      text: "Un mensaje inspirador que motiva al equipo.",
      feedback: "El propósito no es un mensaje ni motiva: ordena. Cuando se convierte en discurso, pierde capacidad de orientar.",
    },
    {
      text: "Un criterio de decisión: un filtro para proyectos, riesgos y prioridades.",
      correct: true,
      feedback: "Correcto. Define qué proyectos aceptamos, qué riesgos asumimos, qué tensiones explicitamos y qué priorizamos cuando hay conflicto.",
    },
    {
      text: "Una narrativa de marketing para diferenciarse.",
      feedback: "Eso es justamente lo que el propósito NO es: cuando se vuelve narrativa, deja de orientar decisiones reales.",
    },
  ],
};

export const decisionA1: LessonBlock = {
  kind: "decision",
  scenario: [
    "Un proyecto es rentable y técnicamente viable, pero implica minimizar públicamente un riesgo socioambiental relevante.",
  ],
  prompt: "¿Cómo lo resuelves?",
  options: [
    {
      text: "Lo acepto: es rentable y podemos ejecutarlo bien.",
      verdict: "incorrecto",
      outcome: "La pregunta no es \"¿podemos hacerlo?\". Aceptarlo separa rentabilidad de responsabilidad estratégica y omite un riesgo crítico por conveniencia: operas fuera del propósito.",
    },
    {
      text: "Lo evalúo contra el propósito: ¿es coherente con fortalecer organizaciones y conectarlas legítimamente con su entorno?",
      verdict: "correcto",
      outcome: "Esa es la pregunta correcta. Cuando hay tensión entre ingreso y coherencia, el propósito decide. Minimizar públicamente un riesgo relevante no es coherente con legitimidad institucional.",
    },
    {
      text: "Lo acepto, pero pido que lo ejecute otra persona del equipo.",
      verdict: "riesgoso",
      outcome: "Delegar no resuelve la incoherencia: la organización sigue asumiendo el encargo. El propósito es un filtro institucional, no una preferencia personal.",
    },
  ],
};

export const revealA1: LessonBlock = {
  kind: "reveal",
  prompt: "¿Cuándo se nota el propósito en el trabajo diario?",
  answer: [
    "Cuando no hay tensión, el propósito no se nota. Cuando hay tensión, el propósito decide.",
    "Si no puedes explicar cómo tu decisión fortalece organización y entorno al mismo tiempo, probablemente estás operando fuera del propósito.",
  ],
};

// ---------------------------------------------------------------------------
// A2 · Propósito vs Propuesta de Valor
// ---------------------------------------------------------------------------

export const checkA2: LessonBlock = {
  kind: "check",
  question: "¿Cuál de estas características corresponde a la propuesta de valor (y no al propósito)?",
  options: [
    {
      text: "No cambia según cliente ni se adapta por conveniencia.",
      feedback: "Eso describe al propósito: es estructural. La propuesta de valor, en cambio, es relacional.",
    },
    {
      text: "Es específica, comunicable, comercial y puede evolucionar.",
      correct: true,
      feedback: "Correcto. La propuesta de valor responde \"¿por qué un cliente debería elegirnos?\" y puede evolucionar; el propósito responde \"¿para qué existimos?\" y es estructural.",
    },
    {
      text: "Define para qué existimos como organización.",
      feedback: "Esa es la pregunta del propósito. La propuesta de valor responde por qué un cliente debería elegirnos.",
    },
  ],
};

export const decisionA2: LessonBlock = {
  kind: "decision",
  scenario: [
    "Un cliente pide una campaña de comunicación que maquilla un problema estructural de su organización.",
    "Técnicamente, el equipo puede ejecutarla sin problema.",
  ],
  prompt: "¿Qué haces?",
  options: [
    {
      text: "La ejecuto: la propuesta de valor dice que sabemos hacer campañas.",
      verdict: "incorrecto",
      outcome: "Vender algo que contradice el propósito genera una brecha interna: tensiones operativas, desgaste y pérdida de legitimidad. No vendemos lo que no podemos defender.",
    },
    {
      text: "Propongo redirigir el encargo: abordar el problema estructural en vez de maquillarlo.",
      verdict: "correcto",
      outcome: "La decisión se resuelve alineando ambos planos: la propuesta de valor (podemos ejecutar) subordinada al propósito (no contribuir a debilitar legitimidad institucional).",
    },
    {
      text: "Acepto la campaña pero suavizo el tono para que el maquillaje sea menos evidente.",
      verdict: "riesgoso",
      outcome: "Suavizar el tono no cierra la brecha: sigues diseñando una solución que erosiona confianza. La incoherencia entre propósito y propuesta de valor se paga después.",
    },
  ],
};

// ---------------------------------------------------------------------------
// A3 · Cómo trabajamos en THO
// ---------------------------------------------------------------------------

export const decisionA3: LessonBlock = {
  kind: "decision",
  scenario: [
    "Tienes un plazo apretado y el diagnóstico está a medias. El cliente quiere ver avances de ejecución esta semana.",
  ],
  prompt: "¿Qué indica el método THO?",
  options: [
    {
      text: "Ejecutar ya y completar el diagnóstico sobre la marcha.",
      verdict: "incorrecto",
      outcome: "Principio no negociable: no ejecutar sin diagnóstico mínimo. No diseñamos soluciones sobre diagnósticos superficiales; la calidad se vuelve variable.",
    },
    {
      text: "Acotar el alcance de esta semana para sostener el diagnóstico mínimo antes de ejecutar.",
      verdict: "correcto",
      outcome: "Comprensión antes que propuesta: el ciclo parte por comprender y diseñar. Ajustar alcance protege el estándar sin ignorar la urgencia del cliente.",
    },
    {
      text: "Ejecutar, pero dejando constancia por correo de que faltó diagnóstico.",
      verdict: "riesgoso",
      outcome: "Documentar no reemplaza el método: la trazabilidad registra decisiones bien tomadas, no blinda decisiones fuera de estándar.",
    },
  ],
};

export const checkA3: LessonBlock = {
  kind: "check",
  question: "¿Qué caracteriza al ciclo operativo de THO (Comprender → Diseñar → Ejecutar → Documentar → Evaluar → Ajustar)?",
  options: [
    {
      text: "Es una secuencia lineal que termina en la entrega.",
      feedback: "No basta con entregar: el cierre incluye evaluación, aprendizajes y riesgos residuales. Y luego se ajusta.",
    },
    {
      text: "Es un ciclo, no una línea recta.",
      correct: true,
      feedback: "Exacto. Cada proyecto deja aprendizaje institucional que alimenta el siguiente ciclo.",
    },
    {
      text: "Aplica solo a proyectos grandes.",
      feedback: "El modelo operativo es explícito y aplica como estándar: la calidad no depende del tamaño del encargo ni del ánimo del día.",
    },
  ],
};

export const revealA3: LessonBlock = {
  kind: "reveal",
  prompt: "¿De qué depende la calidad en THO?",
  answer: [
    "La calidad en THO no depende del ánimo del día. Depende del estándar.",
    "El método no restringe la creatividad: la encuadra.",
  ],
};

// ---------------------------------------------------------------------------
// A4 · ¿Qué significa que un trabajo esté "Done"?
// ---------------------------------------------------------------------------

export const checkA4: LessonBlock = {
  kind: "check",
  question: "Un informe está completo y a tiempo, pero no explicita un riesgo reputacional detectado durante el proceso. ¿Está \"Done\"?",
  options: [
    {
      text: "Sí: cumple con lo pedido y con el cronograma.",
      feedback: "Eso es conformidad, no calidad. \"Cumple con lo pedido literal\" es justamente lo que Done NO es.",
    },
    {
      text: "No: \"riesgos explícitos\" es uno de los criterios DoD de THO.",
      correct: true,
      feedback: "Correcto. Un trabajo está Done cuando, entre otros criterios, no se ocultaron tensiones o riesgos relevantes. Desde el estándar THO, este informe no está cerrado.",
    },
    {
      text: "Depende de si el cliente pregunta por los riesgos.",
      feedback: "\"El cliente no reclamó\" no es un criterio de calidad. Done es cumplimiento verificable, no percepción.",
    },
  ],
};

export const decisionA4: LessonBlock = {
  kind: "decision",
  scenario: [
    "Terminaste una pieza crítica a las 23:00. El envío al cliente es mañana a las 9:00 y nadie más del equipo la ha visto.",
  ],
  prompt: "¿Qué haces?",
  options: [
    {
      text: "La envío ahora: está completa y el plazo se cumple.",
      verdict: "incorrecto",
      outcome: "Falta revisión cruzada, un criterio DoD: otro miembro del equipo debe revisar el contenido crítico. Enviar sin revisión es cerrar sin estándar.",
    },
    {
      text: "Pido revisión cruzada a primera hora y la envío validada antes de las 9:00.",
      verdict: "correcto",
      outcome: "Cumples plazo y estándar: la pieza pasa por otro criterio antes de cerrarse. Cerrar un trabajo es asumir responsabilidad sobre su calidad.",
    },
    {
      text: "La envío ahora y pido que alguien la revise durante el día.",
      verdict: "riesgoso",
      outcome: "La revisión posterior no evita que el cliente reciba una pieza sin validar. Si aparece un error, ya está fuera. La prisa no sustituye el control de calidad.",
    },
  ],
};

// ---------------------------------------------------------------------------
// A5 · Valores organizacionales en acción
// ---------------------------------------------------------------------------

export const checkA5: LessonBlock = {
  kind: "check",
  question: "En THO, Humanidad significa…",
  options: [
    {
      text: "Ser amable y evitar conflictos con actores territoriales.",
      feedback: "Humanidad no es amabilidad. Es responsabilidad: con la dignidad de personas y comunidades, y con el relato institucional.",
    },
    {
      text: "Responsabilidad: no instrumentalizar actores, no simplificar conflictos por conveniencia, no usar datos sensibles sin criterio.",
      correct: true,
      feedback: "Correcto. Y lo que la invalida: narrativas manipuladoras, omisiones estratégicas deliberadas y lenguaje que minimiza impacto real.",
    },
    {
      text: "Priorizar siempre a las personas sobre los resultados del proyecto.",
      feedback: "No es un eslogan de prioridades: es un criterio de comportamiento con exigencias y conductas que lo invalidan.",
    },
  ],
};

export const checkA5b: LessonBlock = {
  kind: "check",
  question: "¿Cuál de estas conductas invalida el valor de Colaboración?",
  options: [
    {
      text: "Dar feedback explícito aunque incomode.",
      feedback: "Al revés: el feedback explícito es una exigencia de la colaboración, no una falta.",
    },
    {
      text: "Trabajar en silo y cerrar entregables sin revisión externa.",
      correct: true,
      feedback: "Correcto. Colaboración no es cordialidad, es trabajo compartido: revisión cruzada real, feedback explícito y escucha activa entre roles.",
    },
    {
      text: "Pedir una segunda opinión en un tema crítico.",
      feedback: "Eso es exactamente lo que la colaboración exige: las decisiones unilaterales en temas críticos son las que la invalidan.",
    },
  ],
};

export const revealA5: LessonBlock = {
  kind: "reveal",
  prompt: "¿Qué pasa cuando los valores chocan entre sí? (Ej.: colaboración ralentiza velocidad, humanidad tensiona rentabilidad.)",
  answer: [
    "El estándar no elimina la tensión. Define cómo se navega.",
    "Si un comportamiento contradice un valor, no es una variación estilística: es una desviación cultural.",
  ],
};

// ---------------------------------------------------------------------------
// A6 · Lo que no es negociable en THO
// ---------------------------------------------------------------------------

export const decisionA6: LessonBlock = {
  kind: "decision",
  scenario: [
    "Un cliente presiona por acortar etapas metodológicas para cumplir plazos políticos.",
  ],
  prompt: "¿Cómo respondes?",
  options: [
    {
      text: "Acepto el recorte: el cliente manda y el plazo es real.",
      verdict: "incorrecto",
      outcome: "La presión comercial no redefine el estándar. La pregunta no es \"¿podemos hacerlo?\" sino \"¿podemos sostenerlo profesionalmente si algo falla?\".",
    },
    {
      text: "Explicito la tensión internamente, documento la decisión y escalo si afecta coherencia estratégica.",
      verdict: "correcto",
      outcome: "Ese es el protocolo ante conflicto de límites: explicitar, documentar, escalar si corresponde y priorizar estándar sobre comodidad.",
    },
    {
      text: "Cedo parcialmente en algunas etapas sin avisar, para no incomodar a nadie.",
      verdict: "riesgoso",
      outcome: "Ceder sin explicitar ni documentar deja a la organización sin trazabilidad ni defensa. Silenciar la tensión para evitar incomodidad erosiona legitimidad.",
    },
  ],
};

export const checkA6: LessonBlock = {
  kind: "check",
  question: "Cuando un límite institucional se tensiona, ¿cuál es el primer paso del protocolo?",
  options: [
    {
      text: "Escalar de inmediato a liderazgo.",
      feedback: "Escalar es el tercer paso, y solo si afecta coherencia estratégica. Antes hay que explicitar y documentar.",
    },
    {
      text: "Explicitarlo internamente.",
      correct: true,
      feedback: "Correcto. La secuencia es: explicitar internamente → documentar la decisión → escalar si afecta coherencia estratégica → priorizar estándar sobre comodidad.",
    },
    {
      text: "Documentar la decisión tomada.",
      feedback: "Documentar es el segundo paso. Primero se explicita internamente: no se puede documentar lo que aún no se nombró.",
    },
  ],
};

export const revealA6: LessonBlock = {
  kind: "reveal",
  prompt: "¿Los límites hacen rígida a la organización?",
  answer: [
    "Los límites no hacen rígida a una organización. La hacen confiable.",
    "No restringen: protegen coherencia, reputación y estándar.",
  ],
};

// ---------------------------------------------------------------------------
// A7 · Cómo actuar ante tensiones críticas
// ---------------------------------------------------------------------------

export const decisionA7: LessonBlock = {
  kind: "decision",
  scenario: [
    "Detectas presión por omitir información relevante en un informe que se entrega esta semana.",
  ],
  prompt: "¿Cuál es tu primer movimiento?",
  options: [
    {
      text: "Nombrar el problema explícitamente, sin asumir que es menor.",
      verdict: "correcto",
      outcome: "Paso 1 del protocolo: Explicitar. Luego documentar la situación y alternativas, consultar un segundo criterio interno y decidir priorizando método y coherencia.",
    },
    {
      text: "Resolverlo por mi cuenta, en silencio, ajustando el informe como me parezca.",
      verdict: "incorrecto",
      outcome: "Saltarse el protocolo deja la decisión sin trazabilidad ni segundo criterio. Los riesgos éticos deben tratarse explícitamente, no en privado.",
    },
    {
      text: "Esperar a ver si alguien más lo nota antes de decir algo.",
      verdict: "riesgoso",
      outcome: "La incomodidad no es suficiente, pero ignorarla sistemáticamente es riesgoso. El impacto de estos riesgos puede no ser inmediato, pero sí acumulativo.",
    },
  ],
};

export const checkA7: LessonBlock = {
  kind: "check",
  question: "Según la matriz de decisión: una situación de alto impacto + incertidumbre, ¿cómo se trata?",
  options: [
    {
      text: "Se resuelve localmente.",
      feedback: "Resolver localmente aplica a bajo impacto + bajo riesgo. Con alto impacto e incertidumbre, falta información para decidir solo.",
    },
    {
      text: "Se escala de inmediato.",
      feedback: "Escalar directo corresponde a alto impacto + alto riesgo. Con incertidumbre, primero se documenta y consulta.",
    },
    {
      text: "Se documenta y se consulta.",
      correct: true,
      feedback: "Correcto. Alto impacto + incertidumbre → documentar y consultar. Así se resuelve con criterio compartido antes de escalar o decidir.",
    },
  ],
};

export const revealA7: LessonBlock = {
  kind: "reveal",
  prompt: "¿Escalar una tensión crítica es dramatizar?",
  answer: [
    "Escalar no es dramatizar. Es proteger calidad y legitimidad.",
    "El escalamiento no es debilidad: es responsabilidad compartida. La ética operativa no busca perfección; busca coherencia bajo presión.",
  ],
};
