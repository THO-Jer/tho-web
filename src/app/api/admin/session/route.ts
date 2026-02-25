import { NextRequest, NextResponse } from "next/server";

import { getUserFromToken, readSession, SESSION_COOKIE, validateSupabaseAccessToken } from "@/lib/adminAuth";
import { createAccessRequest, logStudioLogin } from "@/lib/studioAccessStore";

export const dynamic = "force-dynamic";

function getSupabaseEnv() {
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_SUPABASE_PUBLIC_URL;
  const url = rawUrl?.trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  return { url };
}

function getSourceIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return req.headers.get("x-real-ip") || undefined;
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  const { url } = getSupabaseEnv();
  return NextResponse.json({
    authenticated: Boolean(session),
    email: session?.email ?? null,
    provider: session?.provider ?? null,
    oauthBaseUrl: url ?? null,
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
    const payload = (await req.json()) as { action?: string; accessToken?: string };
    const action = payload.action;

    if (action !== "oauth_login") {
      return NextResponse.json({ error: "Acción no válida. Usa OAuth." }, { status: 400 });
    }

    const token = (payload.accessToken || "").trim();
    if (!token) return NextResponse.json({ error: "Token OAuth faltante." }, { status: 400 });

    const valid = await validateSupabaseAccessToken(token);
    if (!valid) {
      const tokenUser = await getUserFromToken(token);
      if (tokenUser?.email) {
        await createAccessRequest({ email: tokenUser.email, provider: tokenUser.provider });
      }
      return NextResponse.json({
        error: "Tu acceso aún no está autorizado. Se envió una solicitud al superadmin.",
        requestCreated: Boolean(tokenUser?.email),
      }, { status: 403 });
    }

    await logStudioLogin({
      at: new Date().toISOString(),
      email: valid.email,
      provider: valid.provider,
      ip: getSourceIp(req),
    });

    const response = NextResponse.json({
      ok: true,
      email: valid.email,
      provider: valid.provider,
      canManageAccess: valid.permissions.canManageAccess,
      permissions: {
        canBlog: valid.permissions.canBlog,
        canCrm: valid.permissions.canCrm,
        canIncidents: valid.permissions.canIncidents,
      },
    });
    response.cookies.set(SESSION_COOKIE, token, {
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
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
  return response;
}
