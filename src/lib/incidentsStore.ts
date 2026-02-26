import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { getWritableDataPath } from "@/lib/storagePaths";

export type IncidentStatus = "Recibido" | "En revisión" | "Derivado" | "Cerrado";
export type IncidentType = "Acoso laboral" | "Acoso sexual" | "Maltrato" | "Conflicto ético" | "Otro";
export type UrgencyLevel = "Bajo" | "Medio" | "Alto";

export type IncidentAudit = {
  at: string;
  actor_kind: string;
  actor_email?: string;
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
  attachments?: string[];
  anonymous: boolean;
  reporter_email?: string;
  created_at: string;
  status: IncidentStatus;
  process_phase: string;
  urgency_level: UrgencyLevel;
  suggested_action: string;
  director_notes?: string;
  internal_suggestion_urgency?: UrgencyLevel;
  internal_suggestion_action?: string;
  director_only_notes?: string;
  last_updated_at: string;
  audit_log: IncidentAudit[];
  ip_hash?: string;
};

const INCIDENTS_PATH = getWritableDataPath("incidents", "incidents.json");
const INCIDENTS_TABLE = process.env.INCIDENTS_TABLE || "incidents";
const INCIDENT_EVENTS_TABLE = process.env.INCIDENT_EVENTS_TABLE || "incident_events";
const INCIDENT_ATTACHMENTS_TABLE = process.env.INCIDENT_ATTACHMENTS_TABLE || "incident_attachments";

const STATUS_SLA_DAYS: Record<IncidentStatus, number> = {
  "Recibido": 3,
  "En revisión": 8,
  "Derivado": 15,
  "Cerrado": 30,
};

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, service };
}

function hasSupabaseStore() {
  const { url, service } = getSupabaseEnv();
  return Boolean(url && service);
}

function requireSupabaseInProduction() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

