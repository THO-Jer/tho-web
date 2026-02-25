import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
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

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!session.canManageAccess) return NextResponse.json({ error: "Solo superadmin puede gestionar accesos." }, { status: 403 });

  const [blockedEmails, logs, authorizedUsers, accessRequests] = await Promise.all([
    listBlockedEmails(),
    listStudioLoginLogs(250),
    listAuthorizedUsers(),
    listAccessRequests(),
  ]);
  return NextResponse.json({ blockedEmails, logs, authorizedUsers, accessRequests });
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
      const authorizedUsers = await upsertAuthorizedUser({
        email,
        provider: (payload.provider || "google") as StudioUserProvider,
        active: payload.active !== false,
        permissions: {
          canBlog: Boolean(payload.permissions?.canBlog),
          canCrm: Boolean(payload.permissions?.canCrm),
          canIncidents: Boolean(payload.permissions?.canIncidents),
        },
      });
      return NextResponse.json({ ok: true, authorizedUsers });
    }

    if (action === "approve_request") {
      const requestId = String(payload.requestId || "").trim();
      if (!requestId) return NextResponse.json({ error: "requestId es obligatorio." }, { status: 400 });

      await resolveAccessRequest(requestId, "approved");
      const authorizedUsers = await upsertAuthorizedUser({
        email,
        provider: (payload.provider || "google") as StudioUserProvider,
        active: payload.active !== false,
        permissions: {
          canBlog: Boolean(payload.permissions?.canBlog),
          canCrm: Boolean(payload.permissions?.canCrm),
          canIncidents: Boolean(payload.permissions?.canIncidents),
        },
      });
      const accessRequests = await listAccessRequests();
      return NextResponse.json({ ok: true, authorizedUsers, accessRequests });
    }

    if (action === "reject_request") {
      const requestId = String(payload.requestId || "").trim();
      if (!requestId) return NextResponse.json({ error: "requestId es obligatorio." }, { status: 400 });
      const resolved = await resolveAccessRequest(requestId, "rejected");
      return NextResponse.json({ ok: true, request: resolved, accessRequests: await listAccessRequests() });
    }

    if (action === "revoke") {
      const authorizedUsers = await removeAuthorizedUser(email);
      return NextResponse.json({ ok: true, authorizedUsers });
    }

    return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar acceso." }, { status: 400 });
  }
}
