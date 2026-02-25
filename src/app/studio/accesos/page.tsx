"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type LoginLog = { at: string; email: string; provider: string; ip?: string };
type AuthorizedUser = {
  email: string;
  provider: "google" | "azure" | "any";
  active: boolean;
  permissions: { canBlog: boolean; canCrm: boolean; canIncidents: boolean };
  updatedAt: string;
};
type AccessRequest = {
  id: string;
  email: string;
  provider: "google" | "azure" | "any" | "unknown";
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  resolvedAt?: string;
};

export default function StudioAccesosPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [authorized, setAuthorized] = useState<AuthorizedUser[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [grantProvider, setGrantProvider] = useState<"google" | "azure" | "any">("google");
  const [grantBlog, setGrantBlog] = useState(true);
  const [grantCrm, setGrantCrm] = useState(true);
  const [grantIncidents, setGrantIncidents] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/access-control", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cargar control de accesos.");
      setBlocked(data.blockedEmails || []);
      setLogs(data.logs || []);
      setAuthorized(data.authorizedUsers || []);
      setRequests(data.accessRequests || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error cargando datos.");
    } finally {
      setLoading(false);
    }
  }

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
  }, [router]);

  async function onAction(action: "block" | "unblock" | "grant" | "revoke" | "approve_request" | "reject_request", email: string, requestId?: string) {
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
          provider: grantProvider,
          permissions: {
            canBlog: grantBlog,
            canCrm: grantCrm,
            canIncidents: grantIncidents,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo actualizar.");

      if (data.blockedEmails) setBlocked(data.blockedEmails);
      if (data.authorizedUsers) setAuthorized(data.authorizedUsers);
      if (data.accessRequests) setRequests(data.accessRequests);

      if (action === "grant") {
        setMessage("Correo autorizado/actualizado.");
        setEmailInput("");
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

  if (checking) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando control de accesos..." /></main>;

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Control de accesos Studio</h1>
            <p className="mt-2 text-sm text-slate-600">Superadmins (max/francisco/jeremias) entran con Microsoft y gestionan permisos por correo aquí.</p>
          </div>
          <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver al Studio</Link>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Autorizar correo y permisos</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
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
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={grantBlog} onChange={(e) => setGrantBlog(e.target.checked)} /> Blog</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={grantCrm} onChange={(e) => setGrantCrm(e.target.checked)} /> CRM</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={grantIncidents} onChange={(e) => setGrantIncidents(e.target.checked)} /> Incidentes</label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={loading || !emailInput.trim()} onClick={() => onAction("grant", emailInput)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Guardar autorización</button>
            <button type="button" disabled={loading || !emailInput.trim()} onClick={() => onAction("block", emailInput)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Bloquear correo</button>
          </div>
          {message ? <p className="mt-2 text-sm text-slate-600">{message}</p> : null}
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Correos autorizados ({authorized.length})</h2>
          <div className="mt-3 grid gap-2">
            {authorized.map((user) => (
              <div key={user.email} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong>{user.email}</strong> · proveedor: {user.provider}
                    <div className="text-xs text-slate-500">Permisos: {[user.permissions.canBlog ? "Blog" : "", user.permissions.canCrm ? "CRM" : "", user.permissions.canIncidents ? "Incidentes" : ""].filter(Boolean).join(" · ") || "Sin permisos"}</div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onAction("revoke", user.email)} className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50">Quitar acceso</button>
                    <button type="button" onClick={() => onAction("block", user.email)} className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50">Bloquear</button>
                  </div>
                </div>
              </div>
            ))}
            {!authorized.length ? <p className="text-sm text-slate-500">No hay correos autorizados (excepto superadmins).</p> : null}
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
