"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/* ── TYPES ─────────────────────────────────────────────────────────────── */

type Client = { name: string; isNew: boolean };

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
  illustration: string;
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
      { name: "Conce Con Todos", isNew: false },
      { name: "IAP2 Latinoamérica", isNew: false },
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
      "El equipo incorporó un asesor de relacionamiento comunitario, un diseñador gráfico y un asesor en desarrollo organizacional. Los servicios cubren hoy el ciclo completo: comunidad, comunicación, organización y sostenibilidad.",
    ],
    clients: [
      { name: "CChC Concepción", isNew: false },
      { name: "Club34", isNew: false },
      { name: "Conce Con Todos", isNew: false },
      { name: "IAP2 Latinoamérica", isNew: false },
      { name: "Credyhogar", isNew: true },
      { name: "Vanrom", isNew: true },
      { name: "Paleo Andes", isNew: true },
    ],
    clientNote: "CChC Concepción y Club34 llevan con THO desde el primer día.",
  },
];

// Service colors: orange=comunidad, blue=comunicaciones, pink=desarrollo org., green=sostenibilidad, yellow=formación
const PROJECTS: Project[] = [
  {
    id: "cchc",
    client: "CChC Concepción",
    title: "Estrategia de Relacionamiento Comunitario",
    tag: "Comunidad",
    tagColor: "#fa7f33",
    since: "Desde 2023",
    summary: "Acompañamiento continuo al vínculo entre el gremio y las comunidades del Gran Concepción.",
    detail:
      "Desde el segundo semestre de 2023 acompañamos el relacionamiento con las comunidades del Gran Concepción. Desde encuentros iniciales hasta documentos de consenso sobre desarrollo urbano, generamos confianza a través de programas que permiten vínculos auténticos entre el gremio y las organizaciones sociocomunitarias: la Escuela Itinerante, los Encuentros de Diseño Participativo y el documento Visión 2050.",
    illustration: "/ilustraciones/5.png",
  },
  {
    id: "indama",
    client: "INDAMA S.A.",
    title: "Revista Interna Trimestral",
    tag: "Comunicaciones",
    tagColor: "#1e71b8",
    since: "2024",
    summary: "Cultura organizacional desde adentro, a través de una publicación propia.",
    detail:
      "Acompañamos a INDAMA en la promoción de su cultura organizacional mediante una revista trimestral que abordaba eventos, cambios y proyecciones importantes para la empresa. Aniversarios, trabajadores con larga trayectoria, fiestas patrias e inauguración de nueva tecnología fueron contenidos valorados a lo largo del proceso.",
    illustration: "/ilustraciones/11.png",
  },
  {
    id: "paleoandes",
    client: "Paleo Andes",
    title: "Fortalecimiento Organizacional",
    tag: "Desarrollo org.",
    tagColor: "#d13ca2",
    since: "Desde 2026",
    summary: "Actualización de la arquitectura interna para una empresa de arqueología y paleontología.",
    detail:
      "Luego de un acercamiento en torno a la sostenibilidad en 2025, en 2026 iniciamos un proceso de fortalecimiento con foco en la arquitectura organizacional. La revisión del organigrama, el manual de cargos y las matrices de gestión interna permite mayor alineación, el desarrollo de una cultura organizacional sólida y un despliegue más coordinado de las distintas funciones.",
    illustration: "/ilustraciones/2.png",
  },
  {
    id: "iap2",
    client: "IAP2 Latinoamérica",
    title: "Training en Participación Pública",
    tag: "Formación",
    tagColor: "#f2b705",
    since: "Desde 2025",
    summary: "Formaciones certificadas en el Enfoque IAP2 para organizaciones y empresas.",
    detail:
      "Con la certificación internacional de nuestro director como entrenador IAP2, realizamos formaciones a distintas organizaciones y empresas en el Enfoque IAP2 para la Participación Pública. Esta alianza ha permitido una internacionalización del trabajo de THO y un intercambio de experiencias que enriquece cada asesoría.",
    illustration: "/ilustraciones/10.png",
  },
];

/* ── COMPONENT ──────────────────────────────────────────────────────────── */

