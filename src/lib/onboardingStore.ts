import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultOnboardingQuiz, defaultOnboardingUnits, OnboardingQuizQuestion, OnboardingUnit } from "@/content/onboardingContent";
import { getStudioRoleTeamByEmail, hasOnboardingSupabaseStore, listOnboardingSupabaseRecords, upsertOnboardingSupabaseProgress, upsertOnboardingSupabaseQuizResult } from "@/lib/onboardingStoreSupabase";
import { getWritableDataPath } from "@/lib/storagePaths";


export type OnboardingTrack = "sales" | "creative_ops" | "advisory_ops" | "general";

const TRACK_MODULES: Record<OnboardingTrack, string[]> = {
  general: ["A"],
  sales: ["A", "B"],
  creative_ops: ["A", "C"],
  advisory_ops: ["A", "D"],
};

export type OnboardingQuizResult = {
  answered_at: string;
  score: number;
  total: number;
  topics_to_reinforce: string[];
  answers: Array<{ question_id: string; selected_index: number }>;
};

export type OnboardingRecord = {
  email: string;
  track: OnboardingTrack;
  started_at: string;
  completed_at?: string;
  completed_units: string[];
  last_seen_module?: string;
  last_seen_unit?: string;
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
const ONBOARDING_PROGRESS_TABLE = process.env.ONBOARDING_PROGRESS_TABLE || process.env.ONBOARDING_RECORDS_TABLE || "onboarding_progress";
const ONBOARDING_QUIZ_RESULTS_TABLE = process.env.ONBOARDING_QUIZ_RESULTS_TABLE || "onboarding_quiz_results";
const ONBOARDING_QUIZ_ATTEMPTS_TABLE = process.env.ONBOARDING_QUIZ_ATTEMPTS_TABLE || "onboarding_quiz_attempts";

function hasSupabaseStore() {
  return hasOnboardingSupabaseStore(ONBOARDING_STORE);
}

function getOnboardingStoreMode() {
  if (ONBOARDING_STORE === "json") return "json";
  if (hasSupabaseStore()) return "supabase";
  return "json";
}

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

function allowsQuizRetry() {
  return parseBool(process.env.ONBOARDING_QUIZ_ALLOW_RETRY, false);
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
    quizAllowRetry: allowsQuizRetry(),
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

function inferModuleSlug(unitSlug: string, units: OnboardingUnit[]) {
  const index = units.findIndex((u) => u.slug === unitSlug);
  if (index < 0) return undefined;
  const letter = getModuleLetterByIndex(index);
  return letter;
}

function normalizeRecords(records: unknown): OnboardingRecord[] {
  if (!Array.isArray(records)) return [];
  return records
    .map((record) => ({
      email: normalizeEmail(String((record as { email?: unknown }).email || "")),
      track: (["sales", "creative_ops", "advisory_ops", "general"].includes(String((record as { track?: unknown }).track || "")) ? String((record as { track?: unknown }).track) : "general") as "sales" | "creative_ops" | "advisory_ops" | "general",
      started_at: String((record as { started_at?: unknown }).started_at || new Date().toISOString()),
      completed_at: (record as { completed_at?: unknown }).completed_at ? String((record as { completed_at?: unknown }).completed_at) : undefined,
      completed_units: Array.isArray((record as { completed_units?: unknown[] }).completed_units)
        ? ((record as { completed_units?: unknown[] }).completed_units || []).map((unit) => String(unit)).filter(Boolean)
        : [],
      last_seen_module: (record as { last_seen_module?: unknown }).last_seen_module ? String((record as { last_seen_module?: unknown }).last_seen_module) : undefined,
      last_seen_unit: (record as { last_seen_unit?: unknown }).last_seen_unit ? String((record as { last_seen_unit?: unknown }).last_seen_unit) : undefined,
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
  const [records, content] = await Promise.all([
    listOnboardingSupabaseRecords({
      progressTable: ONBOARDING_PROGRESS_TABLE,
      quizResultsTable: ONBOARDING_QUIZ_RESULTS_TABLE,
    }),
    readStateFromJson(),
  ]);

  return {
    units: content.units,
    quiz: content.quiz,
    records,
  };
}

async function upsertSupabaseRecords(records: OnboardingRecord[]) {
  await Promise.all(records.map((record) => upsertOnboardingSupabaseProgress(ONBOARDING_PROGRESS_TABLE, record)));
  await Promise.all(records.map((record) => upsertOnboardingSupabaseQuizResult({
    quizResultsTable: ONBOARDING_QUIZ_RESULTS_TABLE,
    quizAttemptsTable: ONBOARDING_QUIZ_ATTEMPTS_TABLE,
    record,
  })));
}


function getModuleLetterByIndex(index: number) {
  return ["A", "B", "C", "D"][index] || String(index + 1);
}

function getApplicableUnitsByTrack(units: OnboardingUnit[], track: OnboardingTrack) {
  const allowed = new Set(TRACK_MODULES[track] || TRACK_MODULES.general);
  return units.filter((_, index) => allowed.has(getModuleLetterByIndex(index)));
}

function getUnitByTopic(units: OnboardingUnit[], topic: string) {
  const map: Record<string, string> = {
    identidad: "identidad-tho",
    ventas: "ventas-tho",
    operacion_creativa: "operacion-creativa",
    operacion_asesorias: "operacion-asesorias",
    operacion: "operacion-creativa",
    seguridad: "operacion-asesorias",
    onboarding: "identidad-tho",
  };
  const slug = map[topic];
  return units.find((unit) => unit.slug === slug) || units[0];
}

export function getRecommendationsFromTopics(units: OnboardingUnit[], topics: string[]) {
  return Array.from(new Set(topics.map((topic) => topic.trim()).filter(Boolean))).map((topic) => {
    const unit = getUnitByTopic(units, topic);
    return {
      topic,
      unitSlug: unit?.slug || units[0]?.slug || "",
      unitTitle: unit?.title || "Unidad sugerida",
    };
  }).filter((item) => item.unitSlug);
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
    track: await getStudioRoleTeamByEmail(normalized),
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
  const index = state.records.findIndex((row) => row.email === normalized);
  const current = index >= 0 ? state.records[index] : {
    email: normalized,
    track: await getStudioRoleTeamByEmail(normalized),
    started_at: now,
    completed_units: [],
    conversation_suggested: false,
    updated_at: now,
    last_access_at: now,
  };

  const applicableUnits = getApplicableUnitsByTrack(state.units, current.track || "general");
  const units = applicableUnits.map((u) => u.slug);
  if (!units.includes(unitSlug)) throw new Error("Unidad no aplicable para tu track.");

  const completed = Array.from(new Set([...current.completed_units, unitSlug]));
  const done = completed.length >= units.length;
  const next: OnboardingRecord = {
    ...current,
    track: current.track || "general",
    completed_units: completed,
    last_seen_unit: unitSlug,
    last_seen_module: inferModuleSlug(unitSlug, state.units),
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
  const index = state.records.findIndex((row) => row.email === normalized);
  const current = index >= 0 ? state.records[index] : {
    email: normalized,
    track: await getStudioRoleTeamByEmail(normalized),
    started_at: now,
    completed_units: [],
    conversation_suggested: false,
    updated_at: now,
    last_access_at: now,
  };

  const applicableUnits = getApplicableUnitsByTrack(state.units, current.track || "general");
  const applicableSlugs = new Set(applicableUnits.map((u) => u.slug));
  const filteredQuiz = state.quiz.filter((q) => {
    const unit = getUnitByTopic(state.units, q.topic);
    return unit ? applicableSlugs.has(unit.slug) : true;
  });

  const filteredIds = new Set(filteredQuiz.map((q) => q.id));
  const existingAnsweredCount = Array.isArray(current.quiz_result?.answers)
    ? current.quiz_result.answers.filter((row) => filteredIds.has(row.question_id)).length
    : 0;
  const isEvaluationComplete = filteredQuiz.length > 0 && existingAnsweredCount >= filteredQuiz.length;
  if (current.quiz_result && !allowsQuizRetry() && isEvaluationComplete) {
    throw new Error("La evaluación ya fue respondida.");
  }

  const questionMap = new Map(filteredQuiz.map((q) => [q.id, q]));
  let correct = 0;
  const failedTopics: string[] = [];
  for (const answer of answers) {
    const question = questionMap.get(answer.question_id);
    if (!question) continue;
    if (Number(answer.selected_index) === question.correctIndex) correct += 1;
    else failedTopics.push(question.topic);
  }

  const topicsToReinforce = Array.from(new Set(failedTopics));
  const total = filteredQuiz.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  const next: OnboardingRecord = {
    ...current,
    track: current.track || "general",
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
  return state.records
    .map((record) => {
      const applicableCount = Math.max(1, getApplicableUnitsByTrack(state.units, record.track).length);
      const progress = Math.round((record.completed_units.length / applicableCount) * 100);
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
  const state = await readStateFromJson();
  state.quiz = quiz;
  await writeStateToJson(state);
  return state.quiz;
}


export async function getApplicableOnboardingUnits(email: string) {
  const state = await readState();
  const record = await getOrCreateOnboardingRecord(email);
  return getApplicableUnitsByTrack(state.units, record.track);
}
