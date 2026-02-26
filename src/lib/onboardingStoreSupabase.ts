import { OnboardingQuizQuestion, OnboardingUnit } from "@/content/onboardingContent";
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

export async function readOnboardingStateFromSupabase(input: {
  unitsTable: string;
  quizTable: string;
  recordsTable: string;
  normalizeUnits: (units: unknown) => OnboardingUnit[];
  normalizeQuiz: (quiz: unknown) => OnboardingQuizQuestion[];
  normalizeRecords: (records: unknown) => OnboardingRecord[];
}) {
  const [unitsRows, quizRows, recordsRows] = await Promise.all([
    supabaseRequest(`/rest/v1/${input.unitsTable}?select=data&limit=1`).catch(() => []),
    supabaseRequest(`/rest/v1/${input.quizTable}?select=data&limit=1`).catch(() => []),
    supabaseRequest(`/rest/v1/${input.recordsTable}?select=*&order=email.asc`).catch(() => []),
  ]);

  const unitsData = Array.isArray(unitsRows) && unitsRows[0] ? (unitsRows[0] as { data?: unknown }).data : undefined;
  const quizData = Array.isArray(quizRows) && quizRows[0] ? (quizRows[0] as { data?: unknown }).data : undefined;

  return {
    units: input.normalizeUnits(unitsData),
    quiz: input.normalizeQuiz(quizData),
    records: input.normalizeRecords(recordsRows),
  };
}

export async function upsertOnboardingSupabaseRecords(recordsTable: string, records: OnboardingRecord[]) {
  await supabaseRequest(`/rest/v1/${recordsTable}?on_conflict=email`, {
    method: "POST",
    body: JSON.stringify(records),
  });
}

export async function writeOnboardingSupabaseUnits(unitsTable: string, units: OnboardingUnit[]) {
  await supabaseRequest(`/rest/v1/${unitsTable}?on_conflict=id`, {
    method: "POST",
    body: JSON.stringify([{ id: 1, data: units }]),
  });
}

export async function writeOnboardingSupabaseQuiz(quizTable: string, quiz: OnboardingQuizQuestion[]) {
  await supabaseRequest(`/rest/v1/${quizTable}?on_conflict=id`, {
    method: "POST",
    body: JSON.stringify([{ id: 1, data: quiz }]),
  });
}
