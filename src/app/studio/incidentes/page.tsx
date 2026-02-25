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
  attachment_url?: string;
  status: "Recibido" | "En revisión" | "Derivado" | "Cerrado";
  urgency_level: "Bajo" | "Medio" | "Alto";
  suggested_action: string;
  director_notes?: string;
  created_at: string;
  last_updated_at: string;
  audit_log: Array<{ at: string; actor: string; action: string; detail?: string }>;
};

const STATUSES: Incident["status"][] = ["Recibido", "En revisión", "Derivado", "Cerrado"];

export default function StudioIncidentesPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || !data.permissions?.canIncidents) {
          router.replace("/studio");
          return;
        }
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setChecking(false));
  }, [router]);

  const loadIncidents = useCallback(async () => {
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
  }, []);

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
    if (!active) return;
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

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Canal Confidencial · Panel Director</h1>
            <p className="mt-2 text-sm text-slate-600">Gestión estratégica y trazabilidad de incidentes reportados.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver al Studio</Link>
            <Link href="/canal-confidencial" target="_blank" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Abrir formulario público</Link>
          </div>
        </div>

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
                  <div className="text-[11px] text-slate-500">{item.tracking_code}</div>
                  <div className="text-xs text-slate-600">{item.type} · {new Date(item.created_at).toLocaleDateString()}</div>
                </button>
              ))}
              {!visible.length ? <p className="text-sm text-slate-500">No hay incidentes para este filtro.</p> : null}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            {!active ? (
              <p className="text-sm text-slate-500">Selecciona un caso para ver detalle.</p>
            ) : (
              <div className="grid gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caso {active.case_code}</div>
                  <h3 className="text-2xl font-semibold text-slate-900">{active.type}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{active.description}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                    <div><strong>Fecha incidente:</strong> {active.event_date}</div>
                    <div><strong>Anonimato:</strong> {active.anonymous ? "Sí" : "No"}</div>
                    <div><strong>Contacto:</strong> {active.reporter_email || "No informado"}</div>
                    {active.attachment_url ? <div><strong>Evidencia:</strong> <a href={active.attachment_url} target="_blank" rel="noreferrer" className="underline">Abrir archivo</a></div> : null}
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                    <div><strong>Urgencia sugerida:</strong> {active.urgency_level}</div>
                    <div className="mt-1"><strong>Sugerencia:</strong> {active.suggested_action}</div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-semibold text-slate-600">Estado</span>
                    <select id="director_status" defaultValue={active.status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1 sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-600">Notas del Director</span>
                    <textarea id="director_notes" defaultValue={active.director_notes || ""} rows={4} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </label>
                </div>

                <button onClick={onSaveCase} disabled={loading} type="button" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>

                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Bitácora</h4>
                  <ul className="mt-2 grid gap-2">
                    {active.audit_log.map((item, i) => (
                      <li key={`${item.at}-${i}`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">
                        <strong>{new Date(item.at).toLocaleString()}</strong> · {item.actor} · {item.action}{item.detail ? ` · ${item.detail}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
          </section>
        </div>
      </div>
    </main>
  );
}
