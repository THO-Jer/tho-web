import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { IncidentStatus, UrgencyLevel, getIncidentById, recordIncidentEvent, resetIncidentTrackingPin, updateIncidentById } from "@/lib/incidentsStore";

export const dynamic = "force-dynamic";

const VALID_STATUS: IncidentStatus[] = ["Recibido", "En revisión", "Derivado", "Cerrado"];

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await readSession(_req);
  if (!session || !session.canIncidents || !session.isSuperAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const params = await context.params;
    const incident = await getIncidentById(params.id);
    if (!incident) return NextResponse.json({ error: "Caso no encontrado." }, { status: 404 });
    return NextResponse.json({ incident });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo obtener el caso." }, { status: 500 });
  }
}
const VALID_URGENCY: UrgencyLevel[] = ["Bajo", "Medio", "Alto"];

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await readSession(req);
  if (!session || !session.canIncidents || !session.isSuperAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const params = await context.params;

    if (payload.status && !VALID_STATUS.includes(payload.status)) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    }

    if (payload.urgency_level && !VALID_URGENCY.includes(payload.urgency_level)) {
      return NextResponse.json({ error: "Urgencia inválida." }, { status: 400 });
    }

    const updated = await updateIncidentById(
      params.id,
      {
        status: payload.status,
        process_phase: typeof payload.process_phase === "string" ? payload.process_phase : undefined,
        urgency_level: payload.urgency_level,
        director_notes: typeof payload.director_notes === "string" ? payload.director_notes : undefined,
        director_only_notes: typeof payload.director_only_notes === "string" ? payload.director_only_notes : undefined,
      },
      session.email,
      "superadmin"
    );

    return NextResponse.json({ incident: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el caso." }, { status: 400 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await readSession(req);
  if (!session || !session.canIncidents || !session.isSuperAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const params = await context.params;
    const action = String(payload.action || "");

    if (action === "reset_pin") {
      const result = await resetIncidentTrackingPin(params.id, session.email, "superadmin");
      return NextResponse.json({ ok: true, tracking_pin: result.trackingPin, incident: result.incident });
    }

    if (action === "mark_atendible") {
      const updated = await updateIncidentById(
        params.id,
        { status: "En revisión", process_phase: "Caso atendible por comité" },
        session.email,
        "superadmin"
      );
      await recordIncidentEvent(params.id, { action: "MARK_ATTENDABLE", detail: "Comité marca caso como atendible." }, session.email, "superadmin");
      return NextResponse.json({ ok: true, incident: updated });
    }

    if (action === "mark_no_atendible") {
      const updated = await updateIncidentById(
        params.id,
        { status: "Cerrado", process_phase: "Caso no atendible por comité" },
        session.email,
        "superadmin"
      );
      await recordIncidentEvent(params.id, { action: "MARK_NOT_ATTENDABLE", detail: "Comité marca caso como no atendible." }, session.email, "superadmin");
      return NextResponse.json({ ok: true, incident: updated });
    }

    if (action === "request_info") {
      const incident = await getIncidentById(params.id);
      if (!incident) {
        return NextResponse.json({ error: "Caso no encontrado." }, { status: 404 });
      }
      if (incident.anonymous) {
        return NextResponse.json({ error: "No puedes solicitar información adicional en reportes anónimos." }, { status: 400 });
      }

      const detail = typeof payload.detail === "string" && payload.detail.trim()
        ? payload.detail.trim()
        : "Comité solicita información adicional a la persona reportante.";

      const updated = await recordIncidentEvent(
        params.id,
        { action: "REQUEST_ADDITIONAL_INFO", detail },
        session.email,
        "superadmin"
      );
      return NextResponse.json({ ok: true, incident: updated });
    }

    return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo ejecutar acción." }, { status: 400 });
  }
}
