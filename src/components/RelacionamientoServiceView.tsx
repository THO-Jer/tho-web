"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";

type FormStatus = "idle" | "sending" | "ok" | "error";

type RelatedPost = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
};

const BROCHURE_FILE_URL = "/downloads/rc-brochure-v1.pdf";

function useRevealItems() {
  return useMemo(
    () => ["rel-hero-copy", "rel-hero-cta", "rel-statement", "rel-context", "rel-levels", "rel-faq", "rel-contact"],
    []
  );
}

export function RelacionamientoServiceView({ relatedPosts = [] }: { relatedPosts?: RelatedPost[] }) {
  const [open, setOpen] = useState(false);
  const [brochureStatus, setBrochureStatus] = useState<FormStatus>("idle");
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");
  const [riskParallax, setRiskParallax] = useState(0);
  const [levelChecks, setLevelChecks] = useState({
    noMaterialityMap: false,
    investorPressure: false,
    governanceGaps: false,
    shortDeadline: false,
    alreadyExecuting: false,
  });
  const revealItems = useRevealItems();
  const dialogTitleId = useId();

  const levelRecommendation = useMemo(() => {
    const score = Object.values(levelChecks).filter(Boolean).length;

    if (!score) {
      return {
        level: "Completa las casillas para una recomendación",
        hint: "Marca 2 o más condiciones para sugerirte el mejor nivel de partida.",
        tone: "text-slate-700 dark:text-slate-300",
      };
    }

    if (levelChecks.alreadyExecuting && score >= 3) {
      return {
        level: "Nivel sugerido: Implementación y Seguimiento",
        hint: "Ya existe trabajo en marcha; conviene fortalecer ejecución, seguimiento y mejora continua.",
        tone: "text-orange-800 dark:text-orange-300",
      };
    }

    if (score >= 3 || levelChecks.governanceGaps) {
      return {
        level: "Nivel sugerido: Estrategia Territorial y Gobernanza",
        hint: "Necesitas ordenar priorización, definir gobernanza territorial e instalar métricas de seguimiento.",
        tone: "text-orange-800 dark:text-orange-300",
      };
    }

    return {
      level: "Nivel sugerido: Mapa de Riesgos Socioambientales",
      hint: "Punto de entrada ideal para claridad rápida y definición de prioridades inmediatas.",
      tone: "text-orange-800 dark:text-orange-300",
    };
  }, [levelChecks]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setRiskParallax(Math.max(-12, Math.min(22, y * 0.03)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function onBrochureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBrochureStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "brochure_download",
      eventLabel: "mapa_riesgos_socioambientales_brochure_download",
      source: "relacionamiento_level_card_modal",
      resourceId: "mapa-riesgos-socioambientales-brochure",
      resourceName: "Brochure Mapa de Riesgos Socioambientales",
      serviceSlug: "relacionamiento-comunitario",
      serviceName: "Relacionamiento Comunitario",
      levelId: "ticket-mapa-riesgos-socioambientales",
      levelName: "Mapa de Riesgos Socioambientales",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("organization") || ""),
      message: `Cargo: ${String(form.get("role") || "")}`,
      pageUrl: window.location.href,
      hp: String(form.get("hp") || ""),
      utm: {},
    };

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return setBrochureStatus("error");
    setBrochureStatus("ok");

    const link = document.createElement("a");
    link.href = BROCHURE_FILE_URL;
    link.download = "brochure-mapa-riesgos-socioambientales.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    e.currentTarget.reset();
  }

  async function onContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "contact",
      eventLabel: "relacionamiento_service_contact_form",
      source: "relacionamiento_service_footer_form",
      resourceId: "service-relacionamiento-contact",
      resourceName: "Formulario servicio relacionamiento comunitario",
      serviceSlug: "relacionamiento-comunitario",
      serviceName: "Relacionamiento Comunitario",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("organization") || ""),
      message: `Cargo: ${String(form.get("role") || "")}\n\n${String(form.get("message") || "")}`,
      pageUrl: window.location.href,
      hp: String(form.get("hp") || ""),
      utm: {},
    };

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setContactStatus(res.ok ? "ok" : "error");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <main className="esg-page bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="esg-hero relative min-h-[84vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/8.png" alt="Equipo de proyecto y comunidades dialogando en territorio" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/62 via-slate-900/42 to-orange-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_82%,rgba(251,146,60,0.34),rgba(249,115,22,0.14)_34%,transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white dark:to-slate-950" />

        <div className="relative mx-auto flex min-h-[84vh] max-w-6xl items-end px-4 pb-16 pt-24 md:pb-24">
          <div className="max-w-3xl text-white">
            <div className="esg-reveal is-visible" data-reveal-id={revealItems[0]}>
              <h1 className="font-tho-title text-[2.7rem] leading-[0.98] md:text-[5rem]">
                Servicio de
                <br />
                Relacionamiento
                <br />
                Comunitario
              </h1>
              <div className="brand-block-divider mt-4 h-[6px] w-36 rounded-sm" />
              <p className="mt-5 max-w-[700px] text-base text-white/90 md:text-lg">
                Te ayudamos a traducir la complejidad territorial y social en decisiones estratégicas claras, medibles y ejecutables para proteger la continuidad operacional.
              </p>
            </div>
            <a
              href="#relacionamiento-contacto"
              className="btn-unified-motion btn-hero-services esg-reveal is-visible relative z-10 mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:text-slate-900"
              data-reveal-id={revealItems[1]}
            >
              ¡Danos detalles!
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="esg-reveal is-visible grid gap-8 md:grid-cols-[0.95fr_1.05fr]" data-reveal-id={revealItems[3]}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Qué está cambiando</p>
            <div className="brand-block-divider mt-3 mb-6 h-[6px] w-36 rounded-sm" />
            <p className="text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
              La conversación territorial dejó de ser reactiva y se volvió estratégica: hoy los proyectos necesitan integrar desde el inicio a comunidades, actores críticos y riesgos socioambientales.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
              <strong className="text-[#9a3412] dark:text-orange-300">Equipos operacionales</strong>, gerencias y directorios piden <strong className="text-[#9a3412] dark:text-orange-300">trazabilidad</strong> real de compromisos con comunidades, no solo narrativa.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
              Además, el <strong className="text-[#9a3412] dark:text-orange-300">contexto local</strong> cambia rápido: si la organización no coordina mensaje, operación y decisiones, cualquier compromiso territorial se vuelve frágil.
            </p>
          </div>

          <aside className="esg-risk-glass relative rounded-[2rem] border border-white/35 bg-white/25 p-7 text-slate-900 shadow-2xl shadow-orange-950/20 ring-1 ring-white/40 backdrop-blur-xl dark:border-white/15 dark:bg-white/8 dark:text-white dark:ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ilustraciones/7.png"
              alt="Ilustración de acompañamiento"
              className="pointer-events-none absolute -right-10 -top-12 w-44 opacity-100 md:w-48"
              style={{ transform: `translateY(${riskParallax}px)` }}
            />
            <h3 className="font-tho-title -mt-1 max-w-[84%] text-[2.35rem] leading-[0.95] text-orange-950 md:-mr-8 md:text-[3.35rem] dark:text-orange-100">
              El riesgo no es no tener presencia territorial.
              <br />
              El riesgo es relacionarse tarde y sin estrategia.
            </h3>
            <ul className="mt-6 space-y-2 text-sm text-slate-800 md:text-base dark:text-slate-100">
              <li>• Conflictividad social evitable.</li>
              <li>• Pérdida de confianza comunitaria.</li>
              <li>• Desalineación entre terreno y gestión interna.</li>
            </ul>
            <p className="mt-5 text-sm font-semibold text-orange-950 md:text-base dark:text-orange-100">Evitarlo requiere método territorial, no improvisación.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="esg-reveal is-visible" data-reveal-id={revealItems[4]}>
          <h3 className="font-tho-title text-[2.1rem] text-slate-900 md:text-[3.2rem] dark:text-slate-100">Niveles de intervención</h3>
          <div className="brand-block-divider mt-3 mb-8 h-[6px] w-36 rounded-sm" />

          <div className="esg-level-grid esg-levels-gallery grid gap-5 md:grid-cols-3">
            <article className="esg-level-card esg-level-card--start relative rounded-[2.1rem] border border-[#f59e0b] bg-[linear-gradient(160deg,#fff7ed_0%,#ffedd5_55%,#fed7aa_100%)] p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ilustraciones/3.png" alt="Ilustración de inicio" className="pointer-events-none absolute right-4 top-4 w-14 opacity-95" />
              <p className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">● Punto de partida recomendado</p>
              <h4 className="mt-4 text-3xl font-black leading-[1.02] text-slate-900">Mapa de Riesgos Socioambientales</h4>
              <p className="mt-3 text-sm text-slate-700">Diagnóstico estratégico inicial para organizaciones que necesitan claridad territorial inmediata.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-800">
                <li>• Mapeo inicial de actores y dinámicas territoriales.</li>
                <li>• Identificación de riesgos sociales, reputacionales y operacionales.</li>
                <li>• Recomendaciones tempranas de relacionamiento.</li>
              </ul>
              <button type="button" onClick={() => { setOpen(true); setBrochureStatus("idle"); }} className="btn-unified-motion btn-hero-services mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">
                Descargar brochure
              </button>
            </article>

            <article className="esg-level-card rounded-[2.1rem] border border-[#fb923c]/80 bg-[linear-gradient(160deg,#fff7ed_0%,#ffedd5_58%,#fdba74_100%)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-800">Escala de profundidad estratégica</p>
              <h4 className="mt-2 text-2xl font-black text-slate-900">Estrategia Territorial y Gobernanza</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Diseño de estrategia por segmentos de actores.</li>
                <li>• Protocolos de coordinación y vocerías.</li>
                <li>• Indicadores de gestión territorial.</li>
                <li>• Plan de implementación con hitos críticos.</li>
              </ul>
              <div className="mt-5 rounded-xl bg-white/70 p-4 ring-1 ring-orange-700/15">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entregables</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  <li>✓ Hoja de ruta territorial.</li>
                  <li>✓ Marco de gobernanza comunitaria.</li>
                  <li>✓ Sistema de seguimiento de compromisos.</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-800">Ordena la estrategia y alinea áreas.</p>
            </article>

            <article className="esg-level-card rounded-[2.1rem] border border-[#ea580c]/85 bg-[linear-gradient(160deg,#ffedd5_0%,#fdba74_58%,#fb923c_100%)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-900">Escala de consolidación operativa</p>
              <h4 className="mt-2 text-2xl font-black text-slate-900">Implementación y Seguimiento</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Acompañamiento en terreno y mesa interna.</li>
                <li>• Instalación de capacidades de relacionamiento.</li>
                <li>• Monitoreo de señales tempranas y acuerdos.</li>
                <li>• Ajustes tácticos según evolución territorial.</li>
              </ul>
              <div className="mt-5 rounded-xl bg-white/70 p-4 ring-1 ring-orange-700/15">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entregables</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  <li>✓ Sistema operativo de relacionamiento.</li>
                  <li>✓ Evaluaciones periódicas en territorio.</li>
                  <li>✓ Mejora continua.</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-800">Convierte la estrategia en práctica real.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900/70">
        <div className="esg-reveal is-visible mx-auto max-w-6xl" data-reveal-id={revealItems[5]}>
          <div className="grid gap-5 md:grid-cols-[1fr_0.95fr] md:items-start">
            <div>
              <h3 className="font-tho-title text-left text-[2.2rem] text-slate-900 md:text-[3.4rem] dark:text-slate-100">¿Qué implica partir por un Mapa de Riesgos Socioambientales?</h3>
              <div className="brand-block-divider mt-3 mb-8 h-[6px] w-36 rounded-sm" />

              <div className="grid gap-4">
              <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-slate-100">¿Cuándo conviene partir por aquí?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">Cuando hay conflictividad emergente o incertidumbre territorial y el proyecto necesita una lectura temprana para decidir con criterio.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-slate-100">¿Qué decisión habilita?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">Permite definir si conviene abrir una estrategia territorial completa o intervenir primero en actores/riesgos críticos para proteger continuidad operativa.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-slate-100">¿Qué NO es?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">No es una campaña comunicacional ni gestión reactiva de crisis: es una lectura estratégica para ordenar decisiones antes de escalar conflicto.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-slate-100">¿Qué información necesito para iniciarlo?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">Se recomienda contar con contexto del proyecto, antecedentes de relacionamiento previo y actores/zonas sensibles ya detectados por el equipo.</p>
              </details>
              <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-slate-100">¿Cómo se conecta con los siguientes niveles?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">El mapa inicial entrega prioridades y criterios de acción. Desde ahí se escala a estrategia territorial o implementación en terreno según riesgo y madurez del proyecto.</p>
              </details>
              </div>
            </div>

            <aside className="relative md:-mt-4 md:-mr-4">
              <div className="rounded-3xl border border-orange-300/70 bg-[linear-gradient(160deg,#fff7ed_0%,#ffedd5_65%,#fdba74_100%)] p-6 shadow-xl shadow-orange-900/10 dark:border-orange-400/30 dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.96)_0%,rgba(154,52,18,0.65)_100%)]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">Diagnóstico territorial rápido</p>
                <h4 className="mt-2 text-2xl font-black leading-[1.02] text-slate-900 dark:text-slate-100">¿Por cuál nivel conviene partir?</h4>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Marca las condiciones que aplican hoy en tu organización y te sugerimos un punto de entrada.</p>

                <div className="mt-5 grid gap-3">
                  {[
                    ["noMaterialityMap", "No tenemos mapa de materialidad validado."],
                    ["investorPressure", "Hay presión por trazabilidad de compromisos territoriales y sociales."],
                    ["governanceGaps", "No existe gobernanza clara ni responsables definidos."],
                    ["shortDeadline", "Debemos mostrar avances concretos en menos de 90 días."],
                    ["alreadyExecuting", "Ya estamos ejecutando iniciativas pero falta coordinación."],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-start gap-3 rounded-xl bg-white/70 px-3 py-2 text-sm text-slate-800 ring-1 ring-orange-700/10 dark:bg-slate-900/60 dark:text-slate-100 dark:ring-white/10">
                      <input
                        type="checkbox"
                        checked={levelChecks[key as keyof typeof levelChecks]}
                        onChange={(e) => setLevelChecks((prev) => ({ ...prev, [key]: e.target.checked }))}
                        className="mt-0.5 h-4 w-4 rounded border-slate-400 text-orange-700 focus:ring-orange-600"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-white/80 p-4 ring-1 ring-orange-700/20 dark:bg-slate-900/80 dark:ring-white/10">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Resultado sugerido</p>
                  <p className={`mt-1 text-base font-bold ${levelRecommendation.tone}`}>{levelRecommendation.level}</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{levelRecommendation.hint}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {relatedPosts.length ? (
        <section className="bg-white px-4 py-16 dark:bg-slate-950">
          <div className="mx-auto max-w-6xl">
            <h3 className="font-tho-title text-[2rem] text-slate-900 md:text-[2.8rem] dark:text-slate-100">Lecturas relacionadas</h3>
            <div className="brand-block-divider mt-3 mb-8 h-[6px] w-36 rounded-sm" />
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.slice(0, 3).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Blog</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{post.title}</h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                  <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">{post.tags.slice(0, 2).join(" · ")}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="relacionamiento-contacto" className="bg-white px-4 py-20 dark:bg-slate-950">
        <div className="esg-reveal is-visible mx-auto max-w-6xl" data-reveal-id={revealItems[6]}>
          <div className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white ring-1 ring-slate-800 md:px-8 md:py-12">
            <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div>
                <h3 className="font-tho-title text-[2.4rem] text-white md:text-[3.5rem]">¿Comenzamos?</h3>
                <p className="mt-4 max-w-xl text-lg text-white/85">Conversemos sobre la prioridad territorial más crítica de tu organización y definamos el punto de entrada con mayor impacto.</p>
              </div>

              <form onSubmit={onContactSubmit} className="grid gap-3 rounded-3xl bg-slate-900/70 p-5 ring-1 ring-white/10">
                <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
                <input name="name" required placeholder="Nombre" className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15" />
                <input name="role" placeholder="Cargo" className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15" />
                <input name="organization" placeholder="Organización" className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15" />
                <input name="email" type="email" required placeholder="Email" className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15" />
                <textarea name="message" rows={4} placeholder="Mensaje" className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15" />
                <button disabled={contactStatus === "sending"} className="btn-unified-motion btn-hero-services mt-2 inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 disabled:opacity-60">
                  {contactStatus === "sending" ? "Enviando..." : "Enviar solicitud"}
                </button>
                {contactStatus === "ok" ? <p aria-live="polite" className="text-sm text-orange-200">Gracias, te contactaremos pronto.</p> : null}
                {contactStatus === "error" ? <p aria-live="polite" className="text-sm text-rose-200">No pudimos enviar, intenta nuevamente.</p> : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      {open ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-900/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby={dialogTitleId} onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900" role="document" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <h4 id={dialogTitleId} className="text-xl font-semibold text-slate-900 dark:text-slate-100">Descargar brochure</h4>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-1 text-sm dark:border-slate-600 dark:text-slate-200">Cerrar</button>
            </div>
            <form onSubmit={onBrochureSubmit} className="mt-4 grid gap-3">
              <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
              <input name="name" required placeholder="Nombre" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input name="role" placeholder="Cargo" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input name="organization" required placeholder="Organización" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <button disabled={brochureStatus === "sending"} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-orange-400 dark:text-slate-900">
                {brochureStatus === "sending" ? "Enviando..." : "Descargar brochure"}
              </button>
            </form>
            {brochureStatus === "ok" ? <p aria-live="polite" className="mt-3 text-sm text-orange-700">Descarga iniciada. También registramos tu solicitud.</p> : null}
            {brochureStatus === "error" ? <p aria-live="polite" className="mt-3 text-sm text-rose-600">No pudimos procesar tu solicitud, intenta de nuevo.</p> : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
