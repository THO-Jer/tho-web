# Auditoría Web THO — Junio 2026

Revisión completa del código fuente de `tho.cl`. Hallazgos organizados por prioridad y categoría.

---

## 🔴 Bugs (afectan funcionalidad real)

### 1. ResourcesModal marca "visto" antes de mostrarse
**Archivo:** `src/components/ResourcesModal.tsx`

El `localStorage.setItem` ocurre *antes* del `setTimeout` de 3.5s. Si el usuario abandona la página en los primeros 3.5 segundos, el modal queda marcado como visto permanentemente pero nunca se mostró. Pérdida directa de leads.

```ts
// Bug actual:
window.localStorage.setItem(RESOURCES_MODAL_SEEN_KEY, "1"); // ← demasiado pronto
const timeoutId = window.setTimeout(() => {
  setOpen(true); // ← esto puede no ejecutarse
}, 3500);

// Fix: mover el setItem a dentro del callback:
const timeoutId = window.setTimeout(() => {
  window.localStorage.setItem(RESOURCES_MODAL_SEEN_KEY, "1");
  setOpen(true);
}, 3500);
```

---

### 2. TrustSlider links no funcionan con teclado ni con Enter
**Archivo:** `src/components/TrustSlider.tsx`

Los logos con link tienen `onClick={(e) => e.preventDefault()}` para no interferir con el drag. Esto también bloquea la activación por teclado (Enter/Space). El usuario que navega con teclado no puede abrir ningún logo con link.

```tsx
// Bug:
<a onClick={(e) => e.preventDefault()}> ← bloquea teclado

// Fix: usar onKeyDown o dejar que href funcione normalmente para no-drag
```

---

### 3. SocialFloat usa `<Link>` de Next.js para URLs externas
**Archivo:** `src/components/SocialFloat.tsx`

`<Link>` de Next.js hace prefetch de URLs. Las URLs son WhatsApp, Instagram y LinkedIn — dominios externos que no deberían prefetchearse. Genera peticiones innecesarias a dominios externos.

```tsx
// Actual: <Link href="https://wa.me/...">
// Fix: <a href="https://wa.me/..." target="_blank" rel="noreferrer">
```

---

## 🟠 UX (experiencia degradada)

### 4. Menú tablet (md) con `<details>` no cierra al navegar
**Archivo:** `src/components/Header.tsx`

El menú de tablet (visible entre md y xl) usa `<details>/<summary>` para los dropdowns de "Servicios" y "Quiénes". A diferencia del menú mobile que tiene `onClick={closeMobileMenu}`, los `<details>` no se cierran automáticamente al hacer click en un link interno. El usuario tiene que cerrarlo manualmente.

**Fix:** Usar el mismo patrón de estado `useState` del menú mobile, o agregar un `onClick` que cierre el `<details>` al navegar.

---

### 5. Cards de blog en home con flip: inutilizables en mobile
**Archivo:** `src/app/page.tsx` (sección blog)

Las tarjetas del blog usan un efecto flip 3D: al hacer hover se da vuelta y muestra el botón "Leer +". En mobile no hay hover, así que el usuario nunca ve el botón de acción. El contenido del reverso es inaccesible.

**Fix opciones:**
- En mobile, mostrar siempre el reverso (o eliminar el flip y mostrar siempre el CTA).
- Hacer toda la card clicable en lugar de depender del flip.

---

### 6. Modal de recursos intrusivo (autoOpen a los 3.5s)
**Archivo:** `src/components/ResourcesModal.tsx`

El modal se abre automáticamente a los 3.5 segundos en la home. Aunque hay buenas prácticas para esta estrategia, 3.5s puede ser demasiado rápido — el usuario apenas acaba de cargar la página. Considerar:
- Abrir solo después de cierto scroll (ej. 40% del scroll de la página).
- Usar exit-intent en desktop.
- Al menos aumentar el delay a 6–8s.

---

### 7. Sin acceso rápido a contacto en mobile
**Archivo:** `src/components/SocialFloat.tsx`

El botón flotante de WhatsApp/redes sociales solo se muestra en `lg:flex` (pantallas grandes). En mobile, el CTA de contacto más cercano requiere scrollear hasta la sección de contacto al final de la página. Considerar agregar un botón flotante de WhatsApp visible en mobile.

