import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultOnboardingQuiz, defaultOnboardingUnits, OnboardingQuizQuestion, OnboardingUnit } from "@/content/onboardingContent";
import {
  getOnboardingAdminOverviewRows,
  getOnboardingModuleStatusRows,
  getOnboardingQuizAttemptRows,
  getOnboardingQuizResultRows,
  getStudioRoleTeamByEmail,
  hasOnboardingSupabaseStore,
  insertOnboardingQuizAttempt,
  listOnboardingSupabaseRecords,
  OnboardingModuleState,
  resetOnboardingModuleStatus,
  upsertOnboardingModuleStatus,
  upsertOnboardingQuizResultByModule,
  upsertOnboardingSupabaseProgress,
} from "@/lib/onboardingStoreSupabase";
import { getWritableDataPath } from "@/lib/storagePaths";

export type OnboardingTrack = "sales" | "creative_ops" | "advisory_ops" | "general";

type ModuleKey = "A" | "B" | "C" | "D";

const TRACK_MODULES: Record<OnboardingTrack, ModuleKey[]> = {
  general: ["A"],
  sales: ["A", "B"],
  creative_ops: ["A", "C"],
  advisory_ops: ["A", "D"],
};

const MODULE_MAX_ATTEMPTS = Math.max(1, Number(process.env.ONBOARDING_MAX_ATTEMPTS_DEFAULT || 3));
const PASS_SCORE_PERCENT = Number(process.env.ONBOARDING_PASS_PERCENT || process.env.ONBOARDING_PASS_SCORE_PERCENT || 80);
const MIN_LESSON_TIME_SECONDS = Math.max(0, Number(process.env.MIN_LESSON_TIME_SECONDS || 12));

const ONBOARDING_PATH = getWritableDataPath("studio", "onboarding.json");
const ONBOARDING_STORE = (process.env.ONBOARDING_STORE || "").trim().toLowerCase();
const ONBOARDING_PROGRESS_TABLE = process.env.ONBOARDING_PROGRESS_TABLE || "onboarding_progress";
const ONBOARDING_MODULE_STATUS_TABLE = process.env.ONBOARDING_MODULE_STATUS_TABLE || "onboarding_module_status";
const ONBOARDING_QUIZ_RESULTS_TABLE = process.env.ONBOARDING_QUIZ_RESULTS_TABLE || "onboarding_quiz_results";
const ONBOARDING_QUIZ_ATTEMPTS_TABLE = process.env.ONBOARDING_QUIZ_ATTEMPTS_TABLE || "onboarding_quiz_attempts";
const ONBOARDING_ADMIN_OVERVIEW_VIEW = process.env.ONBOARDING_ADMIN_OVERVIEW_VIEW || "onboarding_admin_overview";

export type OnboardingQuizResult = {
  answered_at: string;
  score: number;
  total: number;
  topics_to_reinforce: string[];
  answers: Array<{ question_id: string; selected_index: number }>;
  module_key?: string;
};

export type OnboardingRecord = {
  email: string;
  track: OnboardingTrack;
  started_at: string;
  completed_at?: string;
  completed_units: string[];
  last_seen_module?: string;
  last_seen_unit?: string;
  updated_at: string;
  last_access_at: string;
  conversation_suggested?: boolean;
  internal_signal?: string;
  quiz_result?: OnboardingQuizResult;
};

export type ModuleStatus = {
  moduleKey: ModuleKey;
  status: OnboardingModuleState;
  attempts: number;
  maxAttempts: number;
  validatedAt?: string;
};

export type OnboardingSummary = {
  progress: number;
  completed: boolean;
  completed_units: string[];
  last_seen_unit?: string;
  last_saved_at?: string;
  module_status: ModuleStatus[];
  can_access: { blog: boolean; incidents: boolean; crmStudio: boolean };
};

type OnboardingState = {
  units: OnboardingUnit[];
  quiz: OnboardingQuizQuestion[];
  records: OnboardingRecord[];
  moduleStatusByEmail: Record<string, Record<string, ModuleStatus>>;
  quizAttemptsByEmail: Record<string, Array<{ module_key: string; score: number; max_score: number; missed_topics: string[]; submitted_at: string }>>;
};

