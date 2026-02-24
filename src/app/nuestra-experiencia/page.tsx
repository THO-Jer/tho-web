"use client";

import { useEffect, useMemo, useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type ExperienceSection = {
  id: string;
  counter: string;
  title: string;
  body: string;
  bgClass: string;
  textClass?: string;
};

const SECTIONS: ExperienceSection[] = [
  {
    id: "origen",
    counter: "01",
    title: "Origen en terreno",
    body: "Nacimos en Concepción acompañando organizaciones con presión social, reputacional y operativa.",
    bgClass: "exp-section-white",
    textClass: "text-slate-900",
  },
  {
    id: "diagnostico",
    counter: "02",
    title: "Diagnóstico sin filtro",
    body: "Leemos riesgos, actores y brechas internas para priorizar con datos y no con intuición aislada.",
    bgClass: "exp-section-red",
  },
  {
    id: "estrategia",
    counter: "03",
    title: "Estrategia defendible",
    body: "Convertimos hallazgos en rutas de acción claras para directorio, equipos y operación territorial.",
    bgClass: "exp-section-blue",
  },
  {
    id: "implementacion",
    counter: "04",
    title: "Implementación acompañada",
    body: "No dejamos un documento: acompañamos la ejecución y ajustamos en tiempo real donde ocurre el cambio.",
    bgClass: "exp-section-orange",
  },
  {
    id: "capacidad",
    counter: "05",
    title: "Capacidad instalada",
    body: "El resultado esperado es autonomía interna: decisiones más sólidas y equipos capaces de sostener avances.",
    bgClass: "exp-section-violet",
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
                    <h2 className="exp-nav-title">{section.title}</h2>
                    <p className="exp-nav-body">{section.body}</p>
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
              <div className="mx-auto w-full max-w-4xl px-6 text-center md:px-10">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">Etapa {section.counter}</p>
                <h1 className="font-tho-title mt-3 text-[2.6rem] md:text-[4.2rem]">{section.title}</h1>
                <p className="mx-auto mt-4 max-w-2xl text-base md:text-xl">{section.body}</p>
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
