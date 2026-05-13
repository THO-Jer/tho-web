/**
 * Links operativos / externos centralizados.
 *
 * Mantén las URLs externas que se referencian en múltiples componentes acá,
 * así cuando cambien (ej. migrar de bit.ly a una ruta propia /agendar) es
 * un solo edit y no una cacería por todo el repo.
 */

// URL del calendario de agendamiento. Hoy es un bit.ly que redirige al
// servicio externo de booking. Cuando migremos a /agendar propio, sólo
// cambiar este string.
export const BOOK_URL = "https://bit.ly/bookTHO";
