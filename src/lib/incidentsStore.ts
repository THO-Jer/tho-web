import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { getWritableDataPath } from "@/lib/storagePaths";

export type IncidentStatus = "Recibido" | "En revisión" | "Derivado" | "Cerrado";
export type IncidentType = "Acoso laboral" | "Acoso sexual" | "Maltrato" | "Conflicto ético" | "Otro";
export type UrgencyLevel = "Bajo" | "Medio" | "Alto";

export type IncidentAudit = {
  at: string;
  actor: string;
  action: string;
  detail?: string;
};

export type InternalIncident = {
  id: string;
  case_code: string;
  tracking_code: string;
  tracking_pin_hash: string;
  type: IncidentType;
  description: string;
  event_date: string;
  involved_people?: string;
  attachment_url?: string;
  anonymous: boolean;
  reporter_email?: string;
  created_at: string;
  status: IncidentStatus;
  process_phase: string;
  urgency_level: UrgencyLevel;
  suggested_action: string;
  director_notes?: string;
  last_updated_at: string;
  audit_log: IncidentAudit[];
  ip_hash?: string;
};

const INCIDENTS_PATH = getWritableDataPath("incidents", "incidents.json");
const STATUS_SLA_DAYS: Record<IncidentStatus, number> = {
  "Recibido": 3,
  "En revisión": 8,
  "Derivado": 15,
  "Cerrado": 30,
};

function getSecuritySalt() {
  return process.env.INCIDENT_SECURITY_SALT || process.env.INCIDENT_IP_SALT || "tho-incident-default-salt";
}

function pinHash(pin: string) {
  return crypto.createHash("sha256").update(`${getSecuritySalt()}:${pin}`).digest("hex");
}

function getPhaseFromStatus(status: IncidentStatus) {
  if (status === "Recibido") return "Admisibilidad inicial";
  if (status === "En revisión") return "Investigación interna";
  if (status === "Derivado") return "Derivación y medidas";
  return "Cierre y resguardo";
}

function generateTrackingCode() {
  return `SEG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function generateTrackingPin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function withDefaults(row: Partial<InternalIncident>): InternalIncident {
  const status = (row.status || "Recibido") as IncidentStatus;
  return {
    id: row.id || crypto.randomUUID(),
    case_code: row.case_code || `CCI-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    tracking_code: row.tracking_code || `LEGACY-${(row.case_code || "CASE").replace(/[^A-Za-z0-9-]/g, "")}`,
    tracking_pin_hash: row.tracking_pin_hash || "",
    type: (row.type || "Otro") as IncidentType,
    description: row.description || "",
    event_date: row.event_date || new Date().toISOString().slice(0, 10),
    involved_people: row.involved_people || undefined,
    attachment_url: row.attachment_url || undefined,
    anonymous: Boolean(row.anonymous),
    reporter_email: row.reporter_email || undefined,
    created_at: row.created_at || new Date().toISOString(),
    status,
    process_phase: row.process_phase || getPhaseFromStatus(status),
    urgency_level: (row.urgency_level || "Bajo") as UrgencyLevel,
    suggested_action: row.suggested_action || "",
    director_notes: row.director_notes || "",
    last_updated_at: row.last_updated_at || row.created_at || new Date().toISOString(),
    audit_log: Array.isArray(row.audit_log) ? row.audit_log : [],
    ip_hash: row.ip_hash || undefined,
  };
}

async function ensureStore() {
  await fs.mkdir(path.dirname(INCIDENTS_PATH), { recursive: true });
  try {
    await fs.access(INCIDENTS_PATH);
  } catch {
    await fs.writeFile(INCIDENTS_PATH, "[]", "utf8");
  }
}

