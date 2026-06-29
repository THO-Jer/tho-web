/**
 * Links operativos / externos centralizados.
 *
 * Mantén las URLs externas que se referencian en múltiples componentes acá,
 * así cuando cambien (ej. migrar de bit.ly a una ruta propia /agendar) es
 * un solo edit y no una cacería por todo el repo.
 */

// URL del calendario de agendamiento. Apunta a /agendar, que redirige al
// servicio externo de booking vía next.config.ts redirects().
// Para cambiar el destino, editar solo el redirect en next.config.ts.
export const BOOK_URL = "/agendar";
