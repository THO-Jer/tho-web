import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultOnboardingUnits, OnboardingUnit } from "@/content/onboardingContent";
import { getWritableDataPath } from "@/lib/storagePaths";

export type OnboardingRecord = {
  email: string;
  started_at: string;
  completed_at?: string;
  completed_units: string[];
  conversation_suggested: boolean;
  internal_signal?: string;
  updated_at: string;
};

type OnboardingState = {
  units: OnboardingUnit[];
  records: OnboardingRecord[];
};

const ONBOARDING_PATH = getWritableDataPath("studio", "onboarding.json");

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

export function getOnboardingConfig() {
  const required = parseBool(process.env.ONBOARDING_REQUIRED, true);
  const blockInternal = parseBool(process.env.ONBOARDING_BLOCK_INTERNAL, false);
  const adminEmails = (process.env.ONBOARDING_ADMIN_EMAILS || "")
    .split(",")
    .map((v) => normalizeEmail(v))
    .filter(Boolean);

  return { required, blockInternal, adminEmails };
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
    const initial: OnboardingState = { units: defaultOnboardingUnits, records: [] };
    await fs.writeFile(ONBOARDING_PATH, `${JSON.stringify(initial, null, 2)}\n`, "utf8");
  }
}

async function readState(): Promise<OnboardingState> {
  await ensureStore();
  const raw = await fs.readFile(ONBOARDING_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<OnboardingState>;

  const units = Array.isArray(parsed.units) && parsed.units.length
    ? parsed.units.map((unit) => ({
      slug: String(unit.slug || ""),
      title: String(unit.title || ""),
      summary: String(unit.summary || ""),
      durationMinutes: Number(unit.durationMinutes || 10),
      content: Array.isArray(unit.content) ? unit.content.map((row) => String(row)) : [],
      resources: Array.isArray(unit.resources)
        ? unit.resources.map((resource) => ({ label: String(resource.label || "Recurso"), href: String(resource.href || "") })).filter((resource) => resource.href)
        : undefined,
    })).filter((unit) => unit.slug && unit.title)
    : defaultOnboardingUnits;

  const records = Array.isArray(parsed.records)
    ? parsed.records.map((record) => ({
      email: normalizeEmail(String(record.email || "")),
      started_at: String(record.started_at || new Date().toISOString()),
      completed_at: record.completed_at ? String(record.completed_at) : undefined,
      completed_units: Array.isArray(record.completed_units) ? record.completed_units.map((unit) => String(unit)).filter(Boolean) : [],
      conversation_suggested: Boolean(record.conversation_suggested),
      internal_signal: record.internal_signal ? String(record.internal_signal) : undefined,
      updated_at: String(record.updated_at || new Date().toISOString()),
    })).filter((record) => record.email)
    : [];

  return { units, records };
}

async function writeState(state: OnboardingState) {
  await ensureStore();
  await fs.writeFile(ONBOARDING_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

export async function getUnits() {
  const state = await readState();
  return state.units;
}

export async function setUnits(units: OnboardingUnit[]) {
  const state = await readState();
  state.units = units;
  await writeState(state);
  return state.units;
}

export async function getOrCreateOnboardingRecord(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email inválido para onboarding.");

  const state = await readState();
  const now = new Date().toISOString();
  const index = state.records.findIndex((row) => row.email === normalized);

  if (index >= 0) return state.records[index];

  const created: OnboardingRecord = {
    email: normalized,
    started_at: now,
    completed_units: [],
    conversation_suggested: false,
    updated_at: now,
  };

  state.records.push(created);
  await writeState(state);
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
  };

  const completed = Array.from(new Set([...current.completed_units, unitSlug]));
  const done = completed.length >= units.length;
  const next: OnboardingRecord = {
    ...current,
    completed_units: completed,
    completed_at: done ? (current.completed_at || now) : undefined,
    conversation_suggested: done ? false : current.conversation_suggested,
    updated_at: now,
  };

  if (index >= 0) state.records[index] = next;
  else state.records.push(next);

  await writeState(state);
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
