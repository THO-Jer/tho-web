import { promises as fs } from "node:fs";
import path from "node:path";

import { getWritableDataPath } from "@/lib/storagePaths";

export type StudioLoginLog = {
  at: string;
  email: string;
  provider: string;
  ip?: string;
};

export type StudioUserProvider = "google" | "azure" | "any";

export type StudioUserPermissions = {
  canBlog: boolean;
  canCrm: boolean;
  canIncidents: boolean;
};

export type StudioAuthorizedUser = {
  email: string;
  provider: StudioUserProvider;
  active: boolean;
  permissions: StudioUserPermissions;
  updatedAt: string;
  role?: string;
  blocked?: boolean;
};

export type StudioAccessRequest = {
  id: string;
  email: string;
  provider: StudioUserProvider | "unknown";
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  resolvedAt?: string;
};

type AccessControlState = {
  blockedEmails: string[];
  loginLogs: StudioLoginLog[];
  authorizedUsers: StudioAuthorizedUser[];
  accessRequests: StudioAccessRequest[];
};

const ACCESS_PATH = getWritableDataPath("studio", "access-control.json");
const MAX_LOGS = 1000;

const DEFAULT_PERMISSIONS: StudioUserPermissions = {
  canBlog: false,
  canCrm: false,
  canIncidents: false,
};

const ROLE_TABLE = process.env.STUDIO_ROLES_TABLE || "studio_roles";
const ROLE_LOG_TABLE = process.env.STUDIO_LOGIN_LOGS_TABLE || "studio_login_logs";
const ROLE_REQUESTS_TABLE = process.env.STUDIO_ACCESS_REQUESTS_TABLE || "studio_access_requests";

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, service };
}

function hasSupabaseStore() {
  const { url, service } = getSupabaseEnv();
  return Boolean(url && service);
}

function requireSupabaseInProduction() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

async function supabaseRequest(pathname: string, init?: RequestInit) {
  const { url, service } = getSupabaseEnv();
  if (!url || !service) throw new Error("Supabase roles store no configurado");

  const res = await fetch(`${url}${pathname}`, {
    ...init,
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "content-type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase roles store error (${res.status}): ${body}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function ensureStore() {
  await fs.mkdir(path.dirname(ACCESS_PATH), { recursive: true });
  try {
    await fs.access(ACCESS_PATH);
  } catch {
    const initial: AccessControlState = { blockedEmails: [], loginLogs: [], authorizedUsers: [], accessRequests: [] };
    await fs.writeFile(ACCESS_PATH, `${JSON.stringify(initial, null, 2)}\n`, "utf8");
  }
}

function normalizeEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

function normalizeProvider(provider: unknown): StudioUserProvider {
  const value = String(provider || "").trim().toLowerCase();
  if (value === "google" || value === "azure") return value;
  return "any";
}

function normalizePermissions(input: Partial<StudioUserPermissions> | undefined): StudioUserPermissions {
  return {
    canBlog: Boolean(input?.canBlog),
    canCrm: Boolean(input?.canCrm),
    canIncidents: Boolean(input?.canIncidents),
  };
}

function rowToAuthorized(row: Record<string, unknown>): StudioAuthorizedUser {
  return {
    email: normalizeEmail(String(row.email || "")),
    provider: normalizeProvider(row.provider),
    active: row.active !== false,
    permissions: {
      canBlog: Boolean(row.can_blog),
      canCrm: Boolean(row.can_crm),
      canIncidents: Boolean(row.can_incidents),
    },
    updatedAt: String(row.updated_at || new Date().toISOString()),
    role: String(row.role || "member"),
    blocked: Boolean(row.blocked),
  };
}

async function listAuthorizedUsersFromSupabase() {
  const rows = (await supabaseRequest(`/rest/v1/${ROLE_TABLE}?select=*&order=email.asc`)) as Array<Record<string, unknown>>;
  return rows.map(rowToAuthorized).filter((row) => row.email);
}

async function listLoginLogsFromSupabase(limit = 200) {
  const rows = (await supabaseRequest(`/rest/v1/${ROLE_LOG_TABLE}?select=*&order=at.desc&limit=${Math.max(1, Math.min(limit, MAX_LOGS))}`)) as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    at: String(row.at || ""),
    email: normalizeEmail(String(row.email || "")),
    provider: String(row.provider || "unknown"),
    ip: row.ip ? String(row.ip) : undefined,
  })).filter((row) => row.at && row.email);
}

