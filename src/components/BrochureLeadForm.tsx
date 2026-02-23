"use client";

import { useState } from "react";

export function BrochureLeadForm(props: {
  serviceSlug: string;
  serviceName: string;
  levelId: string;
  levelName: string;
  buttonLabel: string;
  hint?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "brochure_download",
      eventLabel: "service_brochure_download",
      source: "service_detail_level_card",
      resourceId: `brochure-${props.serviceSlug}-${props.levelId}`,
      resourceName: `Brochure ${props.serviceName} · ${props.levelName}`,
      serviceSlug: props.serviceSlug,
      serviceName: props.serviceName,
      levelId: props.levelId,
      levelName: props.levelName,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      message: `${props.serviceName} | ${props.levelName}`,
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
    <div className="mt-5 rounded-2xl border border-tho-green/40 bg-tho-green/10 p-4">
      {props.hint ? (
        <div className="inline-flex rounded-full bg-tho-green px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-950">
          {props.hint}
        </div>
      ) : null}
      <p className="mt-3 text-sm text-slate-700">
        {props.buttonLabel} y te lo enviamos al correo para iniciar la conversación comercial.
      </p>
      <form onSubmit={onSubmit} className="mt-3 grid gap-2 md:grid-cols-3">
        <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
        <input
          name="name"
          required
          placeholder="Nombre"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <input
          name="company"
          placeholder="Empresa"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <button
          disabled={status === "sending"}
          className="btn-unified-motion btn-brand-accent btn-brand-accent-green md:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 disabled:opacity-60"
        >
          {status === "sending" ? "Enviando..." : props.buttonLabel}
        </button>
      </form>
      {status === "ok" ? (
        <p className="mt-2 text-xs text-slate-600">¡Listo! Registramos tu solicitud en el pipeline y te contactaremos por correo.</p>
      ) : null}
      {status === "error" ? <p className="mt-2 text-xs text-slate-600">No pudimos enviar el formulario, intenta nuevamente.</p> : null}
    </div>
  );
}