export default function NuestraExperienciaPage() {
  const [activeId, setActiveId] = useState(ERAS[0].id);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>(PROJECTS[0].id);
  const [revealed, setRevealed] = useState(false);

  const activeEra = ERAS.find((e) => e.id === activeId) ?? ERAS[0];
  const activeProject = PROJECTS.find((p) => p.id === selectedProject) ?? PROJECTS[0];

  function selectEra(id: string) {
    if (id === activeId || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveId(id);
      setTransitioning(false);
    }, 200);
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
        <section className="relative min-h-[52vh] overflow-visible text-white md:min-h-[60vh]">
          <div className="hero-media-fade pointer-events-none absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero/6.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.78]" />
            <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(15,23,42,0.1)_0%,rgba(15,23,42,0.4)_52%,rgba(15,23,42,0.72)_100%)]" />
          </div>
          <div className="relative mx-auto flex h-full min-h-[52vh] max-w-6xl items-end justify-end px-4 pb-14 pt-8 md:min-h-[60vh] md:pb-16 md:pt-12">
            <div className="max-w-2xl text-right">
              <div className="mt-3 ml-auto h-[6px] w-36 rounded-sm brand-block-divider" />
              <h1 className={`mt-4 font-tho-title text-[3rem] leading-[0.95] text-white md:text-[4.4rem]${revealed ? " exp3-title-in" : " exp3-title-out"}`}>
                Nuestra<br />experiencia
              </h1>
              <p className={`mt-4 ml-auto max-w-xl text-base text-white/85 md:text-lg${revealed ? " exp3-title-in" : " exp3-title-out"}`} style={{ transitionDelay: "0.08s" }}>
                Más de una década de trabajo en terreno, convertida en método y relaciones que duran.
              </p>
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="exp3-timeline-section">
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

          <div className="exp3-panel-wrap">
            <div className="exp3-ghost-year font-tho-title" aria-hidden style={{ color: activeEra.accent }}>
              {activeEra.year}
            </div>

            <div className={`exp3-panel-grid${transitioning ? " is-out" : " is-in"}`}>
              <div className="exp3-narrative">
                <div className="exp3-era-accent-bar" style={{ background: activeEra.accent }} aria-hidden />
                <h2 className="exp3-era-label font-tho-title">{activeEra.label}</h2>
                <div className="exp3-era-body">
                  {activeEra.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>

              <div className="exp3-clients">
                {activeEra.clients.length === 0 ? (
                  <div className="exp3-clients-empty"><p>{activeEra.clientNote}</p></div>
                ) : (
                  <>
                    {continuingClients.length > 0 && (
                      <div className="exp3-client-group">
                        <p className="exp3-client-group-label">Continúan</p>
                        <div className="exp3-client-chips">
                          {continuingClients.map((c) => (
                            <span key={c.name} className="exp3-chip exp3-chip--continuing">{c.name}</span>
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
                              style={{ "--chip-color": activeEra.accent, "--chip-bg": activeEra.accent + "15", "--chip-border": activeEra.accent + "40" } as React.CSSProperties}
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
              <h2 className="exp3-section-title font-tho-title">Proyectos destacados</h2>
            </div>

            {/* Split panel: list left, detail right */}
            <div className="exp3-split">
              {/* List */}
              <div className="exp3-split-list">
                {PROJECTS.map((project) => {
                  const isActive = selectedProject === project.id;
                  return (
                    <button
                      key={project.id}
                      className={`exp3-split-item${isActive ? " is-active" : ""}`}
                      style={isActive ? ({ "--item-accent": project.tagColor } as React.CSSProperties) : undefined}
                      onClick={() => setSelectedProject(project.id)}
                      aria-pressed={isActive}
                    >
                      <span
                        className="exp3-split-tag"
                        style={{ color: project.tagColor, background: project.tagColor + "12", borderColor: project.tagColor + "40" }}
                      >
                        {project.tag}
                      </span>
                      <span className="exp3-split-client">{project.client}</span>
                      <span className="exp3-split-title">{project.title}</span>
                      <span className="exp3-split-since">{project.since}</span>
                      {isActive && (
                        <span className="exp3-split-arrow" aria-hidden style={{ color: project.tagColor }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detail panel */}
              <div
                className="exp3-split-detail"
                style={{ "--detail-accent": activeProject.tagColor } as React.CSSProperties}
                key={activeProject.id}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeProject.illustration} alt="" className="exp3-split-detail-illustration" aria-hidden />
                <div className="exp3-split-detail-bar" style={{ background: activeProject.tagColor }} />
                <span
                  className="exp3-split-detail-tag"
                  style={{ color: activeProject.tagColor, background: activeProject.tagColor + "12", borderColor: activeProject.tagColor + "40" }}
                >
                  {activeProject.tag}
                </span>
                <p className="exp3-split-detail-client">{activeProject.client}</p>
                <h3 className="exp3-split-detail-title font-tho-title">{activeProject.title}</h3>
                <p className="exp3-split-detail-since">{activeProject.since}</p>
                <p className="exp3-split-detail-body">{activeProject.detail}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO */}
        <div className="sr-only" aria-hidden="true">
          {ERAS.map((era) => era.body.map((p, i) => <p key={`seo-${era.id}-${i}`}>{p}</p>))}
          {PROJECTS.map((p) => <p key={`seo-proj-${p.id}`}>{p.detail}</p>)}
        </div>
      </main>

      <Footer />
    </div>
  );
}
