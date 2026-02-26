"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type Incident = {
  id: string;
  case_code: string;
  tracking_code: string;
  type: string;
  description: string;
  event_date: string;
  anonymous: boolean;
  reporter_email?: string;
  attachments?: string[];
  status: "Recibido" | "En revisión" | "Derivado" | "Cerrado";
  urgency_level: "Bajo" | "Medio" | "Alto";
  process_phase: string;
  suggested_action: string;
  director_notes?: string;
  director_only_notes?: string;
  created_at: string;
  last_updated_at: string;
  audit_log: Array<{ at: string; actor: string; actor_email?: string; actor_kind?: string; action: string; detail?: string }>;
};

type SessionData = {
  authenticated: boolean;
  role?: string;
  permissions?: { canIncidents?: boolean };
};

type OnboardingStatus = {
  config?: { required?: boolean; blockInternal?: boolean };
  onboarding?: { completed?: boolean };
};

type TriageForm = {
  status: Incident["status"];
  process_phase: string;
  urgency_level: Incident["urgency_level"];
  director_only_notes: string;
  director_notes: string;
};

const STATUSES: Incident["status"][] = ["Recibido", "En revisión", "Derivado", "Cerrado"];
const URGENCIES: Incident["urgency_level"][] = ["Bajo", "Medio", "Alto"];

function CollaboratorView() {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold text-slate-900">Canal Confidencial · Información para el equipo</h2>
      <p className="mt-3 text-sm text-slate-700">
        En THO promovemos una cultura del cuidado, respeto y buen trato. Toda situación que no esté alineada con estos principios,
        con el Código de Ética o con la Ley Karin, puede y debe ser reportada por este canal.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
        <li>Se resguarda el anonimato cuando la persona reportante así lo solicita.</li>
        <li>Cada caso recibe un código y seguimiento con trazabilidad del proceso.</li>
        <li>Se aplica debido proceso, revisión de antecedentes y medidas proporcionales.</li>
        <li>El equipo directivo revisa cada reporte de manera rigurosa y confidencial.</li>
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/studio/canal-confidencial/reportar" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Crear nuevo reporte
        </Link>
        <Link href="/canal-confidencial/seguimiento" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
          Revisar estado de un caso
        </Link>
      </div>
    </section>
  );
}

