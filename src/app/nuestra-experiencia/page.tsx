"use client";

import { useEffect, useMemo, useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type OverlayAsset = {
  src: string;
  alt: string;
  top: string;
  left: string;
  width: string;
};

type ExperienceSection = {
  id: string;
  year: string;
  title: string;
  body: string[];
  bgClass: string;
  textClass: string;
  assets: OverlayAsset[];
};

function jitterSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) % 997;
  return h;
}

const SECTIONS: ExperienceSection[] = [
  {
    id: "pre-tho",
    year: "Pre-2023",
    title: "Pre THO",
    bgClass: "exp-section-pink",
    textClass: "text-white",
    body: [
      "Antes de fundar THO, ya trabajábamos en:",
      "Diagnósticos organizacionales en contextos complejos",
      "Diseño de procesos participativos",
      "Gestión de cambio y cultura organizacional",
      "Análisis de impacto social y reputación",
      "Aprendimos algo clave: sin coherencia interna, ninguna estrategia externa funciona.",
      "THO nace desde esa acumulación.",
    ],
    assets: [
      { src: "/ilustraciones/1.png", alt: "Ilustración", top: "12%", left: "56%", width: "10rem" },
      { src: "/ilustraciones/6.png", alt: "Ilustración", top: "62%", left: "78%", width: "9rem" },
      { src: "/ilustraciones/9.png", alt: "Ilustración", top: "28%", left: "82%", width: "8rem" },
    ],
  },
  {
    id: "fundacion",
    year: "2023",
    title: "Fundación y primer gran contrato",
    bgClass: "exp-section-blue",
    textClass: "text-white",
    body: [
      "En julio de 2023 iniciamos operaciones formales.",
      "Algunos proyectos comenzaron por el relato público. Pero en todos los casos, el trabajo terminó siendo estructural.",
      "Hacia fines de ese año, firmamos nuestro primer contrato sostenido con la Cámara Chilena de la Construcción Concepción, acompañando procesos de relacionamiento comunitario y fortalecimiento estratégico.",
      "Ese hito marcó el inicio de una práctica continua y de largo plazo.",
    ],
    assets: [
      { src: "/confian/1.svg", alt: "Logo confianza", top: "14%", left: "80%", width: "8.2rem" },
      { src: "/confian/4.svg", alt: "Logo confianza", top: "45%", left: "58%", width: "9rem" },
      { src: "/confian/9.svg", alt: "Logo confianza", top: "70%", left: "82%", width: "8rem" },
    ],
  },
  {
    id: "metodo-red",
    year: "2024",
    title: "Método y red",
    bgClass: "exp-section-orange",
    textClass: "text-slate-950",
    body: [
      "El segundo año no fue de expansión. Fue de consolidación.",
      "Estructuramos un método anual de relacionamiento comunitario.",
      "Formalizamos herramientas como la Hoja de Ruta Comunitaria y el mapeo de actores.",
      "Profundizamos la evaluación de impacto social.",
      "Nos vinculamos formalmente con la red IAP2 Latinoamérica en participación pública.",
      "THO dejó de ser una consultora joven. Comenzó a tener método.",
    ],
    assets: [
      { src: "/confian/2.svg", alt: "Logo confianza", top: "12%", left: "60%", width: "8.4rem" },
      { src: "/confian/3.svg", alt: "Logo confianza", top: "50%", left: "82%", width: "8rem" },
      { src: "/confian/8.svg", alt: "Logo confianza", top: "72%", left: "66%", width: "8.8rem" },
    ],
  },
  {
    id: "profundizacion",
    year: "2025",
    title: "Profundización y profesionalización",
    bgClass: "exp-section-yellow",
    textClass: "text-slate-950",
    body: [
      "El tercer año fue de madurez.",
      "Ejecución sostenida de estrategias comunitarias.",
      "Consolidación de programas territoriales.",
      "Formación avanzada del director para convertirse en trainer oficial IAP2.",
      "Entrenamiento a equipos y círculos internos en liderazgo y participación.",
      "Incorporación de nuevos clientes que buscan coherencia entre organización, comunidad y relato público.",
      "La experiencia dejó de medirse en proyectos. Comenzó a medirse en profundidad.",
    ],
    assets: [
      { src: "/confian/4.svg", alt: "Logo confianza", top: "12%", left: "78%", width: "8.2rem" },
      { src: "/confian/5.svg", alt: "Logo confianza", top: "48%", left: "58%", width: "8.6rem" },
      { src: "/confian/6.svg", alt: "Logo confianza", top: "80%", left: "82%", width: "8rem" },
    ],
  },
  {
    id: "consolidacion",
    year: "2026",
    title: "Camino a la consolidación",
    bgClass: "exp-section-green",
    textClass: "text-slate-950",
    body: [
      "Hoy consolidamos una identidad.",
      "No buscamos volumen. Buscamos coherencia.",
      "No buscamos clientes para ejecutar tareas. Buscamos organizaciones dispuestas a transformarse.",
    ],
    assets: [{ src: "/confian/7.svg", alt: "Logo confianza", top: "10%", left: "74%", width: "8.4rem" }],
  },
];

export default function NuestraExperienciaPage() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0.01,
    }),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    }, observerOptions);

    const elements = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [observerOptions]);

  return (
    <div className="exp-wrapper min-h-screen">
      <Header />
      <main id="contenido" className="relative">
        <aside className="exp-nav-wrapper" aria-label="Navegación de experiencia">
          <ol className="exp-nav-list">
            {SECTIONS.map((section) => {
              const active = section.id === activeId;
              return (
                <li key={section.id} className={`exp-nav-item ${active ? "active" : ""}`}>
                  <a href={`#${section.id}`}>
                    <div className="exp-nav-counter">{section.year}</div>
                    <p className="exp-nav-body whitespace-pre-line">{section.body.join("\n\n")}</p>
                  </a>
                </li>
              );
            })}
          </ol>
        </aside>

        <div>
          {SECTIONS.map((section) => {
            const active = section.id === activeId;
            return (
              <section key={section.id} id={section.id} className={`exp-section ${section.bgClass} ${section.textClass}`}>
                <div className="exp-section-overlay" aria-hidden>
                  {section.assets.map((asset) => {
                    const seed = jitterSeed(`${section.id}-${asset.src}`);
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={`${section.id}-${asset.src}`}
                        src={asset.src}
                        alt={asset.alt}
                        className={`exp-float-media ${active ? "is-visible" : ""}`}
                        style={{
                          top: asset.top,
                          left: asset.left,
                          width: asset.width,
                          transform: `rotate(${(seed % 9) - 4}deg)`,
                          animationDelay: `${(seed % 7) * 0.25}s`,
                        }}
                      />
                    );
                  })}
                </div>

                <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-[1.2fr_0.8fr] md:px-14">
                  <div className="hidden md:block" aria-hidden />
                  <div>
                    <h1 className="font-tho-title text-[2.8rem] leading-[1.01] md:text-[5.2rem]">{section.title}</h1>
                    <div className="mt-4 grid gap-2 text-base leading-relaxed md:hidden">
                      <p className="text-2xl font-semibold">{section.year}</p>
                      {section.body.map((paragraph) => (
                        <p key={`${section.id}-${paragraph}`}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
