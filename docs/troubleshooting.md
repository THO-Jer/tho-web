# Troubleshooting · THO Web

Notas operativas para diagnosticar problemas comunes en producción y desarrollo.

---

## Pipeline de leads → CRM

### Verificación rápida en Vercel

En logs de la función `/api/lead` filtra por `CRM PUSH` y confirma:

- request: `[CRM PUSH REQUEST] POST https://crm-tho.vercel.app/api/public/leads email=<...>`
- response: `[CRM PUSH RESPONSE] 201 ...` (o el error real 4xx/5xx)
- éxito final: `[LEAD CRM OK] <endpoint> <status>`

Si ves `CRM pipeline not configured`, falta `LEADS_API_KEY` (o `CRM_API_KEY` legacy).

### Error 500 del CRM remoto

Si en Vercel aparece:

`CRM endpoint error (500): {"error":"Server misconfigured: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or SERVICE_ROLE_KEY) and LEADS_OWNER_USER_ID are required"}`

ese error viene del **servicio CRM** (`crm-tho`), no de esta web. Debes configurar esas variables en el proyecto `crm-tho` de Vercel.

Esta web ya está enviando `POST` a `/api/public/leads` con auth (`Bearer`, `x-api-key`, `apiKey`).

### Comportamiento ante variables faltantes

Si falta `CRM_ENDPOINT`, la API responde error para evitar perder leads silenciosamente. El mail puede seguir en stub si falta `RESEND_API_KEY`.

---

## Studio Auth (flujo recomendado)

- El acceso al Studio se inicia en `/studio` con botón **Ingresar con Microsoft**.
- Una vez autenticado, la sesión habilita cualquier módulo (`/studio/blog`, etc.) sin pedir login nuevamente.
- Si más adelante quieres Gmail + auto-onboarding (sin insertar correos manualmente), crea una función server-side/post-login que inserte en `blog_editors` según dominio permitido (ej: `@tho.cl`) y rol por defecto.

### Configuración de redirect URLs

- En Supabase Auth (URL Configuration), agrega `https://TU_DOMINIO/studio` y `http://localhost:3000/studio` en **Redirect URLs**; si no, Supabase puede caer al `SITE_URL` de otro proyecto (ej. `crm-tho`).
- En el proveedor Azure/Microsoft, asegúrate de pedir scope `email` (además de `openid profile`) para evitar errores `Error getting user email from external provider`.

---

## Studio Blog · persistencia en producción

- En Vercel, el filesystem es efímero/no persistente para este caso; para Studio Blog usa Supabase tabla `blog_posts`.
- Ejecuta `sql/supabase_blog_posts.sql` en tu proyecto Supabase.
- Asegura `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (o `SERVICE_ROLE_KEY`) configuradas en el deploy para que el editor guarde en Supabase.
- El archivo `data/blog/posts.json` se usa **solo como fallback en local** cuando no hay variables Supabase; en producción nunca se escribe.

---

## Tipografías

- **Títulos:** `Thocl-Regular.ttf` (auto-hospedada vía `next/font/local`).
- **Cuerpo:** **TT Firs Neue** — actualmente auto-hospedada en `src/app/fonts/` y registrada como `next/font/local` (Regular, Bold, BoldItalic).

Si en algún momento aparece FOUT (flash of unstyled text), revisa que los `.ttf` estén en `src/app/fonts/` y referenciados en `src/app/layout.tsx`.

---

## Imágenes

- Las imágenes públicas deben vivir en `public/` para que Vercel las sirva con cache de CDN.
- Hero: `public/hero/*.png`
- Logos: `public/brand/logo-negro.svg`, `logo-blanco.svg` (vector, servidos con `unoptimized` en `next/image`). PNGs antiguos (`logo-negro.png`, `logo-blanco.png`, `logo-small.png`) se mantienen como fallback.
- Para Next/Image con `fill`, **siempre pasa `sizes`** para evitar que Next genere variantes hasta 3840px de ancho innecesariamente.
