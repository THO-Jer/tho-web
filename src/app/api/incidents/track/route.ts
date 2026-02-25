import { NextRequest, NextResponse } from "next/server";

import { getIncidentByTracking } from "@/lib/incidentsStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const trackingCode = String(payload.tracking_code || "").trim().toUpperCase();
    const pin = String(payload.pin || "").trim();

    if (!trackingCode || !pin) {
      return NextResponse.json({ error: "Debes enviar código de seguimiento y PIN." }, { status: 400 });
    }

    const snapshot = await getIncidentByTracking(trackingCode, pin);
    if (!snapshot) {
      return NextResponse.json({ error: "Código/PIN inválidos." }, { status: 404 });
    }

    return NextResponse.json({ incident: snapshot });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo consultar el caso." }, { status: 400 });
  }
}
