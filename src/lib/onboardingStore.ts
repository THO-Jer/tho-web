import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultOnboardingQuiz, defaultOnboardingUnits, OnboardingQuizQuestion, OnboardingUnit } from "@/content/onboardingContent";
import {
  getModuleVisibilityFromSupabase,
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
  setModuleVisibilityToSupabase,
  upsertOnboardingModuleStatus,
  upsertOnboardingQuizResultByModule,
  upsertOnboardingSupabaseProgress,
} from "@/lib/onboardingStoreSupabase";
import { resolveVisibleModules } from "@/lib/onboarding";
import { getWritableDataPath } from "@/lib/storagePaths";

// La rama/área de la organización a la que pertenece el usuario (su "track").
// Es un id libre: además de las 4 ramas base se pueden crear ramas nuevas
// desde el panel admin de onboarding.
export type OnboardingTrack = string;

// Clave de módulo (A, B, C, ...). Es string para escalar a módulos futuros.
type ModuleKey = string;

/**
 * Configuración editable de visibilidad de módulos del onboarding.
 *
 * - branches: ramas/áreas de la organización, cada una con el set de módulos
 *   que ven sus integrantes por defecto.
 * - userOverrides: excepción puntual por usuario (heredar de su rama, asignar
 *   otra rama, o un set de módulos a medida).
 *
 * Se persiste en onboarding.json (el mismo store de contenido que units/quiz),
 * por lo que aplica tanto en modo JSON como Supabase.
 */
export type OnboardingBranch = {
  id: string;
  label: string;
  modules: ModuleKey[];
};

export type OnboardingUserOverride = {
  mode: "inherit" | "branch" | "custom";
  branchId?: string;
  modules?: ModuleKey[];
};

export type ModuleVisibilityConfig = {
  branches: OnboardingBranch[];
  userOverrides: Record<string, OnboardingUserOverride>;
};

const DEFAULT_BRANCHES: OnboardingBranch[] = [
  { id: "general", label: "General", modules: ["A", "B", "C", "D"] },
  { id: "sales", label: "Ventas", modules: ["A", "B"] },
  { id: "creative_ops", label: "Operación Creativa", modules: ["A", "C"] },
  { id: "advisory_ops", label: "Operación Asesorías", modules: ["A", "D"] },
];

function defaultModuleVisibility(): ModuleVisibilityConfig {
  return {
    branches: DEFAULT_BRANCHES.map((branch) => ({ ...branch, modules: [...branch.modules] })),
    userOverrides: {},
  };
}

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
  moduleVisibility: ModuleVisibilityConfig;
  moduleStatusByEmail: Record<string, Record<string, ModuleStatus>>;
  quizAttemptsByEmail: Record<string, Array<{ module_key: string; score: number; max_score: number; missed_topics: string[]; submitted_at: string; passed?: boolean }>>;
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
  // A, B, C, ... Z — escala a módulos futuros más allá de los 4 iniciales.
  if (index >= 0 && index < 26) return String.fromCharCode(65 + index);
  return "A";
}

function indexByModuleKey(moduleKey: string) {
  const code = String(moduleKey || "").trim().toUpperCase().charCodeAt(0) - 65;
  return code >= 0 && code < 26 ? code : -1;
}

function moduleKeyFromUnit(unit: OnboardingUnit, index: number): ModuleKey {
  if (unit.slug === "identidad-tho") return "A";
  if (unit.slug === "ventas-tho") return "B";
  if (unit.slug === "operacion-creativa") return "C";
  if (unit.slug === "operacion-asesorias") return "D";
  return moduleKeyByIndex(index);
}

function getUnitByModuleKey(units: OnboardingUnit[], moduleKey: string) {
  const bySlug = units.find((unit, index) => moduleKeyFromUnit(unit, index) === moduleKey);
  if (bySlug) return bySlug;
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
      moduleVisibility: defaultModuleVisibility(),
      moduleStatusByEmail: {},
      quizAttemptsByEmail: {},
    };
    await fs.writeFile(ONBOARDING_PATH, `${JSON.stringify(initial, null, 2)}\n`, "utf8");
  }
}