async function listAccessRequestsFromSupabase() {
  const rows = (await supabaseRequest(`/rest/v1/${ROLE_REQUESTS_TABLE}?select=*&order=requested_at.desc`)) as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    id: String(row.id || ""),
    email: normalizeEmail(String(row.email || "")),
    provider: normalizeProvider(row.provider) as StudioUserProvider | "unknown",
    status: (["pending", "approved", "rejected"].includes(String(row.status)) ? String(row.status) : "pending") as "pending" | "approved" | "rejected",
    requestedAt: String(row.requested_at || new Date().toISOString()),
    resolvedAt: row.resolved_at ? String(row.resolved_at) : undefined,
  })).filter((row) => row.id && row.email);
}

async function readState(): Promise<AccessControlState> {
  if (hasSupabaseStore()) {
    const [authorizedUsers, loginLogs, accessRequests] = await Promise.all([
      listAuthorizedUsersFromSupabase(),
      listLoginLogsFromSupabase(MAX_LOGS),
      listAccessRequestsFromSupabase().catch(() => []),
    ]);
    return {
      blockedEmails: authorizedUsers.filter((u) => u.blocked).map((u) => u.email),
      authorizedUsers,
      loginLogs,
      accessRequests,
    };
  }

  if (requireSupabaseInProduction()) {
    throw new Error("Debes configurar Supabase para studio_roles en producción.");
  }

  await ensureStore();
  const raw = await fs.readFile(ACCESS_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<AccessControlState>;

  return {
    blockedEmails: Array.isArray(parsed.blockedEmails)
      ? parsed.blockedEmails.map((email) => normalizeEmail(String(email))).filter(Boolean)
      : [],
    loginLogs: Array.isArray(parsed.loginLogs)
      ? parsed.loginLogs
          .map((log) => ({
            at: String(log.at || ""),
            email: normalizeEmail(String(log.email || "")),
            provider: String(log.provider || "unknown"),
            ip: log.ip ? String(log.ip) : undefined,
          }))
          .filter((log) => log.at && log.email)
      : [],
    authorizedUsers: Array.isArray(parsed.authorizedUsers)
      ? parsed.authorizedUsers
          .map((row) => ({
            email: normalizeEmail(String(row.email || "")),
            provider: normalizeProvider(row.provider),
            active: row.active !== false,
            permissions: normalizePermissions(row.permissions),
            updatedAt: String(row.updatedAt || new Date().toISOString()),
          }))
          .filter((row) => row.email)
      : [],
    accessRequests: Array.isArray(parsed.accessRequests)
      ? parsed.accessRequests
          .map((row) => ({
            id: String(row.id || ""),
            email: normalizeEmail(String(row.email || "")),
            provider: normalizeProvider(row.provider) as StudioUserProvider | "unknown",
            status: (["pending", "approved", "rejected"].includes(String(row.status)) ? String(row.status) : "pending") as "pending" | "approved" | "rejected",
            requestedAt: String(row.requestedAt || new Date().toISOString()),
            resolvedAt: row.resolvedAt ? String(row.resolvedAt) : undefined,
          }))
          .filter((row) => row.id && row.email)
      : [],
  };
}

async function writeState(state: AccessControlState) {
  if (hasSupabaseStore()) return;
  if (requireSupabaseInProduction()) throw new Error("Debes configurar Supabase para studio_roles en producción.");
  await ensureStore();
  await fs.writeFile(ACCESS_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

export async function listBlockedEmails() {
  const state = await readState();
  return [...state.blockedEmails].sort((a, b) => a.localeCompare(b, "es"));
}

export async function isBlockedEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  const blocked = await listBlockedEmails();
  return blocked.includes(normalized);
}

export async function blockEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido para bloquear.");

  if (hasSupabaseStore()) {
    const existing = (await supabaseRequest(`/rest/v1/${ROLE_TABLE}?select=*&email=eq.${encodeURIComponent(normalized)}&limit=1`)) as Array<Record<string, unknown>>;
    const base = existing[0] || {};
    await supabaseRequest(`/rest/v1/${ROLE_TABLE}?on_conflict=email`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify([{
        email: normalized,
        role: String(base.role || "member"),
        active: base.active !== false,
        blocked: true,
        can_blog: Boolean(base.can_blog),
        can_crm: Boolean(base.can_crm),
        can_incidents: Boolean(base.can_incidents),
        provider: String(base.provider || "any"),
        updated_at: new Date().toISOString(),
      }]),
    });
    return listBlockedEmails();
  }

  const state = await readState();
  if (!state.blockedEmails.includes(normalized)) {
    state.blockedEmails.push(normalized);
    state.blockedEmails.sort((a, b) => a.localeCompare(b, "es"));
    await writeState(state);
  }

  return state.blockedEmails;
}

