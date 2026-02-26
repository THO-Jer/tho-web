import { NextRequest } from "next/server";

import { getAuthorizedUser, isBlockedEmail, StudioUserPermissions } from "@/lib/studioAccessStore";

const SESSION_COOKIE = "blog_admin_session";

type TokenUser = { email: string; provider: string };

type SessionData = {
  email: string;
  provider: string;
  token: string;
} & SessionPermissions;

export type SessionPermissions = StudioUserPermissions & {
  canManageAccess: boolean;
  isSuperAdmin: boolean;
  role: string;
};

function getSupabaseEnv() {
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_SUPABASE_PUBLIC_URL;
  const url = rawUrl?.trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_SUPABASE_ANON_KEY;
  return { url, anon };
}

function normalizeProvider(provider: string) {
  const p = provider.trim().toLowerCase();
  if (["azure", "azuread", "microsoft", "aad"].includes(p)) return "azure";
  if (p === "google") return "google";
  return "unknown";
}

export function isStudioSuperAdmin(email: string) {
  const normalized = email.trim().toLowerCase();
  const configured = (process.env.STUDIO_SUPERADMINS || "max@tho.cl,francisco@tho.cl,jeremias@tho.cl")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return configured.includes(normalized);
}

export async function getUserFromToken(token: string): Promise<TokenUser | null> {
  const { url, anon } = getSupabaseEnv();
  if (!url || !anon || !token) return null;

  const res = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const user = (await res.json()) as {
    email?: string;
    app_metadata?: { provider?: string };
    identities?: Array<{ provider?: string }>;
  };

  const email = user.email?.trim().toLowerCase();
  if (!email) return null;

  const identityProvider = Array.isArray(user.identities)
    ? user.identities.map((row) => String(row?.provider || "")).find((value) => normalizeProvider(value) !== "unknown") || user.identities[0]?.provider
    : "";

  const providerRaw = user.app_metadata?.provider || identityProvider || "";
  return { email, provider: normalizeProvider(providerRaw) };
}

export async function getStudioPermissions(email: string): Promise<SessionPermissions | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  if (await isBlockedEmail(normalized)) return null;

  if (isStudioSuperAdmin(normalized)) {
    return {
      canBlog: true,
      canCrm: true,
      canIncidents: true,
      canManageAccess: true,
      isSuperAdmin: true,
      role: "superadmin",
    };
  }

  const allowedUser = await getAuthorizedUser(normalized);
  if (!allowedUser || !allowedUser.active || allowedUser.blocked) return null;

  return {
    ...allowedUser.permissions,
    canManageAccess: allowedUser.role === "superadmin" || allowedUser.role === "director" || allowedUser.role === "rrhh_admin",
    isSuperAdmin: allowedUser.role === "superadmin",
    role: allowedUser.role || "member",
  };
}

export async function validateSupabaseAccessToken(token: string) {
  const user = await getUserFromToken(token);
  if (!user) return null;

  const permissions = await getStudioPermissions(user.email);
  if (!permissions) return null;

  return {
    email: user.email,
    provider: user.provider,
    permissions,
  };
}

export async function readSession(req: NextRequest): Promise<SessionData | null> {
  const authHeader = req.headers.get("authorization") || "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const cookieToken = req.cookies.get(SESSION_COOKIE)?.value || "";
  const token = headerToken || cookieToken;
  if (!token) return null;

  const valid = await validateSupabaseAccessToken(token);
  if (!valid) return null;

  return {
    email: valid.email,
    provider: valid.provider,
    token,
    ...valid.permissions,
  };
}

export async function isAdminAuthorized(req: NextRequest) {
  return Boolean(await readSession(req));
}

export { SESSION_COOKIE };
