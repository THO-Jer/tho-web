import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import localFont from "next/font/local";
import { UtmTracker } from "@/components/UtmTracker";

const thocl = localFont({
  src: "./fonts/Thocl-Regular.ttf",
  variable: "--font-thocl",
  display: "swap",
});

const ttFirsNeue = localFont({
  src: [
    { path: "./fonts/TTFirsNeue-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/TTFirsNeue-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/TTFirsNeue-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-tt",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tho.cl"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "The Human Org — Consultora estratégica en Concepción",
    template: "%s · The Human Org",
  },
  description:
    "Consultora boutique en Concepción especializada en desarrollo organizacional, relacionamiento comunitario y sostenibilidad corporativa (ESG). Atendemos clientes en todo Chile, de forma remota o en terreno según el servicio.",
  keywords: [
    "consultora concepcion",
    "consultoría estratégica concepción",
    "desarrollo organizacional concepción",
    "relacionamiento comunitario chile",
    "sostenibilidad corporativa ESG",
    "consultora ESG chile",
    "consultoría organizacional biobío",
  ],
  applicationName: "The Human Org",
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "The Human Org",
    title: "The Human Org — Consultora estratégica en Concepción",
    description:
      "Consultora en Concepción especializada en ESG, relacionamiento comunitario y desarrollo organizacional. Rigor y viabilidad para decisiones complejas.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "The Human Org" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Human Org — Consultora estratégica en Concepción",
    description:
      "Consultora en Concepción especializada en ESG, relacionamiento comunitario y desarrollo organizacional. Rigor y viabilidad para decisiones complejas.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "The Human Org",
    alternateName: "THO",
    url: "https://tho.cl",
    email: "hola@tho.cl",
    logo: "https://tho.cl/brand/logo-negro.svg",
    image: "https://tho.cl/og.png",
    description:
      "Consultora estratégica boutique en Concepción, Chile, especializada en sostenibilidad corporativa (ESG), relacionamiento comunitario y desarrollo organizacional.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Concepción",
      addressRegion: "Región del Biobío",
      addressCountry: "CL",
    },
    areaServed: { "@type": "Country", name: "Chile" },
    knowsAbout: [
      "Sostenibilidad corporativa",
      "ESG",
      "Relacionamiento comunitario",
      "Desarrollo organizacional",
      "Reporte de sostenibilidad",
      "Gestión de stakeholders",
      "Cultura organizacional",
    ],
    sameAs: [
      "https://instagram.com/thehumanorg/",
      "https://linkedin.com/company/thocl",
    ],
  };

  return (
    <html lang="es" className={`${thocl.variable} ${ttFirsNeue.variable}`}>
      <body className="bg-tho-bg text-slate-950 antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow"
        >
          Saltar al contenido
        </a>
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <UtmTracker />
        {children}
      </body>
    </html>
  );
}
