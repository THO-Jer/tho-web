"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FormStatus = "idle" | "sending" | "ok" | "error";

type RelatedPost = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
};

const BROCHURE_FILE_URL = "/downloads/manual-diversidad-v1.pdf";

function useRevealItems() {
  return useMemo(
    () => ["esg-hero-copy", "esg-hero-cta", "esg-statement", "esg-context", "esg-levels", "esg-faq", "esg-contact"],
    []
  );
}

export function SostenibilidadServiceView({ relatedPosts = [] }: { relatedPosts?: RelatedPost[] }) {
  const [open, setOpen] = useState(false);
  const [brochureStatus, setBrochureStatus] = useState<FormStatus>("idle");
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");
  const [riskParallax, setRiskParallax] = useState(0);
  const revealItems = useRevealItems();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setRiskParallax(Math.max(-12, Math.min(22, y * 0.03)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function onBrochureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBrochureStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "brochure_download",
      eventLabel: "flash_audit_esg_brochure_download",
      source: "esg_level_card_modal",
      resourceId: "flash-audit-esg-brochure",
      resourceName: "Brochure Flash Audit ESG",
      serviceSlug: "sostenibilidad-corporativa",
      serviceName: "Sostenibilidad Corporativa",
      levelId: "ticket-flash-audit-esg",
      levelName: "Flash Audit ESG",
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
    link.download = "brochure-flash-audit-esg.pdf";
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
      eventLabel: "esg_service_contact_form",
      source: "sostenibilidad_service_footer_form",
      resourceId: "service-sostenibilidad-contact",
      resourceName: "Formulario servicio sostenibilidad",
      serviceSlug: "sostenibilidad-corporativa",
      serviceName: "Sostenibilidad Corporativa",
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
        <img src="/hero/2.png" alt="Equipo evaluando riesgos y estrategia" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/55 to-emerald-950/45" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white dark:to-slate-950" />

        <div className="relative mx-auto flex min-h-[84vh] max-w-6xl items-end px-4 pb-16 pt-24 md:pb-24">
          <div className="max-w-3xl text-white">
            <div className="esg-reveal is-visible" data-reveal-id={revealItems[0]}>
              <h1 className="font-tho-title text-[2.5rem] leading-[1.02] md:text-[4.8rem]">
                No es ESG.
                <br />
                Es riesgo (y oportunidad) medible.
              </h1>
              <p className="mt-5 max-w-[700px] text-base text-white/90 md:text-lg">
                Te ayudamos a traducir presión regulatoria, expectativas de inversionistas y escrutinio público en decisiones estratégicas claras, medibles y ejecutables.
              </p>
            </div>
            <a
              href="#esg-contacto"
              className="btn-unified-motion btn-hero-services esg-reveal is-visible relative z-10 mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:text-slate-900"
              data-reveal-id={revealItems[1]}
            >
              ¡Danos detalles!
            </a>
          </div>
        </div>
      </section>

      <section className="esg-statement mx-auto max-w-6xl px-4 py-24 text-center md:py-28">
        <h2 className="esg-reveal is-visible font-tho-title text-[3.4rem] leading-[0.98] text-slate-900 md:text-[6rem] dark:text-slate-100" data-reveal-id={revealItems[2]}>
          Cumplir no es lo mismo
          <br />
          que gestionar riesgos.
        </h2>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="esg-reveal is-visible grid gap-8 md:grid-cols-[0.95fr_1.05fr]" data-reveal-id={revealItems[3]}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Qué está cambiando</p>
            <div className="brand-block-divider mt-3 mb-6 h-[6px] w-36 rounded-sm" />
            <p className="text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
              La conversación ESG dejó de ser reputacional y se volvió estratégica: hoy la <strong className="text-[#0f4e2f] dark:text-emerald-300">doble materialidad</strong> obliga a mirar impacto financiero e impacto externo al mismo tiempo.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
              <strong className="text-[#0f4e2f] dark:text-emerald-300">Inversionistas</strong> y directorios piden <strong className="text-[#0f4e2f] dark:text-emerald-300">trazabilidad</strong> real, no solo narrativa.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
              Además, el <strong className="text-[#0f4e2f] dark:text-emerald-300">escrutinio público</strong> es más rápido y más exigente: si la organización no está alineada internamente, cualquier promesa externa se vuelve vulnerable.
            </p>
          </div>

          <aside className="esg-risk-glass relative rounded-[2rem] border border-white/35 bg-white/25 p-7 text-slate-900 shadow-2xl shadow-emerald-950/20 ring-1 ring-white/40 backdrop-blur-xl dark:border-white/15 dark:bg-white/8 dark:text-white dark:ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ilustraciones/7.png"
              alt="Ilustración de acompañamiento"
              className="pointer-events-none absolute -right-10 -top-12 w-44 opacity-100 md:w-48"
              style={{ transform: `translateY(${riskParallax}px)` }}
            />
            <h3 className="font-tho-title -mt-1 max-w-[84%] text-[2.35rem] leading-[0.95] text-emerald-950 md:-mr-8 md:text-[3.35rem] dark:text-emerald-100">
              El riesgo no es no tener ESG.
              <br />
              El riesgo es practicarlo superficialmente.
            </h3>
            <ul className="mt-6 space-y-2 text-sm text-slate-800 md:text-base dark:text-slate-100">
              <li>• Greenwashing.</li>
              <li>• Compliance theater.</li>
              <li>• Desalineación interna.</li>
            </ul>
            <p className="mt-5 text-sm font-semibold text-emerald-950 md:text-base dark:text-emerald-100">Evitarlo requiere método, no discurso.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="esg-reveal is-visible" data-reveal-id={revealItems[4]}>
          <h3 className="font-tho-title text-[2.1rem] text-slate-900 md:text-[3.2rem] dark:text-slate-100">Niveles de intervención</h3>
          <div className="brand-block-divider mt-3 mb-8 h-[6px] w-36 rounded-sm" />

          <div className="esg-level-grid esg-levels-gallery grid gap-5 md:grid-cols-3">
            <article className="esg-level-card esg-level-card--start relative rounded-[2.1rem] border border-[#9ac94f] bg-[linear-gradient(160deg,#f7fbe8_0%,#eef7d4_55%,#e5f2c1_100%)] p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ilustraciones/3.png" alt="Ilustración de inicio" className="pointer-events-none absolute right-4 top-4 w-14 opacity-95" />
              <p className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">● Punto de partida recomendado</p>
              <h4 className="mt-4 text-3xl font-black leading-[1.02] text-slate-900">Flash Audit ESG</h4>
              <p className="mt-3 text-sm text-slate-700">Revisión estratégica focalizada para organizaciones que necesitan claridad inmediata.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-800">
                <li>• Diagnóstico express de materialidad.</li>
                <li>• Identificación de riesgos reputacionales y regulatorios.</li>
                <li>• Recomendaciones inmediatas.</li>
              </ul>
              <p className="mt-4 text-sm font-semibold text-slate-900">Duración estimada: 3–4 semanas.</p>
              <button type="button" onClick={() => { setOpen(true); setBrochureStatus("idle"); }} className="btn-unified-motion btn-hero-services mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">
                Descargar brochure
              </button>
            </article>

            <article className="esg-level-card rounded-[2.1rem] border border-[#9ac94f]/70 bg-[linear-gradient(160deg,#f9fcea_0%,#f1f8dc_60%,#e8f3cb_100%)] p-6">
              <h4 className="text-2xl font-black text-slate-900">Hoja de Ruta y Gobernanza</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Profundización de materialidad.</li>
                <li>• Diseño de gobernanza.</li>
                <li>• Indicadores y métricas.</li>
                <li>• Plan de implementación.</li>
              </ul>
              <div className="mt-5 rounded-xl bg-white/70 p-4 ring-1 ring-emerald-700/15">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entregables</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  <li>✓ Hoja de Ruta ESG.</li>
                  <li>✓ Marco de gobernanza.</li>
                  <li>✓ Sistema de seguimiento.</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-800">Ordena la estrategia y alinea áreas.</p>
            </article>

            <article className="esg-level-card rounded-[2.1rem] border border-[#9ac94f]/70 bg-[linear-gradient(160deg,#f9fcea_0%,#f1f8dc_60%,#e8f3cb_100%)] p-6">
              <h4 className="text-2xl font-black text-slate-900">Implementación y Consolidación</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Acompañamiento en ejecución.</li>
                <li>• Instalación de capacidades internas.</li>
                <li>• Seguimiento de indicadores.</li>
                <li>• Ajustes estratégicos.</li>
              </ul>
              <div className="mt-5 rounded-xl bg-white/70 p-4 ring-1 ring-emerald-700/15">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entregables</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  <li>✓ Sistema operativo ESG.</li>
                  <li>✓ Evaluaciones periódicas.</li>
                  <li>✓ Mejora continua.</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-800">Convierte la estrategia en práctica real.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900/70">
        <div className="esg-reveal is-visible mx-auto max-w-4xl" data-reveal-id={revealItems[5]}>
          <h3 className="font-tho-title text-center text-[2.2rem] text-slate-900 md:text-[3.4rem] dark:text-slate-100">¿Qué implica partir por un Flash Audit ESG?</h3>
          <div className="brand-block-divider mx-auto mt-3 mb-8 h-[6px] w-36 rounded-sm" />

          <div className="grid gap-4">
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-slate-100">¿Cuándo conviene partir por aquí?</summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">Cuando hay presión por definir prioridades rápidamente y aún no existe base común entre áreas para diseñar una ruta completa.</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-slate-100">¿Qué decisión habilita?</summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">Te permite decidir con evidencia si avanzar a una hoja de ruta integral o focalizar recursos en brechas críticas de corto plazo.</p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <summary className="cursor-pointer text-base font-semibold text-slate-900 dark:text-slate-100">¿Qué NO es?</summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">No es una versión “ligera” del servicio completo: es un instrumento estratégico para reducir incertidumbre y ordenar la conversación ejecutiva.</p>
            </details>
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-tho-green">Blog</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{post.title}</h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                  <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">{post.tags.slice(0, 2).join(" · ")}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="esg-contacto" className="bg-white px-4 py-20 dark:bg-slate-950">
        <div className="esg-reveal is-visible mx-auto max-w-6xl" data-reveal-id={revealItems[6]}>
          <div className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white ring-1 ring-slate-800 md:px-8 md:py-12">
            <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div>
                <h3 className="font-tho-title text-[2.4rem] text-white md:text-[3.5rem]">¿Comenzamos?</h3>
                <p className="mt-4 max-w-xl text-lg text-white/85">Conversemos sobre la prioridad ESG más crítica de tu organización y definamos el punto de entrada con mayor impacto.</p>
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
                {contactStatus === "ok" ? <p className="text-sm text-emerald-200">Gracias, te contactaremos pronto.</p> : null}
                {contactStatus === "error" ? <p className="text-sm text-rose-200">No pudimos enviar, intenta nuevamente.</p> : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      {open ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-900/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Descargar brochure</h4>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-1 text-sm dark:border-slate-600 dark:text-slate-200">Cerrar</button>
            </div>
            <form onSubmit={onBrochureSubmit} className="mt-4 grid gap-3">
              <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
              <input name="name" required placeholder="Nombre" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input name="role" placeholder="Cargo" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input name="organization" required placeholder="Organización" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <button disabled={brochureStatus === "sending"} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-emerald-400 dark:text-slate-900">
                {brochureStatus === "sending" ? "Enviando..." : "Descargar brochure"}
              </button>
            </form>
            {brochureStatus === "ok" ? <p className="mt-3 text-sm text-emerald-700">Descarga iniciada. También registramos tu solicitud.</p> : null}
            {brochureStatus === "error" ? <p className="mt-3 text-sm text-rose-600">No pudimos procesar tu solicitud, intenta de nuevo.</p> : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
