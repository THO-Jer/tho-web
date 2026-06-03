"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/* ── TYPES ─────────────────────────────────────────────────────────────── */

type Client = {
  name: string;
  isNew: boolean;
};

type Era = {
  id: string;
  year: string;
  label: string;
  accent: string;
  body: string[];
  clients: Client[];
  clientNote?: string;
};

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

/* ── DATA ───────────────────────────────────────────────────────────────── */

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
    clients: [],
    clientNote: "THO se constituye formalmente en 2022.",
  },
  {
    id: "inicio",
    year: "2023",
    label: "Primeros pasos",
    accent: "#1e71b8",
    body: [
      "Iniciamos operaciones con fuerza en 2023. Los primeros proyectos definieron bien el perímetro de lo que hacemos: relacionamiento comunitario con la Cámara Chilena de la Construcción Concepción, gestión de contenido para Club34.",
      "Dos relaciones que comenzaron ese año siguen activas hoy — lo que dice más de cómo trabajamos que cualquier credencial.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: true },
      { name: "Club34", isNew: true },
    ],
  },
  {
    id: "consolidacion",
    year: "2024",
    label: "Consolidación",
    accent: "#fa7f33",
    body: [
      "El segundo año fue de profundización, no de expansión por expansión. Continuamos con los clientes del año anterior, sumamos nuevos proyectos y formalizamos vínculo con IAP2 Latinoamérica, la red de referencia en participación pública de la región.",
      "Acompañamos a INDAMA S.A. en la construcción de su cultura organizacional a través de una revista trimestral interna. Empezamos también a proyectar servicios de sostenibilidad, orientados a la gestión, la reportabilidad y el cumplimiento de estándares.",
      "El trabajo dejó de ser acumulación de proyectos y empezó a tener una arquitectura.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: false },
      { name: "Club34", isNew: false },
      { name: "Conce Con Todos", isNew: true },
      { name: "INDAMA S.A.", isNew: true },
      { name: "IAP2 Latinoamérica", isNew: true },
    ],
  },
  {
    id: "certificacion",
    year: "2025",
    label: "Certificación y equipo",
    accent: "#f2b705",
    body: [
      "Asesoramos al Círculo de Mujeres de la CChC en vocería estratégica. Llegamos a CChC Araucanía — primera expansión geográfica fuera del Gran Concepción.",
      "El director se certificó como entrenador internacional IAP2. Se incorpora un nuevo director, enriqueciendo la conducción de THO con una mirada complementaria. El equipo crece con un área audiovisual y una jefatura de administración y finanzas.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: false },
      { name: "Club34", isNew: false },
      { name: "Círculo de Mujeres CChC", isNew: true },
      { name: "CChC Araucanía", isNew: true },
    ],
    clientNote: "Primera expansión geográfica fuera del Gran Concepción.",
  },
  {
    id: "hoy",
    year: "2026",
    label: "Hoy",
    accent: "#93bf24",
    body: [
      "Trabajamos con Paleo Andes en un proceso de fortalecimiento organizacional y actualización de su arquitectura interna. Sumamos a Credyhogar y Vanrom en contenido digital con foco en las personas detrás de cada operación.",
      "El equipo incorporó un asesor de relacionamiento comunitario, una diseñadora gráfica y un asesor en desarrollo organizacional. Los servicios cubren hoy el ciclo completo: comunidad, comunicación, organización y sostenibilidad.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: false },
      { name: "Club34", isNew: false },
      { name: "Credyhogar", isNew: true },
      { name: "Vanrom", isNew: true },
      { name: "Paleo Andes", isNew: true },
    ],
    clientNote: "CChC Concepción y Club34 llevan con THO desde el primer día.",
  },
];

