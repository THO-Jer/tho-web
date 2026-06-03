"use client";

import { useEffect, useState } from "react";
import type { Era, Project } from "@/content/experiencia";

export function ExperienciaClient({
  eras,
  projects,
}: {
  eras: Era[];
  projects: Project[];
}) {
  const [activeId, setActiveId] = useState(eras[0].id);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>(projects[0].id);
  const [revealed, setRevealed] = useState(false);

  const activeEra = eras.find((e) => e.id === activeId) ?? eras[0];
  const activeProject = projects.find((p) => p.id === selectedProject) ?? projects[0];

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
    <>
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
            {eras.map((era) => {
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

          <div className="exp3-split">
            <div className="exp3-split-list">
              {projects.map((project) => {
                const isActive = selectedProject === project.id;
                return (
                  <div
                    key={project.id}
                    className={`exp3-split-item${isActive ? " is-active" : ""}`}
                    style={isActive ? ({ "--item-accent": project.tagColor } as React.CSSProperties) : undefined}
                  >
                    <button
                      className="exp3-split-item-trigger"
                      onClick={() => setSelectedProject(project.id)}
                      aria-expanded={isActive}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.illustration} alt="" className="exp3-split-item-bg-illustration" aria-hidden />
                      <span
                        className="exp3-split-tag"
                        style={{ color: project.tagColor, background: project.tagColor + "12", borderColor: project.tagColor + "40" }}
                      >
                        {project.tag}
                      </span>
                      <span className="exp3-split-client">{project.client}</span>
                      <span className="exp3-split-title">{project.title}</span>
                      <span className="exp3-split-since">{project.since}</span>
                      <span className="exp3-split-arrow" aria-hidden style={{ color: project.tagColor }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d={isActive ? "M3 10l5-5 5 5" : "M6 3l5 5-5 5"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>

                    <div className={`exp3-split-item-inline${isActive ? " is-open" : ""}`}>
                      <div className="exp3-split-item-inline-inner">
                        <div className="exp3-split-detail-bar" style={{ background: project.tagColor }} />
                        <p className="exp3-split-detail-body">{project.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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
    </>
  );
}
