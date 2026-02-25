import { NextRequest, NextResponse } from "next/server";

import { getStudioPermissionsLocal, isStudioSuperAdmin, LOCAL_SESSION_COOKIE, readSession } from "@/lib/adminAuth";
import { isBlockedEmail, logStudioLogin } from "@/lib/studioAccessStore";

export const dynamic = "force-dynamic";

function getSourceIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return req.headers.get("x-real-ip") || undefined;
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  return NextResponse.json({
    authenticated: Boolean(session),
    email: session?.email ?? null,
    provider: session?.provider ?? null,
    canManageAccess: Boolean(session?.canManageAccess),
    permissions: session
      ? {
          canBlog: session.canBlog,
          canCrm: session.canCrm,
          canIncidents: session.canIncidents,
        }
      : null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as { action?: string; email?: string };
    const action = String(payload.action || "").trim();

    if (action !== "local_login") {
      return NextResponse.json({ error: "Acción no válida. Usa local_login." }, { status: 400 });
    }

    const email = String(payload.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const permissions = await getStudioPermissionsLocal(email);
    if (!permissions) {
      if (isStudioSuperAdmin(email) && await isBlockedEmail(email)) {
        return NextResponse.json({ ok: false, error: "Tu correo superadmin está bloqueado en Control de Accesos.", reason: "superadmin_blocked" });
      }
      return NextResponse.json({ ok: false, error: "Correo no autorizado. Debe habilitarse desde Control de Accesos.", reason: "local_not_authorized" });
    }

    await logStudioLogin({
      at: new Date().toISOString(),
      email,
      provider: "local",
      ip: getSourceIp(req),
    });

    const response = NextResponse.json({
      ok: true,
      email,
      provider: "local",
      canManageAccess: permissions.canManageAccess,
      permissions: {
        canBlog: permissions.canBlog,
        canCrm: permissions.canCrm,
        canIncidents: permissions.canIncidents,
      },
    });

    response.cookies.set(LOCAL_SESSION_COOKIE, email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo procesar autenticación." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(LOCAL_SESSION_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
  return response;
}
