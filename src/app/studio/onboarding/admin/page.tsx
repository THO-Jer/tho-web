"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";
import { topicReviewLabel } from "@/content/onboarding/lessonGuides";
import { resolveVisibleModules } from "@/lib/onboarding";

type ModuleStatus = { moduleKey: string; status: string; attempts: number; maxAttempts: number };
type RecordRow = {
  email: string;
  track: string;
  progress: number;
  completed_at?: string;
  completed_units: string[];
  updated_at: string;
  module_status?: ModuleStatus[];
};

type Attempt = { module_key: string; score: number; max_score: number; submitted_at: string; missed_topics?: string[]; passed?: boolean };
type Config = { passScore: number };

type ModuleCatalogItem = { key: string; title: string; slug: string };
type Branch = { id: string; label: string; modules: string[] };
type UserOverride = { mode: "inherit" | "branch" | "custom"; branchId?: string; modules?: string[] };
type Visibility = { branches: Branch[]; userOverrides: Record<string, UserOverride> };

const EMPTY_VISIBILITY: Visibility = { branches: [], userOverrides: {} };

export default function StudioOnboardingAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [config, setConfig] = useState<Config>({ passScore: 80 });
  const [selectedEmail, setSelectedEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(EMPTY_VISIBILITY);
  const [moduleCatalog, setModuleCatalog] = useState<ModuleCatalogItem[]>([]);
  const [newBranchId, setNewBranchId] = useState("");
  const [newBranchLabel, setNewBranchLabel] = useState("");

  async function reloadAdminData() {
    const recordsRes = await fetch("/api/studio/onboarding/admin", { credentials: "include", cache: "no-store" });
    const recordsData = await recordsRes.json();
    if (!recordsRes.ok) throw new Error(recordsData.error || "No autorizado.");

    const nextRows = (recordsData.records || []) as RecordRow[];
    setRows(nextRows);
    setModuleCatalog((recordsData.moduleCatalog || []) as ModuleCatalogItem[]);
    if (recordsData.config?.passScore) setConfig({ passScore: Number(recordsData.config.passScore) });
    const vis = recordsData.visibility as Visibility | undefined;
    if (vis && Array.isArray(vis.branches)) {
      setVisibility({ branches: vis.branches, userOverrides: vis.userOverrides || {} });
    }
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

  const moduleKeys = useMemo(() => moduleCatalog.map((module) => module.key), [moduleCatalog]);

  // Resolución (espejo de la lógica del servidor) para previsualizar qué módulos verá un usuario.
  function resolveModules(email: string, track: string): string[] {
    return resolveVisibleModules(email, track, visibility, moduleKeys);
  }

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

  async function saveVisibility() {
    setSavingVisibility(true);
    setMessage("");
    try {
      const res = await fetch("/api/studio/onboarding/admin", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "save_module_visibility", visibility }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar la visibilidad.");
      if (data.visibility) setVisibility({ branches: data.visibility.branches || [], userOverrides: data.visibility.userOverrides || {} });
      setMessage("Visibilidad de módulos guardada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar la visibilidad.");
    } finally {
      setSavingVisibility(false);
    }
  }

  function updateBranch(branchId: string, patch: Partial<Branch>) {
    setVisibility((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) => (branch.id === branchId ? { ...branch, ...patch } : branch)),
    }));
  }

  function toggleBranchModule(branchId: string, key: string) {
    setVisibility((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) => {
        if (branch.id !== branchId) return branch;
        const has = branch.modules.includes(key);
        return { ...branch, modules: has ? branch.modules.filter((m) => m !== key) : [...branch.modules, key] };
      }),
    }));
  }

  function removeBranch(branchId: string) {
    if (branchId === "general") return;
    setVisibility((prev) => {
      const userOverrides = { ...prev.userOverrides };
      // Limpia overrides que apuntaban a la rama eliminada.
      for (const [email, override] of Object.entries(userOverrides)) {
        if (override.mode === "branch" && override.branchId === branchId) delete userOverrides[email];
      }
      return { branches: prev.branches.filter((branch) => branch.id !== branchId), userOverrides };
    });
  }

  function addBranch() {
    const id = newBranchId.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
    if (!id) return setMessage("Indica un identificador para la rama (ej. producto).");
    if (visibility.branches.some((branch) => branch.id === id)) return setMessage(`La rama "${id}" ya existe.`);
    setVisibility((prev) => ({
      ...prev,
      branches: [...prev.branches, { id, label: newBranchLabel.trim() || id, modules: [] }],
    }));
    setNewBranchId("");
    setNewBranchLabel("");
    setMessage("");
  }

  function setOverride(email: string, next: UserOverride) {
    const key = email.trim().toLowerCase();
    setVisibility((prev) => {
      const userOverrides = { ...prev.userOverrides };
      if (next.mode === "inherit") delete userOverrides[key];
      else userOverrides[key] = next;
      return { ...prev, userOverrides };
    });
  }

  function attemptPassed(attempt: Attempt): boolean {
    if (typeof attempt.passed === "boolean") return attempt.passed;
    if (!attempt.max_score) return false;
    return Math.round((attempt.score / attempt.max_score) * 100) >= config.passScore;
  }

  const completedCount = rows.filter((row) => Boolean(row.completed_at)).length;
  const avgProgress = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.progress, 0) / rows.length) : 0;

  if (loading) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando panel admin onboarding..." /></main>;

  const activeOverride: UserOverride = active ? (visibility.userOverrides[active.email] || { mode: "inherit" }) : { mode: "inherit" };
  const activeModules = active ? resolveModules(active.email, active.track) : [];

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

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-tho-title text-2xl text-slate-950">Visibilidad de módulos</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Define qué módulos ve cada rama de la organización. Cada usuario hereda los módulos de su rama,
                y abajo puedes hacer excepciones puntuales por usuario.
              </p>
            </div>
            <button
              type="button"
              onClick={saveVisibility}
              disabled={savingVisibility}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {savingVisibility ? "Guardando..." : "Guardar visibilidad"}
            </button>
          </div>

          {!moduleCatalog.length ? (
            <p className="mt-4 text-sm text-slate-600">No hay módulos en el catálogo todavía.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {visibility.branches.map((branch) => (
                <div key={branch.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={branch.label}
                        onChange={(event) => updateBranch(branch.id, { label: event.target.value })}
                        className="rounded border border-slate-300 px-2 py-1 text-sm font-semibold text-slate-900"
                        aria-label={`Nombre de la rama ${branch.id}`}
                      />
                      <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{branch.id}</code>
                    </div>
                    {branch.id === "general" ? (
                      <span className="text-xs text-slate-400">Rama base (no se elimina)</span>
                    ) : (
                      <button type="button" onClick={() => removeBranch(branch.id)} className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50">
                        Eliminar rama
                      </button>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {moduleCatalog.map((module) => {
                      const checked = branch.modules.includes(module.key);
                      return (
                        <label
                          key={`${branch.id}-${module.key}`}
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${checked ? "border-slate-900 bg-slate-50 text-slate-900" : "border-slate-200 text-slate-600"}`}
                        >
                          <input type="checkbox" checked={checked} onChange={() => toggleBranchModule(branch.id, module.key)} />
                          <span className="font-semibold">Módulo {module.key}</span>
                          <span className="text-slate-500">· {module.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-dashed border-slate-300 p-4">
                <h3 className="text-sm font-semibold text-slate-800">Agregar rama nueva</h3>
                <p className="mt-1 text-xs text-slate-500">El identificador debe coincidir con el campo <code>team</code> de la tabla de roles para asignarla automáticamente.</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    value={newBranchId}
                    onChange={(event) => setNewBranchId(event.target.value)}
                    placeholder="identificador (ej. producto)"
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                  />
                  <input
                    value={newBranchLabel}
                    onChange={(event) => setNewBranchLabel(event.target.value)}
                    placeholder="Nombre visible (ej. Producto)"
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                  />
                  <button type="button" onClick={addBranch} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">
                    Agregar rama
                  </button>
                </div>
              </div>
            </div>
          )}
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

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                  <h4 className="text-sm font-semibold text-slate-800">Visibilidad de módulos del usuario</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Módulos que verá hoy: <strong>{activeModules.length ? activeModules.join(", ") : "ninguno"}</strong>.
                    Recuerda usar “Guardar visibilidad” para aplicar cambios.
                  </p>
                  <div className="mt-2 grid gap-1 text-sm text-slate-700">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="override-mode"
                        checked={activeOverride.mode === "inherit"}
                        onChange={() => setOverride(active.email, { mode: "inherit" })}
                      />
                      Heredar de su rama ({active.track})
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="override-mode"
                        checked={activeOverride.mode === "branch"}
                        onChange={() => setOverride(active.email, { mode: "branch", branchId: activeOverride.branchId || visibility.branches[0]?.id || "general" })}
                      />
                      Asignar otra rama
                    </label>
                    {activeOverride.mode === "branch" ? (
                      <select
                        value={activeOverride.branchId || ""}
                        onChange={(event) => setOverride(active.email, { mode: "branch", branchId: event.target.value })}
                        className="ml-6 w-fit rounded border border-slate-300 px-2 py-1 text-xs"
                      >
                        {visibility.branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>{branch.label} ({branch.id})</option>
                        ))}
                      </select>
                    ) : null}
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="override-mode"
                        checked={activeOverride.mode === "custom"}
                        onChange={() => setOverride(active.email, { mode: "custom", modules: activeModules })}
                      />
                      Personalizar módulos
                    </label>
                    {activeOverride.mode === "custom" ? (
                      <div className="ml-6 flex flex-wrap gap-2">
                        {moduleCatalog.map((module) => {
                          const checked = (activeOverride.modules || []).includes(module.key);
                          return (
                            <label key={`ov-${module.key}`} className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-xs ${checked ? "border-slate-900 bg-white text-slate-900" : "border-slate-200 text-slate-600"}`}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const current = activeOverride.modules || [];
                                  const next = checked ? current.filter((m) => m !== module.key) : [...current, module.key];
                                  setOverride(active.email, { mode: "custom", modules: next });
                                }}
                              />
                              Módulo {module.key}
                            </label>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Estado por módulo</h4>
                  <ul className="mt-1 space-y-2 text-sm text-slate-700">
                    {(active.module_status || []).map((module) => {
                      const lessonsDone = active.completed_units
                        .filter((u) => u.startsWith(`${module.moduleKey}:`))
                        .map((u) => u.split(":")[1]);
                      return (
                        <li key={module.moduleKey} className="rounded border border-slate-200 px-3 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">Módulo {module.moduleKey}: {module.status} · intentos {module.attempts}/{module.maxAttempts}</span>
                            <button type="button" onClick={() => resetModule(module.moduleKey)} disabled={saving} className="rounded border border-slate-300 px-2 py-1 text-xs">Reset</button>
                          </div>
                          {lessonsDone.length > 0 ? (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {lessonsDone.map((id) => (
                                <span key={id} className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">{id}</span>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-1 text-xs text-slate-400">Sin lecciones completadas.</p>
                          )}
                        </li>
                      );
                    })}
                    {!(active.module_status || []).length ? <li className="text-xs text-slate-500">Sin módulos asignados.</li> : null}
                  </ul>
                </div>
                {/* Temas débiles: tópicos fallados en al menos un intento no aprobado */}
                {(() => {
                  const failedTopics = Array.from(
                    new Set(
                      attempts
                        .filter((a) => !attemptPassed(a))
                        .flatMap((a) => a.missed_topics || [])
                    )
                  );
                  if (!failedTopics.length) return null;
                  return (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <h4 className="text-sm font-semibold text-amber-900">Temas con errores (intentos fallidos)</h4>
                      <p className="mt-1 text-xs text-amber-700">Tópicos donde este usuario ha respondido incorrectamente al menos una vez sin aprobar el módulo.</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {failedTopics.map((topic) => (
                          <span key={topic} className="rounded-md bg-amber-100 border border-amber-200 px-2 py-0.5 text-xs text-amber-900">
                            {topicReviewLabel[topic] || topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Histórico de intentos</h4>
                  <div className="mt-1 max-h-64 space-y-2 overflow-auto">
                    {attempts.map((attempt, idx) => (
                      <div key={`${attempt.module_key}-${attempt.submitted_at}-${idx}`} className="rounded-lg border border-slate-200 p-2.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800">
                            Módulo {attempt.module_key} · {attempt.score}/{attempt.max_score} pts
                          </span>
                          <span className={`rounded px-1.5 py-0.5 font-semibold ${attemptPassed(attempt) ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {attemptPassed(attempt) ? "Aprobado" : "No aprobado"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-slate-500">{new Date(attempt.submitted_at).toLocaleString("es-CL")}</p>
                        {(attempt.missed_topics || []).length > 0 && (
                          <div className="mt-1.5">
                            <span className="text-slate-500">Errores: </span>
                            <span className="text-rose-700">
                              {(attempt.missed_topics || []).map((t) => topicReviewLabel[t] || t).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    {!attempts.length ? <p className="text-xs text-slate-500">Sin intentos registrados.</p> : null}
                  </div>
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
