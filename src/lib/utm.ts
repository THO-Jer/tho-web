/**
 * UTM + marketing attribution helper.
 *
 * Captura los parámetros de tracking del URL al cargar la página (por
 * UtmTracker en layout.tsx) y los persiste en sessionStorage. Cualquier
 * formulario que llame a `getUtm()` los recupera para enviarlos en el
 * payload del lead.
 *
 * Modelo: "first-touch wins dentro de la sesión". Si el usuario llega de
 * LinkedIn (?utm_source=linkedin) y luego navega varias páginas antes de
 * llenar el form, los UTM originales se conservan. Si en medio de la sesión
 * vuelve con otros UTM params en la URL, esos sobrescriben (last-touch
 * dentro de la sesión).
 */

const STORAGE_KEY = "tho_utm";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",   // Google Ads click id
  "fbclid",  // Facebook click id
  "li_fat_id", // LinkedIn click id
  "ref",     // referral genérico
] as const;

type UtmRecord = Record<string, string>;

function safeParseStored(): UtmRecord {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function safeSetStored(value: UtmRecord) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // sessionStorage puede fallar en modo privado o cuando está deshabilitado — ignorar.
  }
}

function readFromUrl(): UtmRecord {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const captured: UtmRecord = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) captured[key] = value;
  }
  // Bonus: agregar el referrer y la URL de aterrizaje la primera vez (útil
  // para entender qué página vio el usuario antes de convertir).
  if (Object.keys(captured).length > 0) {
    if (document.referrer) captured["referrer"] = document.referrer;
    captured["landing_page"] = window.location.pathname;
  }
  return captured;
}

/**
 * Llamar al montar la app (UtmTracker en layout). Captura los UTM del URL
 * actual y los persiste merged con lo que ya había en sessionStorage.
 */
export function captureUtm() {
  const fromUrl = readFromUrl();
  if (Object.keys(fromUrl).length === 0) return;
  const stored = safeParseStored();
  safeSetStored({ ...stored, ...fromUrl });
}

/**
 * Llamar al momento de enviar un formulario. Retorna los UTM persistidos.
 * Si no hay nada capturado, retorna {}.
 */
export function getUtm(): UtmRecord {
  return safeParseStored();
}
