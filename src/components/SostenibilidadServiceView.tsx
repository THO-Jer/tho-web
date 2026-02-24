"use client";

import { useMemo, useState } from "react";

type FormStatus = "idle" | "sending" | "ok" | "error";

const BROCHURE_FILE_URL = "/downloads/manual-diversidad-v1.pdf";

function useRevealItems() {
  return useMemo(
    () => [
      "esg-hero-copy",
      "esg-hero-cta",
      "esg-statement",
      "esg-context",
      "esg-levels",
      "esg-ticket",
      "esg-contact",
    ],
    []
  );
}

export function SostenibilidadServiceView() {
  const [open, setOpen] = useState(false);
  const [brochureStatus, setBrochureStatus] = useState<FormStatus>("idle");
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");

  const revealItems = useRevealItems();

  async function onBrochureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBrochureStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "brochure_download",
      eventLabel: "flash_audit_esg_brochure_download",
      source: "esg_ticket_reveal_modal",
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

    if (!res.ok) {
      setBrochureStatus("error");
      return;
    }

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
    <main className="esg-page bg-white text-slate-900">
      <section className="esg-hero relative min-h-[84vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/2.png" alt="Equipo evaluando riesgos y estrategia" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/25 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />

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
            <a href="#esg-contacto" className="esg-reveal is-visible mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5" data-reveal-id={revealItems[1]}>
              ¿Quieres cotizar?
            </a>
          </div>
        </div>
      </section>

      <section className="esg-statement mx-auto max-w-5xl px-4 py-24 text-center">
        <h2 className="esg-reveal is-visible font-tho-title text-[2.2rem] leading-[1.05] text-slate-900 md:text-[4rem]" data-reveal-id={revealItems[2]}>
          Cumplir no es lo mismo que gestionar riesgos.
        </h2>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="esg-reveal is-visible grid gap-8 md:grid-cols-[1.2fr_0.8fr]" data-reveal-id={revealItems[3]}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Qué está cambiando</p>
            <div className="esg-title-line mt-3 mb-6" />
            <p className="text-base leading-relaxed text-slate-700 md:text-lg">
              La conversación ESG dejó de ser reputacional y se volvió estratégica: hoy la doble materialidad obliga a mirar impacto financiero e impacto externo al mismo tiempo.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
              Inversionistas y directorios piden trazabilidad real, no solo narrativa. Lo que antes era voluntario ahora condiciona decisiones de capital, continuidad y riesgo.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
              Además, el escrutinio público es más rápido y más exigente: si la organización no está alineada internamente, cualquier promesa externa se vuelve vulnerable.
            </p>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-7">
            <h3 className="font-tho-title text-[1.8rem] leading-[1.06] text-slate-900 md:text-[2.3rem]">
              El riesgo no es no tener ESG.
              <br />
              El riesgo es practicarlo superficialmente.
            </h3>
            <ul className="mt-5 space-y-2 text-sm text-slate-700 md:text-base">
              <li>• Greenwashing.</li>
              <li>• Compliance theater.</li>
              <li>• Desalineación interna.</li>
            </ul>
            <p className="mt-5 text-sm font-semibold text-slate-900 md:text-base">Evitarlo requiere método, no discurso.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="esg-reveal is-visible" data-reveal-id={revealItems[4]}>
          <h3 className="font-tho-title text-[2.1rem] text-slate-900 md:text-[3.2rem]">Niveles de intervención</h3>
          <div className="esg-title-line mt-3 mb-8" />

          <div className="grid gap-5 md:grid-cols-3">
            <article className="esg-level-card rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="text-xl font-semibold text-slate-900">Diagnóstico Estratégico ESG</h4>
              <p className="mt-2 text-sm text-slate-600">Para organizaciones que necesitan claridad antes de diseñar una estrategia completa.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Identificación de riesgos críticos.</li>
                <li>• Análisis preliminar de doble materialidad.</li>
                <li>• Evaluación de brechas.</li>
                <li>• Mapa de prioridades.</li>
              </ul>
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entregables</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  <li>✓ Informe ejecutivo.</li>
                  <li>✓ Matriz de riesgos priorizados.</li>
                  <li>✓ Recomendaciones a 90 días.</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-800">Permite priorizar antes de invertir en grande.</p>
            </article>

            <article className="esg-level-card rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="text-xl font-semibold text-slate-900">Hoja de Ruta y Gobernanza</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Profundización de materialidad.</li>
                <li>• Diseño de gobernanza.</li>
                <li>• Indicadores y métricas.</li>
                <li>• Plan de implementación.</li>
              </ul>
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entregables</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  <li>✓ Hoja de Ruta ESG.</li>
                  <li>✓ Marco de gobernanza.</li>
                  <li>✓ Sistema de seguimiento.</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-800">Ordena la estrategia y alinea áreas.</p>
            </article>

            <article className="esg-level-card rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="text-xl font-semibold text-slate-900">Implementación y Consolidación</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Acompañamiento en ejecución.</li>
                <li>• Instalación de capacidades internas.</li>
                <li>• Seguimiento de indicadores.</li>
                <li>• Ajustes estratégicos.</li>
              </ul>
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
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

      <section className="bg-slate-50 px-4 py-20">
        <div className="esg-reveal is-visible mx-auto max-w-3xl text-center" data-reveal-id={revealItems[5]}>
          <h3 className="font-tho-title text-[2.2rem] text-slate-900 md:text-[3.6rem]">¿Partimos por el principio?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-700 md:text-lg">
            No todas las organizaciones necesitan una intervención extensa desde el día uno. A veces lo primero es claridad estratégica.
          </p>

          <div className="mx-auto mt-8 max-w-[700px] rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <h4 className="text-2xl font-semibold text-slate-900">Flash Audit ESG</h4>
            <p className="mt-2 text-sm text-slate-700 md:text-base">
              Revisión estratégica focalizada para identificar riesgos críticos y brechas prioritarias.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-700 md:text-base">
              <li>• Diagnóstico express de materialidad.</li>
              <li>• Identificación de riesgos reputacionales y regulatorios.</li>
              <li>• Recomendaciones inmediatas.</li>
            </ul>

            <p className="mt-4 text-sm font-semibold text-slate-900 md:text-base">Duración estimada: 3–4 semanas.</p>
            <p className="mt-4 text-sm text-slate-700 md:text-base">
              No es una versión reducida del servicio. Es un instrumento estratégico para decidir con información.
            </p>

            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setBrochureStatus("idle");
              }}
              className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Descargar brochure
            </button>
          </div>
        </div>
      </section>

      <section id="esg-contacto" className="bg-white px-4 py-20">
        <div className="esg-reveal is-visible mx-auto max-w-3xl" data-reveal-id={revealItems[6]}>
          <h3 className="font-tho-title text-[2.2rem] text-slate-900 md:text-[3.4rem]">Conversemos si hace sentido.</h3>
          <div className="esg-title-line mt-3 mb-7" />

          <form onSubmit={onContactSubmit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6">
            <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
            <input name="name" required placeholder="Nombre" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="role" placeholder="Cargo" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="organization" placeholder="Organización" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <textarea name="message" rows={4} placeholder="Mensaje" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <button
              disabled={contactStatus === "sending"}
              className="mt-2 inline-flex w-fit rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {contactStatus === "sending" ? "Enviando..." : "Enviar solicitud"}
            </button>
            {contactStatus === "ok" ? <p className="text-sm text-emerald-700">Gracias, te contactaremos pronto.</p> : null}
            {contactStatus === "error" ? <p className="text-sm text-rose-600">No pudimos enviar, intenta nuevamente.</p> : null}
          </form>
        </div>
      </section>

      {open ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-900/60 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xl font-semibold text-slate-900">Descargar brochure</h4>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-1 text-sm">
                Cerrar
              </button>
            </div>

            <form onSubmit={onBrochureSubmit} className="mt-4 grid gap-3">
              <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
              <input name="name" required placeholder="Nombre" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              <input name="role" placeholder="Cargo" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              <input name="organization" required placeholder="Organización" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              <button disabled={brochureStatus === "sending"} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
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
