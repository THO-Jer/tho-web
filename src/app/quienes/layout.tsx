import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes somos · The Human Org",
  description:
    "Conoce al equipo de The Human Org: consultora boutique en Concepción especializada en sostenibilidad, relacionamiento comunitario y desarrollo organizacional.",
  alternates: { canonical: "https://tho.cl/quienes" },
  openGraph: {
    type: "website",
    title: "Quiénes somos · The Human Org",
    description:
      "Conoce al equipo de The Human Org: consultora boutique en Concepción especializada en sostenibilidad, relacionamiento comunitario y desarrollo organizacional.",
    url: "https://tho.cl/quienes",
    siteName: "The Human Org",
    images: [{ url: "https://tho.cl/og.png", width: 1200, height: 630, alt: "The Human Org" }],
  },
};

export default function QuienesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
