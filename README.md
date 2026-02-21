# THO Web (Next.js)

Sitio estático + formularios por API routes (Vercel) para The Human Org.

## Correr local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Imágenes

Las imágenes deben estar en `public/` para que Vercel las sirva.

- Hero: `public/hero/1.png` (y 2–4)
- Logos: `public/brand/logo-negro.png`, `logo-blanco.png`, `logo-small.png`

## Tipografías

- **Títulos:** `Thocl-Regular.ttf` (ya incluido como `next/font/local`).
- **Cuerpo:** **TT Firs Neue** (por ahora está declarado como `font-family: "TT Firs Neue"` con fallbacks).

Si quieres auto-hospedar TT Firs Neue, súbela a `public/fonts/` y luego la registramos como `next/font/local`.

## Formularios

El formulario envía a `hola@tho.cl` usando un API route en `src/app/api/contact/route.ts`.

Más adelante podemos conectar el envío con tu CRM (endpoint / pipeline) cuando esté listo.


## Variables de entorno (Vercel)

Configura estas variables para salir del modo stub:

- `RESEND_API_KEY`: API key de Resend para envío de correos.
- `MAIL_FROM`: remitente verificado en Resend (ej: `THO Web <contacto@tu-dominio.com>`).
- `CRM_ENDPOINT`: endpoint HTTP de tu CRM. Si no se define, usa por defecto `https://crm-tho.vercel.app/api/public/leads`.
- `LEADS_API_KEY`: clave usada para auth con CRM (se envía como `Authorization: Bearer`, `x-api-key` y también `apiKey` en body como fallback).
- `CRM_API_KEY` (opcional/legacy): usado solo si no existe `LEADS_API_KEY`.
- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase (Auth + REST).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon key pública para OTP/email auth.
- `SUPABASE_SERVICE_ROLE_KEY` (o `SERVICE_ROLE_KEY`): service key para validar allowlist de editores en backend.
- Tabla `public.blog_editors` en Supabase (ver SQL en `sql/supabase_blog_editors.sql`).
- En Supabase Auth habilita proveedor **Azure/Microsoft** y agrega redirect URL de este proyecto (`https://tu-dominio/studio/blog` y `http://localhost:3000/studio/blog`).

Si falta `CRM_ENDPOINT`, la API responde error para evitar perder leads silenciosamente. El mail puede seguir en stub si falta `RESEND_API_KEY`.


## Verificación rápida de pipeline

En logs de Vercel (función `/api/lead`) filtra por `CRM PUSH` y confirma:

- request: `[CRM PUSH REQUEST] POST https://crm-tho.vercel.app/api/public/leads email=<...>`
- response: `[CRM PUSH RESPONSE] 201 ...` (o el error real 4xx/5xx)
- éxito final: `[LEAD CRM OK] <endpoint> <status>`

Si ves `CRM pipeline not configured`, falta `LEADS_API_KEY` (o `CRM_API_KEY` legacy).


### Error 500 del CRM remoto (caso actual)

Si en Vercel aparece:

`CRM endpoint error (500): {"error":"Server misconfigured: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or SERVICE_ROLE_KEY) and LEADS_OWNER_USER_ID are required"}`

ese error viene del **servicio CRM** (`crm-tho`), no de esta web.
Debes configurar esas variables en el proyecto `crm-tho` de Vercel.

Esta web ya está enviando `POST` a `/api/public/leads` con auth (`Bearer`, `x-api-key`, `apiKey`).

### Studio Auth (flujo recomendado)

- El acceso al Studio se inicia en `/studio` con botón **Ingresar con Microsoft**.
- Una vez autenticado, la sesión habilita cualquier módulo (`/studio/blog`, etc.) sin pedir login nuevamente.
- Si más adelante quieres Gmail + auto-onboarding (sin insertar correos manualmente), crea una función server-side/post-login que inserte en `blog_editors` según dominio permitido (ej: `@tho.cl`) y rol por defecto.

- En Supabase Auth (URL Configuration), agrega `https://TU_DOMINIO/studio` y `http://localhost:3000/studio` en **Redirect URLs**; si no, Supabase puede caer al `SITE_URL` de otro proyecto (ej. `crm-tho`).
- En el proveedor Azure/Microsoft, asegúrate de pedir scope `email` (además de `openid profile`) para evitar errores `Error getting user email from external provider`.


### Studio Blog persistence (producción)

- En Vercel, el filesystem es efímero/no persistente para este caso; para Studio Blog usa Supabase tabla `blog_posts`.
- Ejecuta `sql/supabase_blog_posts.sql` en tu proyecto Supabase.
- Asegura `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (o `SERVICE_ROLE_KEY`) configuradas en el deploy para que el editor guarde en Supabase.
