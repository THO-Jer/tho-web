import { NextRequest, NextResponse } from "next/server";

import { buildSessionValue, isAllowedEditorEmail, readSession, SESSION_COOKIE } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = readSession(req);
  return NextResponse.json({ authenticated: Boolean(session), email: session?.email ?? null });
}

export async function POST(req: NextRequest) {
  const expected = process.env.BLOG_ADMIN_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: "BLOG_ADMIN_TOKEN no configurado." }, { status: 500 });
  }

  try {
    const { email, token } = (await req.json()) as { email?: string; token?: string };
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !token) {
      return NextResponse.json({ error: "Debes enviar email y token." }, { status: 400 });
    }

    if (token !== expected) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    if (!isAllowedEditorEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Email sin permisos de edición." }, { status: 403 });
    }

    const response = NextResponse.json({ ok: true, email: normalizedEmail });
    response.cookies.set(SESSION_COOKIE, buildSessionValue(normalizedEmail, token), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo iniciar sesión." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
  return response;
}
