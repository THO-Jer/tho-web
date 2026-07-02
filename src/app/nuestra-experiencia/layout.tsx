import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra experiencia · The Human Org",
  description:
    "Trabajo en terreno desde 2023. Conoce los proyectos y relaciones detrás de The Human Org.",
  alternates: { canonical: "https://tho.cl/nuestra-experiencia" },
  openGraph: {
    type: "website",
    title: "Nuestra experiencia · The Human Org",
    description:
      "Trabajo en terreno desde 2023. Conoce los proyectos y relaciones detrás de The Human Org.",
    url: "https://tho.cl/nuestra-experiencia",
    siteName: "The Human Org",
    images: [{ url: "https://tho.cl/og.png", width: 1200, height: 630, alt: "The Human Org" }],
  },
};

export default function NuestraExperienciaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
