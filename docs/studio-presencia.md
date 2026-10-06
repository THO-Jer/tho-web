# Studio Presencia

`/studio/presencia` muestra **cómo encuentran a THO** en todo el sitio, no solo en el blog:

- **Visitas** por día y **canal de llegada**: buscadores, redes sociales, asistentes de IA, correo, otros sitios, campañas con UTM, publicidad y directo.
- **Contactos por canal**: por qué canal llegó por primera vez cada persona que escribió (en los 90 días previos), y por qué página entró.
- **¿Cómo supiste de THO?**: la respuesta del formulario de contacto. Es la única forma de ver las recomendaciones, eventos y relaciones, que en la analítica aparecen como "directo".
- **Google para todo el sitio**: búsquedas, separadas entre las que nombran a THO y las de temas; páginas, clics, apariciones y posición.
- **Qué hacer ahora**: sugerencias automáticas, como temas con potencial en Google, páginas que reciben visitas pero no contactos o canales que no convierten.

Pueden entrar quienes tienen permiso de **Blog** o de **CRM** en Studio.

## Activar (2 minutos)

1. Supabase → **SQL Editor** → ejecuta [`sql/web_analytics.sql`](../sql/web_analytics.sql). Requiere haber ejecutado antes `sql/blog_analytics.sql`, y se puede volver a ejecutar sin perder datos.
2. Publica los cambios. No hay variables nuevas: Search Console usa las mismas de [blog-analytics.md](./blog-analytics.md).

Los datos empiezan a acumularse desde ese momento.

## Cómo se mide

- **Visita**: una persona navegando el sitio. Se cuenta una nueva si vuelve tras 30 minutos sin actividad o en otra pestaña.
- **Canal**: se decide al inicio de la visita, a partir de la página de origen (referrer) y de los parámetros UTM del enlace.
  - Enlaces con `utm_source` / `utm_medium` → Campañas, o Redes / Correo según la fuente; con `gclid` o `utm_medium=cpc` → Publicidad pagada.
  - google, bing, duckduckgo… → Buscadores; linkedin, instagram, facebook, x, youtube… → Redes; chatgpt, perplexity, gemini, copilot, claude → IA; gmail, outlook → Correo.
  - Sin página de origen → **Directo**. Aquí caen también los enlaces abiertos desde WhatsApp y otras apps, que no informan de dónde vienen. Para distinguirlos, comparte enlaces con UTM, por ejemplo `https://tho.cl/?utm_source=whatsapp&utm_medium=social`.
- **Primer canal de un contacto**: el navegador recuerda (por 90 días, en `localStorage`) el canal y la página por los que la persona llegó la primera vez. Se envía con el formulario dentro de `utm` (`first_channel`, `first_source`, `first_landing`, `last_channel`, `last_source`) y también llega al correo del lead y al CRM.
- **No se mide**: Studio, el canal confidencial de denuncias (por resguardo de quienes lo usan), los bots, las previsualizaciones de enlaces ni las visitas del equipo con sesión abierta en Studio.

**Privacidad**: no se guardan nombre, email ni IP en la analítica. Solo totales por día, y por contacto: canal, fuente, página de entrada y respuesta a "¿Cómo supiste de THO?". Es medición propia, sin cookies de terceros, pensada para minimizar datos personales de cara a la Ley 21.719. Conviene confirmarlo con asesoría legal.

## Cómo leerlo

- **"Directo" alto no es un error.** En consultoría, mucha gente llega porque alguien le habló de THO y escribe la dirección o abre un enlace reenviado. Crúzalo con "Cómo supieron de THO".
- **Búsquedas por nombre frente a búsquedas por temas.** Si casi todos los clics de Google vienen de búsquedas por "THO" o "The Human Org", Google te muestra a quienes ya te conocen. Para atraer a quienes aún no te conocen, el blog y las páginas de servicio deben aparecer en búsquedas de temas.
- **Las cifras del primer mes son orientativas.** Con 60–90 días de datos ya se ven tendencias.

## Archivos

| Archivo | Rol |
|---|---|
| `sql/web_analytics.sql` | Tablas `web_page_views`, `web_sessions`; columnas de origen en `blog_lead_events`; funciones `track_web_hit`, `web_dashboard` |
| `src/lib/webChannels.ts` | Catálogo de canales, opciones de "¿Cómo supiste de THO?" y rutas excluidas |
| `src/lib/webTracking.ts` | Clasificación del canal y memoria de primer/último canal (cliente) |
| `src/components/SiteTracker.tsx` | Registra visitas y páginas (montado en `layout.tsx`) |
| `src/app/api/web/hit/route.ts` | Endpoint público que registra visitas (filtra bots y equipo) |
| `src/components/ContactForm.tsx` | Pregunta opcional "¿Cómo supiste de THO?" |
| `src/app/api/lead/route.ts` | Guarda el origen de cada contacto y lo incluye en correo y CRM |
| `src/lib/searchConsole.ts` | `getSitePerformance`: Google para todo el sitio |
| `src/app/api/admin/presence-metrics/route.ts` | Arma el panel y las sugerencias |
| `src/app/studio/presencia/page.tsx` | Studio Presencia |
