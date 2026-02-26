"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BrandLoader } from "@/components/BrandLoader";

type Unit = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  content: string[];
  resources?: Array<{ label: string; href: string }>;
};

type Onboarding = {
  completed_units: string[];
  progress: number;
};

export default function StudioOnboardingUnitPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok) {
          router.replace("/studio");
          return;
        }
        setUnits((data.units || []) as Unit[]);
        setOnboarding(data.onboarding as Onboarding);
      } catch {
        router.replace("/studio");
      } finally {
        setLoading(false);
      }
    };

    run().catch(() => undefined);
  }, [router]);

  const unit = useMemo(() => units.find((item) => item.slug === slug), [units, slug]);
  const currentIndex = unit ? units.findIndex((item) => item.slug === unit.slug) : -1;
  const next = currentIndex >= 0 ? units[currentIndex + 1] : null;

  async function onContinue() {
    if (!unit) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/studio/onboarding/progress", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ unitSlug: unit.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar progreso.");
      setOnboarding(data.onboarding as Onboarding);
      if (next) router.push(`/studio/onboarding/${next.slug}`);
      else router.push("/studio/onboarding");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar avance.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando unidad..." /></main>;

  if (!unit) {
    return (
      <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-700">Unidad no encontrada.</p>
          <Link href="/studio/onboarding" className="mt-3 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Volver a onboarding</Link>
        </section>
      </main>
    );
  }

  const done = Boolean(onboarding?.completed_units?.includes(unit.slug));

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{unit.durationMinutes} min · {done ? "Completado" : "En curso"}</div>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{unit.title}</h1>
        <p className="mt-2 text-sm text-slate-700">{unit.summary}</p>

        <div className="mt-5 space-y-3 text-sm text-slate-700">
          {unit.content.map((paragraph, index) => <p key={`${unit.slug}-${index}`}>{paragraph}</p>)}
        </div>

        {unit.resources?.length ? (
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-slate-900">Recursos opcionales</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {unit.resources.map((resource, idx) => (
                <li key={`${resource.href}-${idx}`}>
                  <a href={resource.href} target="_blank" rel="noreferrer" className="underline underline-offset-4">{resource.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={onContinue} disabled={saving} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {next ? "Continuar" : "Finalizar módulo"}
          </button>
          <Link href="/studio/onboarding" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver</Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">Progreso total: {onboarding?.progress ?? 0}%</p>
        {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
