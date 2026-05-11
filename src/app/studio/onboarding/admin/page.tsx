"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type ModuleStatus = { moduleKey: string; status: string; attempts: number; maxAttempts: number };
type RecordRow = {
  email: string;
  track: "sales" | "creative_ops" | "advisory_ops" | "general";
  progress: number;
  completed_at?: string;
  completed_units: string[];
  updated_at: string;
  module_status?: ModuleStatus[];
};

type Attempt = { module_key: string; score: number; max_score: number; submitted_at: string; missed_topics?: string[]; passed?: boolean };

export default function StudioOnboardingAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [message, setMessage] = useState("");

  async function reloadAdminData() {
    const recordsRes = await fetch("/api/studio/onboarding/admin", { credentials: "include", cache: "no-store" });
    const recordsData = await recordsRes.json();
    if (!recordsRes.ok) throw new Error(recordsData.error || "No autorizado.");

    const nextRows = (recordsData.records || []) as RecordRow[];
    setRows(nextRows);
    const first = nextRows[0]?.email || "";
    setSelectedEmail((prev) => {
      if (!nextRows.length) return "";
      if (prev && nextRows.some((row) => row.email === prev)) return prev;
      return first;
    });
  }

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const sessionRes = await fetch("/api/admin/session", { credentials: "include" });
        const session = await sessionRes.json();
        if (!session.authenticated) return router.replace("/studio");
        await reloadAdminData();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo cargar panel onboarding.");
      } finally {
        setLoading(false);
      }
    };
    run().catch(() => undefined);
  }, [router]);

  const active = rows.find((row) => row.email === selectedEmail) || rows[0];

  useEffect(() => {
    const target = rows.find((row) => row.email === selectedEmail) || rows[0];
    const loadAttempts = async () => {
      if (!target) return;
      const res = await fetch(`/api/studio/onboarding/admin?email=${encodeURIComponent(target.email)}&track=${encodeURIComponent(target.track)}`, { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (res.ok) setAttempts((data.attempts || []) as Attempt[]);
    };
    loadAttempts().catch(() => undefined);
  }, [rows, selectedEmail]);

  async function resetModule(moduleKey: string) {
    if (!active) return;
    setSaving(true);
    try {
      const res = await fetch("/api/studio/onboarding/admin", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "reset_module", email: active.email, track: active.track, moduleKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo resetear módulo.");
      await reloadAdminData();
      setMessage(`Módulo ${moduleKey} reseteado para ${active.email}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo resetear módulo.");
    } finally {
      setSaving(false);
    }
  }

  const completedCount = rows.filter((row) => Boolean(row.completed_at)).length;
  const avgProgress = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.progress, 0) / rows.length) : 0;

  if (loading) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando panel admin onboarding..." /></main>;

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h1 className="font-tho-title text-3xl text-slate-950">Panel Admin · Studio Onboarding</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-slate-100 px-2 py-1">Usuarios: {rows.length}</span>
            <span className="rounded-md bg-slate-100 px-2 py-1">Completado: {completedCount}</span>
            <span className="rounded-md bg-slate-100 px-2 py-1">Progreso promedio: {avgProgress}%</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/studio/onboarding" className="rounded-lg border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50">Volver onboarding</Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">Participantes</h2>
            <div className="mt-3 grid max-h-[420px] gap-2 overflow-auto pr-1">
              {rows.map((row) => (
                <button key={row.email} type="button" onClick={() => setSelectedEmail(row.email)} className={`rounded-lg border p-2 text-left ${active?.email === row.email ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}>
                  <div className="text-xs font-semibold text-slate-700">{row.email}</div>
                  <div className="mt-1 text-xs text-slate-500">{row.track} · {row.progress}%</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            {!active ? <p className="text-sm text-slate-600">Selecciona un usuario.</p> : (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">{active.email}</h3>
                <p className="text-sm text-slate-700">Track: {active.track} · Progreso: {active.progress}%</p>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Estado por módulo</h4>
                  <ul className="mt-1 space-y-2 text-sm text-slate-700">
                    {(active.module_status || []).map((module) => (
                      <li key={module.moduleKey} className="flex items-center justify-between gap-2 rounded border border-slate-200 px-3 py-2">
                        <span>{module.moduleKey}: {module.status} · intentos {module.attempts}/{module.maxAttempts}</span>
                        <button type="button" onClick={() => resetModule(module.moduleKey)} disabled={saving} className="rounded border border-slate-300 px-2 py-1 text-xs">Reset</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Histórico de intentos</h4>
                  <ul className="mt-1 max-h-40 space-y-1 overflow-auto text-xs text-slate-600">
                    {attempts.map((attempt, idx) => (
                      <li key={`${attempt.module_key}-${attempt.submitted_at}-${idx}`}>
                        {attempt.submitted_at} · Módulo {attempt.module_key} · {attempt.score}/{attempt.max_score} {attempt.passed ? "(aprobado)" : ""}
                      </li>
                    ))}
                    {!attempts.length ? <li>Sin intentos registrados.</li> : null}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      </div>
    </main>
  );
}
