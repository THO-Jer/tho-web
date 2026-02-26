import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { IncidentStatus, resetIncidentTrackingPin, updateIncidentById } from "@/lib/incidentsStore";

export const dynamic = "force-dynamic";

const VALID_STATUS: IncidentStatus[] = ["Recibido", "En revisión", "Derivado", "Cerrado"];

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await readSession(req);
  if (!session || !session.canIncidents || !session.canManageAccess) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const params = await context.params;

    if (payload.status && !VALID_STATUS.includes(payload.status)) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    }

    const updated = await updateIncidentById(
      params.id,
      {
        status: payload.status,
        director_notes: typeof payload.director_notes === "string" ? payload.director_notes : undefined,
      },
      session.email,
      "admin"
    );

    return NextResponse.json({ incident: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el caso." }, { status: 400 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await readSession(req);
  if (!session || !session.canIncidents || !session.canManageAccess) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    if (String(payload.action || "") !== "reset_pin") {
      return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
    }

    const params = await context.params;
    const result = await resetIncidentTrackingPin(params.id, session.email, "admin");
    return NextResponse.json({ ok: true, tracking_pin: result.trackingPin, incident: result.incident });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo resetear PIN." }, { status: 400 });
  }
}
