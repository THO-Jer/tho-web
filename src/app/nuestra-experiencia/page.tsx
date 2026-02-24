"use client";

import { useEffect, useMemo, useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type ExperienceSection = {
  id: string;
  counter: string;
  navTitle: string;
  middleTitle: string;
  year: string;
  body: string[];
  bgClass: string;
  textClass?: string;
};

const SECTIONS: ExperienceSection[] = [
  {
    id: "pre-tho",
    counter: "01",
    navTitle: "Pre THO",
    middleTitle: "Pre THO",
    year: "Pre-2023",
    bgClass: "exp-section-white",
    textClass: "text-slate-900",
    body: [
      "Antes de fundar THO, ya trabajábamos en:",
      "Diagnósticos organizacionales en contextos complejos",
      "Diseño de procesos participativos",
      "Gestión de cambio y cultura organizacional",
      "Análisis de impacto social y reputación",
      "Aprendimos algo clave: sin coherencia interna, ninguna estrategia externa funciona.",
      "THO nace desde esa acumulación.",
    ],
  },
  {
    id: "fundacion",
    counter: "02",
    navTitle: "Fundación y primer gran contrato",
    middleTitle: "Fundación y primer gran contrato",
    year: "2023",
    bgClass: "exp-section-red",
    body: [
      "En julio de 2023 iniciamos operaciones formales.",
      "Algunos proyectos comenzaron por el relato público. Pero en todos los casos, el trabajo terminó siendo estructural.",
      "Hacia fines de ese año, firmamos nuestro primer contrato sostenido con la Cámara Chilena de la Construcción Concepción, acompañando procesos de relacionamiento comunitario y fortalecimiento estratégico.",
      "Ese hito marcó el inicio de una práctica continua y de largo plazo.",
    ],
  },
  {
    id: "metodo-red",
    counter: "03",
    navTitle: "Método y red",
    middleTitle: "Método y red",
    year: "2024",
    bgClass: "exp-section-blue",
    body: [
      "El segundo año no fue de expansión. Fue de consolidación.",
      "Estructuramos un método anual de relacionamiento comunitario.",
      "Formalizamos herramientas como la Hoja de Ruta Comunitaria y el mapeo de actores.",
      "Profundizamos la evaluación de impacto social.",
      "Nos vinculamos formalmente con la red IAP2 Latinoamérica en participación pública.",
      "THO dejó de ser una consultora joven. Comenzó a tener método.",
    ],
  },
  {
    id: "profundizacion",
    counter: "04",
    navTitle: "Profundización y profesionalización",
    middleTitle: "Profundización y profesionalización",
    year: "2025",
    bgClass: "exp-section-orange",
    body: [
      "El tercer año fue de madurez.",
      "Ejecución sostenida de estrategias comunitarias.",
      "Consolidación de programas territoriales.",
      "Formación avanzada del director para convertirse en trainer oficial IAP2.",
      "Entrenamiento a equipos y círculos internos en liderazgo y participación.",
      "Incorporación de nuevos clientes que buscan coherencia entre organización, comunidad y relato público.",
      "La experiencia dejó de medirse en proyectos. Comenzó a medirse en profundidad.",
    ],
  },
  {
    id: "consolidacion",
    counter: "05",
    navTitle: "Camino a la consolidación",
    middleTitle: "Camino a la consolidación",
    year: "2026",
    bgClass: "exp-section-violet",
    body: [
      "Hoy consolidamos una identidad.",
      "No buscamos volumen. Buscamos coherencia.",
      "No buscamos clientes para ejecutar tareas. Buscamos organizaciones dispuestas a transformarse.",
    ],
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
                    <div className="exp-nav-counter">{section.counter}</div>
                    <h2 className="exp-nav-title">{section.navTitle}</h2>
                    <p className="exp-nav-body">{section.year}</p>
                  </a>
                </li>
              );
            })}
          </ol>
        </aside>

        <div>
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`exp-section ${section.bgClass} ${section.textClass || "text-white"}`}
            >
              <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-[0.8fr_1.2fr] md:px-14">
                <h1 className="font-tho-title text-[2.2rem] leading-[1.02] md:text-[4rem]">{section.middleTitle}</h1>

                <div>
                  <p className="text-3xl font-semibold md:text-5xl">{section.year}</p>
                  <div className="mt-5 grid gap-3 text-sm leading-relaxed md:text-lg">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
