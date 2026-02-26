"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type RecordRow = {
  email: string;
  progress: number;
  completed_at?: string;
  completed_units: string[];
  conversation_suggested: boolean;
  internal_signal?: string;
  updated_at: string;
};

type Unit = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  content: string[];
};

export default function StudioOnboardingAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [contentDraft, setContentDraft] = useState("[]");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const sessionRes = await fetch("/api/admin/session", { credentials: "include" });
        const session = await sessionRes.json();
        if (!session.authenticated) {
          router.replace("/studio");
          return;
        }

        const [recordsRes, unitsRes] = await Promise.all([
          fetch("/api/studio/onboarding/admin", { credentials: "include", cache: "no-store" }),
          fetch("/api/studio/onboarding/admin/content", { credentials: "include", cache: "no-store" }),
        ]);

        const recordsData = await recordsRes.json();
        const unitsData = await unitsRes.json();
        if (!recordsRes.ok || !unitsRes.ok) {
          throw new Error(recordsData.error || unitsData.error || "No autorizado para panel onboarding.");
        }

        const records = (recordsData.records || []) as RecordRow[];
        const unitRows = (unitsData.units || []) as Unit[];
        setRows(records);
        setUnits(unitRows);
        setContentDraft(JSON.stringify(unitRows, null, 2));
        setSelectedEmail((prev) => prev || records[0]?.email || "");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo cargar panel onboarding.");
      } finally {
        setLoading(false);
      }
    };

    run().catch(() => undefined);
  }, [router]);

  const filteredRows = useMemo(() => {
    if (statusFilter === "completed") return rows.filter((row) => Boolean(row.completed_at));
    if (statusFilter === "in_progress") return rows.filter((row) => !row.completed_at && row.progress > 0);
    if (statusFilter === "pending") return rows.filter((row) => row.progress === 0);
    return rows;
  }, [rows, statusFilter]);

  const active = filteredRows.find((row) => row.email === selectedEmail) || filteredRows[0];

  function exportCsv() {
    const header = ["email", "progress", "completed_at", "conversation_suggested", "updated_at", "completed_units"];
    const lines = filteredRows.map((row) => [
      row.email,
      String(row.progress),
      row.completed_at || "",
      row.conversation_suggested ? "yes" : "no",
      row.updated_at,
      row.completed_units.join("|")
    ]);
    const csv = [header, ...lines].map((cells) => cells.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onboarding-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function saveContent() {
    setSaving(true);
    setMessage("");
    try {
      const parsed = JSON.parse(contentDraft);
      const res = await fetch("/api/studio/onboarding/admin/content", {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ units: parsed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar contenido.");
      const next = (data.units || []) as Unit[];
      setUnits(next);
      setContentDraft(JSON.stringify(next, null, 2));
      setMessage("Contenido onboarding actualizado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error guardando contenido.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando panel admin onboarding..." /></main>;

  const completedCount = rows.filter((row) => Boolean(row.completed_at)).length;
  const avgProgress = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.progress, 0) / rows.length) : 0;

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h1 className="font-tho-title text-3xl text-slate-950">Panel Admin · Studio Onboarding</h1>
          <p className="mt-2 text-sm text-slate-700">Estado de usuarios, señales internas y editor básico de contenido.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-slate-100 px-2 py-1">Usuarios: {rows.length}</span>
            <span className="rounded-md bg-slate-100 px-2 py-1">Completado: {completedCount}</span>
            <span className="rounded-md bg-slate-100 px-2 py-1">Progreso promedio: {avgProgress}%</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/studio/onboarding" className="rounded-lg border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50">Volver onboarding</Link>
            <button onClick={exportCsv} className="rounded-lg border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50" type="button">Exportar CSV</button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Participantes</h2>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded border border-slate-300 px-2 py-1 text-xs">
                <option value="all">Todos</option>
                <option value="completed">Completados</option>
                <option value="in_progress">En curso</option>
                <option value="pending">Sin iniciar</option>
              </select>
            </div>
            <div className="mt-3 grid max-h-[420px] gap-2 overflow-auto pr-1">
              {filteredRows.map((row) => (
                <button key={row.email} type="button" onClick={() => setSelectedEmail(row.email)} className={`rounded-lg border p-2 text-left ${active?.email === row.email ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}>
                  <div className="text-xs font-semibold text-slate-700">{row.email}</div>
                  <div className="mt-1 text-xs text-slate-500">{row.progress}% · {row.completed_at ? "Completado" : "En curso"}</div>
                </button>
              ))}
              {!filteredRows.length ? <p className="text-xs text-slate-500">No hay resultados para este filtro.</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            {!active ? <p className="text-sm text-slate-600">Selecciona un usuario para ver detalle.</p> : (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">{active.email}</h3>
                <p className="text-sm text-slate-700">Estado: {active.completed_at ? "Completado" : "En curso"} · {active.progress}%</p>
                <p className="text-sm text-slate-700">Señal interna: {active.conversation_suggested ? "Conversación sugerida" : "Sin señal"}</p>
                <p className="text-xs text-slate-500">Recomendación automática: {active.progress < 50 ? "Sugerir conversación de alineación temprana." : active.completed_at ? "Alineación base lograda, mantener seguimiento normal." : "Reforzar expectativas y cierre de módulos."}</p>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Unidades completadas</h4>
                  <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                    {active.completed_units.map((unit) => <li key={unit}>{unit}</li>)}
                    {!active.completed_units.length ? <li>Sin avances todavía.</li> : null}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Editor básico de contenido (JSON)</h2>
          <p className="mt-1 text-xs text-slate-500">Iteración inicial para evitar tocar código: editable por admin desde panel.</p>
          <textarea value={contentDraft} onChange={(e) => setContentDraft(e.target.value)} rows={14} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs" />
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={saveContent} disabled={saving} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">Guardar contenido</button>
            <span className="self-center text-xs text-slate-500">Unidades activas: {units.length}</span>
          </div>
        </section>

        {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      </div>
    </main>
  );
}