export default function StudioIncidentesPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [requestInfoText, setRequestInfoText] = useState("");
  const [triage, setTriage] = useState<TriageForm | null>(null);
  const [blockedByOnboarding, setBlockedByOnboarding] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const sessionRes = await fetch("/api/admin/session", { credentials: "include" });
        const data = (await sessionRes.json()) as SessionData;
        if (!data.authenticated || !data.permissions?.canIncidents) {
          router.replace("/studio");
          return;
        }

        const isSuper = String(data.role || "") === "superadmin";
        setIsSuperAdmin(isSuper);

        if (!isSuper) {
          const onboardingRes = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
          const onboarding = (await onboardingRes.json()) as OnboardingStatus;
          if (onboardingRes.ok) {
            const required = Boolean(onboarding.config?.required ?? true);
            const blockInternal = Boolean(onboarding.config?.blockInternal ?? false);
            const completed = Boolean(onboarding.onboarding?.completed);
            setBlockedByOnboarding(required && blockInternal && !completed);
          }
        }
      } catch {
        router.replace("/studio");
      } finally {
        setChecking(false);
      }
    };

    run().catch(() => undefined);
  }, [router]);

  const loadIncidents = useCallback(async () => {
    if (!isSuperAdmin || previewMode) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/incidents", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cargar incidentes.");
      const rows = (data.incidents || []) as Incident[];
      setIncidents(rows);
      const nextId = activeId || rows[0]?.id || "";
      setActiveId(nextId);
      const focus = rows.find((item) => item.id === nextId) || rows[0];
      if (focus) {
        setTriage({
          status: focus.status,
          process_phase: focus.process_phase || "",
          urgency_level: focus.urgency_level,
          director_only_notes: focus.director_only_notes || "",
          director_notes: focus.director_notes || "",
        });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error cargando incidentes.");
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, previewMode, activeId]);

  useEffect(() => {
    if (checking) return;
    loadIncidents().catch(() => undefined);
  }, [checking, loadIncidents]);

  const visible = useMemo(() => {
    if (statusFilter === "all") return incidents;
    return incidents.filter((item) => item.status === statusFilter);
  }, [incidents, statusFilter]);

  const active = visible.find((item) => item.id === activeId) || visible[0];

  useEffect(() => {
    if (!active) return;
    setTriage({
      status: active.status,
      process_phase: active.process_phase || "",
      urgency_level: active.urgency_level,
      director_only_notes: active.director_only_notes || "",
      director_notes: active.director_notes || "",
    });
    setRequestInfoText("");
  }, [active]);

  async function saveTriage() {
    if (!active || !isSuperAdmin || previewMode || !triage) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/incidents/${active.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(triage),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar triage.");
      setMessage("Triage actualizado por comité.");
      await loadIncidents();
      setActiveId(active.id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error actualizando caso.");
    } finally {
      setLoading(false);
    }
  }

  async function runAction(action: "mark_atendible" | "mark_no_atendible" | "request_info" | "reset_pin") {
    if (!active || !isSuperAdmin || previewMode) return;
    setLoading(true);
    setMessage("");
    setNewPin("");
    try {
      const res = await fetch(`/api/admin/incidents/${active.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, anonymous: active.anonymous, detail: requestInfoText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo ejecutar acción.");
      if (action === "reset_pin") {
        setNewPin(String(data.tracking_pin || ""));
      }
      setMessage("Acción de comité ejecutada correctamente.");
      await loadIncidents();
      setActiveId(active.id);
      if (action === "request_info") setRequestInfoText("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error ejecutando acción.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando Canal Confidencial..." /></main>;

  if (blockedByOnboarding) {
    return (
      <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-2xl font-semibold text-amber-900">Bloqueado hasta completar onboarding</h1>
          <p className="mt-2 text-sm text-amber-900">Para acceder a este módulo interno debes completar Studio Onboarding.</p>
          <div className="mt-4 flex gap-2">
            <Link href="/studio/onboarding" className="rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white">Ir a onboarding</Link>
            <Link href="/studio" className="rounded-lg border border-amber-400 px-4 py-2 text-sm text-amber-900">Volver al Studio</Link>
          </div>
        </section>
      </main>
    );
  }

  const showCommitteePanel = isSuperAdmin && !previewMode;

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Canal Confidencial</h1>
            <p className="mt-2 text-sm text-slate-600">
              {showCommitteePanel ? "Acceso Comité (solo superadmins): triage, timeline y gestión interna de incidentes." : "Vista colaborador: información, orientación y acceso al reporte/seguimiento."}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver al Studio</Link>
            <Link href="/studio/canal-confidencial/reportar" target="_blank" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Abrir formulario público</Link>
            {isSuperAdmin ? (
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setPreviewMode((v) => !v)}
              >
                {previewMode ? "Volver a Acceso Comité" : "Preview vista colaborador"}
              </button>
            ) : null}
          </div>
        </div>

        {!showCommitteePanel ? <CollaboratorView /> : null}

        {showCommitteePanel ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Casos ({visible.length})</h2>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                  <option value="all">Todos</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="mt-3 grid max-h-[560px] gap-2 overflow-auto pr-1">
                {visible.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={`rounded-xl border p-3 text-left ${active?.id === item.id ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}
                  >
                    <div className="text-xs font-semibold uppercase text-slate-500">{item.status} · {item.urgency_level}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{item.case_code}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-slate-600">{item.description}</div>
                  </button>
                ))}
                {!visible.length ? <p className="text-sm text-slate-500">No hay casos para este filtro.</p> : null}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              {!active || !triage ? <p className="text-sm text-slate-600">Selecciona un caso para ver detalle.</p> : (
                <div className="grid gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{active.case_code}</h2>
                    <div className="mt-1 text-xs text-slate-500">Tracking: {active.tracking_code}</div>
                  </div>

                  <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
                    <div><strong>Tipo:</strong> {active.type}</div>
                    <div><strong>Fecha evento:</strong> {active.event_date}</div>
                    <div><strong>Anónimo:</strong> {active.anonymous ? "Sí" : "No"}</div>
                    <div><strong>Contacto:</strong> {active.reporter_email || "No informado"}</div>
                    <div><strong>Creado:</strong> {new Date(active.created_at).toLocaleString()}</div>
                    <div><strong>Actualizado:</strong> {new Date(active.last_updated_at).toLocaleString()}</div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Descripción</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{active.description}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-600">Estado</span>
                      <select value={triage.status} onChange={(e) => setTriage((prev) => prev ? { ...prev, status: e.target.value as Incident["status"] } : prev)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                        {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-600">Fase</span>
                      <input value={triage.process_phase} onChange={(e) => setTriage((prev) => prev ? { ...prev, process_phase: e.target.value } : prev)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-600">Urgencia</span>
                      <select value={triage.urgency_level} onChange={(e) => setTriage((prev) => prev ? { ...prev, urgency_level: e.target.value as Incident["urgency_level"] } : prev)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                        {URGENCIES.map((urgency) => <option key={urgency} value={urgency}>{urgency}</option>)}
                      </select>
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-600">Responsable comité</span>
                      <input value={triage.director_only_notes} onChange={(e) => setTriage((prev) => prev ? { ...prev, director_only_notes: e.target.value } : prev)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="nombre o correo" />
                    </label>
                    <label className="grid gap-1 sm:col-span-2">
                      <span className="text-xs font-semibold text-slate-600">Notas internas del comité</span>
                      <textarea value={triage.director_notes} onChange={(e) => setTriage((prev) => prev ? { ...prev, director_notes: e.target.value } : prev)} rows={4} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={saveTriage} disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      Guardar triage
                    </button>
                    <button type="button" onClick={() => runAction("mark_atendible")} disabled={loading} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
                      Marcar atendible
                    </button>
                    <button type="button" onClick={() => runAction("mark_no_atendible")} disabled={loading} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
                      Marcar no atendible
                    </button>
                    <button type="button" onClick={() => runAction("reset_pin")} disabled={loading} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
                      Resetear PIN
                    </button>
                    <button type="button" onClick={() => loadIncidents()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50" disabled={loading}>
                      Recargar
                    </button>
                  </div>

                  {!active.anonymous ? (
                    <div className="rounded-xl border border-slate-200 p-3">
                      <h3 className="text-sm font-semibold text-slate-800">Solicitar información adicional</h3>
                      <textarea value={requestInfoText} onChange={(e) => setRequestInfoText(e.target.value)} rows={3} placeholder="Detalle de la información requerida" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                      <button type="button" onClick={() => runAction("request_info")} disabled={loading} className="mt-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                        Solicitar información adicional
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Caso anónimo: no se puede solicitar información adicional por contacto directo.</p>
                  )}

                  {message ? <p className="text-sm text-slate-600">{message}</p> : null}

                  {newPin ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Nuevo PIN (mostrar una sola vez): <strong>{newPin}</strong>
                    </div>
                  ) : null}

                  {active.attachments?.length ? (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Adjuntos</h3>
                      <div className="mt-2 grid gap-2">
                        {active.attachments.map((url, idx) => (
                          <a key={`${url}-${idx}`} href={url} target="_blank" rel="noreferrer" className="inline-flex w-fit rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                            Ver adjunto {active.attachments && active.attachments.length > 1 ? `#${idx + 1}` : ""}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Timeline (incident_events)</h3>
                    <div className="mt-2 grid gap-2">
                      {active.audit_log.map((row, idx) => (
                        <div key={`${row.at}-${idx}`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">
                          <strong>{new Date(row.at).toLocaleString()}</strong> · {row.action} · {row.actor}
                          {row.actor_email ? ` (${row.actor_email})` : ""}
                          {row.actor_kind ? ` · ${row.actor_kind}` : ""}
                          {row.detail ? ` · ${row.detail}` : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