---

### 8. Brochure modal no restaura el foco al cerrarse
**Archivo:** `src/components/ServicePage.tsx`

Al abrir el modal de brochure, el foco entra al modal. Al cerrarlo, el foco no vuelve al botón "Descargar brochure" que lo abrió. Es un problema de accesibilidad (WCAG 2.1 AA, criterio 2.4.3).

**Fix:** Guardar ref del botón trigger y llamar `.focus()` en el cleanup del modal.

---

### 9. Formulario de contacto sin feedback visual de validación
**Archivo:** `src/components/ContactForm.tsx`

Los campos requeridos (nombre, email) no tienen estilos customizados para el estado inválido. El browser muestra el tooltip nativo, que varía entre navegadores y no es consistente con el diseño. Tampoco hay indicación visual de cuál campo es requerido.

**Fix:**
- Agregar asterisco (`*`) en campos requeridos con `aria-required="true"`.
- Agregar clase CSS para `:invalid:not(:placeholder-shown)` con ring rojo.

---

## 🟡 UI / Diseño

### 10. Home sin `<h1>` en el hero
**Archivo:** `src/app/page.tsx`

La sección hero de la home no tiene un `<h1>`. El primer heading semántico es un `<h2>` ("Sostenibilidad desintegrada..."). El texto del hero ("Integramos ESG, relacionamiento comunitario...") está en un `<p>`. Los crawlers y lectores de pantalla necesitan un h1 claro.

**Fix:** Agregar un `<h1>` al hero, aunque sea visualmente pequeño o como tagline de la empresa. La descripción principal del negocio debería ser el h1.

---

### 11. `text-white/82` es un valor no estándar de Tailwind
**Archivo:** `src/app/page.tsx` (línea 112)

`text-white/82` usa una opacidad arbitraria (82%). Si bien funciona con Tailwind v4 y JIT, es inconsistente con el resto del código que usa valores estándar (75, 85, 90). Mejor usar `text-white/80` o `text-white/85`.

---

### 12. Página "quienes" — texto `text-justify` en párrafos
**Archivo:** `src/app/quienes/page.tsx`

Varios párrafos usan `text-justify`. En español, la justificación tipográfica sin hyphenation genera "ríos" de espacios en blanco visualmente molestos. CSS `text-justify` sin `hyphens: auto` en español produce resultados pobres especialmente en pantallas angostas.

**Fix:** Usar `text-left` o agregar `hyphens-auto` (con soporte por idioma).

---

## 🔵 SEO / Performance

### 13. Imágenes hero sin `next/image`
**Archivos:** `src/app/page.tsx`, `src/app/blog/page.tsx`, `src/app/quienes/page.tsx`, `src/components/ServicePage.tsx`

Las imágenes de fondo del hero usan `<img>` nativo. `next/image` daría: conversión automática a WebP/AVIF, responsive srcSet, lazy loading optimizado y reducción del LCP (Largest Contentful Paint).

El patrón de posicionamiento absoluto (inset-0, object-cover) es compatible con `next/image` usando `fill`:

```tsx
// Actual:
<img src="/hero/hands.png" className="absolute inset-0 h-full w-full object-cover" />

// Fix:
<Image src="/hero/hands.png" alt="" fill className="object-cover" priority />
```

---

### 14. `sameAs: []` vacío en el JSON-LD de organización
**Archivo:** `src/app/layout.tsx`

El schema `ProfessionalService` tiene `sameAs: []`. Aquí deberían ir los URLs de perfiles sociales verificados para que Google los asocie con la organización:

```ts
sameAs: [
  "https://instagram.com/thehumanorg/",
  "https://linkedin.com/company/thocl",
]
```

---

### 15. `page.tsx` de quienes es 100% client-side
**Archivo:** `src/app/quienes/page.tsx`

La directiva `"use client"` en el tope hace que toda la página (equipo, valores, misión/visión, ética) se envíe al cliente sin SSR. Esto afecta el SEO del contenido y el tiempo de First Contentful Paint. La metadata está en el `layout.tsx` separado (bien hecho), pero el contenido no se renderiza en el servidor.

**Fix:** Extraer solo el parallax y el scroll observer a un componente cliente pequeño. Dejar el contenido principal como Server Component.

