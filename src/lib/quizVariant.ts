/**
 * Variantes deterministas del quiz de onboarding.
 *
 * Cada intento de evaluación recibe una "variante": un subconjunto aleatorio
 * del banco de preguntas del módulo, con orden de preguntas y de alternativas
 * barajado. La aleatorización es determinista a partir de una semilla
 * (email|módulo|n° de intento), de modo que:
 *
 *  - El servidor NO necesita persistir qué variante sirvió: al corregir,
 *    regenera la misma variante con la misma semilla.
 *  - Cada intento fallido produce una variante distinta (cambia el n° de
 *    intento), evitando aprobar por memoria de posiciones.
 *
 * Módulo puro (sin dependencias): usable en server y client.
 */

export type QuizQuestionLike = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  topic: string;
};

/** Hash simple de string a uint32 (xmur3, una ronda). */
function hashSeed(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** PRNG mulberry32: rápido, determinista, suficiente para barajar. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates con PRNG inyectado. No muta el arreglo original. */
function seededShuffle<T>(items: T[], rand: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Construye la variante de quiz para una semilla dada:
 * muestrea `count` preguntas del banco (o todas si el banco es menor),
 * baraja su orden y baraja las alternativas de cada una, remapeando
 * `correctIndex` a la nueva posición.
 */
export function buildQuizVariant<T extends QuizQuestionLike>(
  bank: T[],
  seed: string,
  count: number,
): T[] {
  const rand = mulberry32(hashSeed(seed));
  const sampled = seededShuffle(bank, rand).slice(0, Math.max(1, Math.min(count, bank.length)));
  return sampled.map((question) => {
    const order = seededShuffle(
      question.options.map((_, idx) => idx),
      rand,
    );
    return {
      ...question,
      options: order.map((idx) => question.options[idx]),
      correctIndex: order.indexOf(question.correctIndex),
    };
  });
}

/** Semilla canónica de variante: email normalizado + módulo + n° de intento. */
export function quizVariantSeed(email: string, moduleKey: string, attempts: number): string {
  return `${email.trim().toLowerCase()}|${moduleKey}|${attempts}`;
}
