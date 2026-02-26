import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultOnboardingQuiz, defaultOnboardingUnits, OnboardingQuizQuestion, OnboardingUnit } from "@/content/onboardingContent";
import { getWritableDataPath } from "@/lib/storagePaths";

export type OnboardingQuizResult = {
  answered_at: string;
  score: number;
  total: number;
  topics_to_reinforce: string[];
  answers: Array<{ question_id: string; selected_index: number }>;
};

export type OnboardingRecord = {
  email: string;
  started_at: string;
  completed_at?: string;
  completed_units: string[];
  conversation_suggested: boolean;
  internal_signal?: string;
  updated_at: string;
  last_access_at: string;
  quiz_result?: OnboardingQuizResult;
};

type OnboardingState = {
  units: OnboardingUnit[];
  quiz: OnboardingQuizQuestion[];
  records: OnboardingRecord[];
};

const ONBOARDING_PATH = getWritableDataPath("studio", "onboarding.json");
const ONBOARDING_STORE = (process.env.ONBOARDING_STORE || "").trim().toLowerCase();
const ONBOARDING_UNITS_TABLE = process.env.ONBOARDING_UNITS_TABLE || "studio_onboarding_units";
const ONBOARDING_RECORDS_TABLE = process.env.ONBOARDING_RECORDS_TABLE || "studio_onboarding_records";
const ONBOARDING_QUIZ_TABLE = process.env.ONBOARDING_QUIZ_TABLE || "studio_onboarding_quiz";

function normalizeEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

function parseBool(value: string | undefined, fallback: boolean) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, service };
}

function hasSupabaseStore() {
  const { url, service } = getSupabaseEnv();
  if (ONBOARDING_STORE === "json") return false;
  if (ONBOARDING_STORE === "supabase") return Boolean(url && service);
  return Boolean(url && service);
}

export function getOnboardingStoreMode() {
  return hasSupabaseStore() ? "supabase" : "json";
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

export function getOnboardingConfig() {
  const required = parseBool(process.env.ONBOARDING_REQUIRED, true);
  const blockInternal = parseBool(process.env.ONBOARDING_BLOCK_INTERNAL, false);
  const adminEmails = (process.env.ONBOARDING_ADMIN_EMAILS || "")
    .split(",")
    .map((v) => normalizeEmail(v))
    .filter(Boolean);

  return {
    required,
    blockInternal,
    adminEmails,
    store: getOnboardingStoreMode(),
    persistenceNote: hasSupabaseStore()
      ? "Persistencia en Supabase (sobrevive reinicios y redeploy)."
      : "Persistencia en JSON local (/tmp en Vercel puede ser efímero).",
  };
}

export function canManageOnboarding(email: string, role?: string, canManageAccess?: boolean) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  const { adminEmails } = getOnboardingConfig();
  if (adminEmails.includes(normalized)) return true;
  if (role === "superadmin") return true;
  return Boolean(canManageAccess);
}

async function ensureStore() {
  await fs.mkdir(path.dirname(ONBOARDING_PATH), { recursive: true });
  try {
    await fs.access(ONBOARDING_PATH);
  } catch {
    const initial: OnboardingState = { units: defaultOnboardingUnits, quiz: defaultOnboardingQuiz, records: [] };
    await fs.writeFile(ONBOARDING_PATH, `${JSON.stringify(initial, null, 2)}\n`, "utf8");
  }
}

function normalizeUnits(units: unknown): OnboardingUnit[] {
  if (!Array.isArray(units) || !units.length) return defaultOnboardingUnits;
  const parsed = units.map((unit) => ({
    slug: String((unit as { slug?: unknown }).slug || "").trim(),
    title: String((unit as { title?: unknown }).title || "").trim(),
    summary: String((unit as { summary?: unknown }).summary || "").trim(),
    durationMinutes: Math.max(1, Number((unit as { durationMinutes?: unknown }).durationMinutes || 10)),
    content: Array.isArray((unit as { content?: unknown[] }).content)
      ? ((unit as { content?: unknown[] }).content || []).map((row) => String(row || "").trim()).filter(Boolean)
      : [],
    resources: Array.isArray((unit as { resources?: unknown[] }).resources)
      ? ((unit as { resources?: unknown[] }).resources || [])
          .map((resource) => ({
            label: String((resource as { label?: unknown }).label || "Recurso").trim(),
            href: String((resource as { href?: unknown }).href || "").trim(),
          }))
          .filter((resource) => resource.href)
      : undefined,
  })).filter((unit) => unit.slug && unit.title && unit.content.length > 0);
  return parsed.length ? parsed : defaultOnboardingUnits;
}

function normalizeQuiz(quiz: unknown): OnboardingQuizQuestion[] {
  if (!Array.isArray(quiz) || !quiz.length) return defaultOnboardingQuiz;
  const parsed = quiz.map((row) => ({
    id: String((row as { id?: unknown }).id || "").trim(),
    prompt: String((row as { prompt?: unknown }).prompt || "").trim(),
    options: Array.isArray((row as { options?: unknown[] }).options)
      ? ((row as { options?: unknown[] }).options || []).map((opt) => String(opt || "").trim()).filter(Boolean)
      : [],
    correctIndex: Math.max(0, Number((row as { correctIndex?: unknown }).correctIndex || 0)),
    topic: String((row as { topic?: unknown }).topic || "general").trim(),
  })).filter((question) => question.id && question.prompt && question.options.length >= 2 && question.correctIndex < question.options.length);
  return parsed.length ? parsed : defaultOnboardingQuiz;
}