async function supabaseRequest(pathname: string, init?: RequestInit) {
  const { url, service } = getSupabaseEnv();
  if (!url || !service) throw new Error("Supabase incidents store no configurado");

  const res = await fetch(`${url}${pathname}`, {
    ...init,
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "content-type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase incidents store error (${res.status}): ${body}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

function getSecuritySalt() {
  return process.env.INCIDENT_SECURITY_SALT || process.env.INCIDENT_IP_SALT || "tho-incident-default-salt";
}

function pinHash(pin: string) {
  return crypto.scryptSync(pin, getSecuritySalt(), 64).toString("hex");
}

function isPinValid(pin: string, hash: string) {
  const left = Buffer.from(pinHash(pin.trim()), "hex");
  const right = Buffer.from(hash, "hex");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
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
    attachments: Array.isArray(row.attachments) ? row.attachments.filter(Boolean) : undefined,
    anonymous: Boolean(row.anonymous),
    reporter_email: row.reporter_email || undefined,
    created_at: row.created_at || new Date().toISOString(),
    status,
    process_phase: row.process_phase || getPhaseFromStatus(status),
    urgency_level: (row.urgency_level || "Bajo") as UrgencyLevel,
    suggested_action: row.suggested_action || "",
    director_notes: row.director_notes || "",
    internal_suggestion_urgency: (row.internal_suggestion_urgency || row.urgency_level || "Bajo") as UrgencyLevel,
    internal_suggestion_action: row.internal_suggestion_action || row.suggested_action || "",
    director_only_notes: row.director_only_notes || "",
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
  if (hasSupabaseStore()) {
    const incidents = (await supabaseRequest(`/rest/v1/${INCIDENTS_TABLE}?select=*&order=created_at.desc`)) as Array<Partial<InternalIncident>>;
    const events = (await supabaseRequest(`/rest/v1/${INCIDENT_EVENTS_TABLE}?select=incident_id,at,actor_kind,actor_email,actor,action,detail&order=at.asc`)) as Array<Record<string, unknown>>;
    const attachments = (await supabaseRequest(`/rest/v1/${INCIDENT_ATTACHMENTS_TABLE}?select=incident_id,url,created_at&order=created_at.desc`)) as Array<Record<string, unknown>>;

    const eventsByIncident = new Map<string, IncidentAudit[]>();
    for (const row of events) {
      const incidentId = String(row.incident_id || "");
      if (!incidentId) continue;
      const arr = eventsByIncident.get(incidentId) || [];
      arr.push({
        at: String(row.at || new Date().toISOString()),
        actor_kind: String(row.actor_kind || "system"),
        actor_email: row.actor_email ? String(row.actor_email) : undefined,
        actor: String(row.actor || row.actor_email || row.actor_kind || "system"),
        action: String(row.action || "Evento"),
        detail: row.detail ? String(row.detail) : undefined,
      });
      eventsByIncident.set(incidentId, arr);
    }

    const attachmentMap = new Map<string, string[]>();
    for (const row of attachments) {
      const incidentId = String(row.incident_id || "");
      if (!incidentId) continue;
      const arr = attachmentMap.get(incidentId) || [];
      const url = String(row.url || "");
      if (url) arr.push(url);
      attachmentMap.set(incidentId, arr);
    }

    return incidents.map((row) => withDefaults({ ...row, attachments: attachmentMap.get(String(row.id || "")) || [], audit_log: eventsByIncident.get(String(row.id || "")) || [] }));
  }

  if (requireSupabaseInProduction()) {
    throw new Error("Debes configurar Supabase para incidents en producción.");
  }

  await ensureStore();
  const raw = await fs.readFile(INCIDENTS_PATH, "utf8");
  const rows = JSON.parse(raw) as Partial<InternalIncident>[];
  return rows.map(withDefaults).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

async function writeStore(rows: InternalIncident[]) {
  if (hasSupabaseStore()) return;
  if (requireSupabaseInProduction()) throw new Error("Debes configurar Supabase para incidents en producción.");
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
  return {
    status: incident.status,
    process_phase: incident.process_phase,
    last_updated_at: incident.last_updated_at || incident.created_at,
    institutional_note: "Canal interno de THO con confidencialidad y debido proceso en cada etapa.",
  };
}

export async function createIncident(input: {
  type: IncidentType;
  description: string;
  event_date: string;
  involved_people?: string;
  attachments?: string[];
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

    anonymous: Boolean(input.anonymous),
    reporter_email: input.anonymous ? undefined : input.reporter_email?.trim().toLowerCase(),
    created_at: now,
    status: "Recibido",
    process_phase: getPhaseFromStatus("Recibido"),
    urgency_level: suggested.urgency,
    suggested_action: suggested.action,
    director_notes: "",
    internal_suggestion_urgency: suggested.urgency,
    internal_suggestion_action: suggested.action,
    director_only_notes: "",
    last_updated_at: now,
    ip_hash: hashIp(input.sourceIp),
    audit_log: [
      {
        at: now,
        actor_kind: "system",
        actor_email: undefined,
        actor: "system",
        action: "Caso creado",
        detail: "Ingreso de denuncia por canal confidencial.",
      },
    ],
  };

  if (hasSupabaseStore()) {
    await supabaseRequest(`/rest/v1/${INCIDENTS_TABLE}`, {
      method: "POST",
      body: JSON.stringify([{
        ...created,
      }]),
    });
    await supabaseRequest(`/rest/v1/${INCIDENT_EVENTS_TABLE}`, {
      method: "POST",
      body: JSON.stringify([{ incident_id: created.id, at: now, actor_kind: "system", actor_email: null, actor: "system", action: "Caso creado", detail: "Ingreso de denuncia por canal confidencial." }]),
    });
    return { incident: created, trackingPin };
  }

  const rows = await readStore();
  rows.unshift(created);
  await writeStore(rows);

  return { incident: created, trackingPin };
}

export async function attachIncidentEvidence(caseCode: string, attachmentUrl: string) {
  if (hasSupabaseStore()) {
    const matches = (await supabaseRequest(`/rest/v1/${INCIDENTS_TABLE}?select=*&case_code=eq.${encodeURIComponent(caseCode)}&limit=1`)) as Array<Partial<InternalIncident>>;
    const incident = matches[0];
    if (!incident?.id) throw new Error("Caso no encontrado para adjuntar evidencia.");

    const now = new Date().toISOString();
    await supabaseRequest(`/rest/v1/${INCIDENT_ATTACHMENTS_TABLE}`, {
      method: "POST",
      body: JSON.stringify([{ incident_id: incident.id, url: attachmentUrl, created_at: now }]),
    });
    await supabaseRequest(`/rest/v1/${INCIDENT_EVENTS_TABLE}`, {
      method: "POST",
      body: JSON.stringify([{ incident_id: incident.id, at: now, actor_kind: "system", actor_email: null, actor: "system", action: "Evidencia adjuntada", detail: attachmentUrl }]),
    });
    const refreshed = (await supabaseRequest(`/rest/v1/${INCIDENTS_TABLE}?select=*&id=eq.${encodeURIComponent(String(incident.id))}&limit=1`)) as Array<Partial<InternalIncident>>;
    return withDefaults({ ...(refreshed[0] || incident), attachments: [attachmentUrl] });
  }

  const rows = await readStore();
  const idx = rows.findIndex((row) => row.case_code === caseCode);
  if (idx < 0) throw new Error("Caso no encontrado para adjuntar evidencia.");

  const now = new Date().toISOString();
  rows[idx] = {
    ...rows[idx],
attachments: [...(rows[idx].attachments || []), attachmentUrl],
    last_updated_at: now,
    audit_log: [
      ...rows[idx].audit_log,
      { at: now, actor_kind: "system", actor_email: undefined, actor: "system", action: "Evidencia adjuntada", detail: attachmentUrl },
    ],
  };

  await writeStore(rows);
  return rows[idx];
}

export async function listIncidents() {
  return readStore();
}


async function appendIncidentEvent(input: { incidentId: string; actorKind: string; actorEmail?: string; actor: string; action: string; detail?: string; at?: string }) {
  const at = input.at || new Date().toISOString();
  if (hasSupabaseStore()) {
    await supabaseRequest(`/rest/v1/${INCIDENT_EVENTS_TABLE}`, {
      method: "POST",
      body: JSON.stringify([{
        incident_id: input.incidentId,
        at,
        actor_kind: input.actorKind,
        actor_email: input.actorEmail || null,
        actor: input.actor,
        action: input.action,
        detail: input.detail || null,
      }]),
    });
    return;
  }
}

export async function updateIncidentById(
  id: string,
  patch: { status?: IncidentStatus; director_notes?: string; director_only_notes?: string },
  actor = "director",
  actorKind = "admin"
) {
  if (hasSupabaseStore()) {
    const rows = (await supabaseRequest(`/rest/v1/${INCIDENTS_TABLE}?select=*&id=eq.${encodeURIComponent(id)}&limit=1`)) as Array<Partial<InternalIncident>>;
    const current = rows[0];
    if (!current) throw new Error("Caso no encontrado.");

    const now = new Date().toISOString();
    const nextStatus = (patch.status || current.status || "Recibido") as IncidentStatus;
    const updatedRows = (await supabaseRequest(`/rest/v1/${INCIDENTS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: nextStatus,
        process_phase: getPhaseFromStatus(nextStatus),
        director_notes: typeof patch.director_notes === "string" ? patch.director_notes : current.director_notes || "",
        director_only_notes: typeof patch.director_only_notes === "string" ? patch.director_only_notes : current.director_only_notes || "",
        last_updated_at: now,
      }),
    })) as Array<Partial<InternalIncident>>;

    await appendIncidentEvent({
      incidentId: id,
      actorKind,
      actorEmail: actor.includes("@") ? actor : undefined,
      actor,
      action: "UPDATE_STATUS",
      detail: `Estado: ${current.status} -> ${nextStatus}` ,
      at: now,
    });

    if (typeof patch.director_notes === "string") {
      await appendIncidentEvent({
        incidentId: id,
        actorKind,
        actorEmail: actor.includes("@") ? actor : undefined,
        actor,
        action: "ADD_NOTE",
        detail: "Actualiza notas de gestión",
        at: now,
      });
    }

    return withDefaults(updatedRows[0]);
  }

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
    director_only_notes: typeof patch.director_only_notes === "string" ? patch.director_only_notes : current.director_only_notes,
    last_updated_at: now,
    audit_log: [
      ...current.audit_log,
      {
        at: now,
        actor_kind: "director",
        actor_email: actor.includes("@") ? actor : undefined,
        actor,
        action: "UPDATE_STATUS",
        detail: `Estado: ${current.status} -> ${nextStatus}`,
      },
    ],
  };

  rows[idx] = next;
  await writeStore(rows);
  return next;
}


export async function resetIncidentTrackingPin(id: string, actor = "admin", actorKind = "admin") {
  const newPin = generateTrackingPin();
  const hash = pinHash(newPin);
  const now = new Date().toISOString();

  if (hasSupabaseStore()) {
    const rows = (await supabaseRequest(`/rest/v1/${INCIDENTS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ tracking_pin_hash: hash, last_updated_at: now }),
    })) as Array<Partial<InternalIncident>>;
    if (!rows[0]) throw new Error("Caso no encontrado.");
    await appendIncidentEvent({
      incidentId: id,
      actorKind,
      actorEmail: actor.includes("@") ? actor : undefined,
      actor,
      action: "RESET_PIN",
      detail: "Rotación manual de PIN por administración",
      at: now,
    });
    return { incident: withDefaults(rows[0]), trackingPin: newPin };
  }

  const rows = await readStore();
  const idx = rows.findIndex((row) => row.id === id);
  if (idx < 0) throw new Error("Caso no encontrado.");
  rows[idx] = {
    ...rows[idx],
    tracking_pin_hash: hash,
    last_updated_at: now,
    audit_log: [
      ...rows[idx].audit_log,
      {
        at: now,
        actor_kind: actorKind,
        actor_email: actor.includes("@") ? actor : undefined,
        actor,
        action: "RESET_PIN",
        detail: "Rotación manual de PIN por administración",
      },
    ],
  };
  await writeStore(rows);
  return { incident: rows[idx], trackingPin: newPin };
}

export async function getIncidentByTracking(trackingCode: string, pin: string) {
  const rows = await readStore();
  const incident = rows.find((row) => row.tracking_code === trackingCode.trim().toUpperCase());
  if (!incident) return null;
  if (!incident.tracking_pin_hash) return null;

  if (!isPinValid(pin, incident.tracking_pin_hash)) return null;

  return getIncidentPublicSnapshot(incident);
}
