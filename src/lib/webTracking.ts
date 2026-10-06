/**
 * Medición de visitas del sitio en el navegador (solo cliente).
 *
 * - Clasifica cada visita por canal (Google, LinkedIn, IA, directo…) a partir
 *   del referrer y de los parámetros UTM, al inicio de la visita.
 * - Recuerda el PRIMER canal por el que llegó la persona (90 días) y el de la
 *   visita actual, para adjuntarlos a los formularios (ver getUtm en lib/utm.ts).
 *
 * Solo guarda canal, fuente y página de entrada. Nada personal.
 */

import { type Channel, normalizePath } from "@/lib/webChannels";

const SESSION_KEY = "tho_visit";
const FIRST_KEY = "tho_first_touch";
const SESSION_IDLE_MS = 30 * 60 * 1000;
const FIRST_TOUCH_MS = 90 * 24 * 60 * 60 * 1000;

export type Touch = { channel: Channel; source: string; landing: string; ts: number };
type Visit = Touch & { last: number; seen: string[] };

function read<T>(storage: "local" | "session", key: string): T | null {
  try {
    const raw = (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(storage: "local" | "session", key: string, value: unknown) {
  try {
    (storage === "local" ? window.localStorage : window.sessionStorage).setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento bloqueado: ignorar
  }
}

const SEARCH = [/(^|\.)google\./, /(^|\.)bing\.com$/, /(^|\.)duckduckgo\.com$/, /(^|\.)yahoo\./, /(^|\.)ecosia\.org$/, /(^|\.)search\.brave\.com$/, /(^|\.)yandex\./];
const SOCIAL: Array<[RegExp, string]> = [
  [/(^|\.)linkedin\.com$|^lnkd\.in$|com\.linkedin\.android/, "linkedin"],
  [/(^|\.)instagram\.com$|com\.instagram\.android/, "instagram"],
  [/(^|\.)facebook\.com$|^fb\.me$|com\.facebook\./, "facebook"],
  [/(^|\.)(x|twitter)\.com$|^t\.co$/, "x"],
  [/(^|\.)youtube\.com$|^youtu\.be$/, "youtube"],
  [/(^|\.)threads\.net$/, "threads"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
];
const AI: Array<[RegExp, string]> = [
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "chatgpt"],
  [/(^|\.)perplexity\.ai$/, "perplexity"],
  [/(^|\.)gemini\.google\.com$/, "gemini"],
  [/(^|\.)copilot\.microsoft\.com$/, "copilot"],
  [/(^|\.)claude\.ai$/, "claude"],
];
const MAIL: Array<[RegExp, string]> = [
  [/^mail\.google\.com$|com\.google\.android\.gm/, "gmail"],
  [/(^|\.)outlook\.(live|office|office365)\.com$/, "outlook"],
  [/(^|\.)mail\.yahoo\.com$/, "yahoo mail"],
];

function cleanSource(value: string) {
  return value.toLowerCase().replace(/^www\./, "").replace(/[^a-z0-9.\-_ ]/g, "").slice(0, 60);
}

/** Clasifica la visita actual. Exportado para pruebas. */
export function classify(search: string, referrer: string, ownHost: string): { channel: Channel; source: string } {
  const params = new URLSearchParams(search);
  const utmSource = cleanSource(params.get("utm_source") || "");
  const utmMedium = (params.get("utm_medium") || "").toLowerCase();

  if (params.get("gclid") || /^(cpc|ppc|paid|paidsocial|paid_social|display|ads?)$/.test(utmMedium)) {
    return { channel: "pagado", source: utmSource || (params.get("gclid") ? "google ads" : "") };
  }
  if (utmSource || utmMedium) {
    if (/linkedin|instagram|facebook|^ig$|^fb$|twitter|^x$|tiktok|youtube/.test(utmSource) || utmMedium === "social") {
      return { channel: "redes", source: utmSource || "redes" };
    }
    if (/e-?mail|newsletter|mailchimp/.test(utmMedium + utmSource)) return { channel: "email", source: utmSource || "email" };
    return { channel: "campanas", source: utmSource || utmMedium };
  }

  let host = "";
  try {
    const url = new URL(referrer);
    host = url.protocol === "android-app:" ? url.hostname : url.hostname.toLowerCase();
  } catch {
    host = "";
  }
  if (!host || host.replace(/^www\./, "") === ownHost.replace(/^www\./, "")) return { channel: "directo", source: "" };

  for (const [re, name] of AI) if (re.test(host)) return { channel: "ia", source: name };
  for (const [re, name] of MAIL) if (re.test(host)) return { channel: "email", source: name };
  if (host === "com.google.android.googlequicksearchbox") return { channel: "buscadores", source: "google" };
  for (const re of SEARCH) if (re.test(host)) return { channel: "buscadores", source: cleanSource(host.split(".").find((p) => p !== "www" && p !== "search") || host) };
  for (const [re, name] of SOCIAL) if (re.test(host)) return { channel: "redes", source: name };
  return { channel: "referidos", source: cleanSource(host) };
}

/**
 * Llamar en cada cambio de página. Devuelve qué hay que registrar:
 *  - newVisit: es la primera página de una visita (registrar canal + página de entrada)
 *  - countPage: la página aún no se contó en esta visita
 */
export function trackNavigation(rawPath: string): { path: string; newVisit: Touch | null; countPage: boolean } | null {
  if (typeof window === "undefined") return null;
  const path = normalizePath(rawPath);
  if (!path) return null;

  const now = Date.now();
  let visit = read<Visit>("session", SESSION_KEY);
  let newVisit: Touch | null = null;

  if (!visit || now - visit.last > SESSION_IDLE_MS) {
    const { channel, source } = classify(window.location.search, document.referrer, window.location.hostname);
    newVisit = { channel, source, landing: path, ts: now };
    visit = { ...newVisit, last: now, seen: [] };

    const first = read<Touch>("local", FIRST_KEY);
    if (!first || now - first.ts > FIRST_TOUCH_MS) write("local", FIRST_KEY, newVisit);
  }

  const countPage = !visit.seen.includes(path);
  if (countPage) visit.seen = [...visit.seen, path].slice(-50);
  visit.last = now;
  write("session", SESSION_KEY, visit);

  return { path, newVisit, countPage };
}

/** Para adjuntar a los formularios (dentro de `utm`). */
export function getWebTouch(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  const first = read<Touch>("local", FIRST_KEY);
  const visit = read<Visit>("session", SESSION_KEY);
  if (first) {
    out.first_channel = first.channel;
    if (first.source) out.first_source = first.source;
    out.first_landing = first.landing;
  }
  if (visit) {
    out.last_channel = visit.channel;
    if (visit.source) out.last_source = visit.source;
  }
  return out;
}
