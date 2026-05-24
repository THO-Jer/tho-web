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
  onboarding?: { completed?: boolean; can_access?: { incidents?: boolean } };
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
const PROCESS_PHASES = ["", "Admisibilidad", "Revisión", "Medidas", "Cierre"] as const;

const URGENCY_BADGE: Record<Incident["urgency_level"], string> = {
  Alto: "bg-red-100 text-red-800 border-red-200",
  Medio: "bg-amber-100 text-amber-800 border-amber-200",
  Bajo: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

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

export default function CanalConfidencialPanelPage() {
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
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [confirmAction, setConfirmAction] = useState<"reset_pin" | "mark_no_atendible" | null>(null);

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
            const canAccess = onboarding?.onboarding?.can_access || {};
            const moduleAllowed = Boolean(canAccess.incidents);
            setBlockedByOnboarding((required && blockInternal && !completed) || !moduleAllowed);
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
    return incidents.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (urgencyFilter !== "all" && item.urgency_level !== urgencyFilter) return false;
      return true;
    });
  }, [incidents, statusFilter, urgencyFilter]);

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

  function requestAction(action: "mark_no_atendible" | "reset_pin") {
    setConfirmAction(action);
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
            <Link href="/studio/canal-confidencial" className="rounded-lg border border-amber-400 px-4 py-2 text-sm text-amber-900">Volver al Canal</Link>
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
            <Link href="/studio/canal-confidencial" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver al Canal</Link>
            <Link href="/studio/canal-confidencial/reportar" target="_blank" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Abrir formulario</Link>
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
              </div>
              <div className="mt-2 flex gap-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs">
                  <option value="all">Todos los estados</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs">
                  <option value="all">Toda urgencia</option>
                  {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase text-slate-500">{item.status}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${URGENCY_BADGE[item.urgency_level]}`}>{item.urgency_level}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{item.case_code}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-slate-600">{item.description}</div>
                  </button>
                ))}
                {!visible.length ? <p className="text-sm text-slate-500">No hay casos para este filtro.</p> : null}
              </div>
            </section>

            <section className="grid gap-4 overflow-auto">
              {!active || !triage ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Selecciona un caso de la lista para ver el detalle.</p>
                </div>
              ) : (
                <>
                  {/* ── Cabecera del caso ── */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{active.case_code}</h2>
                        <p className="mt-0.5 text-xs text-slate-400">Seguimiento: {active.tracking_code}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${URGENCY_BADGE[active.urgency_level]}`}>{active.urgency_level}</span>
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{active.status}</span>
                        <button
                          type="button"
                          onClick={() => window.open(`/studio/canal-confidencial/panel/print/${active.id}`, "_blank")}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                        >
                          Exportar PDF
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                      <div><span className="font-semibold">Tipo:</span> {active.type}</div>
                      <div><span className="font-semibold">Fecha del evento:</span> {active.event_date}</div>
                      <div><span className="font-semibold">Modalidad:</span> {active.anonymous ? "Anónimo" : "Identificado"}</div>
                      <div><span className="font-semibold">Contacto:</span> {active.reporter_email || "No informado"}</div>
                      <div><span className="font-semibold">Fase actual:</span> {active.process_phase || "—"}</div>
                      <div><span className="font-semibold">Actualizado:</span> {new Date(active.last_updated_at).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* ── Relato original ── */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Relato original</h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{active.description}</p>
                  </div>

                  {/* ── Triage del comité ── */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Triage del comité</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1">
                        <span className="text-xs font-semibold text-slate-600">Estado</span>
                        <select value={triage.status} onChange={(e) => setTriage((prev) => prev ? { ...prev, status: e.target.value as Incident["status"] } : prev)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-1">
                        <span className="text-xs font-semibold text-slate-600">Fase del proceso</span>
                        <select value={triage.process_phase} onChange={(e) => setTriage((prev) => prev ? { ...prev, process_phase: e.target.value } : prev)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                          {PROCESS_PHASES.map((phase) => <option key={phase} value={phase}>{phase || "— Sin fase —"}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-1">
                        <span className="text-xs font-semibold text-slate-600">Urgencia</span>
                        <select value={triage.urgency_level} onChange={(e) => setTriage((prev) => prev ? { ...prev, urgency_level: e.target.value as Incident["urgency_level"] } : prev)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                          {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-1">
                        <span className="text-xs font-semibold text-slate-600">Responsable comité</span>
                        <input value={triage.director_only_notes} onChange={(e) => setTriage((prev) => prev ? { ...prev, director_only_notes: e.target.value } : prev)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="nombre o correo" />
                      </label>
                      <label className="grid gap-1 sm:col-span-2">
                        <span className="text-xs font-semibold text-slate-600">Notas internas</span>
                        <textarea value={triage.director_notes} onChange={(e) => setTriage((prev) => prev ? { ...prev, director_notes: e.target.value } : prev)} rows={4} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                      </label>
                    </div>
                    <div className="mt-3">
                      <button type="button" onClick={saveTriage} disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        Guardar triage
                      </button>
                    </div>
                  </div>

                  {/* ── Acciones del comité ── */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Acciones del comité</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => runAction("mark_atendible")} disabled={loading} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
                        Marcar atendible
                      </button>
                      <button type="button" onClick={() => requestAction("mark_no_atendible")} disabled={loading} className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100">
                        Marcar no atendible
                      </button>
                      <button type="button" onClick={() => requestAction("reset_pin")} disabled={loading} className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800 hover:bg-rose-100">
                        Resetear PIN
                      </button>
                      <button type="button" onClick={() => loadIncidents()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50" disabled={loading}>
                        Recargar
                      </button>
                    </div>

                    {!active.anonymous ? (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold text-slate-600">Solicitar información adicional</p>
                        <textarea value={requestInfoText} onChange={(e) => setRequestInfoText(e.target.value)} rows={3} placeholder="Detalle de la información requerida" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <button type="button" onClick={() => runAction("request_info")} disabled={loading} className="mt-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                          Enviar solicitud
                        </button>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-slate-400">Caso anónimo: no se puede solicitar información adicional por contacto directo.</p>
                    )}

                    {message ? (
                      <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">{message}</p>
                    ) : null}
                    {newPin ? (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                        Nuevo PIN (mostrar una sola vez): <strong>{newPin}</strong>
                      </div>
                    ) : null}
                  </div>

                  {/* ── Adjuntos ── */}
                  {active.attachments?.length ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Adjuntos ({active.attachments.length})</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {active.attachments.map((url, idx) => (
                          <a key={`${url}-${idx}`} href={url} target="_blank" rel="noreferrer" className="inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                            Ver adjunto {active.attachments && active.attachments.length > 1 ? `#${idx + 1}` : ""}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* ── Timeline ── */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Timeline ({active.audit_log.length} eventos)</h3>
                    <div className="mt-3 space-y-3">
                      {active.audit_log.map((row, idx) => (
                        <div key={`${row.at}-${idx}`} className="flex gap-3">
                          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-300" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">{row.action}</p>
                            {row.detail ? <p className="mt-0.5 text-sm text-slate-600">{row.detail}</p> : null}
                            <p className="mt-0.5 text-xs text-slate-400">
                              {new Date(row.at).toLocaleString()} · {row.actor}
                              {row.actor_email ? ` (${row.actor_email})` : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        ) : null}
      </div>

      {confirmAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              {confirmAction === "reset_pin" ? "¿Resetear PIN?" : "¿Marcar como no atendible?"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {confirmAction === "reset_pin"
                ? "Se generará un nuevo PIN. El anterior quedará inválido. Esta acción no se puede deshacer."
                : "El caso quedará marcado como no atendible. Esta acción quedará registrada en el timeline."}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const action = confirmAction;
                  setConfirmAction(null);
                  await runAction(action);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${confirmAction === "reset_pin" ? "bg-rose-700 hover:bg-rose-800" : "bg-amber-700 hover:bg-amber-800"}`}
              >
                {confirmAction === "reset_pin" ? "Sí, resetear" : "Sí, marcar no atendible"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