function normalizeRecords(records: unknown): OnboardingRecord[] {
  if (!Array.isArray(records)) return [];
  return records
    .map((record) => ({
      email: normalizeEmail(String((record as { email?: unknown }).email || "")),
      started_at: String((record as { started_at?: unknown }).started_at || new Date().toISOString()),
      completed_at: (record as { completed_at?: unknown }).completed_at ? String((record as { completed_at?: unknown }).completed_at) : undefined,
      completed_units: Array.isArray((record as { completed_units?: unknown[] }).completed_units)
        ? ((record as { completed_units?: unknown[] }).completed_units || []).map((unit) => String(unit)).filter(Boolean)
        : [],
      conversation_suggested: Boolean((record as { conversation_suggested?: unknown }).conversation_suggested),
      internal_signal: (record as { internal_signal?: unknown }).internal_signal ? String((record as { internal_signal?: unknown }).internal_signal) : undefined,
      updated_at: String((record as { updated_at?: unknown }).updated_at || new Date().toISOString()),
      last_access_at: String((record as { last_access_at?: unknown }).last_access_at || (record as { updated_at?: unknown }).updated_at || new Date().toISOString()),
      quiz_result: (record as { quiz_result?: unknown }).quiz_result
        ? {
          answered_at: String(((record as { quiz_result?: { answered_at?: unknown } }).quiz_result?.answered_at) || new Date().toISOString()),
          score: Number(((record as { quiz_result?: { score?: unknown } }).quiz_result?.score) || 0),
          total: Number(((record as { quiz_result?: { total?: unknown } }).quiz_result?.total) || 0),
          topics_to_reinforce: Array.isArray((record as { quiz_result?: { topics_to_reinforce?: unknown[] } }).quiz_result?.topics_to_reinforce)
            ? ((record as { quiz_result?: { topics_to_reinforce?: unknown[] } }).quiz_result?.topics_to_reinforce || []).map((t) => String(t))
            : [],
          answers: Array.isArray((record as { quiz_result?: { answers?: unknown[] } }).quiz_result?.answers)
            ? ((record as { quiz_result?: { answers?: unknown[] } }).quiz_result?.answers || []).map((answer) => ({
              question_id: String((answer as { question_id?: unknown }).question_id || ""),
              selected_index: Number((answer as { selected_index?: unknown }).selected_index || 0),
            })).filter((answer) => answer.question_id)
            : [],
        }
        : undefined,
    }))
    .filter((record) => record.email);
}

async function readStateFromJson(): Promise<OnboardingState> {
  await ensureStore();
  const raw = await fs.readFile(ONBOARDING_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<OnboardingState>;

  return {
    units: normalizeUnits(parsed.units),
    quiz: normalizeQuiz(parsed.quiz),
    records: normalizeRecords(parsed.records),
  };
}

async function writeStateToJson(state: OnboardingState) {
  await ensureStore();
  await fs.writeFile(ONBOARDING_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

async function readStateFromSupabase(): Promise<OnboardingState> {
  const [unitsRows, quizRows, recordsRows] = await Promise.all([
    supabaseRequest(`/rest/v1/${ONBOARDING_UNITS_TABLE}?select=data&limit=1`).catch(() => []),
    supabaseRequest(`/rest/v1/${ONBOARDING_QUIZ_TABLE}?select=data&limit=1`).catch(() => []),
    supabaseRequest(`/rest/v1/${ONBOARDING_RECORDS_TABLE}?select=*&order=email.asc`).catch(() => []),
  ]);

  const unitsData = Array.isArray(unitsRows) && unitsRows[0] ? (unitsRows[0] as { data?: unknown }).data : undefined;
  const quizData = Array.isArray(quizRows) && quizRows[0] ? (quizRows[0] as { data?: unknown }).data : undefined;

  return {
    units: normalizeUnits(unitsData),
    quiz: normalizeQuiz(quizData),
    records: normalizeRecords(recordsRows),
  };
}

async function upsertSupabaseRecords(records: OnboardingRecord[]) {
  await supabaseRequest(`/rest/v1/${ONBOARDING_RECORDS_TABLE}?on_conflict=email`, {
    method: "POST",
    body: JSON.stringify(records),
  });
}

async function writeUnitsToSupabase(units: OnboardingUnit[]) {
  await supabaseRequest(`/rest/v1/${ONBOARDING_UNITS_TABLE}?on_conflict=id`, {
    method: "POST",
    body: JSON.stringify([{ id: 1, data: units }]),
  });
}

async function writeQuizToSupabase(quiz: OnboardingQuizQuestion[]) {
  await supabaseRequest(`/rest/v1/${ONBOARDING_QUIZ_TABLE}?on_conflict=id`, {
    method: "POST",
    body: JSON.stringify([{ id: 1, data: quiz }]),
  });
}

async function readState(): Promise<OnboardingState> {
  if (hasSupabaseStore()) return readStateFromSupabase();
  return readStateFromJson();
}

export async function getUnits() {
  const state = await readState();
  return state.units;
}

export async function getQuizForParticipant() {
  const state = await readState();
  return state.quiz.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    options: question.options,
    topic: question.topic,
  }));
}

