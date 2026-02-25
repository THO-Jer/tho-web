import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { IncidentStatus, updateIncidentById } from "@/lib/incidentsStore";

export const dynamic = "force-dynamic";

const VALID_STATUS: IncidentStatus[] = ["Recibido", "En revisión", "Derivado", "Cerrado"];

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await readSession(req);
  if (!session || !session.canIncidents) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const params = await context.params;

    if (payload.status && !VALID_STATUS.includes(payload.status)) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    }

    const updated = await updateIncidentById(params.id, {
      status: payload.status,
      director_notes: typeof payload.director_notes === "string" ? payload.director_notes : undefined,
    });

    return NextResponse.json({ incident: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el caso." }, { status: 400 });
  }
}
