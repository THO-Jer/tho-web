"use client";

import { useState } from "react";

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
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="text-xs font-medium text-slate-500">Manual descargable</div>
        <h3 className="mt-2 text-lg font-semibold">Manual de Gestión de la Diversidad (v1)</h3>
        <p className="mt-2 text-sm text-slate-600">
          Una guía práctica para pasar de la declaración de principios a la gestión real.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="btn-tho-hover-gradient mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
        >
          Descargar manual
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-xs font-medium text-slate-500">Cómo usarlo</div>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
          <li>Marco conceptual claro y aplicable</li>
          <li>Checklist para diagnóstico inicial</li>
          <li>Errores comunes y cómo evitarlos</li>
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          Después agregaremos recursos específicos por servicio.
        </p>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Descarga por email</div>
                <p className="mt-1 text-sm text-slate-600">Te enviamos el link. Sin spam.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="btn-tho-hover-gradient rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 grid gap-3">
              <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />

              <label className="grid gap-1">
                <span className="text-xs text-slate-500">Nombre</span>
                <input
                  name="name"
                  required
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-slate-500">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-slate-500">Empresa</span>
                <input name="company" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              </label>

              <button
                disabled={status === "sending"}
                className="btn-tho-hover-gradient mt-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                {status === "sending" ? "Enviando…" : "Enviar"}
              </button>

              {status === "ok" ? (
                <p className="text-sm text-slate-600">
                  Listo. Te llegará el link (por ahora queda registrado y nos llega a hola@tho.cl; activamos envío automático al enchufar proveedor).
                </p>
              ) : null}
              {status === "error" ? <p className="text-sm text-slate-600">Algo falló. Intenta de nuevo.</p> : null}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
