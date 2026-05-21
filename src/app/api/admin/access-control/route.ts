import { NextRequest, NextResponse } from "next/server";

import { isStudioSuperAdmin, readSession } from "@/lib/adminAuth";
import { getModuleVisibilityConfig } from "@/lib/onboardingStore";
import {
  blockEmail,
  listAccessRequests,
  listAuthorizedUsers,
  listBlockedEmails,
  listStudioLoginLogs,
  resolveAccessRequest,
  removeAuthorizedUser,
  StudioUserProvider,
  unblockEmail,
  upsertAuthorizedUser,
} from "@/lib/studioAccessStore";

export const dynamic = "force-dynamic";

function getConfiguredSuperAdmins() {
  return (process.env.STUDIO_SUPERADMINS || "max@tho.cl,francisco@tho.cl,jeremias@tho.cl")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function withSuperAdmins(authorizedUsers: Array<{
  email: string;
  provider: "google" | "azure" | "any";
  active: boolean;
  permissions: { canBlog: boolean; canCrm: boolean; canIncidents: boolean; canOnboarding: boolean };
  updatedAt: string;
  role?: string;
  team?: string;
  blocked?: boolean;
}>) {
  const byEmail = new Map(authorizedUsers.map((user) => [user.email, user]));
  for (const email of getConfiguredSuperAdmins()) {
    if (!byEmail.has(email)) {
      byEmail.set(email, {
        email,
        provider: "azure",
        active: true,
        permissions: {
          canBlog: true,
          canCrm: true,
          canIncidents: true,
          canOnboarding: true,
        },
        updatedAt: new Date().toISOString(),
        role: "superadmin",
        team: "general",
        blocked: false,
      });
    }
  }

  return Array.from(byEmail.values()).sort((a, b) => a.email.localeCompare(b.email, "es"));
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!session.canManageAccess) return NextResponse.json({ error: "Solo superadmin puede gestionar accesos." }, { status: 403 });

  const [blockedEmails, logs, authorizedUsersRaw, accessRequests, visibility] = await Promise.all([
    listBlockedEmails(),
    listStudioLoginLogs(250),
    listAuthorizedUsers(),
    listAccessRequests(),
    getModuleVisibilityConfig().catch(() => ({ branches: [], userOverrides: {} })),
  ]);
  const authorizedUsers = withSuperAdmins(authorizedUsersRaw);
  // Ramas disponibles para asignar como track de onboarding (incluye las nuevas
  // creadas en el panel admin de onboarding).
  const branches = (visibility.branches || []).map((branch) => ({ id: branch.id, label: branch.label }));
  return NextResponse.json({ blockedEmails, logs, authorizedUsers, accessRequests, branches });
}

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!session.canManageAccess) return NextResponse.json({ error: "Solo superadmin puede gestionar accesos." }, { status: 403 });

  try {
    const payload = await req.json();
    const email = String(payload.email || "").trim().toLowerCase();
    const action = String(payload.action || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    if (action === "block") {
      const blockedEmails = await blockEmail(email);
      return NextResponse.json({ ok: true, blockedEmails });
    }

    if (action === "unblock") {
      const blockedEmails = await unblockEmail(email);
      return NextResponse.json({ ok: true, blockedEmails });
    }

    if (action === "grant") {
      const authorizedUsersRaw = await upsertAuthorizedUser({
        email,
        provider: (payload.provider || "google") as StudioUserProvider,
        role: isStudioSuperAdmin(email) ? "superadmin" : (payload.role || "member"),
        team: payload.team || "general",
        active: payload.active !== false,
        permissions: {
          canBlog: Boolean(payload.permissions?.canBlog),
          canCrm: Boolean(payload.permissions?.canCrm),
          canIncidents: Boolean(payload.permissions?.canIncidents),
          canOnboarding: payload.permissions?.canOnboarding !== false,
        },
      });
      return NextResponse.json({ ok: true, authorizedUsers: withSuperAdmins(authorizedUsersRaw) });
    }

    if (action === "approve_request") {
      const requestId = String(payload.requestId || "").trim();
      if (!requestId) return NextResponse.json({ error: "requestId es obligatorio." }, { status: 400 });

      await resolveAccessRequest(requestId, "approved");
      const authorizedUsersRaw = await upsertAuthorizedUser({
        email,
        provider: (payload.provider || "google") as StudioUserProvider,
        role: isStudioSuperAdmin(email) ? "superadmin" : (payload.role || "member"),
        team: payload.team || "general",
        active: payload.active !== false,
        permissions: {
          canBlog: Boolean(payload.permissions?.canBlog),
          canCrm: Boolean(payload.permissions?.canCrm),
          canIncidents: Boolean(payload.permissions?.canIncidents),
          canOnboarding: payload.permissions?.canOnboarding !== false,
        },
      });
      const accessRequests = await listAccessRequests();
      return NextResponse.json({ ok: true, authorizedUsers: withSuperAdmins(authorizedUsersRaw), accessRequests });
    }

    if (action === "reject_request") {
      const requestId = String(payload.requestId || "").trim();
      if (!requestId) return NextResponse.json({ error: "requestId es obligatorio." }, { status: 400 });
      const resolved = await resolveAccessRequest(requestId, "rejected");
      return NextResponse.json({ ok: true, request: resolved, accessRequests: await listAccessRequests() });
    }

    if (action === "revoke") {
      const authorizedUsersRaw = await removeAuthorizedUser(email);
      return NextResponse.json({ ok: true, authorizedUsers: withSuperAdmins(authorizedUsersRaw) });
    }

    return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar acceso." }, { status: 400 });
  }
}
