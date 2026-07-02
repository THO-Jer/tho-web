"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BOOK_URL } from "@/lib/links";
import type { Era, Project } from "@/content/experiencia";

/* Año numérico por era — usado para el gráfico de permanencia */
const ERA_YEAR: Record<string, number> = {
  origen: 2022,
  inicio: 2023,
  consolidacion: 2024,
  certificacion: 2025,
  hoy: 2026,
};
const TL_START = 2023;
const TL_END = 2026;
const TL_SPAN = TL_END - TL_START + 1;

/* Año grande del panel sticky (origen muestra el inicio de la trayectoria) */
const BIG_YEAR: Record<string, string> = { origen: "2009" };

type Tenure = { name: string; start: number; end: number; accent: string };

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        if (reduced) {
          setDisplay(value);
          return;
        }
        const t0 = performance.now();
        const duration = 1100;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function ExperienciaClient({
  eras,
  projects,
}: {
  eras: Era[];
  projects: Project[];
}) {
  const [activeId, setActiveId] = useState(eras[0].id);
  const [revealed, setRevealed] = useState(false);
  const eraRefs = useRef<(HTMLElement | null)[]>([]);

  const activeEra = eras.find((e) => e.id === activeId) ?? eras[0];
  const activeIndex = eras.findIndex((e) => e.id === activeEra.id);
  const activeYear = ERA_YEAR[activeEra.id] ?? TL_START;

  /* Permanencia de clientes derivada de las eras */
  const tenures = useMemo(() => {
    const map = new Map<string, Tenure>();
    eras.forEach((era) => {
      const y = ERA_YEAR[era.id];
      if (!y) return;
      era.clients.forEach((c) => {
        const t = map.get(c.name);
        if (!t) map.set(c.name, { name: c.name, start: y, end: y, accent: era.accent });
        else t.end = y;
      });
    });
    return [...map.values()];
  }, [eras]);

  const stats = useMemo(() => {
    const dayOne = tenures.filter((t) => t.start === TL_START && t.end === TL_END).length;
    return [
      { value: 10, suffix: "+", label: "años de trabajo en terreno" },
      { value: tenures.length, suffix: "", label: "clientes y aliados" },
      { value: dayOne, suffix: "", label: "relaciones desde el día uno" },
      { value: 4, suffix: "", label: "áreas de servicio" },
    ];
  }, [tenures]);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* Scrollytelling: la era activa se define por la sección visible */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.era;
            if (id) setActiveId(id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    eraRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

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
            <h1 className={`mt-4 font-tho-title text-[3rem] leading-[0.95] text-white md:text-[4.4rem]${revealed ? " exp4-title-in" : " exp4-title-out"}`}>
              Nuestra<br />experiencia
            </h1>
            <p className={`mt-4 ml-auto max-w-xl text-base text-white/85 md:text-lg${revealed ? " exp4-title-in" : " exp4-title-out"}`} style={{ transitionDelay: "0.08s" }}>
              Más de una década de trabajo en terreno, convertida en método y relaciones que duran.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROOF BAR ── */}
      <section className="exp4-proof-section">
        <div className="exp4-proof">
          {stats.map((s) => (
            <div key={s.label} className="exp4-proof-item">
              <span className="exp4-proof-value font-tho-title">
                <CountUp value={s.value} suffix={s.suffix} />
              </span>
              <span className="exp4-proof-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE — scrollytelling ── */}
      <section className="exp4-scrolly-section">
        <div className="exp4-scrolly">
          <div className="exp4-eras">
            {eras.map((era, i) => {
              const isActive = era.id === activeId;
              const isPassed = i < activeIndex;
              const newClients = era.clients.filter((c) => c.isNew);
              return (
                <article
                  key={era.id}
                  data-era={era.id}
                  ref={(el) => { eraRefs.current[i] = el; }}
                  className={`exp4-era${isActive ? " is-active" : ""}`}
                >
                  <span
                    className="exp4-era-dot"
                    style={isActive || isPassed ? { background: era.accent, borderColor: era.accent } : undefined}
                    aria-hidden
                  />
                  <p className="exp4-era-year" style={isActive ? { color: era.accent } : undefined}>
                    {era.year}
                  </p>
                  <h2 className="exp4-era-label font-tho-title">{era.label}</h2>
                  <div className="exp4-era-body">
                    {era.body.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                  {newClients.length > 0 && (
                    <p className="exp4-era-joins">
                      <span style={{ color: era.accent }}>Se suman</span>{" "}
                      {newClients.map((c) => c.name).join(" · ")}
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {/* Panel sticky: año gigante + permanencia de clientes */}
          <aside className="exp4-sticky" aria-label="Relaciones con clientes en el tiempo">
            <div key={activeEra.id} className="exp4-big-year font-tho-title" style={{ color: activeEra.accent }} aria-hidden>
              {BIG_YEAR[activeEra.id] ?? activeEra.year}
            </div>

            <div className="exp4-chart">
              <p className="exp4-chart-title">Relaciones que duran</p>
              {tenures.length > 0 && (
                <div className="exp4-chart-rows">
                  {tenures.map((t) => {
                    const started = activeYear >= t.start;
                    const visibleEnd = Math.min(t.end, activeYear);
                    const left = ((t.start - TL_START) / TL_SPAN) * 100;
                    const width = started ? ((visibleEnd - t.start + 1) / TL_SPAN) * 100 : 0;
                    const isNewNow = t.start === activeYear;
                    return (
                      <div key={t.name} className="exp4-chart-row">
                        <span className={`exp4-chart-name${started ? " is-on" : ""}${isNewNow ? " is-new" : ""}`} style={isNewNow ? { color: activeEra.accent } : undefined}>
                          {t.name}
                        </span>
                        <div className="exp4-chart-track">
                          <div
                            className="exp4-chart-bar"
                            style={{ left: `${left}%`, width: `${width}%`, background: t.accent }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="exp4-chart-axis" aria-hidden>
                {Array.from({ length: TL_SPAN }, (_, i) => (
                  <span key={i}>{TL_START + i}</span>
                ))}
              </div>
              {activeEra.clientNote && <p className="exp4-chart-note">{activeEra.clientNote}</p>}
            </div>
          </aside>
        </div>
      </section>

      {/* ── PROYECTOS — stacked cards ── */}
      <section className="exp4-projects-section">
        <div className="exp4-projects-header">
          <p className="exp4-eyebrow">Proyectos</p>
          <h2 className="exp4-section-title font-tho-title">Proyectos destacados</h2>
        </div>

        <div className="exp4-stack">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="exp4-card"
              style={{ top: `calc(5.5rem + ${index * 14}px)`, zIndex: index + 1 }}
            >
              <div className="exp4-card-photo">
                {project.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.photo} alt={project.title} className="exp4-card-photo-img" />
                ) : (
                  <div className="exp4-card-photo-illus" style={{ background: project.tagColor + "10" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.illustration} alt="" aria-hidden className="exp4-card-illus-img" />
                  </div>
                )}
              </div>
              <div className="exp4-card-content">
                <span
                  className="exp4-card-tag"
                  style={{ color: project.tagColor, background: project.tagColor + "12", borderColor: project.tagColor + "40" }}
                >
                  {project.tag}
                </span>
                <p className="exp4-card-client">{project.client}</p>
                <h3 className="exp4-card-title font-tho-title">{project.title}</h3>
                <p className="exp4-card-since">{project.since}</p>
                <p className="exp4-card-body">{project.detail}</p>
                <div className="exp4-card-bar" style={{ background: project.tagColor }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="exp4-cta">
        <div className="exp4-cta-inner">
          <h2 className="exp4-cta-title font-tho-title">
            ¿Tu organización podría ser el próximo caso?
          </h2>
          <p className="exp4-cta-sub">
            El primer contacto es siempre una conversación para entender tu situación específica.
          </p>
          <div className="exp4-cta-actions">
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-unified-motion btn-hero-services rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900"
            >
              Conversemos tu caso
            </a>
            <a href="mailto:hola@tho.cl" className="exp4-cta-mail">
              o escríbenos a hola@tho.cl
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
