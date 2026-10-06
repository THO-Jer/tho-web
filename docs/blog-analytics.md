# Analítica del blog · Centro de comando de Studio Blog

`/studio/blog` abre en **Centro de comando**:

- **Lecturas** por entrada y por día, medidas por la propia web.
- **Contactos que leyeron el blog**: cuántos contactos de la web habían leído alguna entrada antes de escribir, y cuáles.
- **Google Search Console**: clics, apariciones, posición media y las búsquedas que traen a cada entrada.
- **Qué hacer ahora**: sugerencias automáticas (entradas a un paso de la primera página, títulos que no atraen clics, entradas que se leen pero no generan contactos, borradores detenidos).
- **Salud editorial**: portada, descripción SEO, largo del título, categoría y tags.

La pestaña **Entradas** mantiene la gestión de siempre y agrega las métricas de cada entrada.

---

## 1. Activar la medición propia (obligatorio, 2 minutos)

1. Abre Supabase → **SQL Editor**.
2. Pega y ejecuta el contenido de [`sql/blog_analytics.sql`](../sql/blog_analytics.sql). Se puede volver a ejecutar sin perder datos.
3. Listo: no hay que configurar variables nuevas (usa `SUPABASE_SERVICE_ROLE_KEY`, que ya existe).

Desde ese momento:

- Cada lectura de `/blog/[slug]` se cuenta cuando la entrada estuvo visible **al menos 5 segundos**, **una vez por navegador y día**.
- No cuentan bots, previsualizadores de enlaces (WhatsApp, LinkedIn, etc.) ni personas con sesión abierta en Studio.
- El navegador recuerda (en `localStorage`, por 30 días) qué entradas leyó la persona. Cuando envía cualquier formulario de la web, eso viaja dentro de `utm` como `blog_post` (última entrada leída) y `blog_read` (todas). También aparece en el correo del lead y llega al CRM.

**Privacidad.** Las tablas no guardan nombre, email ni IP: solo totales por entrada y día, y por cada contacto el tipo de formulario y los slugs leídos. Es medición propia y agregada, sin cookies de terceros ni identificación de personas, pensada para minimizar datos personales de cara a la Ley 21.719 (conviene confirmarlo con asesoría legal).

> Las métricas empiezan desde cero el día que se activa. No hay datos históricos de lecturas anteriores.

---

## 2. Conectar Google Search Console (recomendado)

Search Console es la fuente oficial de cómo aparece tho.cl en Google. La conexión es de **solo lectura**.

### 2.1 Verificar la propiedad (si aún no está)

1. Entra a <https://search.google.com/search-console> con la cuenta de Google de THO.
2. Agrega una propiedad de tipo **Dominio** → `tho.cl` y verifícala con el registro TXT que te indica Google (en el proveedor DNS del dominio).
3. En **Sitemaps**, envía `https://tho.cl/sitemap.xml`.

Google tarda unos días en empezar a mostrar datos.

### 2.2 Crear una cuenta de servicio

1. Entra a <https://console.cloud.google.com> y crea un proyecto (ej. `tho-web`).
2. **APIs y servicios → Biblioteca** → busca **Google Search Console API** → **Habilitar**.
3. **IAM y administración → Cuentas de servicio → Crear cuenta de servicio** (ej. `tho-studio-gsc`). No necesita roles.
4. Abre la cuenta creada → **Claves → Agregar clave → Crear clave nueva → JSON**. Se descarga un archivo `.json`. Guárdalo en un lugar seguro y no lo subas al repositorio.

> Si Google muestra "La creación de claves de cuentas de servicio está inhabilitada", la organización de Google Cloud tiene activa la política `iam.disableServiceAccountKeyCreation`. Un administrador puede desactivarla para este proyecto en **IAM → Políticas de la organización**.

### 2.3 Dar acceso a la cuenta de servicio

1. En Search Console → **Configuración → Usuarios y permisos → Agregar usuario**.
2. Email: el `client_email` del JSON (termina en `.iam.gserviceaccount.com`).
3. Permiso: **Restringido**.

### 2.4 Variables en Vercel

En Vercel → proyecto `tho-web` → **Settings → Environment Variables** (Production):

| Variable | Valor |
|---|---|
| `GSC_CLIENT_EMAIL` | `client_email` del JSON |
| `GSC_PRIVATE_KEY` | `private_key` del JSON, completo, incluido `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`. Sirve tal cual, con los `\n`. |
| `GSC_SITE_URL` | `sc-domain:tho.cl` si la propiedad es de tipo Dominio (por defecto). Si es de tipo prefijo de URL: `https://tho.cl/` |

Haz **Redeploy** para que tome las variables. Si algo falla, el panel muestra el error exacto (por ejemplo, si falta dar acceso a la cuenta de servicio).

---

## Cómo leer las métricas

- **Lecturas**: visitas reales de más de 5 segundos. Es un número más bajo y más honesto que las "páginas vistas" de otras herramientas.
- **Contactos (columna)**: personas que leyeron esa entrada en los 30 días previos a escribir. Entre paréntesis, cuántas la tenían como **última** lectura. Una entrada rara vez "cierra" un contacto por sí sola; suele construir confianza en el camino.
- **Apariciones / Clics / Posición**: datos de Google con 2–3 días de retraso. Posición 1–10 = primera página. Una posición entre 8 y 20 con apariciones es la mejor oportunidad: poco esfuerzo para entrar a la primera página.

## Archivos

| Archivo | Rol |
|---|---|
| `sql/blog_analytics.sql` | Tablas `blog_post_views`, `blog_lead_events` y funciones `increment_blog_view`, `blog_dashboard` |
| `src/components/blog/BlogViewTracker.tsx` | Cuenta la lectura en `/blog/[slug]` |
| `src/lib/blogReadTracking.ts` | Memoria local de entradas leídas (cliente) |
| `src/lib/utm.ts` | `getUtm()` adjunta `blog_post` / `blog_read` a todos los formularios |
| `src/app/api/blog/view/route.ts` | Endpoint público que registra lecturas (filtra bots y equipo) |
| `src/app/api/lead/route.ts` | Registra cada contacto en `blog_lead_events` (sin datos personales) |
| `src/lib/searchConsole.ts` | Cliente de Search Console (cuenta de servicio, sin dependencias) |
| `src/app/api/admin/blog-metrics/route.ts` | Arma el panel: métricas, salud editorial y sugerencias |
| `src/app/studio/blog/page.tsx` | Centro de comando + gestión de entradas |
