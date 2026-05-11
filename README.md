# THO Web

Sitio público de **The Human Org** + Studio interno. Next.js 16 (App Router) + React 19 + Tailwind v4 + Supabase + Resend.

Deploy en Vercel · dominio `tho.cl`.

---

## Correr local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

Scripts disponibles:

- `npm run dev` — desarrollo con HMR
- `npm run build` — build de producción
- `npm run start` — servir build
- `npm run lint` — ESLint

---

## Stack

- **Framework:** Next.js 16 (App Router, RSC)
- **UI:** React 19 + Tailwind v4
- **Auth + Datos:** Supabase (Auth con Microsoft/Azure + tablas `blog_posts`, `blog_editors`, `studio_access`, `incidents`, `onboarding_*`)
- **Mail:** Resend (formulario de contacto)
- **CRM:** push a `crm-tho` vía `/api/lead`
- **Tipografías:** `next/font/local` (Thocl + TT Firs Neue)

---

## Estructura

```
src/
├── app/
│   ├── (rutas públicas: /, /quienes, /servicios, /blog, /etica, ...)
│   ├── studio/         # área interna autenticada
│   ├── api/            # API routes (lead, contact, admin, studio/*)
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/         # UI components (Header, Footer, BrandLoader, ContactForm, ...)
├── content/            # contenido tipado (services, posts seed, onboarding, etc.)
├── lib/                # storage, auth, crm, mail, supabase clients
docs/                   # documentación operativa
public/                 # assets estáticos servidos por Vercel
sql/                    # migraciones SQL de Supabase
```

---

## Variables de entorno (Vercel)

Configura estas variables para salir del modo stub:

| Variable | Rol |
|---|---|
| `RESEND_API_KEY` | API key de Resend para envío de correos. |
| `MAIL_FROM` | Remitente verificado en Resend (ej: `THO Web <contacto@tu-dominio.com>`). |
| `CRM_ENDPOINT` | Endpoint HTTP del CRM. Default: `https://crm-tho.vercel.app/api/public/leads`. |
| `LEADS_API_KEY` | Auth al CRM (se envía como `Authorization: Bearer`, `x-api-key` y `apiKey` en body). |
| `CRM_API_KEY` | Legacy. Solo se usa si no existe `LEADS_API_KEY`. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública para OTP / OAuth. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service key para validar allowlist de editores en backend. |
| `STUDIO_AUTH_REDIRECT_URL` | URL de retorno post-OAuth (server-side). |
| `NEXT_PUBLIC_STUDIO_AUTH_REDIRECT_URL` | Idem, para el cliente. |

Supabase: requiere tablas `blog_editors`, `blog_posts`, `incidents`, etc. — ver SQL en `sql/`.

En Supabase Auth habilita el proveedor **Azure/Microsoft** y agrega como Redirect URLs `https://tho.cl/studio` (+ `https://tho.cl/studio/auth/callback`) y los equivalentes en `localhost:3000`.

---

## Documentación

- **[Troubleshooting](./docs/troubleshooting.md)** — errores comunes del pipeline de leads, Studio Auth, persistencia en producción, tipografías.
- **[Migración Canal Confidencial](./docs/supabase-migration-canal-confidencial.md)** — proceso de migración a Supabase del módulo de incidentes.
- **[Brochures · upload](./docs/brochures-upload.md)** — cómo subir nuevos brochures.

---

## Convenciones

- Imágenes públicas viven en `public/` y se referencian con paths absolutos (`/brand/logo-negro.png`).
- Al usar `next/image` con `fill`, **siempre pasa `sizes`** para evitar variantes innecesarias (Next genera srcset hasta 3840px por defecto).
- Las rutas `/studio/*` están detrás de auth y **no se enlazan públicamente**. Acceso vía URL directa.
- Contenido editorial (servicios, tickets, onboarding) vive en `src/content/` como TypeScript tipado, no Markdown.
