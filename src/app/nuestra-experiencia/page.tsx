"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type Era = {
  id: string;
  year: string;
  label: string;
  accent: string;
  body: string[];
};

const ERAS: Era[] = [
  {
    id: "origen",
    year: "Antes de 2023",
    label: "Origen",
    accent: "#d13ca2",
    body: [
      "El director de THO acumula trayectoria desde 2009 en trabajo de campo, levantamiento de datos y facilitación. Pasó por programas de fortalecimiento comunitario del FOSIS y luego por una consultora local acompañando organizaciones de distinto rubro y escala.",
      "Ahí se hizo evidente un patrón: muchas asesorías operaban sin metodología real, terminando como confirmaciones del diagnóstico del cliente o como ejercicios puramente comunicacionales.",
      "THO nació para cerrar esa brecha — trabajo sistemático, resultados concretos.",
    ],
  },
  {
    id: "inicio",
    year: "2022–2023",
    label: "Primeros pasos",
    accent: "#1e71b8",
    body: [
      "Constituimos la organización en 2022 e iniciamos operaciones con fuerza en 2023. Los primeros proyectos definieron bien el perímetro: relacionamiento comunitario con la Cámara Chilena de la Construcción Concepción y su proyecto Conce Con Todos, gestión de contenido para Club34 y una revista interna para los trabajadores de INDAMA S.A.",
      "La mayoría de esas relaciones comerciales siguen activas hoy.",
    ],
  },
  {
    id: "consolidacion",
    year: "2024",
    label: "Consolidación",
    accent: "#fa7f33",
    body: [
      "Continuamos con los clientes del año anterior y formalizamos vínculo con IAP2 Latinoamérica, la red de referencia en participación pública de la región.",
      "Empezamos también a proyectar servicios de sostenibilidad, orientados a la gestión, la reportabilidad y el cumplimiento de estándares — una extensión natural del trabajo estratégico y organizacional que ya hacíamos.",
      "El trabajo dejó de ser acumulación de proyectos y empezó a tener una arquitectura.",
    ],
  },
  {
    id: "certificacion",
    year: "2025",
    label: "Certificación y equipo",
    accent: "#f2b705",
    body: [
      "Asesoramos al Círculo de Mujeres de la CChC en vocería estratégica. Sumamos a Credyhogar y Vanrom en contenido digital con foco en las personas detrás de cada operación.",
      "El director se certificó como entrenador internacional IAP2. Se incorpora además un nuevo director, enriqueciendo la conducción de THO con una mirada complementaria.",
      "El equipo crece con un área audiovisual y una jefatura de administración y finanzas.",
    ],
  },
  {
    id: "hoy",
    year: "2026",
    label: "Hoy y hacia adelante",
    accent: "#93bf24",
    body: [
      "Trabajamos con Paleo Andes en un proceso de fortalecimiento organizacional y actualización de su arquitectura interna. El equipo incorporó un asesor de relacionamiento comunitario, una diseñadora gráfica y un asesor en desarrollo organizacional.",
      "Los servicios cubren hoy el ciclo completo: comunidad, comunicación, organización y sostenibilidad — esta última con proyección concreta para los próximos años.",
    ],
  },
];

export default function NuestraExperienciaPage() {
  const [activeId, setActiveId] = useState(ERAS[0].id);
  const [visible, setVisible] = useState(false);
  const prevIdRef = useRef(activeId);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeEra = ERAS.find((e) => e.id === activeId) ?? ERAS[0];

  function selectEra(id: string) {
    if (id === activeId) return;
    setVisible(false);
    setTimeout(() => {
      prevIdRef.current = id;
      setActiveId(id);
      setVisible(true);
    }, 180);
  }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Reveal header elements on mount
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-exp-reveal]");
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add("exp2-visible"), 60 + i * 80);
    });
  }, []);

  return (
    <div className="min-h-screen bg-tho-bg">
      <Header />

      <main id="contenido" className="exp2-page">
        {/* Page header */}
        <div className="exp2-hero">
          <div className="exp2-hero-inner">
            <p className="exp2-eyebrow" data-exp-reveal>Trayectoria</p>
            <h1 className="exp2-title font-tho-title" data-exp-reveal>
              Nuestra experiencia
            </h1>
            <p className="exp2-subtitle" data-exp-reveal>
              Más de una década de trabajo en terreno, convertida en método.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="exp2-layout">
          {/* Left: year nav */}
          <nav className="exp2-nav" aria-label="Períodos">
            <ol className="exp2-nav-list">
              {ERAS.map((era, i) => {
                const isActive = era.id === activeId;
                return (
                  <li key={era.id} className="exp2-nav-item">
                    {/* connector line */}
                    {i < ERAS.length - 1 && (
                      <span className="exp2-connector" aria-hidden />
                    )}
                    <button
                      onClick={() => selectEra(era.id)}
                      className={`exp2-nav-btn${isActive ? " is-active" : ""}`}
                      style={isActive ? { "--era-accent": era.accent } as React.CSSProperties : undefined}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className="exp2-dot"
                        style={isActive ? { background: era.accent } : undefined}
                        aria-hidden
                      />
                      <span className="exp2-nav-year">{era.year}</span>
                      <span className="exp2-nav-label">{era.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Right: content panel */}
          <div
            ref={contentRef}
            className={`exp2-panel${visible ? " is-visible" : ""}`}
          >
            <div
              className="exp2-panel-accent"
              style={{ background: activeEra.accent }}
              aria-hidden
            />
            <div className="exp2-panel-body">
              <p
                className="exp2-panel-year"
                style={{ color: activeEra.accent }}
              >
                {activeEra.year}
              </p>
              <h2 className="exp2-panel-heading font-tho-title">
                {activeEra.label}
              </h2>
              <div className="exp2-panel-text">
                {activeEra.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden SEO: all content in DOM */}
        <div className="sr-only" aria-hidden="true">
          {ERAS.map((era) =>
            era.body.map((p) => <p key={`seo-${era.id}-${p.slice(0, 20)}`}>{p}</p>)
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