function hasSupabaseStore() {
  return hasOnboardingSupabaseStore(ONBOARDING_STORE);
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

function moduleKeyByIndex(index: number): ModuleKey {
  return (["A", "B", "C", "D"][index] || "A") as ModuleKey;
}

function indexByModuleKey(moduleKey: string) {
  return ["A", "B", "C", "D"].indexOf(moduleKey);
}

function getUnitByModuleKey(units: OnboardingUnit[], moduleKey: string) {
  const index = indexByModuleKey(moduleKey);
  return index >= 0 ? units[index] : null;
}

function getOnboardingStoreMode() {
  if (ONBOARDING_STORE === "json") return "json";
  if (hasSupabaseStore()) return "supabase";
  return "json";
}

export function getOnboardingConfig() {
  return {
    required: parseBool(process.env.ONBOARDING_REQUIRED, true),
    blockInternal: parseBool(process.env.ONBOARDING_BLOCK_INTERNAL, false),
    store: getOnboardingStoreMode(),
    persistenceNote: hasSupabaseStore() ? "Persistencia en Supabase." : "Persistencia en JSON local.",
    passScore: PASS_SCORE_PERCENT,
    maxAttempts: MODULE_MAX_ATTEMPTS,
    minLessonTimeSeconds: MIN_LESSON_TIME_SECONDS,
  };
}

export function canManageOnboarding(email: string, role?: string, canManageAccess?: boolean) {
  if (!normalizeEmail(email)) return false;
  if (role === "superadmin") return true;
  return Boolean(canManageAccess);
}

async function ensureStore() {
  await fs.mkdir(path.dirname(ONBOARDING_PATH), { recursive: true });
  try {
    await fs.access(ONBOARDING_PATH);
  } catch {
    const initial: OnboardingState = {
      units: defaultOnboardingUnits,
      quiz: defaultOnboardingQuiz,
      records: [],
      moduleStatusByEmail: {},
      quizAttemptsByEmail: {},
    };
    await fs.writeFile(ONBOARDING_PATH, `${JSON.stringify(initial, null, 2)}\n`, "utf8");
  }
}

async function readStateFromJson(): Promise<OnboardingState> {
  await ensureStore();
  const raw = await fs.readFile(ONBOARDING_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<OnboardingState>;
  return {
    units: Array.isArray(parsed.units) && parsed.units.length ? (parsed.units as OnboardingUnit[]) : defaultOnboardingUnits,
    quiz: Array.isArray(parsed.quiz) && parsed.quiz.length ? (parsed.quiz as OnboardingQuizQuestion[]) : defaultOnboardingQuiz,
    records: Array.isArray(parsed.records) ? (parsed.records as OnboardingRecord[]) : [],
    moduleStatusByEmail: parsed.moduleStatusByEmail || {},
    quizAttemptsByEmail: parsed.quizAttemptsByEmail || {},
  };
}

async function writeStateToJson(state: OnboardingState) {
  await ensureStore();
  await fs.writeFile(ONBOARDING_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

async function readStateFromSupabase(): Promise<OnboardingState> {
  const [records, content, moduleRows, quizRows] = await Promise.all([
    listOnboardingSupabaseRecords({ progressTable: ONBOARDING_PROGRESS_TABLE, quizResultsTable: ONBOARDING_QUIZ_RESULTS_TABLE }),
    readStateFromJson(),
    getOnboardingModuleStatusRows({ moduleStatusTable: ONBOARDING_MODULE_STATUS_TABLE }),
    getOnboardingQuizAttemptRows({ quizAttemptsTable: ONBOARDING_QUIZ_ATTEMPTS_TABLE }),
  ]);

  const moduleStatusByEmail: OnboardingState["moduleStatusByEmail"] = {};
  for (const row of moduleRows) {
    const email = normalizeEmail(row.email);
    if (!moduleStatusByEmail[email]) moduleStatusByEmail[email] = {};
    moduleStatusByEmail[email][row.module] = {
      moduleKey: row.module as ModuleKey,
      status: row.status,
      attempts: row.attempts_used,
      maxAttempts: row.max_attempts,
      validatedAt: row.validated_at,
    };
  }

  const quizAttemptsByEmail: OnboardingState["quizAttemptsByEmail"] = {};
  for (const row of quizRows) {
    const email = normalizeEmail(row.email);
    if (!quizAttemptsByEmail[email]) quizAttemptsByEmail[email] = [];
    quizAttemptsByEmail[email].push({
      module_key: row.module_key,
      score: row.score,
      max_score: row.max_score,
      missed_topics: row.missed_topics,
      submitted_at: row.submitted_at,
    });
  }

  return {
    units: content.units,
    quiz: content.quiz,
    records,
    moduleStatusByEmail,
    quizAttemptsByEmail,
  };
}

async function readState() {
  return hasSupabaseStore() ? readStateFromSupabase() : readStateFromJson();
}

function getTrackModules(track: OnboardingTrack) {
  return TRACK_MODULES[track] || TRACK_MODULES.general;
}

function getApplicableUnitsByTrack(units: OnboardingUnit[], track: OnboardingTrack) {
  const allowed = new Set(getTrackModules(track));
  return units.filter((_, i) => allowed.has(moduleKeyByIndex(i)));
}

function getUnitByTopic(units: OnboardingUnit[], topic: string) {
  const t = topic.toLowerCase();
  const byUnit: Record<string, string[]> = {
    "identidad-tho": ["identidad", "onboarding"],
    "ventas-tho": ["ventas"],
    "operacion-creativa": ["operacion_creativa", "operacion"],
    "operacion-asesorias": ["operacion_asesorias", "seguridad"],
  };
  return units.find((unit) => (byUnit[unit.slug] || []).some((prefix) => t.startsWith(prefix)));
}



function parseLessonIds(content: string[]) {
  return content.map((paragraph, index) => {
    const normalized = String(paragraph || "").replace(/\s+/g, " ").trim();
    const match = normalized.match(/^([A-Z]\d+|Reflexión guiada sugerida|Venta consultiva en THO|Cierre del módulo)\s*[—:-]\s*(.+)$/i);
    if (match) return String(match[1]).trim();
    return `L${index + 1}`;
  });
}

function defaultModuleStatus(moduleKey: ModuleKey): ModuleStatus {
  return { moduleKey, status: moduleKey === "A" ? "in_progress" : "locked", attempts: 0, maxAttempts: MODULE_MAX_ATTEMPTS };
}

function computeModuleStatuses(record: OnboardingRecord, state: OnboardingState): ModuleStatus[] {
  const email = normalizeEmail(record.email);
  const stored = state.moduleStatusByEmail[email] || {};
  const modules = getTrackModules(record.track);
  const statuses: ModuleStatus[] = modules.map((moduleKey) => {
    const row = stored[moduleKey];
    return row || defaultModuleStatus(moduleKey);
  });

  let hasValidatedPrevious = true;
  return statuses.map((status) => {
    if (status.moduleKey === "A") {
      hasValidatedPrevious = status.status === "validated";
      return status;
    }
    if (!hasValidatedPrevious && status.status === "locked") return status;
    if (hasValidatedPrevious && status.status === "locked") {
      const next = { ...status, status: "in_progress" as OnboardingModuleState };
      hasValidatedPrevious = false;
      return next;
    }
    hasValidatedPrevious = status.status === "validated";
    return status;
  });
}

function getModuleStatus(statuses: ModuleStatus[], moduleKey: string) {
  return statuses.find((item) => item.moduleKey === moduleKey);
}

function getAccessFlags(statuses: ModuleStatus[], email: string, role?: string) {
  const normalized = normalizeEmail(email);
  const isBypass = role === "superadmin" && normalized === "jeremias@tho.cl";
  if (isBypass) return { blog: true, incidents: true, crmStudio: true };

  const aValidated = getModuleStatus(statuses, "A")?.status === "validated";
  const bValidated = getModuleStatus(statuses, "B")?.status === "validated";
  return {
    blog: aValidated,
    incidents: aValidated,
    crmStudio: aValidated && bValidated,
  };
}

function summarizeOnboarding(record: OnboardingRecord, state: OnboardingState, role?: string): OnboardingSummary {
  const units = getApplicableUnitsByTrack(state.units, record.track);
  const statuses = computeModuleStatuses(record, state);
  const completedSet = new Set(record.completed_units || []);
  const requiredLessonTags = units.flatMap((unit, idx) => {
    const moduleKey = moduleKeyByIndex(idx);
    return parseLessonIds(unit.content).map((lessonId) => `${moduleKey}:${lessonId}`);
  });
  const completedLessons = requiredLessonTags.filter((tag) => completedSet.has(tag)).length;
  const progress = requiredLessonTags.length ? Math.round((completedLessons / requiredLessonTags.length) * 100) : 0;
  const completed = statuses.every((status) => status.status === "validated" || ["C", "D"].includes(status.moduleKey));
  return {
    progress,
    completed,
    completed_units: Array.from(completedSet),
    last_seen_unit: record.last_seen_unit,
    last_saved_at: record.last_access_at,
    module_status: statuses,
    can_access: getAccessFlags(statuses, record.email, role),
  };
}

async function persistRecord(state: OnboardingState, record: OnboardingRecord) {
  const index = state.records.findIndex((r) => r.email === record.email);
  if (index >= 0) state.records[index] = record;
  else state.records.push(record);

  if (hasSupabaseStore()) {
    await upsertOnboardingSupabaseProgress(ONBOARDING_PROGRESS_TABLE, record);
  } else {
    await writeStateToJson(state);
  }
}

async function persistModuleStatus(record: OnboardingRecord, status: ModuleStatus, state: OnboardingState) {
  const email = normalizeEmail(record.email);
  if (!state.moduleStatusByEmail[email]) state.moduleStatusByEmail[email] = {};
  state.moduleStatusByEmail[email][status.moduleKey] = status;

  if (hasSupabaseStore()) {
    await upsertOnboardingModuleStatus({
      moduleStatusTable: ONBOARDING_MODULE_STATUS_TABLE,
      row: {
        email,
        track: record.track,
        module: status.moduleKey,
        status: status.status,
        attempts_used: status.attempts,
        max_attempts: status.maxAttempts,
        validated_at: status.validatedAt,
      },
    });
  }
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

export async function setQuiz(quiz: OnboardingQuizQuestion[]) {
  const state = await readStateFromJson();
  state.quiz = quiz;
  await writeStateToJson(state);
  return state.quiz;
}

export async function getOrCreateOnboardingRecord(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido.");

  const state = await readState();
  const now = new Date().toISOString();
  const existing = state.records.find((row) => row.email === normalized);
  if (existing) {
    const updated = { ...existing, last_access_at: now, updated_at: now };
    await persistRecord(state, updated);
    return updated;
  }

  const created: OnboardingRecord = {
    email: normalized,
    track: await getStudioRoleTeamByEmail(normalized),
    started_at: now,
    completed_units: [],
    updated_at: now,
    last_access_at: now,
  };
  await persistRecord(state, created);
  return created;
}

export async function markLessonCompleted(email: string, moduleKey: string, lessonId: string, unitSlug: string, elapsedSeconds = 0, reachedEnd = false) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido.");
  if (!lessonId.trim()) throw new Error("Lección inválida.");

  const state = await readState();
  const now = new Date().toISOString();
  const current = (state.records.find((r) => r.email === normalized)) || {
    email: normalized,
    track: await getStudioRoleTeamByEmail(normalized),
    started_at: now,
    completed_units: [],
    updated_at: now,
    last_access_at: now,
  };

  if (elapsedSeconds < MIN_LESSON_TIME_SECONDS || !reachedEnd) {
    throw new Error(`Para completar la lección debes llegar al final y permanecer al menos ${MIN_LESSON_TIME_SECONDS} segundos.`);
  }

  const tag = `${moduleKey}:${lessonId}`;
  const completed = Array.from(new Set([...(current.completed_units || []), tag]));
  const nextRecord: OnboardingRecord = {
    ...current,
    completed_units: completed,
    last_seen_module: moduleKey,
    last_seen_unit: unitSlug,
    updated_at: now,
    last_access_at: now,
  };

  const statuses = computeModuleStatuses(nextRecord, state);
  const moduleStatus = getModuleStatus(statuses, moduleKey);
  if (moduleStatus && moduleStatus.status === "locked") {
    throw new Error("Módulo bloqueado hasta validar el anterior.");
  }
  if (moduleStatus && moduleStatus.status !== "validated") {
    await persistModuleStatus(nextRecord, { ...moduleStatus, status: "in_progress" }, state);
  }

  await persistRecord(state, nextRecord);
  if (!hasSupabaseStore()) await writeStateToJson(state);
  return { record: nextRecord, summary: summarizeOnboarding(nextRecord, state) };
}

export async function submitModuleQuiz(email: string, moduleKey: string, answers: Array<{ question_id: string; selected_index: number }>) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido.");

  const state = await readState();
  const now = new Date().toISOString();
  const current = (state.records.find((r) => r.email === normalized)) || {
    email: normalized,
    track: await getStudioRoleTeamByEmail(normalized),
    started_at: now,
    completed_units: [],
    updated_at: now,
    last_access_at: now,
  };

  const statuses = computeModuleStatuses(current, state);
  const currentStatus = getModuleStatus(statuses, moduleKey);
  if (!currentStatus) throw new Error("Módulo no aplicable.");
  if (currentStatus.status === "failed_max_attempts" || currentStatus.attempts >= currentStatus.maxAttempts) {
    throw new Error("Se alcanzó el máximo de intentos. Solicita reset de superadmin.");
  }

  const unit = getUnitByModuleKey(state.units, moduleKey);
  if (!unit) throw new Error("Módulo no configurado.");

  const requiredLessonTags = new Set(parseLessonIds(unit.content).map((lessonId) => `${moduleKey}:${lessonId}`));
  const completedSet = new Set(current.completed_units || []);
  const allLessonsCompleted = Array.from(requiredLessonTags).every((tag) => completedSet.has(tag));
  if (!allLessonsCompleted) {
    throw new Error("Debes completar todas las lecciones del módulo antes de enviar la evaluación.");
  }

  const moduleQuiz = state.quiz.filter((q) => getUnitByTopic(state.units, q.topic)?.slug === unit.slug);
  const map = new Map(moduleQuiz.map((q) => [q.id, q]));
  if (!moduleQuiz.length) throw new Error("No hay evaluación para este módulo.");

  let correct = 0;
  const missedTopics: string[] = [];
  for (const answer of answers) {
    const question = map.get(answer.question_id);
    if (!question) continue;
    if (Number(answer.selected_index) === question.correctIndex) correct += 1;
    else missedTopics.push(question.topic);
  }

  const total = moduleQuiz.length;
  const score = Math.round((correct / total) * 100);
  const passed = score >= PASS_SCORE_PERCENT;
  const attempts = currentStatus.attempts + 1;
  const nextStatus: ModuleStatus = {
    ...currentStatus,
    attempts,
    status: passed ? "validated" : attempts >= currentStatus.maxAttempts ? "failed_max_attempts" : "in_progress",
    validatedAt: passed ? now : undefined,
  };

  const nextRecord: OnboardingRecord = {
    ...current,
    last_seen_module: moduleKey,
    updated_at: now,
    last_access_at: now,
    quiz_result: {
      answered_at: now,
      score,
      total,
      topics_to_reinforce: Array.from(new Set(missedTopics)),
      answers,
      module_key: moduleKey,
    },
  };

  await persistModuleStatus(nextRecord, nextStatus, state);
  await persistRecord(state, nextRecord);

  if (hasSupabaseStore()) {
    await upsertOnboardingQuizResultByModule({
      quizResultsTable: ONBOARDING_QUIZ_RESULTS_TABLE,
      row: {
        email: nextRecord.email,
        track: nextRecord.track,
        module_key: moduleKey,
        score,
        max_score: total,
        missed_topics: Array.from(new Set(missedTopics)),
        submitted_at: now,
      },
    });
    await insertOnboardingQuizAttempt({
      quizAttemptsTable: ONBOARDING_QUIZ_ATTEMPTS_TABLE,
      row: {
        email: nextRecord.email,
        track: nextRecord.track,
        module_key: moduleKey,
        score,
        max_score: total,
        missed_topics: Array.from(new Set(missedTopics)),
        submitted_at: now,
        passed,
      },
    });
  } else {
    if (!state.quizAttemptsByEmail[nextRecord.email]) state.quizAttemptsByEmail[nextRecord.email] = [];
    state.quizAttemptsByEmail[nextRecord.email].unshift({ module_key: moduleKey, score, max_score: total, missed_topics: Array.from(new Set(missedTopics)), submitted_at: now });
    await writeStateToJson(state);
  }

  return {
    record: nextRecord,
    summary: summarizeOnboarding(nextRecord, state),
    moduleStatus: nextStatus,
    passed,
    topics_to_reinforce: Array.from(new Set(missedTopics)),
  };
}

export function getRecommendationsFromTopics(units: OnboardingUnit[], topics: string[]) {
  const unique = Array.from(new Set(topics.map((topic) => topic.trim().toLowerCase()).filter(Boolean)));
  return unique.map((topic) => {
    const unit = getUnitByTopic(units, topic);
    return {
      topic,
      unitSlug: unit?.slug || units[0]?.slug || "",
      unitTitle: unit?.title || units[0]?.title || "Revisar onboarding",
    };
  });
}

export async function getApplicableOnboardingUnits(email: string) {
  const state = await readState();
  const record = await getOrCreateOnboardingRecord(email);
  return getApplicableUnitsByTrack(state.units, record.track);
}

export async function getOnboardingSnapshot(email: string, role?: string) {
  const state = await readState();
  const record = await getOrCreateOnboardingRecord(email);
  const units = getApplicableUnitsByTrack(state.units, record.track);
  const summary = summarizeOnboarding(record, state, role);
  const quiz = await getQuizForParticipant();
  const quizResults = hasSupabaseStore()
    ? await getOnboardingQuizResultRows({ quizResultsTable: ONBOARDING_QUIZ_RESULTS_TABLE, email: record.email, track: record.track })
    : [];
  return { units, record, summary, quiz, quizResults };
}

export async function listOnboardingRecords() {
  const state = await readState();
  return state.records.map((record) => {
    const summary = summarizeOnboarding(record, state);
    return {
      ...record,
      progress: summary.progress,
      completed_at: summary.completed ? record.updated_at : undefined,
      module_status: summary.module_status,
      can_access: summary.can_access,
      conversation_suggested: Boolean(record.quiz_result?.topics_to_reinforce?.length),
    };
  }).sort((a, b) => a.email.localeCompare(b.email, "es"));
}

export async function getAdminOverview() {
  if (!hasSupabaseStore()) return [] as Array<Record<string, unknown>>;
  return getOnboardingAdminOverviewRows(ONBOARDING_ADMIN_OVERVIEW_VIEW);
}

export async function getUserQuizAttempts(email: string, track: string, moduleKey?: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return [];
  if (hasSupabaseStore()) {
    return getOnboardingQuizAttemptRows({ quizAttemptsTable: ONBOARDING_QUIZ_ATTEMPTS_TABLE, email: normalized, track, moduleKey });
  }
  const state = await readStateFromJson();
  return (state.quizAttemptsByEmail[normalized] || []).filter((row) => (!moduleKey ? true : row.module_key === moduleKey));
}

export async function resetModuleForUser(email: string, track: OnboardingTrack, moduleKey: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido.");
  if (!["A", "B", "C", "D"].includes(moduleKey)) throw new Error("Módulo inválido.");
  const now = new Date().toISOString();
  if (hasSupabaseStore()) {
    await resetOnboardingModuleStatus({ moduleStatusTable: ONBOARDING_MODULE_STATUS_TABLE, email: normalized, track, moduleKey });
    await insertOnboardingQuizAttempt({
      quizAttemptsTable: ONBOARDING_QUIZ_ATTEMPTS_TABLE,
      row: {
        email: normalized,
        track,
        module_key: moduleKey,
        score: 0,
        max_score: 0,
        missed_topics: ["admin_reset"],
        submitted_at: now,
        passed: true,
      },
    });
    return;
  }
  const state = await readStateFromJson();
  if (!state.moduleStatusByEmail[normalized]) state.moduleStatusByEmail[normalized] = {};
  state.moduleStatusByEmail[normalized][moduleKey] = { moduleKey: moduleKey as ModuleKey, status: "in_progress", attempts: 0, maxAttempts: MODULE_MAX_ATTEMPTS };
  if (!state.quizAttemptsByEmail[normalized]) state.quizAttemptsByEmail[normalized] = [];
  state.quizAttemptsByEmail[normalized].unshift({ module_key: moduleKey, score: 0, max_score: 0, missed_topics: ["admin_reset"], submitted_at: now });
  await writeStateToJson(state);
}
