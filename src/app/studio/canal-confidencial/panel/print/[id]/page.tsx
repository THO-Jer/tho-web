"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type AuditEntry = {
  at: string;
  actor: string;
  actor_email?: string;
  actor_kind?: string;
  action: string;
  detail?: string;
};

type Incident = {
  id: string;
  case_code: string;
  tracking_code: string;
  type: string;
  description: string;
  event_date: string;
  involved_people?: string;
  anonymous: boolean;
  reporter_email?: string;
  attachments?: string[];
  status: string;
  urgency_level: string;
  process_phase: string;
  director_notes?: string;
  director_only_notes?: string;
  suggested_action?: string;
  created_at: string;
  last_updated_at: string;
  audit_log: AuditEntry[];
};

const ACTION_LABELS: Record<string, string> = {
  "Caso creado": "Caso creado",
  UPDATE_STATUS: "Cambio de estado",
  UPDATE_PHASE: "Cambio de fase",
  UPDATE_URGENCY: "Cambio de urgencia",
  UPDATE_RESPONSIBLE: "Asignación de responsable",
  ADD_COMMITTEE_NOTE: "Actualización de notas del comité",
  MARK_ATTENDABLE: "Caso marcado como atendible",
  MARK_NOT_ATTENDABLE: "Caso marcado como no atendible",
  REQUEST_ADDITIONAL_INFO: "Solicitud de información adicional",
  RESET_PIN: "Rotación de PIN de seguimiento",
  "Evidencia adjuntada": "Evidencia adjuntada",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("es-CL", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function CanalConfidencialPrintPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "");
  const [incident, setIncident] = useState<Incident | null>(null);
  const [error, setError] = useState("");
  const [printDate] = useState(() => new Date().toLocaleString("es-CL", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  }));

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/incidents/${id}`, { credentials: "include", cache: "no-store" })
      .then((res) => {
        if (res.status === 401) { router.replace("/studio"); return null; }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.error) { setError(data.error); return; }
        setIncident(data.incident as Incident);
      })
      .catch(() => setError("No se pudo cargar el expediente."));
  }, [id, router]);

  useEffect(() => {
    if (!incident) return;
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, [incident]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white p-8">
        <p className="text-sm text-rose-700">{error}</p>
      </main>
    );
  }

  if (!incident) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white p-8">
        <p className="text-sm text-slate-500">Preparando expediente…</p>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-page { box-shadow: none !important; border: none !important; }
        }
        @page {
          margin: 2cm;
          size: A4;
        }
      `}</style>

      {/* Barra de acciones — se oculta al imprimir */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <span className="text-sm font-semibold text-slate-700">Vista previa del expediente — {incident.case_code}</span>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Guardar / Imprimir PDF
          </button>
          <button
            onClick={() => window.close()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Expediente */}
      <div className="print-page mx-auto max-w-3xl bg-white px-10 py-10 text-slate-900">

        {/* Encabezado */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">THO · Uso Interno Confidencial</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Expediente de Incidente</h1>
              <p className="mt-0.5 text-sm text-slate-600">Canal Confidencial de Incidentes</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Generado: {printDate}</p>
              <p className="mt-0.5">Documento de uso interno restringido</p>
            </div>
          </div>
        </div>

        {/* Identificación */}
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Identificación del caso</h2>
          <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><span className="font-semibold">Código de caso:</span> {incident.case_code}</div>
            <div><span className="font-semibold">Código de seguimiento:</span> {incident.tracking_code}</div>
            <div><span className="font-semibold">Estado actual:</span> {incident.status}</div>
            <div><span className="font-semibold">Urgencia:</span> {incident.urgency_level}</div>
            <div><span className="font-semibold">Fase del proceso:</span> {incident.process_phase || "—"}</div>
            <div><span className="font-semibold">Tipo:</span> {incident.type}</div>
            <div><span className="font-semibold">Fecha del evento:</span> {incident.event_date}</div>
            <div><span className="font-semibold">Creado el:</span> {fmt(incident.created_at)}</div>
            <div><span className="font-semibold">Última actualización:</span> {fmt(incident.last_updated_at)}</div>
          </div>
        </section>

        {/* Persona reportante */}
        <section className="mt-6 border-t border-slate-200 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Persona reportante</h2>
          <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><span className="font-semibold">Modalidad:</span> {incident.anonymous ? "Anónimo" : "Identificado"}</div>
            <div><span className="font-semibold">Contacto:</span> {incident.reporter_email || "No informado"}</div>
            {incident.involved_people ? (
              <div className="col-span-2"><span className="font-semibold">Personas mencionadas:</span> {incident.involved_people}</div>
            ) : null}
          </div>
        </section>

        {/* Relato original */}
        <section className="mt-6 border-t border-slate-200 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Relato original (resguardado sin modificaciones)</h2>
          <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
            {incident.description}
          </div>
        </section>

        {/* Triage del comité */}
        <section className="mt-6 border-t border-slate-200 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Triage del comité</h2>
          <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {incident.director_only_notes ? (
              <div className="col-span-2"><span className="font-semibold">Responsable asignado:</span> {incident.director_only_notes}</div>
            ) : null}
            {incident.suggested_action ? (
              <div className="col-span-2"><span className="font-semibold">Acción sugerida (sistema):</span> {incident.suggested_action}</div>
            ) : null}
          </div>
          {incident.director_notes ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Notas internas del comité</p>
              <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                {incident.director_notes}
              </div>
            </div>
          ) : null}
        </section>

        {/* Adjuntos */}
        {incident.attachments?.length ? (
          <section className="mt-6 border-t border-slate-200 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Adjuntos ({incident.attachments.length})</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {incident.attachments.map((url, i) => (
                <li key={url}><span className="font-semibold">Adjunto {i + 1}:</span> {url}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Timeline */}
        <section className="mt-6 border-t border-slate-200 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Timeline completo ({incident.audit_log.length} eventos)</h2>
          <div className="mt-3 space-y-2">
            {incident.audit_log.map((entry, idx) => (
              <div key={`${entry.at}-${idx}`} className="flex gap-3 text-sm">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-slate-400 mt-[6px]" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {ACTION_LABELS[entry.action] || entry.action}
                  </p>
                  {entry.detail ? <p className="text-slate-600">{entry.detail}</p> : null}
                  <p className="text-xs text-slate-400">
                    {fmt(entry.at)} · {entry.actor}{entry.actor_email ? ` (${entry.actor_email})` : ""}
                    {entry.actor_kind ? ` · ${entry.actor_kind}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pie de página */}
        <div className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">
          <p>Este documento es de uso interno y confidencial. Su divulgación no autorizada infringe el protocolo de manejo de incidentes de THO.</p>
          <p className="mt-1">Expediente generado automáticamente desde el Canal Confidencial de Incidentes — THO Studio.</p>
        </div>

      </div>
    </>
  );
}
