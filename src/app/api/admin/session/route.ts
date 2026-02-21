import { NextRequest, NextResponse } from "next/server";

import { isAllowedEditorEmail, readSession, SESSION_COOKIE } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anon };
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  return NextResponse.json({ authenticated: Boolean(session), email: session?.email ?? null });
}

export async function POST(req: NextRequest) {
  const { url, anon } = getSupabaseEnv();
  if (!url || !anon) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 });
  }

  try {
    const payload = (await req.json()) as { action?: string; email?: string; otp?: string };
    const action = payload.action;
    const email = (payload.email || "").trim().toLowerCase();

    if (!email) return NextResponse.json({ error: "Debes enviar email." }, { status: 400 });

    if (!(await isAllowedEditorEmail(email))) {
      return NextResponse.json({ error: "Email sin permisos de edición." }, { status: 403 });
    }

    if (action === "send_otp") {
      const otpRes = await fetch(`${url}/auth/v1/otp`, {
        method: "POST",
        headers: { "content-type": "application/json", apikey: anon },
        body: JSON.stringify({ email, create_user: false }),
      });

      if (!otpRes.ok) {
        const errorText = await otpRes.text();
        return NextResponse.json({ error: `No se pudo enviar código: ${errorText}` }, { status: 400 });
      }

      return NextResponse.json({ ok: true, message: "Código enviado a tu correo." });
    }

    if (action === "verify_otp") {
      const otp = (payload.otp || "").trim();
      if (!otp) return NextResponse.json({ error: "Debes ingresar el código OTP." }, { status: 400 });

      const verifyRes = await fetch(`${url}/auth/v1/verify`, {
        method: "POST",
        headers: { "content-type": "application/json", apikey: anon },
        body: JSON.stringify({ email, token: otp, type: "email" }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData?.access_token) {
        return NextResponse.json({ error: "Código inválido o expirado." }, { status: 401 });
      }

      const response = NextResponse.json({ ok: true, email });
      response.cookies.set(SESSION_COOKIE, verifyData.access_token as string, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return response;
    }

    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
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
