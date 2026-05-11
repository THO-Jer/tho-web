import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import localFont from "next/font/local";

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
    default: "The Human Org — Consultoría estratégica",
    template: "%s · The Human Org",
  },
  description:
    "Consultoría boutique en desarrollo organizacional, relacionamiento comunitario y sostenibilidad corporativa. Rigor, viabilidad y acompañamiento en terreno.",
  applicationName: "The Human Org",
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "The Human Org",
    title: "The Human Org — Consultoría estratégica",
    description:
      "Rigor y viabilidad para decisiones complejas: DO, relacionamiento comunitario y sostenibilidad corporativa.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "The Human Org" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Human Org — Consultoría estratégica",
    description:
      "Rigor y viabilidad para decisiones complejas: DO, relacionamiento comunitario y sostenibilidad corporativa.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Human Org",
    url: "https://tho.cl",
    email: "hola@tho.cl",
    logo: "https://tho.cl/brand/logo-negro.png",
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
        {children}
      </body>
    </html>
  );
}
