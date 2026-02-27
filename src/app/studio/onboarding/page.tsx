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
  conversation_suggested: boolean;
  updated_at: string;
  last_seen_unit?: string;
  last_saved_at?: string;
  recommendations?: Recommendation[];
};

type ApiResponse = {
  config: { required: boolean; blockInternal: boolean; store: string; persistenceNote: string };
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
  const [track, setTrack] = useState<ApiResponse["track"]>("general");
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
        setTrack(onboarding.track || "general");
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
    const done = new Set(data.completed_units || []);
    return units.find((unit) => !done.has(unit.slug)) || units[0];
  }, [data, units]);

  const totalMinutes = useMemo(() => units.reduce((sum, unit) => sum + (unit.durationMinutes || 0), 0), [units]);

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
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Studio Onboarding</h1>
        <p className="mt-3 text-sm text-slate-700">
          Ruta obligatoria de alineación THO para identidad, método y protocolos operativos. Incluye evaluación formativa (sin nota punitiva).
        </p>
        <p className="mt-2 text-xs text-slate-500">Duración estimada total: {totalMinutes} minutos.</p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-slate-800">Progreso</span>
            <span className="text-slate-700">{data?.progress ?? 0}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-slate-900" style={{ width: `${Math.min(100, Math.max(0, data?.progress ?? 0))}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Estado: {data?.completed ? "Completado" : "En curso"}
            {data?.conversation_suggested ? " · Conversación sugerida" : ""}
          </p>
          <p className="mt-1 text-xs text-slate-500">Último guardado: {timeAgo(data?.last_saved_at)}</p>
        </div>

        {config ? (
          <p className="mt-3 text-xs text-slate-500">
            Track activo: <strong>{track}</strong> · Persistencia: <strong>{config.store}</strong> · {config.persistenceNote}
          </p>
        ) : null}


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

        <div className="mt-5 grid gap-3">
          {units.map((unit, idx) => {
            const done = Boolean(data?.completed_units?.includes(unit.slug));
            return (
              <article key={unit.slug} className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs font-semibold uppercase text-slate-500">Paso {idx + 1} · {unit.durationMinutes} min</div>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{unit.title}</h2>
                <p className="mt-1 text-sm text-slate-700">{unit.summary}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/studio/onboarding/${unit.slug}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">
                    {done ? "Revisar" : "Continuar"}
                  </Link>
                  {done ? <span className="text-xs font-semibold text-emerald-700">Completado</span> : null}
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

        <div className="mt-6 flex flex-wrap gap-2">
          {nextUnit ? (
            <Link href={`/studio/onboarding/${nextUnit.slug}`} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Continuar donde quedaste</Link>
          ) : null}
          {isAdmin ? (
            <Link href="/studio/onboarding/admin" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Panel Admin Onboarding</Link>
          ) : null}
          <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver al Studio</Link>
        </div>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
