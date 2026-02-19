export type Post = { slug: string; title: string; minutes: number; excerpt: string };

export const POSTS: Post[] = [
  {
    slug: "gestion-de-riesgos",
    title: "Gestión de riesgos en consultoría",
    minutes: 5,
    excerpt: "Cómo convertir incertidumbre en decisiones, sin maquillaje.",
  },
  {
    slug: "confianza-activo",
    title: "La confianza como activo intangible",
    minutes: 6,
    excerpt: "La confianza no se declara: se diseña y se gestiona.",
  },
  {
    slug: "licencia-social",
    title: "¿Tienes licencia social para operar?",
    minutes: 7,
    excerpt: "Lo que pasa cuando el territorio deja de creer tu relato.",
  },
];
