import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

type AuditIssue = {
  id: string;
  module: "access" | "onboarding" | "incidents";
  severity: "error" | "warning";
  message: string;
  fixSql?: string;
};

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, service };
}

async function supabaseRequest(pathname: string) {
  const { url, service } = getSupabaseEnv();
  if (!url || !service) throw new Error("Supabase no configurado para auditoría.");

  const res = await fetch(`${url}${pathname}`, {
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "content-type": "application/json",
    },
    cache: "no-store",
  });

  const body = await res.text();
  if (!res.ok) throw new Error(`Supabase audit error (${res.status}): ${body}`);
  return body;
}

function escapeColumns(columns: string[]) {
  return columns.map((col) => encodeURIComponent(col)).join(",");
}

async function checkTableColumns(table: string, columns: string[]) {
  try {
    await supabaseRequest(`/rest/v1/${table}?select=${escapeColumns(columns)}&limit=1`);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : String(error) };
  }
}

function hasMissingColumn(error: string, column: string) {
  return error.includes("PGRST204") && error.includes(column);
}

function hasMissingTable(error: string) {
  return error.includes("42P01") || error.toLowerCase().includes("does not exist") || error.toLowerCase().includes("relation");
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!session.canManageAccess) return NextResponse.json({ error: "Solo superadmin puede auditar." }, { status: 403 });

  const { url, service } = getSupabaseEnv();
  if (!url || !service) {
    return NextResponse.json({
      ok: false,
      configured: false,
      issues: [{
        id: "supabase_not_configured",
        module: "access",
        severity: "error",
        message: "Supabase no está configurado (falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY).",
      } satisfies AuditIssue],
    });
  }

  const issues: AuditIssue[] = [];

  const rolesCheck = await checkTableColumns(process.env.STUDIO_ROLES_TABLE || "studio_roles", [
    "email",
    "provider",
    "active",
    "blocked",
    "role",
    "can_blog",
    "can_crm",
    "can_incidents",
    "can_onboarding",
    "updated_at",
  ]);

  if (!rolesCheck.ok) {
    if (hasMissingColumn(rolesCheck.error, "can_onboarding")) {
      issues.push({
        id: "studio_roles_missing_can_onboarding",
        module: "access",
        severity: "warning",
        message: "La tabla studio_roles no tiene la columna can_onboarding. Se puede seguir operando, pero no persistirá ese permiso.",
        fixSql: "ALTER TABLE public.studio_roles ADD COLUMN IF NOT EXISTS can_onboarding boolean NOT NULL DEFAULT true;",
      });
    } else if (hasMissingTable(rolesCheck.error)) {
      issues.push({
        id: "studio_roles_missing_table",
        module: "access",
        severity: "error",
        message: "No existe la tabla studio_roles.",
        fixSql: "-- crea studio_roles según docs/supabase-migration-canal-confidencial.md",
      });
    } else {
      issues.push({ id: "studio_roles_unknown", module: "access", severity: "error", message: rolesCheck.error });
    }
  }

  const onboardingProgressCheck = await checkTableColumns(process.env.ONBOARDING_PROGRESS_TABLE || "onboarding_progress", [
    "email",
    "track",
    "completed_units",
    "last_seen_module",
    "last_seen_unit",
    "last_saved_at",
    "completed_at",
  ]);

  if (!onboardingProgressCheck.ok) {
    issues.push({
      id: "onboarding_progress_missing_or_invalid",
      module: "onboarding",
      severity: "error",
      message: "onboarding_progress no existe o no coincide con columnas esperadas.",
      fixSql: "-- ejecuta el schema de onboarding (onboarding_progress / onboarding_quiz_results) en Supabase SQL editor",
    });
  }

  const onboardingQuizCheck = await checkTableColumns(process.env.ONBOARDING_QUIZ_RESULTS_TABLE || "onboarding_quiz_results", [
    "email",
    "track",
    "score",
    "max_score",
    "missed_topics",
    "submitted_at",
  ]);

  if (!onboardingQuizCheck.ok) {
    issues.push({
      id: "onboarding_quiz_results_missing_or_invalid",
      module: "onboarding",
      severity: "error",
      message: "onboarding_quiz_results no existe o no coincide con columnas esperadas.",
      fixSql: "-- ejecuta el schema de onboarding_quiz_results en Supabase SQL editor",
    });
  }

  const incidentsCheck = await checkTableColumns(process.env.INCIDENTS_TABLE || "incidents", ["id", "case_code", "tracking_code", "tracking_pin_hash", "status", "process_phase", "created_at"]);
  if (!incidentsCheck.ok) {
    issues.push({
      id: "incidents_missing_or_invalid",
      module: "incidents",
      severity: "error",
      message: "La tabla incidents no existe o no coincide con columnas esperadas.",
      fixSql: "-- ejecuta el schema de incidents / incident_events / incident_attachments",
    });
  }

  const eventsCheck = await checkTableColumns(process.env.INCIDENT_EVENTS_TABLE || "incident_events", ["incident_id", "at", "action", "actor_kind", "actor_email"]);
  if (!eventsCheck.ok) {
    issues.push({
      id: "incident_events_missing_or_invalid",
      module: "incidents",
      severity: "error",
      message: "La tabla incident_events no existe o no coincide con columnas esperadas.",
    });
  }

  const attachmentsCheck = await checkTableColumns(process.env.INCIDENT_ATTACHMENTS_TABLE || "incident_attachments", ["incident_id", "url", "created_at"]);
  if (!attachmentsCheck.ok) {
    issues.push({
      id: "incident_attachments_missing_or_invalid",
      module: "incidents",
      severity: "warning",
      message: "La tabla incident_attachments no existe o no coincide con columnas esperadas.",
    });
  }

  return NextResponse.json({
    ok: issues.length === 0,
    configured: true,
    checkedAt: new Date().toISOString(),
    issues,
  });
}
