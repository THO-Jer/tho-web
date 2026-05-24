import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_LENGTH = 300;
const EVENTO = "aniversario_2026";

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, serviceKey };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mensaje = String(body?.mensaje || "").trim();

    if (!mensaje) {
      return NextResponse.json({ error: "El mensaje no puede estar vacío." }, { status: 400 });
    }
    if (mensaje.length > MAX_LENGTH) {
      return NextResponse.json({ error: `El mensaje no puede superar los ${MAX_LENGTH} caracteres.` }, { status: 400 });
    }

    const { url, serviceKey } = getSupabaseEnv();
    if (!url || !serviceKey) {
      console.error("[deseos] Supabase env vars not configured");
      return NextResponse.json({ error: "Error de configuración del servidor." }, { status: 500 });
    }

    const res = await fetch(`${url}/rest/v1/capsula_tiempo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ mensaje, evento: EVENTO }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[deseos] Supabase insert error:", res.status, text);
      return NextResponse.json({ error: "No se pudo guardar el deseo." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[deseos] Unexpected error:", err);
    return NextResponse.json({ error: "Error inesperado." }, { status: 500 });
  }
}

// Lectura de deseos: solo para admins con canManageAccess
export async function GET(req: NextRequest) {
  const { readSession } = await import("@/lib/adminAuth");
  const session = await readSession(req);
  if (!session || (!session.canManageAccess && !session.isSuperAdmin)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const { url, serviceKey } = getSupabaseEnv();
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Error de configuración." }, { status: 500 });
  }

  const evento = req.nextUrl.searchParams.get("evento") || EVENTO;

  const res = await fetch(
    `${url}/rest/v1/capsula_tiempo?evento=eq.${encodeURIComponent(evento)}&order=created_at.asc&select=id,mensaje,created_at`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo leer los deseos." }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ deseos: data, evento });
}
