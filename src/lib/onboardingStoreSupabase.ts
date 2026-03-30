import type { OnboardingRecord } from "@/lib/onboardingStore";

export type OnboardingModuleState = "locked" | "in_progress" | "validated" | "failed_max_attempts";

export type OnboardingModuleStatusRow = {
  email: string;
  track: OnboardingRecord["track"];
  module: string;
  status: OnboardingModuleState;
  attempts_used: number;
  max_attempts: number;
  validated_at?: string;
  updated_at: string;
};

export type OnboardingQuizResultRow = {
  email: string;
  track: OnboardingRecord["track"];
  module_key: string;
  score: number;
  max_score: number;
  missed_topics: string[];
  submitted_at: string;
};

export type OnboardingQuizAttemptRow = OnboardingQuizResultRow & { id?: string; passed?: boolean };

type SupabaseEnv = { url: string; service: string };

function getSupabaseEnv(): SupabaseEnv {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, service };
}

async function supabaseRequest(pathname: string, init?: RequestInit) {
  const { url, service } = getSupabaseEnv();
  if (!url || !service) throw new Error("Supabase onboarding store no configurado.");

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
    throw new Error(`Supabase onboarding store error (${res.status}): ${body}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

function normalizeModuleState(value: unknown): OnboardingModuleState {
  const normalized = String(value || "locked").trim();
  if (["locked", "in_progress", "validated", "failed_max_attempts"].includes(normalized)) {
    return normalized as OnboardingModuleState;
  }
  return "locked";
}

export function hasOnboardingSupabaseStore(onboardingStore: string) {
  const { url, service } = getSupabaseEnv();
  if (onboardingStore === "json") return false;
  if (onboardingStore === "supabase") return Boolean(url && service);
  return process.env.NODE_ENV === "production" ? Boolean(url && service) : Boolean(url && service);
}

function isMissingColumnError(error: unknown, column: string) {
  const text = error instanceof Error ? error.message : String(error || "");
  return text.includes("PGRST204") && text.includes(`'${column}'`);
}

function normalizeTrack(value: unknown): OnboardingRecord["track"] {
  const track = String(value || "general").trim();
  if (["sales", "creative_ops", "advisory_ops", "general"].includes(track)) return track as OnboardingRecord["track"];
  return "general";
}

function recordFromProgressRow(row: Record<string, unknown>): OnboardingRecord {
  return {
    email: String(row.email || "").trim().toLowerCase(),
    track: normalizeTrack(row.track),
    started_at: String(row.created_at || row.updated_at || new Date().toISOString()),
    completed_at: row.completed_at ? String(row.completed_at) : undefined,
    completed_units: Array.isArray(row.completed_units) ? row.completed_units.map((u) => String(u)).filter(Boolean) : [],
    last_seen_module: row.last_seen_module ? String(row.last_seen_module) : undefined,
    last_seen_unit: row.last_seen_unit ? String(row.last_seen_unit) : undefined,
    conversation_suggested: false,
    internal_signal: undefined,
    updated_at: String(row.updated_at || new Date().toISOString()),
    last_access_at: String(row.last_saved_at || row.updated_at || new Date().toISOString()),
  };
}

export async function listOnboardingSupabaseRecords(input: {
  progressTable: string;
  quizResultsTable: string;
}) {
  const [progressRows, quizRows] = await Promise.all([
    supabaseRequest(`/rest/v1/${input.progressTable}?select=*&order=email.asc`).catch(() => []),
    supabaseRequest(`/rest/v1/${input.quizResultsTable}?select=*&order=email.asc`).catch(() => []),
  ]);

  const records = Array.isArray(progressRows)
    ? (progressRows as Array<Record<string, unknown>>).map(recordFromProgressRow).filter((r) => r.email)
    : [];

  const quizByEmail = new Map<string, Record<string, unknown>>();
  if (Array.isArray(quizRows)) {
    for (const row of quizRows as Array<Record<string, unknown>>) {
      const email = String(row.email || "").trim().toLowerCase();
      if (!email) continue;
      quizByEmail.set(email, row);
    }
  }

  return records.map((record) => {
    const quiz = quizByEmail.get(record.email);
    if (!quiz) return record;
    const score = Number(quiz.score || 0);
    const total = Number(quiz.max_score || 0);
    const missed = Array.isArray(quiz.missed_topics) ? quiz.missed_topics.map((t) => String(t)).filter(Boolean) : [];

    return {
      ...record,
      conversation_suggested: missed.length > 0,
      quiz_result: {
        answered_at: String(quiz.submitted_at || quiz.updated_at || new Date().toISOString()),
        score,
        total,
        topics_to_reinforce: missed,
        answers: [],
      },
      updated_at: String(quiz.updated_at || record.updated_at),
    };
  });
}

export async function upsertOnboardingSupabaseProgress(progressTable: string, record: OnboardingRecord) {
  await supabaseRequest(`/rest/v1/${progressTable}?on_conflict=email`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{
      email: record.email,
      track: record.track || "general",
      completed_units: record.completed_units,
      last_seen_module: record.last_seen_module || null,
      last_seen_unit: record.last_seen_unit || null,
      last_saved_at: record.last_access_at,
      completed_at: record.completed_at || null,
    }]),
  });
}

export async function upsertOnboardingSupabaseQuizResult(input: {
  quizResultsTable: string;
  quizAttemptsTable?: string;
  record: OnboardingRecord;
}) {
  if (!input.record.quiz_result) return;

  const quiz = input.record.quiz_result;
  await supabaseRequest(`/rest/v1/${input.quizResultsTable}?on_conflict=email`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{
      email: input.record.email,
      track: input.record.track || "general",
      score: quiz.score,
      max_score: quiz.total,
      missed_topics: quiz.topics_to_reinforce,
      submitted_at: quiz.answered_at,
    }]),
  });

  if (input.quizAttemptsTable) {
    await supabaseRequest(`/rest/v1/${input.quizAttemptsTable}`, {
      method: "POST",
      body: JSON.stringify([{
        email: input.record.email,
        track: input.record.track || "general",
        score: quiz.score,
        max_score: quiz.total,
        missed_topics: quiz.topics_to_reinforce,
        submitted_at: quiz.answered_at,
      }]),
    }).catch(() => null);
  }
}

export async function getOnboardingModuleStatusRows(input: { moduleStatusTable: string; email?: string; track?: string }) {
  const filters: string[] = ["select=*"];
  if (input.email) filters.push(`email=eq.${encodeURIComponent(input.email)}`);
  if (input.track) filters.push(`track=eq.${encodeURIComponent(input.track)}`);
  filters.push("order=module.asc", "order=updated_at.desc");
  const rows = await supabaseRequest(`/rest/v1/${input.moduleStatusTable}?${filters.join("&")}`).catch(() => []);
  if (!Array.isArray(rows)) return [] as OnboardingModuleStatusRow[];
  return (rows as Array<Record<string, unknown>>).map((row) => ({
    email: String(row.email || "").trim().toLowerCase(),
    track: normalizeTrack(row.track),
    module: String(row.module || row.module_key || "").trim(),
    status: normalizeModuleState(row.status),
    attempts_used: Math.max(0, Number(row.attempts_used || 0)),
    max_attempts: Math.max(1, Number(row.max_attempts || 3)),
    validated_at: row.validated_at ? String(row.validated_at) : undefined,
    updated_at: String(row.updated_at || new Date().toISOString()),
  })).filter((row) => row.email && row.module);
}

export async function upsertOnboardingModuleStatus(input: {
  moduleStatusTable: string;
  row: Omit<OnboardingModuleStatusRow, "updated_at"> & { updated_at?: string };
}) {
  const updatedAt = input.row.updated_at || new Date().toISOString();
  await supabaseRequest(`/rest/v1/${input.moduleStatusTable}?on_conflict=email,track,module`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{
      email: input.row.email,
      track: input.row.track,
      module: input.row.module,
      status: input.row.status,
      attempts_used: input.row.attempts_used,
      max_attempts: input.row.max_attempts,
      validated_at: input.row.validated_at || null,
      updated_at: updatedAt,
    }]),
  });
}

export async function getOnboardingQuizResultRows(input: { quizResultsTable: string; email?: string; track?: string }) {
  const filters: string[] = ["select=*"];
  if (input.email) filters.push(`email=eq.${encodeURIComponent(input.email)}`);
  if (input.track) filters.push(`track=eq.${encodeURIComponent(input.track)}`);
  filters.push("order=submitted_at.desc");
  const rows = await supabaseRequest(`/rest/v1/${input.quizResultsTable}?${filters.join("&")}`).catch(() => []);
  if (!Array.isArray(rows)) return [] as OnboardingQuizResultRow[];
  return (rows as Array<Record<string, unknown>>).map((row) => ({
    email: String(row.email || "").trim().toLowerCase(),
    track: normalizeTrack(row.track),
    module_key: String(row.module_key || row.module || "").trim(),
    score: Number(row.score || 0),
    max_score: Number(row.max_score || 0),
    missed_topics: Array.isArray(row.missed_topics) ? row.missed_topics.map((topic) => String(topic)).filter(Boolean) : [],
    submitted_at: String(row.submitted_at || row.updated_at || new Date().toISOString()),
  })).filter((row) => row.email && row.module_key);
}

export async function getOnboardingQuizAttemptRows(input: { quizAttemptsTable: string; email?: string; track?: string; moduleKey?: string }) {
  const filters: string[] = ["select=*"];
  if (input.email) filters.push(`email=eq.${encodeURIComponent(input.email)}`);
  if (input.track) filters.push(`track=eq.${encodeURIComponent(input.track)}`);
  filters.push("order=submitted_at.desc");
  const rows = await supabaseRequest(`/rest/v1/${input.quizAttemptsTable}?${filters.join("&")}`).catch(() => []);
  if (!Array.isArray(rows)) return [] as OnboardingQuizAttemptRow[];
  const mapped = (rows as Array<Record<string, unknown>>).map((row) => ({
    id: row.id ? String(row.id) : undefined,
    email: String(row.email || "").trim().toLowerCase(),
    track: normalizeTrack(row.track),
    module_key: String(row.module_key || row.module || "").trim(),
    score: Number(row.score || 0),
    max_score: Number(row.max_score || 0),
    missed_topics: Array.isArray(row.missed_topics) ? row.missed_topics.map((topic) => String(topic)).filter(Boolean) : [],
    passed: typeof row.passed === "boolean" ? row.passed : undefined,
    submitted_at: String(row.submitted_at || row.updated_at || new Date().toISOString()),
  })).filter((row) => row.email && row.module_key);
  return input.moduleKey ? mapped.filter((row) => row.module_key === input.moduleKey) : mapped;
}

export async function upsertOnboardingQuizResultByModule(input: {
  quizResultsTable: string;
  row: OnboardingQuizResultRow;
}) {
  const nextRow = {
    email: input.row.email,
    track: input.row.track,
    module: input.row.module_key,
    score: input.row.score,
    max_score: input.row.max_score,
    missed_topics: input.row.missed_topics,
    submitted_at: input.row.submitted_at,
  };

  try {
    await supabaseRequest(`/rest/v1/${input.quizResultsTable}?on_conflict=email,track,module`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify([nextRow]),
    });
  } catch (error) {
    if (!isMissingColumnError(error, "module")) throw error;
    await supabaseRequest(`/rest/v1/${input.quizResultsTable}?on_conflict=email,track,module_key`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify([input.row]),
    });
  }
}

export async function insertOnboardingQuizAttempt(input: { quizAttemptsTable: string; row: OnboardingQuizAttemptRow }) {
  const rowWithModule = {
    email: input.row.email,
    track: input.row.track,
    module: input.row.module_key,
    score: input.row.score,
    max_score: input.row.max_score,
    missed_topics: input.row.missed_topics,
    submitted_at: input.row.submitted_at,
    passed: input.row.passed,
  };

  const rowWithModuleKey = {
    email: input.row.email,
    track: input.row.track,
    module_key: input.row.module_key,
    score: input.row.score,
    max_score: input.row.max_score,
    missed_topics: input.row.missed_topics,
    submitted_at: input.row.submitted_at,
    passed: input.row.passed,
  };

  const rowWithModuleNoPassed = { ...rowWithModule };
  delete (rowWithModuleNoPassed as { passed?: boolean }).passed;
  const rowWithModuleKeyNoPassed = { ...rowWithModuleKey };
  delete (rowWithModuleKeyNoPassed as { passed?: boolean }).passed;

  try {
    await supabaseRequest(`/rest/v1/${input.quizAttemptsTable}`, {
      method: "POST",
      body: JSON.stringify([rowWithModule]),
    });
    return;
  } catch (error) {
    if (isMissingColumnError(error, "passed")) {
      await supabaseRequest(`/rest/v1/${input.quizAttemptsTable}`, {
        method: "POST",
        body: JSON.stringify([rowWithModuleNoPassed]),
      });
      return;
    }
    if (!isMissingColumnError(error, "module")) throw error;
  }

  try {
    await supabaseRequest(`/rest/v1/${input.quizAttemptsTable}`, {
      method: "POST",
      body: JSON.stringify([rowWithModuleKey]),
    });
  } catch (error) {
    if (isMissingColumnError(error, "passed")) {
      await supabaseRequest(`/rest/v1/${input.quizAttemptsTable}`, {
        method: "POST",
        body: JSON.stringify([rowWithModuleKeyNoPassed]),
      });
      return;
    }
    if (isMissingColumnError(error, "module_key")) return;
    throw error;
  }
}

export async function getOnboardingAdminOverviewRows(viewName = "onboarding_admin_overview") {
  const rows = await supabaseRequest(`/rest/v1/${viewName}?select=*`).catch(() => []);
  if (!Array.isArray(rows)) return [] as Array<Record<string, unknown>>;
  return rows as Array<Record<string, unknown>>;
}

export async function resetOnboardingModuleStatus(input: {
  moduleStatusTable: string;
  email: string;
  track: string;
  moduleKey: string;
}) {
  await supabaseRequest(`/rest/v1/${input.moduleStatusTable}?email=eq.${encodeURIComponent(input.email)}&track=eq.${encodeURIComponent(input.track)}&module=eq.${encodeURIComponent(input.moduleKey)}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "in_progress", attempts_used: 0, validated_at: null, updated_at: new Date().toISOString() }),
  });
}

export async function getStudioRoleTeamByEmail(email: string) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return "general" as const;

  const roleTable = process.env.STUDIO_ROLES_TABLE || "studio_roles";
  const rows = await supabaseRequest(`/rest/v1/${roleTable}?select=team&email=eq.${encodeURIComponent(normalized)}&limit=1`).catch(() => []);
  if (!Array.isArray(rows) || !rows.length) return "general" as const;

  const team = String((rows[0] as Record<string, unknown>).team || "general").trim();
  if (["sales", "creative_ops", "advisory_ops", "general"].includes(team)) {
    return team as "sales" | "creative_ops" | "advisory_ops" | "general";
  }

  return "general" as const;
}
