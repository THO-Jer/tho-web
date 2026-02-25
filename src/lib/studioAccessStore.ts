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

async function readState(): Promise<AccessControlState> {
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

  const state = await readState();
  state.blockedEmails = state.blockedEmails.filter((item) => item !== normalized);
  await writeState(state);
  return state.blockedEmails;
}

export async function logStudioLogin(event: StudioLoginLog) {
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
}) {
  const email = normalizeEmail(input.email);
  if (!email || !email.includes("@")) throw new Error("Email inválido para autorizar.");

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
