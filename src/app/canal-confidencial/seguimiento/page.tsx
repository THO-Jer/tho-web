"use client";

import { useState } from "react";

import { incidentsCopy } from "@/content/incidentsCopy";

type Snapshot = {
  status: string;
  process_phase: string;
  last_updated_at: string;
  institutional_note: string;
};

export default function SeguimientoIncidentePage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSnapshot(null);

    try {
      const res = await fetch("/api/incidents/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tracking_code: trackingCode.trim().toUpperCase(), pin: pin.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(incidentsCopy.invalidTrackingMessage);
      setSnapshot(data.incident || null);
    } catch {
      setError(incidentsCopy.invalidTrackingMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Seguimiento de incidente</h1>
        <p className="mt-3 text-sm text-slate-600">{incidentsCopy.trackingIntro}</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Código de seguimiento</span>
            <input
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              required
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="SEG-XXXXXX"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">PIN</span>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="******"
            />
          </label>

          <button type="submit" disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? "Consultando..." : "Consultar estado"}
          </button>
        </form>

        {snapshot ? (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500">Estado</span>
                  <p className="mt-0.5 font-semibold text-slate-900">{snapshot.status}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500">Fase del proceso</span>
                  <p className="mt-0.5 font-semibold text-slate-900">{snapshot.process_phase || "Por definir"}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold uppercase text-slate-500">Última actualización</span>
                  <p className="mt-0.5 text-slate-700">{new Date(snapshot.last_updated_at).toLocaleString()}</p>
                </div>
              </div>
              {snapshot.institutional_note ? (
                <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-600">{snapshot.institutional_note}</p>
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-800">¿Qué significa este estado?</p>
              <div className="mt-2 text-xs text-slate-600">
                {snapshot.status === "Recibido" && <p>Tu reporte fue recibido correctamente. El comité lo revisará para determinar su admisibilidad.</p>}
                {snapshot.status === "En revisión" && <p>El comité está analizando los antecedentes del caso. Este proceso puede tomar varios días hábiles.</p>}
                {snapshot.status === "Derivado" && <p>El caso ha sido derivado a la instancia correspondiente para continuar con el proceso formal.</p>}
                {snapshot.status === "Cerrado" && <p>El proceso ha concluido. Si dejaste contacto, el equipo pudo haberte comunicado los resultados.</p>}
              </div>
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p><strong>¿Perdiste tu PIN?</strong></p>
          <p className="mt-1">{incidentsCopy.lostPinMessage}</p>
          <p className="mt-1">{incidentsCopy.lostPinContactMessage}</p>
          <p className="mt-1">{incidentsCopy.lostPinAnonymousMessage}</p>
        </div>
      </section>
    </main>
  );
}