export async function getQuizForAdmin() {
  const state = await readState();
  return state.quiz;
}

export async function setUnits(units: OnboardingUnit[]) {
  if (hasSupabaseStore()) {
    await writeUnitsToSupabase(units);
    return units;
  }

  const state = await readStateFromJson();
  state.units = units;
  await writeStateToJson(state);
  return state.units;
}

export async function getOrCreateOnboardingRecord(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido para onboarding.");

  const state = await readState();
  const now = new Date().toISOString();
  const index = state.records.findIndex((row) => row.email === normalized);

  if (index >= 0) {
    const updated = { ...state.records[index], last_access_at: now, updated_at: now };
    if (hasSupabaseStore()) await upsertSupabaseRecords([updated]);
    else {
      state.records[index] = updated;
      await writeStateToJson(state);
    }
    return updated;
  }

  const created: OnboardingRecord = {
    email: normalized,
    started_at: now,
    completed_units: [],
    conversation_suggested: false,
    updated_at: now,
    last_access_at: now,
  };

  if (hasSupabaseStore()) await upsertSupabaseRecords([created]);
  else {
    state.records.push(created);
    await writeStateToJson(state);
  }
  return created;
}

export async function markUnitCompleted(email: string, unitSlug: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido.");
  if (!unitSlug.trim()) throw new Error("Unidad inválida.");

  const state = await readState();
  const now = new Date().toISOString();
  const units = state.units.map((u) => u.slug);
  if (!units.includes(unitSlug)) throw new Error("Unidad no encontrada.");

  const index = state.records.findIndex((row) => row.email === normalized);
  const current = index >= 0 ? state.records[index] : {
    email: normalized,
    started_at: now,
    completed_units: [],
    conversation_suggested: false,
    updated_at: now,
    last_access_at: now,
  };

  const completed = Array.from(new Set([...current.completed_units, unitSlug]));
  const done = completed.length >= units.length;
  const next: OnboardingRecord = {
    ...current,
    completed_units: completed,
    completed_at: done ? (current.completed_at || now) : undefined,
    conversation_suggested: done ? false : current.conversation_suggested,
    updated_at: now,
    last_access_at: now,
  };

  if (hasSupabaseStore()) await upsertSupabaseRecords([next]);
  else {
    if (index >= 0) state.records[index] = next;
    else state.records.push(next);
    await writeStateToJson(state);
  }

  return next;
}

export async function submitQuiz(email: string, answers: Array<{ question_id: string; selected_index: number }>) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido.");

  const state = await readState();
  const now = new Date().toISOString();
  const questionMap = new Map(state.quiz.map((q) => [q.id, q]));

  let correct = 0;
  const failedTopics: string[] = [];
  for (const answer of answers) {
    const question = questionMap.get(answer.question_id);
    if (!question) continue;
    if (Number(answer.selected_index) === question.correctIndex) correct += 1;
    else failedTopics.push(question.topic);
  }

  const topicsToReinforce = Array.from(new Set(failedTopics));
  const total = state.quiz.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  const index = state.records.findIndex((row) => row.email === normalized);
  const current = index >= 0 ? state.records[index] : {
    email: normalized,
    started_at: now,
    completed_units: [],
    conversation_suggested: false,
    updated_at: now,
    last_access_at: now,
  };

  const next: OnboardingRecord = {
    ...current,
    updated_at: now,
    last_access_at: now,
    completed_at: current.completed_at || now,
    conversation_suggested: topicsToReinforce.length > 0,
    quiz_result: {
      answered_at: now,
      score,
      total,
      topics_to_reinforce: topicsToReinforce,
      answers,
    },
  };

  if (hasSupabaseStore()) await upsertSupabaseRecords([next]);
  else {
    if (index >= 0) state.records[index] = next;
    else state.records.push(next);
    await writeStateToJson(state);
  }

  return next;
}

export async function listOnboardingRecords() {
  const state = await readState();
  const unitsCount = Math.max(1, state.units.length);

  return state.records
    .map((record) => {
      const progress = Math.round((record.completed_units.length / unitsCount) * 100);
      const autoConversationSuggested = !record.completed_at && progress > 0 && progress < 100;
      return {
        ...record,
        progress,
        conversation_suggested: record.conversation_suggested || autoConversationSuggested,
      };
    })
    .sort((a, b) => a.email.localeCompare(b.email, "es"));
}

export async function setQuiz(quiz: OnboardingQuizQuestion[]) {
  if (hasSupabaseStore()) {
    await writeQuizToSupabase(quiz);
    return quiz;
  }

  const state = await readStateFromJson();
  state.quiz = quiz;
  await writeStateToJson(state);
  return state.quiz;
}
