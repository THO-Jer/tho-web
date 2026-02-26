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
  suggested_action: string;
  director_notes?: string;
  created_at: string;
  last_updated_at: string;
  audit_log: Array<{ at: string; actor: string; action: string; detail?: string }>;
};

type SessionData = {
  authenticated: boolean;
  canManageAccess?: boolean;
  role?: string;
  permissions?: { canIncidents?: boolean };
};

const STATUSES: Incident["status"][] = ["Recibido", "En revisión", "Derivado", "Cerrado"];

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
        <Link href="/canal-confidencial" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
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
  const [canManage, setCanManage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data: SessionData) => {
        if (!data.authenticated || !data.permissions?.canIncidents) {
          router.replace("/studio");
          return;
        }
        setCanManage(Boolean(data.canManageAccess));
        setRole(String(data.role || ""));
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setChecking(false));
  }, [router]);

  const loadIncidents = useCallback(async () => {
    if (!canManage || previewMode) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/incidents", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cargar incidentes.");
      const rows = (data.incidents || []) as Incident[];
      setIncidents(rows);
      setActiveId((prev) => prev || rows[0]?.id || "");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error cargando incidentes.");
    } finally {
      setLoading(false);
    }
  }, [canManage, previewMode]);

  useEffect(() => {
    if (checking) return;
    loadIncidents().catch(() => undefined);
  }, [checking, loadIncidents]);

  const visible = useMemo(() => {
    if (statusFilter === "all") return incidents;
    return incidents.filter((item) => item.status === statusFilter);
  }, [incidents, statusFilter]);

  const active = visible.find((item) => item.id === activeId) || visible[0];

  async function onSaveCase() {
    if (!active || !canManage || previewMode) return;
    setLoading(true);
    setMessage("");
    try {
      const notes = (document.getElementById("director_notes") as HTMLTextAreaElement | null)?.value || "";
      const status = (document.getElementById("director_status") as HTMLSelectElement | null)?.value || active.status;

      const res = await fetch(`/api/admin/incidents/${active.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, director_notes: notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      setMessage("Caso actualizado.");
      await loadIncidents();
      setActiveId(active.id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error actualizando caso.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando Canal Confidencial..." /></main>;

  const showDirectorPanel = canManage && !previewMode;

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Canal Confidencial</h1>
            <p className="mt-2 text-sm text-slate-600">
              {showDirectorPanel ? "Panel Director: gestión estratégica y trazabilidad de incidentes reportados." : "Vista colaborador: información, orientación y acceso al reporte/seguimiento."}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver al Studio</Link>
            <Link href="/canal-confidencial" target="_blank" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Abrir formulario público</Link>
            {canManage ? (
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setPreviewMode((v) => !v)}
              >
                {previewMode ? "Volver a vista director" : "Preview vista colaborador"}
              </button>
            ) : null}
          </div>
        </div>

        {!showDirectorPanel ? <CollaboratorView /> : null}

        {showDirectorPanel ? (
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
              {!active ? <p className="text-sm text-slate-600">Selecciona un caso para ver detalle.</p> : (
                <div className="grid gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{active.case_code}</h2>
                    <div className="mt-1 text-xs text-slate-500">Tracking: {active.tracking_code}</div>
                  </div>

                  <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
                    <div><strong>Tipo:</strong> {active.type}</div>
                    <div><strong>Fecha evento:</strong> {active.event_date}</div>
                    <div><strong>Estado:</strong> {active.status}</div>
                    <div><strong>Urgencia:</strong> {active.urgency_level}</div>
                    <div><strong>Anónimo:</strong> {active.anonymous ? "Sí" : "No"}</div>
                    <div><strong>Contacto:</strong> {active.reporter_email || "No informado"}</div>
                    <div><strong>Creado:</strong> {new Date(active.created_at).toLocaleString()}</div>
                    <div><strong>Actualizado:</strong> {new Date(active.last_updated_at).toLocaleString()}</div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Descripción</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{active.description}</p>
                  </div>

                  {role === "superadmin" ? (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Sugerencia automática (solo director)</h3>
                      <p className="mt-1 text-sm text-slate-700">{active.suggested_action}</p>
                    </div>
                  ) : null}

                  {active.attachments?.length ? (
                    <div className="grid gap-2">
                      {active.attachments.map((url, idx) => (
                        <a key={`${url}-${idx}`} href={url} target="_blank" rel="noreferrer" className="inline-flex w-fit rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                          Ver evidencia adjunta {active.attachments && active.attachments.length > 1 ? `#${idx + 1}` : ""}
                        </a>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-600">Estado director</span>
                      <select id="director_status" defaultValue={active.status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                        {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-600">Notas director</span>
                      <textarea id="director_notes" defaultValue={active.director_notes || ""} rows={4} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onSaveCase()} disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      Guardar cambios
                    </button>
                    <button type="button" onClick={() => loadIncidents()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50" disabled={loading}>
                      Recargar
                    </button>
                  </div>

                  {message ? <p className="text-sm text-slate-600">{message}</p> : null}

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Auditoría</h3>
                    <div className="mt-2 grid gap-2">
                      {active.audit_log.map((row, idx) => (
                        <div key={`${row.at}-${idx}`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">
                          <strong>{new Date(row.at).toLocaleString()}</strong> · {row.actor} · {row.action}{row.detail ? ` · ${row.detail}` : ""}
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
