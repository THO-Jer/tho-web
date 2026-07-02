import type { Metadata } from "next";
import Script from "next/script";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExperienciaClient } from "@/components/ExperienciaClient";
import { ERAS, PROJECTS } from "@/content/experiencia";

const SITE = "https://tho.cl";

export const metadata: Metadata = {
  title: "Nuestra Experiencia · The Human Org",
  description:
    "Trabajo en terreno desde 2023. Proyectos en relacionamiento comunitario, desarrollo organizacional y sostenibilidad con empresas y organizaciones en Chile.",
  alternates: { canonical: `${SITE}/nuestra-experiencia` },
  openGraph: {
    type: "website",
    title: "Nuestra Experiencia · The Human Org",
    description:
      "Trabajo en terreno desde 2023. Proyectos en relacionamiento comunitario, desarrollo organizacional y sostenibilidad con empresas en Chile.",
    url: `${SITE}/nuestra-experiencia`,
    siteName: "The Human Org",
    images: [{ url: `${SITE}/og.png`, width: 1200, height: 630, alt: "The Human Org" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Proyectos destacados de The Human Org",
  description:
    "Selección de proyectos en relacionamiento comunitario, desarrollo organizacional y sostenibilidad ejecutados por The Human Org en Chile.",
  url: `${SITE}/nuestra-experiencia`,
  itemListElement: PROJECTS.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: project.title,
    description: project.detail,
    item: {
      "@type": "CreativeWork",
      name: project.title,
      description: project.detail,
      about: project.tag,
      provider: {
        "@type": "Organization",
        name: "The Human Org",
        url: SITE,
      },
    },
  })),
};

export default function NuestraExperienciaPage() {
  return (
    <div className="min-h-screen bg-tho-bg">
      <Script
        id="ld-experiencia"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="contenido">
        {/* Contenido estático indexable por Google — visible en el HTML inicial */}
        <div className="sr-only">
          <h1>Nuestra experiencia — The Human Org</h1>
          <p>
            The Human Org es una consultora estratégica con sede en Concepción, Chile, en operación desde 2023,
            con trabajo en terreno en relacionamiento comunitario, desarrollo organizacional y sostenibilidad corporativa.
          </p>
          {ERAS.map((era) => (
            <section key={era.id}>
              <h2>{era.label} ({era.year})</h2>
              {era.body.map((p, i) => <p key={i}>{p}</p>)}
              {era.clients.length > 0 && (
                <p>Clientes: {era.clients.map((c) => c.name).join(", ")}.</p>
              )}
            </section>
          ))}
          <section>
            <h2>Proyectos destacados</h2>
            {PROJECTS.map((project) => (
              <article key={project.id}>
                <h3>{project.title} — {project.client}</h3>
                <p>{project.detail}</p>
              </article>
            ))}
          </section>
        </div>

        {/* Interfaz interactiva */}
        <ExperienciaClient eras={ERAS} projects={PROJECTS} />
      </main>
      <Footer />
    </div>
  );
}