export async function unblockEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido para desbloquear.");

  if (hasSupabaseStore()) {
    await supabaseRequest(`/rest/v1/${ROLE_TABLE}?email=eq.${encodeURIComponent(normalized)}`, {
      method: "PATCH",
      body: JSON.stringify({ blocked: false, updated_at: new Date().toISOString() }),
    });
    return listBlockedEmails();
  }

  const state = await readState();
  state.blockedEmails = state.blockedEmails.filter((item) => item !== normalized);
  await writeState(state);
  return state.blockedEmails;
}

export async function logStudioLogin(event: StudioLoginLog) {
  if (hasSupabaseStore()) {
    await supabaseRequest(`/rest/v1/${ROLE_LOG_TABLE}`, {
      method: "POST",
      body: JSON.stringify([{ at: event.at, email: normalizeEmail(event.email), provider: String(event.provider || "unknown"), ip: event.ip || null }]),
    });
    return;
  }

  const state = await readState();
  state.loginLogs.unshift({
    at: event.at,
    email: normalizeEmail(event.email),
    provider: String(event.provider || "unknown"),
    ip: event.ip,
  });
  state.loginLogs = state.loginLogs.slice(0, MAX_LOGS);
  await writeState(state);
}

export async function listStudioLoginLogs(limit = 200) {
  const state = await readState();
  return state.loginLogs.slice(0, Math.max(1, Math.min(limit, MAX_LOGS)));
}

export async function listAuthorizedUsers() {
  const state = await readState();
  return [...state.authorizedUsers].sort((a, b) => a.email.localeCompare(b.email, "es"));
}

export async function upsertAuthorizedUser(input: {
  email: string;
  provider?: StudioUserProvider;
  active?: boolean;
  permissions?: Partial<StudioUserPermissions>;
  role?: string;
}) {
  const email = normalizeEmail(input.email);
  if (!email || !email.includes("@")) throw new Error("Email inválido para autorizar.");

  if (hasSupabaseStore()) {
    await supabaseRequest(`/rest/v1/${ROLE_TABLE}?on_conflict=email`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify([{
        email,
        provider: normalizeProvider(input.provider),
        active: input.active !== false,
        blocked: false,
        role: input.role || "member",
        can_blog: Boolean(input.permissions?.canBlog),
        can_crm: Boolean(input.permissions?.canCrm),
        can_incidents: Boolean(input.permissions?.canIncidents),
        updated_at: new Date().toISOString(),
      }]),
    });
    return listAuthorizedUsers();
  }

  const state = await readState();
  const idx = state.authorizedUsers.findIndex((row) => row.email === email);
  const next: StudioAuthorizedUser = {
    email,
    provider: normalizeProvider(input.provider),
    active: input.active !== false,
    permissions: normalizePermissions(input.permissions),
    updatedAt: new Date().toISOString(),
  };

  if (idx >= 0) state.authorizedUsers[idx] = next;
  else state.authorizedUsers.push(next);

  state.authorizedUsers.sort((a, b) => a.email.localeCompare(b.email, "es"));
  await writeState(state);
  return state.authorizedUsers;
}

