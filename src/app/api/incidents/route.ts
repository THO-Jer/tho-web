import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { attachIncidentEvidence, createIncident, IncidentType } from "@/lib/incidentsStore";

export const dynamic = "force-dynamic";

const VALID_TYPES: IncidentType[] = ["Acoso laboral", "Acoso sexual", "Maltrato", "Conflicto ético", "Otro"];
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_EXT = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp", ".doc", ".docx"]);

function getSourceIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return req.headers.get("x-real-ip") || undefined;
}

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, "");
}

async function saveAttachment(file: File, caseCode: string) {
  const ext = path.extname(file.name || "").toLowerCase();
  if (!ALLOWED_FILE_EXT.has(ext)) {
    throw new Error("Formato de evidencia no soportado.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("El archivo supera el máximo de 10MB.");
  }

  const safeCaseCode = sanitizeSegment(caseCode);
  const dir = path.join(process.cwd(), "public", "uploads", "incidents", safeCaseCode);
  await fs.mkdir(dir, { recursive: true });

  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 50) || "evidencia";
  const filename = `${Date.now()}-${baseName}${ext}`;
  const fullPath = path.join(dir, filename);
  const bytes = await file.arrayBuffer();
  await fs.writeFile(fullPath, Buffer.from(bytes));

  return `/uploads/incidents/${safeCaseCode}/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const type = String(form.get("type") || "") as IncidentType;
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Tipo de incidente inválido." }, { status: 400 });
    }

    const created = await createIncident({
      type,
      description: String(form.get("description") || ""),
      event_date: String(form.get("event_date") || ""),
      involved_people: String(form.get("involved_people") || ""),
      anonymous: String(form.get("anonymous") || "true") === "true",
      reporter_email: form.get("reporter_email") ? String(form.get("reporter_email")) : undefined,
      sourceIp: getSourceIp(req),
    });

    const file = form.get("evidence_file");
    if (file instanceof File && file.size > 0) {
      const attachmentUrl = await saveAttachment(file, created.incident.case_code);
      await attachIncidentEvidence(created.incident.case_code, attachmentUrl);
    }

    return NextResponse.json(
      {
        case_code: created.incident.case_code,
        tracking_code: created.incident.tracking_code,
        tracking_pin: created.trackingPin,
        created_at: created.incident.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo registrar el incidente." }, { status: 400 });
  }
}