function coerceModuleVisibility(raw: unknown): ModuleVisibilityConfig {
  const value = (raw && typeof raw === "object" ? raw : {}) as Partial<ModuleVisibilityConfig>;
  const branches: OnboardingBranch[] = Array.isArray(value.branches)
    ? value.branches
        .map((branch) => {
          const id = String((branch as OnboardingBranch)?.id || "").trim();
          if (!id) return null;
          return {
            id,
            label: String((branch as OnboardingBranch)?.label || id).trim() || id,
            modules: Array.isArray((branch as OnboardingBranch)?.modules)
              ? (branch as OnboardingBranch).modules.map((m) => String(m).trim()).filter(Boolean)
              : [],
          } as OnboardingBranch;
        })
        .filter((branch): branch is OnboardingBranch => Boolean(branch))
    : [];

  const userOverrides: Record<string, OnboardingUserOverride> = {};
  if (value.userOverrides && typeof value.userOverrides === "object") {
    for (const [email, override] of Object.entries(value.userOverrides as Record<string, OnboardingUserOverride>)) {
      const key = normalizeEmail(email);
      if (!key || !override || typeof override !== "object") continue;
      const mode = override.mode === "branch" || override.mode === "custom" ? override.mode : "inherit";
      userOverrides[key] = {
        mode,
        branchId: override.branchId ? String(override.branchId).trim() : undefined,
        modules: Array.isArray(override.modules) ? override.modules.map((m) => String(m).trim()).filter(Boolean) : undefined,
      };
    }
  }

  const config: ModuleVisibilityConfig = branches.length ? { branches, userOverrides } : defaultModuleVisibility();
  if (branches.length) config.userOverrides = userOverrides;
  // La rama "general" siempre debe existir como fallback de resolución.
  if (!config.branches.some((branch) => branch.id === "general")) {
    config.branches.unshift({ id: "general", label: "General", modules: ["A", "B", "C", "D"] });
  }
  return config;
}

/**
 * Fusiona las preguntas almacenadas en disco con las del default del código.
 * - Las preguntas editadas en el admin (presentes en stored) se respetan.
 * - Las preguntas nuevas en el código que no existen en stored se agregan.
 * Esto evita que nuevas preguntas de módulos recientes queden invisibles
 * porque el JSON en disco fue creado antes de que existieran.
 */
function mergeQuiz(stored: OnboardingQuizQuestion[]): OnboardingQuizQuestion[] {
  if (!stored.length) return defaultOnboardingQuiz;
  const storedIds = new Set(stored.map((q) => q.id));
  const newFromDefault = defaultOnboardingQuiz.filter((q) => !storedIds.has(q.id));
  return [...stored, ...newFromDefault];
}