---

### 16. `soluciones/[slug]` existe pero no está en el sitemap
**Archivo:** `src/app/sitemap.ts`

La ruta `/soluciones/[slug]` redirige a `/servicios/[slug]` (redirect 307). Esto está bien, pero si hay links externos apuntando a `/soluciones/...`, el sitemap no los incluye. Considera agregar los redirects al `next.config.ts` como `redirects()` de tipo 301 (permanente) en lugar de un componente de página.

---

### 17. `BOOK_URL` usa bit.ly — dependencia de tercero en CTA principal
**Archivo:** `src/lib/links.ts`

El botón de agendamiento principal en el hero, header y contacto apunta a `https://bit.ly/bookTHO`. Si bit.ly tiene downtime o el link expira, el CTA principal de conversión deja de funcionar.

**Fix:** Crear una redirección propia en Next.js:
```ts
// next.config.ts
async redirects() {
  return [{ source: "/agendar", destination: "https://cal.com/...", permanent: false }]
}
```
Y usar `/agendar` en lugar de `bit.ly/bookTHO`.

---

## 🟣 Accesibilidad

### 18. `ResourcesModal` sin roles ARIA adecuados
**Archivo:** `src/components/ResourcesModal.tsx`

El modal no tiene `role="dialog"`, `aria-modal="true"`, ni `aria-labelledby`. El brochure modal en `ServicePage.tsx` sí los implementa correctamente. Inconsistencia que afecta lectores de pantalla.

**Fix:**
```tsx
<div role="dialog" aria-modal="true" aria-label="Recurso descargable" ...>
```

---

### 19. `ResourcesModal` sin focus trap
**Archivo:** `src/components/ResourcesModal.tsx`

Al abrir el modal, el foco no queda atrapado dentro. El usuario con teclado puede tabular y quedar detrás del overlay. Mismo fix que el brochure modal de `ServicePage.tsx` que implementa `keydown: Escape` pero tampoco tiene focus trap completo.

---

### 20. `ContactForm` sin `aria-live` en mensajes de estado
**Archivo:** `src/components/ContactForm.tsx`

Los mensajes de éxito/error del formulario no tienen `aria-live="polite"`. Los lectores de pantalla no anuncian el cambio de estado al enviarse el formulario. `ServicePage.tsx` sí tiene `aria-live="polite"` en sus formularios — inconsistente.

**Fix:**
```tsx
{status === "ok" ? <div role="status" aria-live="polite">Listo. Te escribimos pronto.</div> : null}
```

---

## 🔧 Deuda técnica menor

### 21. `not-found.tsx` con keyframes inline via `<style>` tag
**Archivo:** `src/app/not-found.tsx`

Los keyframes `tho-404-in` y `tho-404-float` se definen inline con `<style>`. No rompen nada pero es un antipatrón: si el componente se renderiza múltiples veces, se duplican los estilos. Moverlos a `globals.css` es más limpio.

---

### 22. Rate limiting de `/api/lead` es por-instancia serverless
**Archivo:** `src/app/api/lead/route.ts`

Está documentado en el código, pero vale la pena destacar: el `Map<string, ...>` en memoria se resetea por instancia serverless. Un bot puede superar el rate limit distribuyendo requests a diferentes instancias. Para mayor protección, considerar Upstash Redis o Vercel KV.

---

### 23. `MethodTimeline`, `ActionGallery`, `Scribble` sin revisar
Componentes que no se auditaron en detalle en esta revisión. Podrían tener issues menores.

---

## Resumen ejecutivo

| Categoría | Hallazgos |
|-----------|-----------|
| Bugs | 3 |
| UX | 6 |
| UI / Diseño | 3 |
| SEO / Performance | 5 |
| Accesibilidad | 3 |
| Deuda técnica | 3 |
| **Total** | **23** |

**Prioridades inmediatas (mayor impacto):**
1. Fix `ResourcesModal` — marca seen antes de mostrar (pérdida de leads)
2. `<h1>` en hero de la home (SEO + accesibilidad)
3. `next/image` en imágenes hero (performance LCP)
4. `BOOK_URL` → redirección propia `/agendar` (resiliencia del CTA)
5. `sameAs` en JSON-LD (quick win SEO)
6. Cards de blog en mobile (UX)
