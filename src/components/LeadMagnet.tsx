"use client";

import { useState } from "react";

import { getUtm } from "@/lib/utm";

const RESOURCE_FILE_URL = "/downloads/manual-diversidad-v1.pdf";

export function LeadMagnet() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "lead_magnet",
      eventLabel: "manual_diversidad_download",
      source: "resources_modal",
      resourceId: "manual-diversidad-v1",
      resourceName: "Manual de Gestión de la Diversidad",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      pageUrl: window.location.href,
      hp: String(form.get("hp") || ""),
      utm: getUtm(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="lead-capture-shell rounded-3xl p-4 md:p-6">
      <div className="lead-capture-grid grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:gap-7">
        <section>
          <p className="lead-capture-kicker text-xs font-semibold uppercase tracking-[0.14em]">Recurso recomendado</p>
          <h3 className="lead-capture-title mt-2 text-[1.65rem] font-bold leading-tight md:text-[2rem]">
            Descarga el Manual de Gestión de la Diversidad
          </h3>
          <p className="lead-capture-subtitle mt-2 text-sm leading-relaxed md:text-base">
            Obtén el recurso en PDF con marco conceptual, checklist inicial y errores frecuentes para decidir con criterio.
          </p>

          <form onSubmit={onSubmit} className="mt-5 grid gap-2.5 md:mt-6">
            <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />

            <input
              name="name"
              required
              placeholder="Nombre"
              className="lead-capture-input rounded-lg px-3.5 py-2.5 text-sm"
            />

            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="lead-capture-input rounded-lg px-3.5 py-2.5 text-sm"
            />

            <input
              name="company"
              placeholder="Empresa"
              className="lead-capture-input rounded-lg px-3.5 py-2.5 text-sm"
            />

            <button
              disabled={status === "sending"}
              className="lead-capture-cta mt-1 rounded-lg px-4 py-2.5 text-sm font-semibold uppercase tracking-wide disabled:opacity-70"
            >
              {status === "sending" ? "Enviando..." : "Descargar manual"}
            </button>

            {status === "ok" ? (
              <div className="lead-capture-success mt-2 rounded-lg p-3 text-sm">
                <p>¡Listo! Ya puedes abrir el recurso.</p>
                <a href={RESOURCE_FILE_URL} target="_blank" rel="noreferrer" className="mt-1 inline-flex underline underline-offset-2">
                  Abrir PDF
                </a>
              </div>
            ) : null}

            {status === "error" ? <p className="lead-capture-error mt-1 text-sm">Algo falló. Intenta de nuevo.</p> : null}
          </form>
        </section>

        <aside className="lead-book-wrap flex items-center justify-center">
          <div className="lead-book-mock">
            <div className="lead-book-spine" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/downloads/portada-manual-01.png"
              alt="Portada del Manual de Gestión de la Diversidad"
              className="lead-book-face"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