const PROJECTS: Project[] = [
  {
    id: "cchc",
    client: "CChC Concepción",
    title: "Estrategia de Relacionamiento Comunitario",
    tag: "Comunidad",
    tagColor: "#1e71b8",
    since: "Desde 2023",
    summary: "Acompañamiento continuo al vínculo entre el gremio y las comunidades del Gran Concepción.",
    detail:
      "Desde el segundo semestre de 2023 acompañamos el relacionamiento con las comunidades del Gran Concepción. Desde encuentros iniciales hasta documentos de consenso sobre desarrollo urbano, generamos confianza a través de programas que permiten vínculos auténticos entre el gremio y las organizaciones sociocomunitarias: la Escuela Itinerante, los Encuentros de Diseño Participativo y el documento Visión 2050.",
  },
  {
    id: "indama",
    client: "INDAMA S.A.",
    title: "Revista Interna Trimestral",
    tag: "Comunicación",
    tagColor: "#d13ca2",
    since: "2024",
    summary: "Cultura organizacional desde adentro, a través de una publicación propia.",
    detail:
      "Acompañamos a INDAMA en la promoción de su cultura organizacional mediante una revista trimestral que abordaba eventos, cambios y proyecciones importantes para la empresa. Aniversarios, trabajadores con larga trayectoria, fiestas patrias e inauguración de nueva tecnología fueron contenidos valorados a lo largo del proceso.",
  },
  {
    id: "paleoandes",
    client: "Paleo Andes",
    title: "Fortalecimiento Organizacional",
    tag: "Desarrollo org.",
    tagColor: "#93bf24",
    since: "Desde 2026",
    summary: "Actualización de la arquitectura interna para una empresa de arqueología y paleontología.",
    detail:
      "Luego de un acercamiento en torno a la sostenibilidad en 2025, en 2026 iniciamos un proceso de fortalecimiento con foco en la arquitectura organizacional. La revisión del organigrama, el manual de cargos y las matrices de gestión interna permite mayor alineación, el desarrollo de una cultura organizacional sólida y un despliegue más coordinado de las distintas funciones.",
  },
  {
    id: "iap2",
    client: "IAP2 Latinoamérica",
    title: "Training en Participación Pública",
    tag: "Formación",
    tagColor: "#fa7f33",
    since: "Desde 2025",
    summary: "Formaciones certificadas en el Enfoque IAP2 para organizaciones y empresas.",
    detail:
      "Con la certificación internacional de nuestro director como entrenador IAP2, realizamos formaciones a distintas organizaciones y empresas en el Enfoque IAP2 para la Participación Pública. Esta alianza ha permitido una internacionalización del trabajo de THO y un intercambio de experiencias que enriquece cada asesoría.",
  },
];

/* ── COMPONENT ──────────────────────────────────────────────────────────── */