async function readStore(): Promise<InternalIncident[]> {
  await ensureStore();
  const raw = await fs.readFile(INCIDENTS_PATH, "utf8");
  const rows = JSON.parse(raw) as Partial<InternalIncident>[];
  return rows.map(withDefaults).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

async function writeStore(rows: InternalIncident[]) {
  await ensureStore();
  await fs.writeFile(INCIDENTS_PATH, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

export function suggestUrgencyAndAction(type: IncidentType, description: string): { urgency: UrgencyLevel; action: string } {
  const text = description.toLowerCase();
  const highRiskKeywords = ["amenaza", "agresión", "violencia", "tocaciones", "represalia", "hostigamiento"];
  const mediumRiskKeywords = ["humillación", "insulto", "presión", "discriminación", "acoso"];

  const hasHighKeyword = highRiskKeywords.some((kw) => text.includes(kw));
  const hasMediumKeyword = mediumRiskKeywords.some((kw) => text.includes(kw));

  if (type === "Acoso sexual" || hasHighKeyword) {
    return { urgency: "Alto", action: "Activar protocolo formal y evaluar derivación externa inmediata." };
  }

  if (type === "Acoso laboral" || type === "Maltrato" || hasMediumKeyword) {
    return { urgency: "Medio", action: "Iniciar conversación privada y abrir revisión con protocolo interno." };
  }

  if (type === "Conflicto ético") {
    return { urgency: "Medio", action: "Levantar antecedentes y determinar medidas correctivas con jefatura." };
  }

  return { urgency: "Bajo", action: "Mantener observación y definir ruta de mediación o seguimiento." };
}

function generateCaseCode() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const short = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `CCI-${stamp}-${short}`;
}

function hashIp(ip: string | null | undefined) {
  if (!ip) return undefined;
  return crypto.createHash("sha256").update(`${getSecuritySalt()}:${ip}`).digest("hex");
}

export function getIncidentSla(status: IncidentStatus) {
  return STATUS_SLA_DAYS[status];
}

export function getIncidentPublicSnapshot(incident: InternalIncident) {
  const slaDays = getIncidentSla(incident.status);
  const startedAt = incident.last_updated_at || incident.created_at;
  const deadline = new Date(new Date(startedAt).getTime() + slaDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    case_code: incident.case_code,
    tracking_code: incident.tracking_code,
    status: incident.status,
    process_phase: incident.process_phase,
    status_started_at: startedAt,
    status_max_days: slaDays,
    status_deadline_at: deadline,
    legal_note: "Plazos referenciales para gestión interna alineada a Ley Karin.",
  };
}

export async function createIncident(input: {
  type: IncidentType;
  description: string;
  event_date: string;
  involved_people?: string;
  attachment_url?: string;
  anonymous: boolean;
  reporter_email?: string;
  sourceIp?: string;
}) {
  if (!input.type || !input.description?.trim() || !input.event_date) {
    throw new Error("Faltan campos obligatorios del incidente.");
  }

  if (!input.anonymous && !input.reporter_email?.trim()) {
    throw new Error("Si el reporte no es anónimo, debes indicar email de contacto.");
  }

  const now = new Date().toISOString();
  const suggested = suggestUrgencyAndAction(input.type, input.description);
  const trackingPin = generateTrackingPin();

  const created: InternalIncident = {
    id: crypto.randomUUID(),
    case_code: generateCaseCode(),
    tracking_code: generateTrackingCode(),
    tracking_pin_hash: pinHash(trackingPin),
    type: input.type,
    description: input.description.trim(),
    event_date: input.event_date,
    involved_people: input.involved_people?.trim() || undefined,
    attachment_url: input.attachment_url?.trim() || undefined,
    anonymous: Boolean(input.anonymous),
    reporter_email: input.anonymous ? undefined : input.reporter_email?.trim().toLowerCase(),
    created_at: now,
    status: "Recibido",
    process_phase: getPhaseFromStatus("Recibido"),
    urgency_level: suggested.urgency,
    suggested_action: suggested.action,
    director_notes: "",
    last_updated_at: now,
    ip_hash: hashIp(input.sourceIp),
    audit_log: [
      {
        at: now,
        actor: "system",
        action: "Caso creado",
        detail: "Ingreso de denuncia por canal confidencial.",
      },
    ],
  };

  const rows = await readStore();
  rows.unshift(created);
  await writeStore(rows);

  return { incident: created, trackingPin };
}

export async function attachIncidentEvidence(caseCode: string, attachmentUrl: string) {
  const rows = await readStore();
  const idx = rows.findIndex((row) => row.case_code === caseCode);
  if (idx < 0) throw new Error("Caso no encontrado para adjuntar evidencia.");

  const now = new Date().toISOString();
  rows[idx] = {
    ...rows[idx],
    attachment_url: attachmentUrl,
    last_updated_at: now,
    audit_log: [
      ...rows[idx].audit_log,
      { at: now, actor: "system", action: "Evidencia adjuntada", detail: attachmentUrl },
    ],
  };

  await writeStore(rows);
  return rows[idx];
}

export async function listIncidents() {
  return readStore();
}

export async function updateIncidentById(
  id: string,
  patch: { status?: IncidentStatus; director_notes?: string },
  actor = "director"
) {
  const rows = await readStore();
  const idx = rows.findIndex((row) => row.id === id);
  if (idx < 0) throw new Error("Caso no encontrado.");

  const current = rows[idx];
  const nextStatus = patch.status ?? current.status;
  const now = new Date().toISOString();
  const next: InternalIncident = {
    ...current,
    status: nextStatus,
    process_phase: getPhaseFromStatus(nextStatus),
    director_notes: typeof patch.director_notes === "string" ? patch.director_notes : current.director_notes,
    last_updated_at: now,
    audit_log: [
      ...current.audit_log,
      {
        at: now,
        actor,
        action: "Actualización de caso",
        detail: `Estado: ${current.status} -> ${nextStatus}`,
      },
    ],
  };

  rows[idx] = next;
  await writeStore(rows);
  return next;
}

export async function getIncidentByTracking(trackingCode: string, pin: string) {
  const rows = await readStore();
  const incident = rows.find((row) => row.tracking_code === trackingCode.trim().toUpperCase());
  if (!incident) return null;
  if (!incident.tracking_pin_hash) return null;

  if (incident.tracking_pin_hash !== pinHash(pin.trim())) {
    return null;
  }

  return getIncidentPublicSnapshot(incident);
}
