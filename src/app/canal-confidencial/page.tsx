"use client";

import Link from "next/link";
import { useState } from "react";

const INCIDENT_TYPES = ["Acoso laboral", "Acoso sexual", "Maltrato", "Conflicto ético", "Otro"] as const;

export default function CanalConfidencialPage() {
  const [anonymous, setAnonymous] = useState(true);
  const [sending, setSending] = useState(false);
  const [successCaseCode, setSuccessCaseCode] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingPin, setTrackingPin] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccessCaseCode("");
    setTrackingCode("");
    setTrackingPin("");

    try {
      const formElement = e.currentTarget;
      const form = new FormData(formElement);
      form.set("anonymous", anonymous ? "true" : "false");

      const res = await fetch("/api/incidents", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo enviar el reporte.");
      setSuccessCaseCode(data.case_code || "");
      setTrackingCode(data.tracking_code || "");
      setTrackingPin(data.tracking_pin || "");
      formElement.reset();
      setAnonymous(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error enviando reporte.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Canal Confidencial de Incidentes</h1>
        <p className="mt-3 text-sm text-slate-600">
          Este canal permite reportar incidentes de forma confidencial en el marco de cumplimiento Ley Karin.
          Al finalizar recibirás código de caso y credenciales de seguimiento.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Tipo de incidente *</span>
            <select name="type" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              {INCIDENT_TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Descripción detallada *</span>
            <textarea name="description" required rows={6} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Fecha aproximada *</span>
              <input name="event_date" type="date" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Personas involucradas (opcional)</span>
              <input name="involved_people" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Adjuntar evidencia (opcional · pdf, imágenes, doc/docx · máx. 10MB)</span>
            <input name="evidence_file" type="file" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Deseo mantener anonimato
          </label>

          {!anonymous ? (
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Correo de contacto *</span>
              <input name="reporter_email" type="email" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </label>
          ) : null}

          <button
            type="submit"
            disabled={sending}
            className="btn-unified-motion btn-tho-hover-gradient inline-flex w-fit rounded-xl border border-slate-700/20 bg-slate-900 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-60"
          >
            {sending ? "Enviando..." : "Enviar reporte"}
          </button>
        </form>

        {successCaseCode ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <p>Reporte enviado con éxito. Código de caso: <strong>{successCaseCode}</strong></p>
            <p className="mt-1">Código de seguimiento: <strong>{trackingCode}</strong></p>
            <p className="mt-1">PIN de seguimiento: <strong>{trackingPin}</strong> (guárdalo, sólo se muestra una vez).</p>
            <Link href="/canal-confidencial/seguimiento" className="mt-3 inline-flex rounded-md border border-emerald-300 px-3 py-1.5 font-semibold">
              Consultar estado del caso
            </Link>
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
        ) : null}
      </section>
    </main>
  );
}
