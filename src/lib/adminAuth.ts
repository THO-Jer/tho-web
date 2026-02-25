import { NextRequest } from "next/server";

import { getAuthorizedUser, isBlockedEmail, StudioUserPermissions } from "@/lib/studioAccessStore";

const LOCAL_SESSION_COOKIE = "studio_local_session";

const LOCAL_PROVIDER = "local";

type SessionData = {
  email: string;
  provider: string;
  token: null;
} & SessionPermissions;

export type SessionPermissions = StudioUserPermissions & {
  canManageAccess: boolean;
  isSuperAdmin: boolean;
};

export function isStudioSuperAdmin(email: string) {
  const normalized = email.trim().toLowerCase();
  const configured = (process.env.STUDIO_SUPERADMINS || "max@tho.cl,francisco@tho.cl,jeremias@tho.cl")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return configured.includes(normalized);
}

export async function getStudioPermissionsLocal(email: string): Promise<SessionPermissions | null> {
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
    };
  }

  const allowedUser = await getAuthorizedUser(normalized);
  if (!allowedUser || !allowedUser.active) return null;

  return {
    ...allowedUser.permissions,
    canManageAccess: false,
    isSuperAdmin: false,
  };
}

export async function readSession(req: NextRequest): Promise<SessionData | null> {
  const localEmail = req.cookies.get(LOCAL_SESSION_COOKIE)?.value?.trim().toLowerCase() || "";
  if (!localEmail) return null;

  const localPermissions = await getStudioPermissionsLocal(localEmail);
  if (!localPermissions) return null;

  return {
    email: localEmail,
    provider: LOCAL_PROVIDER,
    token: null,
    ...localPermissions,
  };
}

export async function isAdminAuthorized(req: NextRequest) {
  return Boolean(await readSession(req));
}

export { LOCAL_SESSION_COOKIE };
