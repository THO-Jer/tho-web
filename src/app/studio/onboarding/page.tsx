"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type OnboardingUnit = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
};

type Recommendation = { topic: string; unitSlug: string; unitTitle: string };

type OnboardingData = {
  progress: number;
  completed: boolean;
  completed_units: string[];
  module_status?: Array<{ moduleKey: string; status: string; attempts: number; maxAttempts: number }>;
  can_access?: { blog: boolean; incidents: boolean; crmStudio: boolean };
  updated_at: string;
  last_seen_unit?: string;
  last_saved_at?: string;
  recommendations?: Recommendation[];
};

type ModuleStatusView = {
  label: string;
  tone: string;
};

type ApiResponse = {
  config: { required: boolean; blockInternal: boolean; store: string; persistenceNote: string; passScore?: number; maxAttempts?: number; minLessonTimeSeconds?: number };
  track: "sales" | "creative_ops" | "advisory_ops" | "general";
  units: OnboardingUnit[];
  onboarding: OnboardingData;
};


async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  const raw = await res.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function StudioOnboardingLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [units, setUnits] = useState<OnboardingUnit[]>([]);
  const [data, setData] = useState<OnboardingData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [config, setConfig] = useState<ApiResponse["config"] | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [sessionRes, onboardingRes] = await Promise.all([
          fetch("/api/admin/session", { credentials: "include" }),
          fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" }),
        ]);

        const session = (await parseJsonSafe<{ authenticated?: boolean; role?: string; canManageAccess?: boolean; permissions?: { canOnboarding?: boolean } }>(sessionRes)) || {};
        if (!session.authenticated || session.permissions?.canOnboarding === false) {
          router.replace("/studio");
          return;
        }

        const onboarding = (await parseJsonSafe<ApiResponse & { error?: string }>(onboardingRes)) || null;
        if (!onboardingRes.ok || !onboarding) {
          throw new Error(onboarding?.error || "No se pudo cargar onboarding. Si persiste, revisa configuración Supabase y roles.");
        }

        setUnits(onboarding.units || []);
        setData(onboarding.onboarding || null);
        setConfig(onboarding.config || null);
        setIsAdmin(String(session.role || "") === "superadmin" || Boolean(session.canManageAccess));
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo cargar onboarding.");
      } finally {
        setLoading(false);
      }
    };

    run().catch(() => undefined);
  }, [router, reloadToken]);

  const nextUnit = useMemo(() => {
    if (!data) return units[0];
    if (data.last_seen_unit && units.some((unit) => unit.slug === data.last_seen_unit)) {
      return units.find((unit) => unit.slug === data.last_seen_unit) || units[0];
    }
    const status = new Map((data.module_status || []).map((row) => [row.moduleKey, row.status]));
    return units.find((_, index) => status.get(["A","B","C","D"][index] || "") !== "validated") || units[0];
  }, [data, units]);

  const totalMinutes = useMemo(() => units.reduce((sum, unit) => sum + (unit.durationMinutes || 0), 0), [units]);
  const nextModuleKey = useMemo(() => {
    if (!nextUnit) return "";
    const idx = units.findIndex((unit) => unit.slug === nextUnit.slug);
    return idx >= 0 ? ["A", "B", "C", "D"][idx] || "" : "";
  }, [nextUnit, units]);

  const currentStatusLabel = data?.completed ? "Validado" : "En curso";
  const attemptsLimit = config?.maxAttempts ?? 3;

  function getStatusView(status?: string): ModuleStatusView {
    if (status === "validated") return { label: "Validado", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" };
    if (status === "locked") return { label: "Bloqueado", tone: "border-slate-200 bg-slate-100 text-slate-600" };
    if (status === "failed_max_attempts") return { label: "Requiere reinicio", tone: "border-rose-200 bg-rose-50 text-rose-700" };
    return { label: "En curso", tone: "border-sky-200 bg-sky-50 text-sky-700" };
  }

  function timeAgo(iso?: string) {
    if (!iso) return "Sin registro";
    const diff = Date.now() - new Date(iso).getTime();
    if (Number.isNaN(diff)) return "Sin registro";
    const minutes = Math.max(1, Math.round(diff / 60000));
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.round(hours / 24);
    return `hace ${days} día(s)`;
  }

  if (loading) {
    return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando Onboarding..." /></main>;
  }

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div
          className="relative border-b border-slate-200 px-6 py-8 sm:px-8 sm:py-10"
          style={{
            backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.92), rgba(255,255,255,0.94)), url('/hero/6.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="font-tho-title text-3xl text-slate-950 sm:text-4xl">Studio Onboarding</h1>
          <p className="mt-2 text-base font-semibold text-slate-900">Ruta obligatoria de alineación institucional</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
            Este programa instala el estándar THO y permite alinear lo que sabes hacer con el modo en que debes desarrollar tus actividades en la empresa.
          </p>
          <p className="mt-2 text-sm text-slate-700">Incluye evaluación formativa por módulo. Requiere aprobación mínima de {config?.passScore ?? 80}%.</p>
          <div className="brand-block-divider mt-5 h-[6px] w-36 rounded-sm" aria-hidden />
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-900">Progreso total</span>
              <span className="text-slate-700">{data?.progress ?? 0}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-slate-900" style={{ width: `${Math.min(100, Math.max(0, data?.progress ?? 0))}%` }} />
            </div>
            <div className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
              <p>Estado actual: <strong>{currentStatusLabel}</strong></p>
              <p>Último guardado: <strong>{timeAgo(data?.last_saved_at)}</strong></p>
              <p>Intentos por módulo: <strong>{attemptsLimit}</strong></p>
              <p>Corte de aprobación: <strong>{config?.passScore ?? 80}%</strong></p>
            </div>
          </div>


        {!units.length ? (
          <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            No encontramos módulos visibles para tu track actual.
            <button
              type="button"
              onClick={() => setReloadToken((prev) => prev + 1)}
              className="ml-2 underline underline-offset-2"
            >
              Reintentar carga
            </button>
          </div>
        ) : null}

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="font-tho-title text-2xl text-slate-950">Mapa de módulos</h2>
          <p className="mt-1 text-sm text-slate-600">Duración total estimada: {totalMinutes} min.</p>
        </div>

        <div className="mt-4 grid gap-3">
          {units.map((unit, idx) => {
            const moduleKey = ["A", "B", "C", "D"][idx] || "";
            const row = data?.module_status?.find((item) => item.moduleKey === moduleKey);
            const statusView = getStatusView(row?.status);
            const done = row?.status === "validated";
            const locked = row?.status === "locked";
            return (
              <article key={unit.slug} className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs font-semibold uppercase text-slate-500">Módulo {moduleKey}</div>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{unit.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{unit.durationMinutes} min</p>
                <p className="mt-2 text-sm text-slate-700">{unit.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusView.tone}`}>Estado: {statusView.label}</span>
                  {locked ? null : <Link href={`/studio/onboarding/${unit.slug}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">{done ? "Revisar" : "Continuar"}</Link>}
                </div>
              </article>
            );
          })}
        </div>


        {data?.completed && data?.recommendations?.length ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="text-sm font-semibold text-emerald-900">Recomendación de refuerzo</h3>
            <p className="mt-1 text-xs text-emerald-900">Estos temas pueden requerir una breve conversación de alineación:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900">
              {data.recommendations.map((item) => (
                <li key={`${item.topic}-${item.unitSlug}`}>
                  <span className="font-semibold">{item.topic}</span> ·{' '}
                  <Link href={`/studio/onboarding/${item.unitSlug}`} className="underline underline-offset-2">
                    Revisar {item.unitTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="flex flex-wrap items-center gap-2">
          {nextUnit ? (
            <Link href={`/studio/onboarding/${nextUnit.slug}`} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Continuar módulo {nextModuleKey || "actual"}</Link>
          ) : null}
          {isAdmin ? (
            <Link href="/studio/onboarding/admin" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Panel Admin Onboarding</Link>
          ) : null}
          </div>
          <Link href="/studio" className="mt-3 inline-flex text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700">Volver al Studio</Link>
        </div>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}
