"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/* ── TIMELINE DATA ─────────────────────────────────────────────────────── */

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

/* ── PROJECTS DATA ─────────────────────────────────────────────────────── */

type Project = {
  id: string;
  client: string;
  title: string;
  tag: string;
  tagColor: string;
  since: string;
  summary: string;
  detail: string;
};

const PROJECTS: Project[] = [
  {
    id: "cchc",
    client: "CChC Concepción",
    title: "Estrategia de Relacionamiento Comunitario",
    tag: "Comunidad",
    tagColor: "#1e71b8",
    since: "Desde 2023",
    summary:
      "Acompañamiento continuo al vínculo entre el gremio de la construcción y las comunidades del Gran Concepción.",
    detail:
      "Desde el segundo semestre de 2023 acompañamos el relacionamiento con las comunidades del Gran Concepción. Desde encuentros iniciales hasta la elaboración de documentos de consenso sobre desarrollo urbano, generamos confianza mediante programas que permiten vínculos auténticos entre el gremio y las organizaciones sociocomunitarias. Entre esos programas se cuentan la Escuela Itinerante, los Encuentros de Diseño Participativo y el documento Visión 2050.",
  },
  {
    id: "indama",
    client: "INDAMA S.A.",
    title: "Revista Interna",
    tag: "Comunicación",
    tagColor: "#d13ca2",
    since: "2024",
    summary:
      "Revista trimestral para fortalecer la cultura organizacional desde adentro.",
    detail:
      "Acompañamos a INDAMA en la promoción de su cultura organizacional mediante una revista trimestral que abordaba los eventos, cambios y proyecciones más importantes para la empresa. Celebraciones como aniversarios, trabajadores con larga trayectoria, fiestas patrias e inauguración de nueva tecnología fueron contenidos valorados a lo largo del proceso.",
  },
  {
    id: "paleoandes",
    client: "Paleo Andes",
    title: "Fortalecimiento Organizacional",
    tag: "Desarrollo org.",
    tagColor: "#93bf24",
    since: "Desde 2026",
    summary:
      "Proceso de actualización de la arquitectura interna para una empresa de arqueología y paleontología.",
    detail:
      "Luego de un acercamiento en torno a la sostenibilidad en 2025, en 2026 iniciamos un proceso de fortalecimiento con foco en la arquitectura organizacional. La revisión del organigrama, el manual de cargos y las matrices de gestión interna permite mayor alineación, el desarrollo de una cultura organizacional sólida y un despliegue más coordinado de las distintas funciones de la empresa.",
  },
  {
    id: "iap2",
    client: "IAP2 Latinoamérica",
    title: "Training en Participación Pública",
    tag: "Formación",
    tagColor: "#fa7f33",
    since: "Desde 2025",
    summary:
      "Formaciones certificadas en el Enfoque IAP2 para organizaciones y empresas de la región.",
    detail:
      "Con la certificación internacional de nuestro director como entrenador IAP2, realizamos formaciones a distintas organizaciones y empresas en el Enfoque IAP2 para la Participación Pública. Esta alianza ha permitido una internacionalización del trabajo de THO y un intercambio de experiencias que enriquece cada asesoría.",
  },
];

/* ── PAGE ──────────────────────────────────────────────────────────────── */

export default function NuestraExperienciaPage() {
  const [activeId, setActiveId] = useState(ERAS[0].id);
  const [panelVisible, setPanelVisible] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);

  const activeEra = ERAS.find((e) => e.id === activeId) ?? ERAS[0];

  function selectEra(id: string) {
    if (id === activeId) return;
    setPanelVisible(false);
    setTimeout(() => {
      setActiveId(id);
      setPanelVisible(true);
    }, 180);
  }

  function toggleProject(id: string) {
    setOpenProject((prev) => (prev === id ? null : id));
  }

  useEffect(() => {
    const t = setTimeout(() => setPanelVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

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

        {/* ── Page header ── */}
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

        {/* ── Timeline ── */}
        <div className="exp2-layout">
          <nav className="exp2-nav" aria-label="Períodos">
            <ol className="exp2-nav-list">
              {ERAS.map((era, i) => {
                const isActive = era.id === activeId;
                return (
                  <li key={era.id} className="exp2-nav-item">
                    {i < ERAS.length - 1 && (
                      <span className="exp2-connector" aria-hidden />
                    )}
                    <button
                      onClick={() => selectEra(era.id)}
                      className={`exp2-nav-btn${isActive ? " is-active" : ""}`}
                      style={isActive ? ({ "--era-accent": era.accent } as React.CSSProperties) : undefined}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className="exp2-dot"
                        style={isActive ? { background: era.accent } : undefined}
                        aria-hidden
                      />
                      <span className="exp2-nav-text">
                        <span className="exp2-nav-year">{era.year}</span>
                        <span className="exp2-nav-label">{era.label}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className={`exp2-panel${panelVisible ? " is-visible" : ""}`}>
            <div
              className="exp2-panel-accent"
              style={{ background: activeEra.accent }}
              aria-hidden
            />
            <div className="exp2-panel-body">
              <p className="exp2-panel-year" style={{ color: activeEra.accent }}>
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

        {/* ── Projects ── */}
        <section className="exp2-projects-section">
          <div className="exp2-projects-inner">
            <div className="exp2-projects-header" data-exp-reveal>
              <p className="exp2-eyebrow">Proyectos destacados</p>
              <h2 className="exp2-section-title font-tho-title">
                Trabajo que habla por sí solo
              </h2>
            </div>

            <div className="exp2-projects-grid">
              {PROJECTS.map((project) => {
                const isOpen = openProject === project.id;
                return (
                  <article
                    key={project.id}
                    className={`exp2-card${isOpen ? " is-open" : ""}`}
                  >
                    <button
                      className="exp2-card-trigger"
                      onClick={() => toggleProject(project.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="exp2-card-top">
                        <span
                          className="exp2-card-tag"
                          style={{ color: project.tagColor, borderColor: project.tagColor + "40", background: project.tagColor + "10" }}
                        >
                          {project.tag}
                        </span>
                        <span className="exp2-card-since">{project.since}</span>
                      </div>
                      <p className="exp2-card-client">{project.client}</p>
                      <h3 className="exp2-card-title">{project.title}</h3>
                      <p className="exp2-card-summary">{project.summary}</p>
                      <div className="exp2-card-chevron" aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>

                    <div className="exp2-card-detail" aria-hidden={!isOpen}>
                      <div
                        className="exp2-card-detail-bar"
                        style={{ background: project.tagColor }}
                      />
                      <p>{project.detail}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO: all content in DOM */}
        <div className="sr-only" aria-hidden="true">
          {ERAS.map((era) =>
            era.body.map((p) => <p key={`seo-${era.id}-${p.slice(0, 20)}`}>{p}</p>)
          )}
          {PROJECTS.map((p) => (
            <p key={`seo-proj-${p.id}`}>{p.detail}</p>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
