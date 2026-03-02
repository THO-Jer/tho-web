"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type LoginLog = { at: string; email: string; provider: string; ip?: string };
type Permissions = { canBlog: boolean; canCrm: boolean; canIncidents: boolean; canOnboarding: boolean };
type Team = "sales" | "creative_ops" | "advisory_ops" | "general";

type AuthorizedUser = {
  email: string;
  provider: "google" | "azure" | "any";
  active: boolean;
  permissions: Permissions;
  updatedAt: string;
  role?: string;
  team?: Team;
};
type AccessRequest = {
  id: string;
  email: string;
  provider: "google" | "azure" | "any" | "unknown";
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  resolvedAt?: string;
};

type AuditIssue = {
  id: string;
  module: "access" | "onboarding" | "incidents";
  severity: "error" | "warning";
  message: string;
  fixSql?: string;
};

type RowEditorState = {
  provider: "google" | "azure" | "any";
  team: Team;
  canBlog: boolean;
  canCrm: boolean;
  canIncidents: boolean;
  canOnboarding: boolean;
};

export default function StudioAccesosPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [authorized, setAuthorized] = useState<AuthorizedUser[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [rowEditors, setRowEditors] = useState<Record<string, RowEditorState>>({});
  const [emailInput, setEmailInput] = useState("");
  const [grantProvider, setGrantProvider] = useState<"google" | "azure" | "any">("google");
  const [grantTeam, setGrantTeam] = useState<Team>("general");
  const [grantBlog, setGrantBlog] = useState(true);
  const [grantCrm, setGrantCrm] = useState(true);
  const [grantIncidents, setGrantIncidents] = useState(false);
  const [grantOnboarding, setGrantOnboarding] = useState(true);
  const [message, setMessage] = useState("");
  const [auditIssues, setAuditIssues] = useState<AuditIssue[]>([]);
  const [auditCheckedAt, setAuditCheckedAt] = useState("");
  const [auditLoading, setAuditLoading] = useState(false);

  function hydrateEditors(users: AuthorizedUser[]) {
    const next: Record<string, RowEditorState> = {};
    for (const user of users) {
      next[user.email] = {
        provider: user.provider,
        team: user.team || "general",
        canBlog: Boolean(user.permissions?.canBlog),
        canCrm: Boolean(user.permissions?.canCrm),
        canIncidents: Boolean(user.permissions?.canIncidents),
        canOnboarding: user.permissions?.canOnboarding !== false,
      };
    }
    setRowEditors(next);
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/access-control", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cargar control de accesos.");
      const users = (data.authorizedUsers || []) as AuthorizedUser[];
      setBlocked(data.blockedEmails || []);
      setLogs(data.logs || []);
      setAuthorized(users);
      setRequests(data.accessRequests || []);
      hydrateEditors(users);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error cargando datos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || !data.canManageAccess) {
          router.replace("/studio");
          return;
        }
        loadData().catch(() => undefined);
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setChecking(false));
  }, [router, loadData]);

  async function onAction(action: "block" | "unblock" | "grant" | "revoke" | "approve_request" | "reject_request", email: string, requestId?: string, override?: RowEditorState) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/access-control", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action,
          email,
          requestId,
          provider: override?.provider || grantProvider,
          team: override?.team || grantTeam,
          permissions: {
            canBlog: override?.canBlog ?? grantBlog,
            canCrm: override?.canCrm ?? grantCrm,
            canIncidents: override?.canIncidents ?? grantIncidents,
            canOnboarding: override?.canOnboarding ?? grantOnboarding,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo actualizar.");

      if (data.blockedEmails) setBlocked(data.blockedEmails);
      if (data.authorizedUsers) {
        setAuthorized(data.authorizedUsers);
        hydrateEditors(data.authorizedUsers);
      }
      if (data.accessRequests) setRequests(data.accessRequests);

      if (action === "grant") {
        setMessage("Permisos actualizados correctamente.");
      } else if (action === "approve_request") {
        setMessage("Solicitud aprobada y permisos asignados.");
      } else if (action === "reject_request") {
        setMessage("Solicitud rechazada.");
      } else if (action === "revoke") {
        setMessage("Autorización eliminada.");
      } else if (action === "block") {
        setMessage("Correo bloqueado.");
      } else {
        setMessage("Correo desbloqueado.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error actualizando acceso.");
    } finally {
      setLoading(false);
    }
  }


  async function runSupabaseAudit() {
    setAuditLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/supabase-audit", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo ejecutar auditoría.");
      setAuditIssues(data.issues || []);
      setAuditCheckedAt(String(data.checkedAt || ""));
      if (!data.issues?.length) setMessage("Auditoría OK: no se detectaron problemas críticos.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error ejecutando auditoría.");
    } finally {
      setAuditLoading(false);
    }
  }

  async function copySql(sql: string) {
    try {
      await navigator.clipboard.writeText(sql);
      setMessage("SQL copiado al portapapeles.");
    } catch {
      setMessage("No se pudo copiar SQL.");
    }
  }

  if (checking) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando control de accesos..." /></main>;

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Control de accesos Studio</h1>
            <p className="mt-2 text-sm text-slate-600">Ahora puedes editar permisos por correo y módulo (Blog, CRM, Incidentes y Onboarding).</p>
          </div>
          <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver al Studio</Link>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Autorizar correo y permisos</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="freelance@gmail.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <select value={grantProvider} onChange={(e) => setGrantProvider(e.target.value as "google" | "azure" | "any")} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="google">Google</option>
              <option value="azure">Microsoft</option>
              <option value="any">Cualquiera</option>
            </select>
            <select value={grantTeam} onChange={(e) => setGrantTeam(e.target.value as Team)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="general">Track: General</option>
              <option value="sales">Track: Sales</option>
              <option value="creative_ops">Track: Creative Ops</option>
              <option value="advisory_ops">Track: Advisory Ops</option>
            </select>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={grantBlog} onChange={(e) => setGrantBlog(e.target.checked)} /> Blog</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={grantCrm} onChange={(e) => setGrantCrm(e.target.checked)} /> CRM</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={grantIncidents} onChange={(e) => setGrantIncidents(e.target.checked)} /> Incidentes</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={grantOnboarding} onChange={(e) => setGrantOnboarding(e.target.checked)} /> Onboarding</label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" disabled={loading || !emailInput.trim()} onClick={() => onAction("grant", emailInput)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Guardar autorización</button>
            <button type="button" disabled={loading || !emailInput.trim()} onClick={() => onAction("block", emailInput)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Bloquear correo</button>
          </div>
          {message ? <p className="mt-2 text-sm text-slate-600">{message}</p> : null}
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Correos autorizados ({authorized.length})</h2>
          <div className="mt-3 grid gap-2">
            {authorized.map((user) => {
              const row = rowEditors[user.email] || {
                provider: user.provider,
                team: user.team || "general",
                canBlog: user.permissions.canBlog,
                canCrm: user.permissions.canCrm,
                canIncidents: user.permissions.canIncidents,
                canOnboarding: user.permissions.canOnboarding !== false,
              };
              return (
                <div key={user.email} className="rounded-lg border border-slate-200 px-3 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <strong>{user.email}</strong>
                      <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-[11px] uppercase text-slate-600">{user.role || "member"}</span>
                      <div className="text-xs text-slate-500">Track onboarding: {user.team || "general"} · Última actualización: {new Date(user.updatedAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onAction("grant", user.email, undefined, row)}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50"
                      >
                        Guardar permisos
                      </button>
                      <button type="button" onClick={() => onAction("revoke", user.email)} className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50">Quitar acceso</button>
                      <button type="button" onClick={() => onAction("block", user.email)} className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50">Bloquear</button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-4">
                    <select
                      value={row.provider}
                      onChange={(e) => setRowEditors((prev) => ({ ...prev, [user.email]: { ...row, provider: e.target.value as RowEditorState["provider"] } }))}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    >
                      <option value="google">Google</option>
                      <option value="azure">Microsoft</option>
                      <option value="any">Cualquiera</option>
                    </select>
                    <select
                      value={row.team}
                      onChange={(e) => setRowEditors((prev) => ({ ...prev, [user.email]: { ...row, team: e.target.value as Team } }))}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    >
                      <option value="general">General</option>
                      <option value="sales">Sales</option>
                      <option value="creative_ops">Creative Ops</option>
                      <option value="advisory_ops">Advisory Ops</option>
                    </select>
                    <div className="md:col-span-2 flex flex-wrap gap-3 text-xs">
                      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={row.canBlog} onChange={(e) => setRowEditors((prev) => ({ ...prev, [user.email]: { ...row, canBlog: e.target.checked } }))} /> Blog</label>
                      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={row.canCrm} onChange={(e) => setRowEditors((prev) => ({ ...prev, [user.email]: { ...row, canCrm: e.target.checked } }))} /> CRM</label>
                      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={row.canIncidents} onChange={(e) => setRowEditors((prev) => ({ ...prev, [user.email]: { ...row, canIncidents: e.target.checked } }))} /> Incidentes</label>
                      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={row.canOnboarding} onChange={(e) => setRowEditors((prev) => ({ ...prev, [user.email]: { ...row, canOnboarding: e.target.checked } }))} /> Onboarding</label>
                    </div>
                  </div>
                </div>
              );
            })}
            {!authorized.length ? <p className="text-sm text-slate-500">No hay correos autorizados.</p> : null}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Solicitudes de acceso ({requests.filter((r) => r.status === "pending").length} pendientes)</h2>
          <div className="mt-3 grid gap-2">
            {requests.map((req) => (
              <div key={req.id} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong>{req.email}</strong> · proveedor detectado: {req.provider}
                    <div className="text-xs text-slate-500">
                      Estado: {req.status} · solicitado: {new Date(req.requestedAt).toLocaleString()}
                      {req.resolvedAt ? ` · resuelto: ${new Date(req.resolvedAt).toLocaleString()}` : ""}
                    </div>
                  </div>
                  {req.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEmailInput(req.email);
                          setGrantProvider(req.provider === "unknown" ? "google" : req.provider);
                          setGrantTeam("general");
                          onAction("approve_request", req.email, req.id);
                        }}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50"
                      >
                        Aprobar + permisos actuales
                      </button>
                      <button type="button" onClick={() => onAction("reject_request", req.email, req.id)} className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50">Rechazar</button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {!requests.length ? <p className="text-sm text-slate-500">No hay solicitudes registradas.</p> : null}
          </div>
        </section>


        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Auditoría técnica de Supabase</h2>
            <button type="button" onClick={runSupabaseAudit} disabled={auditLoading} className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50">
              {auditLoading ? "Auditando..." : "Ejecutar auditoría"}
            </button>
          </div>
          <p className="text-xs text-slate-500">Detecta tablas/columnas faltantes del Studio y sugiere SQL para corregir desde el SQL Editor de Supabase.</p>
          {auditCheckedAt ? <p className="mt-2 text-xs text-slate-500">Última ejecución: {new Date(auditCheckedAt).toLocaleString()}</p> : null}
          <div className="mt-3 grid gap-2">
            {auditIssues.map((issue) => (
              <div key={issue.id} className={`rounded-lg border px-3 py-2 text-sm ${issue.severity === "error" ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50"}`}>
                <div className="font-semibold">[{issue.module}] {issue.message}</div>
                {issue.fixSql ? (
                  <div className="mt-2">
                    <pre className="overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-100">{issue.fixSql}</pre>
                    <button type="button" onClick={() => copySql(issue.fixSql || "")} className="mt-2 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs">Copiar SQL</button>
                  </div>
                ) : null}
              </div>
            ))}
            {!auditIssues.length ? <p className="text-sm text-slate-500">Sin resultados de auditoría todavía.</p> : null}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Correos bloqueados ({blocked.length})</h2>
          <div className="mt-3 grid gap-2">
            {blocked.map((email) => (
              <div key={email} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span>{email}</span>
                <button type="button" onClick={() => onAction("unblock", email)} className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50">Desbloquear</button>
              </div>
            ))}
            {!blocked.length ? <p className="text-sm text-slate-500">No hay correos bloqueados.</p> : null}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Últimos ingresos ({logs.length})</h2>
            <button type="button" onClick={() => loadData()} className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50" disabled={loading}>Recargar</button>
          </div>
          <div className="grid gap-2">
            {logs.map((log, idx) => (
              <div key={`${log.at}-${log.email}-${idx}`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">
                <strong>{new Date(log.at).toLocaleString()}</strong> · {log.email} · {log.provider}{log.ip ? ` · IP ${log.ip}` : ""}
              </div>
            ))}
            {!logs.length ? <p className="text-sm text-slate-500">Aún no hay ingresos registrados.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
