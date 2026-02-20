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
- `CRM_ENDPOINT`: endpoint HTTP de tu CRM o middleware SQL que reciba el lead en `POST`.
- `CRM_API_KEY` (opcional): bearer token para autenticar contra `CRM_ENDPOINT`.

- `SUPABASE_URL`: (alternativa a `CRM_ENDPOINT`) URL del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: clave service-role para insertar en SQL vía REST.
- `CRM_TABLE` (opcional): tabla destino en Supabase; por defecto `crm_leads`.

Si faltan destinos de CRM (`CRM_ENDPOINT` o `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`), la API responde error para evitar perder leads silenciosamente. El mail puede seguir en stub si falta `RESEND_API_KEY`.