export async function removeAuthorizedUser(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido para eliminar.");

  if (hasSupabaseStore()) {
    await supabaseRequest(`/rest/v1/${ROLE_TABLE}?email=eq.${encodeURIComponent(normalized)}`, { method: "DELETE" });
    return listAuthorizedUsers();
  }

  const state = await readState();
  state.authorizedUsers = state.authorizedUsers.filter((row) => row.email !== normalized);
  await writeState(state);
  return state.authorizedUsers;
}

export async function getAuthorizedUser(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  const users = await listAuthorizedUsers();
  return users.find((row) => row.email === normalized) || null;
}

export async function listAccessRequests() {
  const state = await readState();
  return [...state.accessRequests].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}

export async function createAccessRequest(input: { email: string; provider: string }) {
  const email = normalizeEmail(input.email);
  if (!email || !email.includes("@")) throw new Error("Email inválido para solicitud.");

  if (hasSupabaseStore()) {
    const existing = (await supabaseRequest(`/rest/v1/${ROLE_REQUESTS_TABLE}?select=*&email=eq.${encodeURIComponent(email)}&status=eq.pending&limit=1`)) as Array<Record<string, unknown>>;
    if (existing[0]) {
      return {
        id: String(existing[0].id),
        email,
        provider: normalizeProvider(existing[0].provider) as StudioUserProvider | "unknown",
        status: "pending" as const,
        requestedAt: String(existing[0].requested_at || new Date().toISOString()),
      };
    }

    const inserted = (await supabaseRequest(`/rest/v1/${ROLE_REQUESTS_TABLE}`, {
      method: "POST",
      body: JSON.stringify([{ email, provider: normalizeProvider(input.provider), status: "pending", requested_at: new Date().toISOString() }]),
    })) as Array<Record<string, unknown>>;
    const row = inserted[0];
    return {
      id: String(row.id),
      email,
      provider: normalizeProvider(row.provider) as StudioUserProvider | "unknown",
      status: "pending" as const,
      requestedAt: String(row.requested_at || new Date().toISOString()),
    };
  }

  const state = await readState();
  const existingPending = state.accessRequests.find((r) => r.email === email && r.status === "pending");
  if (existingPending) return existingPending;

  const req: StudioAccessRequest = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email,
    provider: normalizeProvider(input.provider) as StudioUserProvider | "unknown",
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  state.accessRequests.unshift(req);
  await writeState(state);
  return req;
}

export async function resolveAccessRequest(id: string, status: "approved" | "rejected") {
  if (hasSupabaseStore()) {
    const rows = (await supabaseRequest(`/rest/v1/${ROLE_REQUESTS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status, resolved_at: new Date().toISOString() }),
    })) as Array<Record<string, unknown>>;
    const row = rows[0];
    if (!row) throw new Error("Solicitud no encontrada.");
    return {
      id: String(row.id),
      email: normalizeEmail(String(row.email || "")),
      provider: normalizeProvider(row.provider) as StudioUserProvider | "unknown",
      status: (row.status === "approved" ? "approved" : "rejected") as "approved" | "rejected",
      requestedAt: String(row.requested_at || new Date().toISOString()),
      resolvedAt: String(row.resolved_at || new Date().toISOString()),
    };
  }

  const state = await readState();
  const idx = state.accessRequests.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Solicitud no encontrada.");
  state.accessRequests[idx] = {
    ...state.accessRequests[idx],
    status,
    resolvedAt: new Date().toISOString(),
  };
  await writeState(state);
  return state.accessRequests[idx];
}

export { DEFAULT_PERMISSIONS };
