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
