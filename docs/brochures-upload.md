# Subir brochures (PDF) por service page

Actualmente cada service page de primer nivel usa una constante local para descargar su brochure:

- Desarrollo Organizacional: `public/downloads/do-brochure-v1.pdf`
- Sostenibilidad: `public/downloads/sc-brochure-v1.pdf`
- Relacionamiento Comunitario: `public/downloads/rc-brochure-v1.pdf`

## Paso a paso

1. Copia tus PDF a `public/downloads/` con exactamente esos nombres.
2. Commit + deploy.
3. Verifica en cada service page que el botón **Descargar brochure** inicie la descarga correcta.

## Opcional: versionado

Si quieres cambiar versión de archivo (por ejemplo `-v2`), actualiza también la constante `BROCHURE_FILE_URL` en:

- `src/components/DesarrolloOrganizacionalServiceView.tsx`
- `src/components/SostenibilidadServiceView.tsx`
- `src/components/RelacionamientoServiceView.tsx`

Luego vuelve a desplegar.
