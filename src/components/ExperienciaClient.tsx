"use client";

import { useEffect, useRef, useState } from "react";
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
  const [revealed, setRevealed] = useState(false);
  const [visibleStrips, setVisibleStrips] = useState<Set<string>>(new Set());
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeEra = eras.find((e) => e.id === activeId) ?? eras[0];

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

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    stripRefs.current.forEach((el, i) => {
      if (!el) return;
      const id = projects[i]?.id;
      if (!id) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleStrips((prev) => new Set([...prev, id]));
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      cleanups.push(() => observer.disconnect());
    });
    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* ── PROJECTS — editorial strips ── */}
      <section className="exp3-projects-section">
        <div className="exp3-projects-header">
          <p className="exp3-eyebrow" style={{ color: "#94a3b8" }}>Proyectos</p>
          <h2 className="exp3-section-title font-tho-title">Proyectos destacados</h2>
        </div>

        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => { stripRefs.current[index] = el; }}
            className={`exp3-strip${index % 2 === 1 ? " is-reversed" : ""}${visibleStrips.has(project.id) ? " is-visible" : ""}`}
          >
            <div className="exp3-strip-photo">
              {project.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.photo} alt={project.title} className="exp3-strip-photo-img" />
              ) : (
                <div className="exp3-strip-photo-illus" style={{ background: project.tagColor + "10" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.illustration} alt="" aria-hidden className="exp3-strip-illus-img" />
                </div>
              )}
            </div>
            <div className="exp3-strip-content">
              <span
                className="exp3-strip-tag"
                style={{ color: project.tagColor, background: project.tagColor + "12", borderColor: project.tagColor + "40" }}
              >
                {project.tag}
              </span>
              <p className="exp3-strip-client">{project.client}</p>
              <h3 className="exp3-strip-title font-tho-title">{project.title}</h3>
              <p className="exp3-strip-since">{project.since}</p>
              <p className="exp3-strip-body">{project.detail}</p>
              <div className="exp3-strip-bar" style={{ background: project.tagColor }} />
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
