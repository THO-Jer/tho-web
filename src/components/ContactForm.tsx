"use client";

import { useState } from "react";

export function ContactForm(props: { ticket?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "contact",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      message: String(form.get("message") || ""),
      ticket: props.ticket,
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
    <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="text-sm font-semibold text-white">Hablemos</div>

      <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />

      <Field label="Nombre">
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

      <Field label="Email">
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
        className="btn-tho-hover-gradient mt-2 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-medium text-slate-900 disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar"}
      </button>

      {status === "ok" ? <div className="text-xs text-white/70">Listo. Te escribimos pronto.</div> : null}
      {status === "error" ? (
        <div className="text-xs text-white/70">Algo falló. Intenta de nuevo.</div>
      ) : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/70">{label}</span>
      {children}
    </label>
  );
}
