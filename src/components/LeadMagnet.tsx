"use client";

import { useState } from "react";

const RESOURCE_FILE_URL = "/downloads/manual-diversidad-v1.pdf";

export function LeadMagnet() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "lead_magnet",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      pageUrl: window.location.href,
      hp: String(form.get("hp") || ""),
      utm: {},
    };

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setStatus(res.ok ? "ok" : "error");
    if (res.ok) (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <div className="lead-magnet-shell grid gap-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Recurso de orientación</p>
            <p className="text-sm font-medium text-slate-700">Manual de Gestión de la Diversidad · Vista previa</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">Página 1</span>
        </div>

        <div className="bg-slate-100 p-3 md:p-4">
          <div className="mx-auto aspect-[1/1.414] w-full max-w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg md:max-w-[400px]">
            <iframe
              title="Vista previa de la primera página del manual"
              src={`${RESOURCE_FILE_URL}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH&zoom=page-width`}
              className="h-full w-full"
              scrolling="no"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(160deg,#ffffff_0%,#f8fafc_44%,#f1f5f9_100%)] p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Manual descargable</p>
        <h3 className="mt-2 text-[1.2rem] font-semibold leading-tight text-slate-900 md:text-[1.3rem]">Un recurso para orientar criterios y decisiones</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Diseñado para equipos que necesitan ordenar conversaciones, priorizar acciones y tomar decisiones con mayor claridad en temas de diversidad.
        </p>

        <ul className="mt-5 grid gap-2 text-sm text-slate-600">
          <li>• Marco conceptual claro y aplicable</li>
          <li>• Checklist para diagnóstico inicial</li>
          <li>• Errores frecuentes y cómo evitarlos</li>
        </ul>

        <button
          onClick={() => setOpen(true)}
          className="btn-unified-motion btn-brand-accent btn-brand-accent-pink mt-6 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-800"
        >
          Quiero acceder al recurso
        </button>

        <p className="mt-3 text-xs text-slate-500">Para habilitar el acceso, necesitamos tus datos de contacto.</p>
      </div>

      {open ? (
        <div className="lead-magnet-shell fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Recibir acceso al recurso</div>
                <p className="mt-1 text-sm text-slate-600">Completa tus datos y te habilitamos el acceso al documento.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="btn-unified-motion btn-brand-neutral rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 grid gap-3">
              <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />

              <label className="grid gap-1">
                <span className="text-xs text-slate-500">Nombre</span>
                <input name="name" required className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-slate-500">Email</span>
                <input name="email" type="email" required className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-slate-500">Empresa</span>
                <input name="company" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              </label>

              <button
                disabled={status === "sending"}
                className="btn-unified-motion btn-brand-neutral mt-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 disabled:opacity-60"
              >
                {status === "sending" ? "Enviando…" : "Continuar"}
              </button>

              {status === "ok" ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-sm text-emerald-800">Gracias. Ya puedes abrir el recurso.</p>
                  <a
                    href={RESOURCE_FILE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-emerald-900 underline underline-offset-2"
                  >
                    Abrir recurso
                  </a>
                </div>
              ) : null}

              {status === "error" ? <p className="text-sm text-slate-600">Algo falló. Intenta de nuevo.</p> : null}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