async function readStateFromJson(): Promise<OnboardingState> {
  await ensureStore();
  const raw = await fs.readFile(ONBOARDING_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<OnboardingState>;
  return {
    units: Array.isArray(parsed.units) && parsed.units.length ? (parsed.units as OnboardingUnit[]) : defaultOnboardingUnits,
    quiz: mergeQuiz(Array.isArray(parsed.quiz) ? (parsed.quiz as OnboardingQuizQuestion[]) : []),
    records: Array.isArray(parsed.records) ? (parsed.records as OnboardingRecord[]) : [],
    moduleVisibility: coerceModuleVisibility(parsed.moduleVisibility),
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
    moduleVisibility: content.moduleVisibility,
    moduleStatusByEmail,
    quizAttemptsByEmail,
  };
}

async function readState() {
  return hasSupabaseStore() ? readStateFromSupabase() : readStateFromJson();
}

/** Todas las claves de módulo existentes, en orden canónico (orden de units). */
function getAllModuleKeys(units: OnboardingUnit[]): ModuleKey[] {
  const keys = units.map((unit, index) => moduleKeyFromUnit(unit, index));
  return keys.filter((key, index) => keys.indexOf(key) === index);
}

/**
 * Resuelve el set de módulos visibles para un usuario, en orden canónico.
 * Delega en resolveVisibleModules (lib/onboarding.ts) para mantener una sola
 * fuente de verdad compartida con la previsualización del panel admin.
 */
function resolveModulesForUser(email: string, track: OnboardingTrack, state: OnboardingState): ModuleKey[] {
  const config = state.moduleVisibility || defaultModuleVisibility();
  const allKeys = getAllModuleKeys(state.units);
  return resolveVisibleModules(normalizeEmail(email), track, config, allKeys);
}

function getApplicableUnitsForUser(state: OnboardingState, email: string, track: OnboardingTrack) {
  const allowed = new Set(resolveModulesForUser(email, track, state));
  return state.units.filter((unit, index) => allowed.has(moduleKeyFromUnit(unit, index)));
}

function getUnitByTopic(units: OnboardingUnit[], topic: string) {
  const t = topic.toLowerCase();
  const byUnit: Record<string, string[]> = {
    "identidad-tho": [
      "identidad",
      "onboarding",
      "adaptabilidad_ordenada",
      "definition_of_done",
      "metodo_sobre_costumbre",
      "limites_institucionales",
      "protocolo_etico",
      "escalamiento",
      "marco_agile",
      "coherencia",
      "integridad_territorial",
      "trazabilidad",
    ],
    "ventas-tho": ["ventas"],
    "operacion-creativa": ["operacion_creativa", "creativa"],
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

function defaultModuleStatus(moduleKey: ModuleKey, isFirst: boolean): ModuleStatus {
  return { moduleKey, status: isFirst ? "in_progress" : "locked", attempts: 0, maxAttempts: MODULE_MAX_ATTEMPTS };
}

function computeModuleStatuses(record: OnboardingRecord, state: OnboardingState): ModuleStatus[] {
  const email = normalizeEmail(record.email);
  const stored = state.moduleStatusByEmail[email] || {};
  const modules = resolveModulesForUser(record.email, record.track, state);
  const statuses: ModuleStatus[] = modules.map((moduleKey, index) => {
    const row = stored[moduleKey];
    return row || defaultModuleStatus(moduleKey, index === 0);
  });

  // Desbloqueo secuencial: el primer módulo del set queda activo y cada módulo
  // siguiente se abre al validar el anterior. Ya no se asume que el primero es "A".
  let hasValidatedPrevious = true;
  return statuses.map((status, index) => {
    if (index === 0) {
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

  // El control de acceso ya no depende de módulos fijos (A/B): se calcula sobre
  // el set de módulos efectivamente asignado al usuario.
  // - blog / incidentes: se habilitan al validar el primer módulo de su ruta.
  // - CRM interno: requiere completar todo el onboarding asignado.
  // Si el usuario no tiene módulos asignados, no hay nada que bloquear.
  const firstValidated = statuses.length === 0 || statuses[0]?.status === "validated";
  const allValidated = statuses.every((status) => status.status === "validated");
  return {
    blog: firstValidated,
    incidents: firstValidated,
    crmStudio: allValidated,
  };
}

function summarizeOnboarding(record: OnboardingRecord, state: OnboardingState, role?: string): OnboardingSummary {
  const units = getApplicableUnitsForUser(state, record.email, record.track);
  const statuses = computeModuleStatuses(record, state);
  const completedSet = new Set(record.completed_units || []);
  const requiredLessonTags = units.flatMap((unit, idx) => {
    const moduleKey = moduleKeyFromUnit(unit, idx);
    return parseLessonIds(unit.content).map((lessonId) => `${moduleKey}:${lessonId}`);
  });
  const completedLessons = requiredLessonTags.filter((tag) => completedSet.has(tag)).length;
  const progress = requiredLessonTags.length ? Math.round((completedLessons / requiredLessonTags.length) * 100) : 0;
  const completed = statuses.length > 0 && statuses.every((status) => status.status === "validated");
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
    state.quizAttemptsByEmail[nextRecord.email].unshift({ module_key: moduleKey, score, max_score: total, missed_topics: Array.from(new Set(missedTopics)), submitted_at: now, passed });
    await writeStateToJson(state);
  }

  return {
    record: nextRecord,
    summary: summarizeOnboarding(nextRecord, state),
    moduleStatus: nextStatus,
    passed,
    score,
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
  return getApplicableUnitsForUser(state, record.email, record.track);
}

export async function getOnboardingSnapshot(email: string, role?: string) {
  const state = await readState();
  const record = await getOrCreateOnboardingRecord(email);
  const units = getApplicableUnitsForUser(state, record.email, record.track);
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
  if (!String(moduleKey || "").trim()) throw new Error("Módulo inválido.");
  if (hasSupabaseStore()) {
    await resetOnboardingModuleStatus({ moduleStatusTable: ONBOARDING_MODULE_STATUS_TABLE, email: normalized, track, moduleKey });
    return;
  }
  const state = await readStateFromJson();
  if (!state.moduleStatusByEmail[normalized]) state.moduleStatusByEmail[normalized] = {};
  state.moduleStatusByEmail[normalized][moduleKey] = { moduleKey, status: "in_progress", attempts: 0, maxAttempts: MODULE_MAX_ATTEMPTS };
  await writeStateToJson(state);
}

/**
 * Catálogo de módulos disponibles (derivado de las units de contenido).
 * Escala automáticamente: al agregar un módulo nuevo aparece aquí y queda
 * disponible para asignar a las ramas desde el panel admin.
 */
export async function getModuleCatalog() {
  const state = await readState();
  return state.units.map((unit, index) => ({
    key: moduleKeyFromUnit(unit, index),
    title: unit.title,
    slug: unit.slug,
  }));
}

/**
 * Devuelve la configuración editable de visibilidad de módulos.
 * Prioridad: Supabase (si disponible) > JSON local.
 */
export async function getModuleVisibilityConfig(): Promise<ModuleVisibilityConfig> {
  if (hasSupabaseStore()) {
    const raw = await getModuleVisibilityFromSupabase();
    if (raw !== null) return coerceModuleVisibility(raw);
  }
  const state = await readStateFromJson();
  return state.moduleVisibility;
}

/**
 * Persiste la configuración de visibilidad de módulos.
 * Sanitiza ramas (ids únicos, módulos válidos), garantiza la rama "general"
 * y descarta overrides de usuario que no cambian nada (mode "inherit").
 * Escribe en Supabase si está disponible; siempre escribe también en JSON local
 * como respaldo para lectura de units/quiz.
 */
export async function setModuleVisibilityConfig(input: ModuleVisibilityConfig): Promise<ModuleVisibilityConfig> {
  const state = await readStateFromJson();
  const validKeys = new Set(getAllModuleKeys(state.units));
  const sanitizeModules = (modules?: ModuleKey[]) =>
    Array.from(new Set((modules || []).map((m) => String(m).trim()))).filter((m) => validKeys.has(m));

  const seenIds = new Set<string>();
  const branches: OnboardingBranch[] = [];
  for (const raw of input.branches || []) {
    const id = String(raw?.id || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (!id || seenIds.has(id)) continue;
    seenIds.add(id);
    branches.push({ id, label: String(raw?.label || id).trim() || id, modules: sanitizeModules(raw?.modules) });
  }
  if (!branches.some((branch) => branch.id === "general")) {
    branches.unshift({ id: "general", label: "General", modules: getAllModuleKeys(state.units) });
  }
  const branchIds = new Set(branches.map((branch) => branch.id));

  const userOverrides: Record<string, OnboardingUserOverride> = {};
  for (const [emailRaw, raw] of Object.entries(input.userOverrides || {})) {
    const email = normalizeEmail(emailRaw);
    if (!email || !raw) continue;
    if (raw.mode === "branch" && raw.branchId && branchIds.has(raw.branchId)) {
      userOverrides[email] = { mode: "branch", branchId: raw.branchId };
    } else if (raw.mode === "custom") {
      userOverrides[email] = { mode: "custom", modules: sanitizeModules(raw.modules) };
    }
    // mode "inherit" (o inválido) no se almacena: el usuario sigue su rama.
  }

  const visibility: ModuleVisibilityConfig = { branches, userOverrides };

  if (hasSupabaseStore()) {
    await setModuleVisibilityToSupabase(visibility);
  }

  // Siempre persiste en JSON también (lo usa readStateFromJson para units/quiz).
  state.moduleVisibility = visibility;
  await writeStateToJson(state);

  return visibility;
}
