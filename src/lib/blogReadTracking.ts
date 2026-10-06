/**
 * Seguimiento de lectura del blog en el navegador (solo cliente).
 *
 * - Recuerda qué entradas leyó la persona en los últimos 30 días, para que el
 *   formulario de contacto pueda indicar qué entrada(s) del blog influyeron.
 * - Evita contar más de una lectura por entrada, por navegador y por día.
 *
 * Solo guarda slugs y fechas en localStorage. Nada personal.
 */

const READS_KEY = "tho_blog_reads";
const COUNTED_KEY = "tho_blog_counted";
const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_READS = 15;

type ReadEntry = { slug: string; ts: number };

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // modo privado / almacenamiento bloqueado: ignorar
  }
}

function recentReads(): ReadEntry[] {
  const now = Date.now();
  const list = readJson<unknown>(READS_KEY, []);
  if (!Array.isArray(list)) return [];
  return list
    .filter((item): item is ReadEntry => Boolean(item) && typeof item.slug === "string" && typeof item.ts === "number")
    .filter((item) => now - item.ts <= WINDOW_MS);
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** Registra que la persona leyó esta entrada (la más reciente queda al final). */
export function markBlogRead(slug: string) {
  const reads = recentReads().filter((item) => item.slug !== slug);
  reads.push({ slug, ts: Date.now() });
  writeJson(READS_KEY, reads.slice(-MAX_READS));
}

/** true si esta lectura aún no se contó hoy en este navegador (y la marca). */
export function claimDailyView(slug: string) {
  const today = todayKey();
  const counted = readJson<Record<string, string>>(COUNTED_KEY, {});
  const safe = typeof counted === "object" && counted !== null && !Array.isArray(counted) ? counted : {};
  if (safe[slug] === today) return false;

  // Limpia días anteriores para que la clave no crezca sin límite.
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(safe)) if (value === today) next[key] = value;
  next[slug] = today;
  writeJson(COUNTED_KEY, next);
  return true;
}

/**
 * Para adjuntar al envío de un formulario:
 *   blog_post = última entrada leída (últimos 30 días)
 *   blog_read = todas las entradas leídas, separadas por coma
 */
export function getBlogTouch(): Record<string, string> {
  const reads = recentReads();
  if (!reads.length) return {};
  return {
    blog_post: reads[reads.length - 1].slug,
    blog_read: reads.map((item) => item.slug).join(","),
  };
}
