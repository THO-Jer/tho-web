import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, serviceKey };
}

// POST — guardar respuesta anónima (requiere sesión de Studio, pero NO se guarda el email)
export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "Debes estar autenticado en Studio para responder." }, { status: 401 });

  const body = await req.json();
  const rondaId = String(body?.rondaId || "").trim();
  const respuestas = body?.respuestas;

  if (!rondaId) return NextResponse.json({ error: "rondaId requerido." }, { status: 400 });
  if (!respuestas || typeof respuestas !== "object") {
    return NextResponse.json({ error: "Respuestas inválidas." }, { status: 400 });
  }

  const { url, serviceKey } = getSupabase();

  // Verificar que la ronda existe y está activa
  const rondaRes = await fetch(
    `${url}/rest/v1/clima_ronda?id=eq.${encodeURIComponent(rondaId)}&estado=eq.activa&limit=1`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      cache: "no-store",
    }
  );
  const rondaData = await rondaRes.json();
  if (!Array.isArray(rondaData) || rondaData.length === 0) {
    return NextResponse.json({ error: "La ronda no está activa o no existe." }, { status: 409 });
  }

  // Guardar sin ningún identificador del usuario
  const res = await fetch(`${url}/rest/v1/clima_respuesta`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ ronda_id: rondaId, respuestas }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[clima/respuesta] insert error:", res.status, text);
    return NextResponse.json({ error: "No se pudo guardar la respuesta." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// GET — leer resultados agregados (solo admin)
export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const rondaId = req.nextUrl.searchParams.get("rondaId");
  if (!rondaId) return NextResponse.json({ error: "rondaId requerido." }, { status: 400 });

  const { url, serviceKey } = getSupabase();

  const res = await fetch(
    `${url}/rest/v1/clima_respuesta?ronda_id=eq.${encodeURIComponent(rondaId)}&select=respuestas,created_at&order=created_at.asc`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      cache: "no-store",
    }
  );

  if (!res.ok) return NextResponse.json({ error: "No se pudieron leer las respuestas." }, { status: 500 });
  const rows: Array<{ respuestas: Record<string, unknown>; created_at: string }> = await res.json();

  return NextResponse.json({ respuestas: rows, total: rows.length });
}
