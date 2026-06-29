"use client";

import { useState } from "react";
import { getUtm } from "@/lib/utm";

export function ContactForm(props: { ticket?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "contact",
      eventLabel: props.ticket ? "ticket_contact_form" : "general_contact_form",
      source: props.ticket ? "ticket_detail_page" : "homepage_contact_section",
      resourceId: props.ticket ? `ticket-${props.ticket}` : "contact-form",
      resourceName: props.ticket ? `Consulta ticket ${props.ticket}` : "Formulario de contacto",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      message: String(form.get("message") || ""),
      ticket: props.ticket,
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
    <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="text-sm font-semibold text-white">Hablemos</div>

      <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />

      <Field label="Nombre" required>
        <input
          name="name"
          required
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none"
        />
      </Field>

      <Field label="Empresa">
        <input
          name="company"
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none"
        />
      </Field>

      <Field label="Email" required>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none"
        />
      </Field>

      <Field label="Teléfono">
        <input
          name="phone"
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none"
        />
      </Field>

      <Field label="Mensaje">
        <textarea
          name="message"
          rows={3}
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none"
        />
      </Field>

      <button
        disabled={status === "sending"}
        className="btn-unified-motion btn-brand-neutral mt-2 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-medium text-slate-900 disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar"}
      </button>

      {status === "ok" ? (
        <div role="status" aria-live="polite" className="text-xs text-white/70">
          Listo. Te escribimos pronto.
        </div>
      ) : null}
      {status === "error" ? (
        <div role="alert" aria-live="assertive" className="text-xs text-white/70">
          Algo falló. Intenta de nuevo.
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/70">
        {label}
        {required ? <span className="ml-0.5 text-white/50" aria-hidden>*</span> : null}
      </span>
      {children}
    </label>
  );
}
