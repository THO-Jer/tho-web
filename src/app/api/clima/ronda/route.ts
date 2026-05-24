import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  return { url, serviceKey, anonKey };
}

// GET — devuelve lista de rondas (admin) o solo la ronda activa (público)
export async function GET(req: NextRequest) {
  const { url, serviceKey, anonKey } = getSupabase();
  if (!url) return NextResponse.json({ error: "Config error." }, { status: 500 });

  const session = await readSession(req);
  const isAdmin = Boolean(session);

  if (isAdmin) {
    // Admin: todas las rondas
    const res = await fetch(
      `${url}/rest/v1/clima_ronda?order=created_at.desc&select=id,nombre,estado,created_at,cerrada_at`,
      {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return NextResponse.json({ error: "No se pudieron leer las rondas." }, { status: 500 });
    const rondas = await res.json();
    return NextResponse.json({ rondas });
  } else {
    // Público: solo ronda activa (para saber si hay encuesta abierta)
    const res = await fetch(
      `${url}/rest/v1/clima_ronda?estado=eq.activa&order=created_at.desc&limit=1&select=id,nombre,estado,created_at`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return NextResponse.json({ ronda: null });
    const data = await res.json();
    return NextResponse.json({ ronda: data[0] || null });
  }
}

// POST — crear nueva ronda (solo admin con canManageAccess)
export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session || (!session.canManageAccess && !session.isSuperAdmin)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const nombre = String(body?.nombre || "").trim();
  if (!nombre) return NextResponse.json({ error: "El nombre es requerido." }, { status: 400 });

  const { url, serviceKey } = getSupabase();

  // Cerrar cualquier ronda activa antes de crear una nueva
  await fetch(
    `${url}/rest/v1/clima_ronda?estado=eq.activa`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ estado: "cerrada", cerrada_at: new Date().toISOString() }),
    }
  );

  const res = await fetch(`${url}/rest/v1/clima_ronda`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ nombre, estado: "activa" }),
  });

  if (!res.ok) return NextResponse.json({ error: "No se pudo crear la ronda." }, { status: 500 });
  const data = await res.json();
  return NextResponse.json({ ronda: data[0] });
}

// PATCH — cerrar ronda activa (solo admin con canManageAccess)
export async function PATCH(req: NextRequest) {
  const session = await readSession(req);
  if (!session || (!session.canManageAccess && !session.isSuperAdmin)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const rondaId = String(body?.rondaId || "").trim();
  const accion = String(body?.accion || "").trim(); // "cerrar" | "reabrir"

  if (!rondaId) return NextResponse.json({ error: "rondaId requerido." }, { status: 400 });

  const { url, serviceKey } = getSupabase();

  const payload =
    accion === "reabrir"
      ? { estado: "activa", cerrada_at: null }
      : { estado: "cerrada", cerrada_at: new Date().toISOString() };

  const res = await fetch(
    `${url}/rest/v1/clima_ronda?id=eq.${encodeURIComponent(rondaId)}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) return NextResponse.json({ error: "No se pudo actualizar la ronda." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
