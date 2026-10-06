// Catálogo compartido (cliente y servidor) de canales de llegada y de las
// respuestas a "¿Cómo supiste de THO?". Sin dependencias de servidor.

export const CHANNELS = {
  buscadores: { label: "Buscadores (Google, Bing…)", short: "Buscadores" },
  redes: { label: "Redes sociales", short: "Redes" },
  ia: { label: "Asistentes de IA (ChatGPT, Perplexity…)", short: "IA" },
  email: { label: "Correo", short: "Correo" },
  referidos: { label: "Enlaces desde otros sitios", short: "Otros sitios" },
  campanas: { label: "Campañas con UTM", short: "Campañas" },
  pagado: { label: "Publicidad pagada", short: "Pagado" },
  directo: { label: "Directo (escribieron tho.cl, WhatsApp, favoritos…)", short: "Directo" },
} as const;

export type Channel = keyof typeof CHANNELS;

export function isChannel(value: unknown): value is Channel {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(CHANNELS, value);
}

export const HEARD_FROM = {
  recomendacion: "Me lo recomendaron",
  google: "Búsqueda en Google",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  evento: "Evento, charla o taller",
  cliente: "Ya trabajé con THO",
  ia: "ChatGPT u otro asistente de IA",
  medio: "Medio o publicación",
  otro: "Otro",
} as const;

export type HeardFrom = keyof typeof HEARD_FROM;

export function isHeardFrom(value: unknown): value is HeardFrom {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(HEARD_FROM, value);
}

// Rutas que no se miden: Studio (equipo interno) y el canal confidencial de
// denuncias (por resguardo de quienes lo usan).
export function isTrackablePath(path: string) {
  return !/^\/(studio|api|canal-confidencial)(\/|$)/.test(path);
}

const PATH_PATTERN = /^\/[a-z0-9\-_/.]{0,160}$/;

export function normalizePath(raw: string) {
  let path = (raw || "/").split(/[?#]/)[0].toLowerCase();
  try {
    path = decodeURIComponent(path);
  } catch {
    // dejar tal cual
  }
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return PATH_PATTERN.test(path) ? path : null;
}
