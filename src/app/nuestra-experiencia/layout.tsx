import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra experiencia · The Human Org",
  description:
    "Desde 2009 en trabajo de terreno y consultoría estratégica. Relacionamiento comunitario, desarrollo organizacional y sostenibilidad en la región del Biobío.",
  alternates: { canonical: "https://tho.cl/nuestra-experiencia" },
  openGraph: {
    type: "website",
    title: "Nuestra experiencia · The Human Org",
    description:
      "Más de una década acompañando a empresas y organizaciones en Chile. Conoce los proyectos y trayectorias del equipo de The Human Org.",
    url: "https://tho.cl/nuestra-experiencia",
    siteName: "The Human Org",
    images: [{ url: "https://tho.cl/og.png", width: 1200, height: 630, alt: "The Human Org" }],
  },
};

export default function NuestraExperienciaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