export default function NuestraExperienciaPage() {
  const [activeId, setActiveId] = useState(ERAS[0].id);
  const [transitioning, setTransitioning] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const activeEra = ERAS.find((e) => e.id === activeId) ?? ERAS[0];

  function selectEra(id: string) {
    if (id === activeId || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveId(id);
      setTransitioning(false);
    }, 200);
  }

  function toggleProject(id: string) {
    setOpenProject((prev) => (prev === id ? null : id));
  }

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 60);
    return () => clearTimeout(t);
  }, []);

  const newClients = activeEra.clients.filter((c) => c.isNew);
  const continuingClients = activeEra.clients.filter((c) => !c.isNew);

  return (
    <div className="min-h-screen bg-tho-bg">
      <Header />

      <main id="contenido">

        {/* ── HERO ── */}
        <section className="exp3-hero">
          <div className="exp3-hero-inner">
            <p className={`exp3-eyebrow${revealed ? " is-in" : ""}`}>Trayectoria</p>
            <h1 className={`exp3-title font-tho-title${revealed ? " is-in" : ""}`}>
              Nuestra<br />experiencia
            </h1>
            <p className={`exp3-subtitle${revealed ? " is-in" : ""}`}>
              Más de una década de trabajo en terreno,<br className="hidden md:block" /> convertida en método y relaciones que duran.
            </p>
          </div>
          {/* brand bar */}
          <div className="exp3-hero-bar" aria-hidden />
        </section>

        {/* ── TIMELINE ── */}
        <section className="exp3-timeline-section">

          {/* Year tabs */}
          <div className="exp3-tabs-wrap">
            <div className="exp3-tabs">
              {ERAS.map((era) => {
                const isActive = era.id === activeId;
                return (
                  <button
                    key={era.id}
                    onClick={() => selectEra(era.id)}
                    className={`exp3-tab${isActive ? " is-active" : ""}`}
                    style={isActive ? ({ "--tab-accent": era.accent } as React.CSSProperties) : undefined}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {era.year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel */}
          <div className="exp3-panel-wrap">
            {/* Ghost year */}
            <div
              className="exp3-ghost-year font-tho-title"
              aria-hidden
              style={{ color: activeEra.accent }}
            >
              {activeEra.year}
            </div>

            <div className={`exp3-panel-grid${transitioning ? " is-out" : " is-in"}`}>

              {/* Left: narrative */}
              <div className="exp3-narrative">
                <div
                  className="exp3-era-accent-bar"
                  style={{ background: activeEra.accent }}
                  aria-hidden
                />
                <h2 className="exp3-era-label font-tho-title">{activeEra.label}</h2>
                <div className="exp3-era-body">
                  {activeEra.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Right: clients */}
              <div className="exp3-clients">
                {activeEra.clients.length === 0 ? (
                  <div className="exp3-clients-empty">
                    <p>{activeEra.clientNote}</p>
                  </div>
                ) : (
                  <>
                    {continuingClients.length > 0 && (
                      <div className="exp3-client-group">
                        <p className="exp3-client-group-label">Continúan</p>
                        <div className="exp3-client-chips">
                          {continuingClients.map((c) => (
                            <span key={c.name} className="exp3-chip exp3-chip--continuing">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {newClients.length > 0 && (
                      <div className="exp3-client-group">
                        <p className="exp3-client-group-label">Se suman</p>
                        <div className="exp3-client-chips">
                          {newClients.map((c) => (
                            <span
                              key={c.name}
                              className="exp3-chip exp3-chip--new"
                              style={
                                {
                                  "--chip-color": activeEra.accent,
                                  "--chip-bg": activeEra.accent + "15",
                                  "--chip-border": activeEra.accent + "40",
                                } as React.CSSProperties
                              }
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeEra.clientNote && (
                      <p className="exp3-client-note">{activeEra.clientNote}</p>
                    )}
                  </>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section className="exp3-projects-section">
          <div className="exp3-projects-inner">
            <div className="exp3-projects-header">
              <p className="exp3-eyebrow" style={{ color: "#94a3b8" }}>Proyectos destacados</p>
              <h2 className="exp3-section-title font-tho-title">
                Trabajo que habla<br />por sí solo
              </h2>
            </div>

            <div className="exp3-projects-grid">
              {PROJECTS.map((project) => {
                const isOpen = openProject === project.id;
                return (
                  <article
                    key={project.id}
                    className={`exp3-card${isOpen ? " is-open" : ""}`}
                  >
                    <button
                      className="exp3-card-trigger"
                      onClick={() => toggleProject(project.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="exp3-card-top">
                        <span
                          className="exp3-card-tag"
                          style={{
                            color: project.tagColor,
                            borderColor: project.tagColor + "50",
                            background: project.tagColor + "12",
                          }}
                        >
                          {project.tag}
                        </span>
                        <span className="exp3-card-since">{project.since}</span>
                      </div>
                      <p className="exp3-card-client">{project.client}</p>
                      <h3 className="exp3-card-title">{project.title}</h3>
                      <p className="exp3-card-summary">{project.summary}</p>
                      <div className="exp3-card-footer">
                        <span
                          className="exp3-card-cta"
                          style={{ color: project.tagColor }}
                        >
                          {isOpen ? "Cerrar" : "Ver detalle"}
                        </span>
                        <span
                          className={`exp3-card-chevron${isOpen ? " is-open" : ""}`}
                          style={{ color: project.tagColor }}
                          aria-hidden
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M3 5l4 4 4-4"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </button>

                    <div className={`exp3-card-detail${isOpen ? " is-open" : ""}`}>
                      <div
                        className="exp3-card-detail-bar"
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

        {/* SEO */}
        <div className="sr-only" aria-hidden="true">
          {ERAS.map((era) =>
            era.body.map((p, i) => <p key={`seo-${era.id}-${i}`}>{p}</p>)
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
