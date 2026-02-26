import type { OnboardingRecord } from "@/lib/onboardingStore";

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

export function hasOnboardingSupabaseStore(onboardingStore: string) {
  const { url, service } = getSupabaseEnv();
  if (onboardingStore === "json") return false;
  if (onboardingStore === "supabase") return Boolean(url && service);
  return process.env.NODE_ENV === "production" ? Boolean(url && service) : Boolean(url && service);
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
