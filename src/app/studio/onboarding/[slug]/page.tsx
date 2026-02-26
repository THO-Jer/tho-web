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

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  topic: string;
};

type Onboarding = {
  completed_units: string[];
  progress: number;
  completed_units_done?: boolean;
  quiz_result?: { score: number; total: number; topics_to_reinforce: string[] };
  last_saved_at?: string;
};

export default function StudioOnboardingUnitPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
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
        setQuiz((data.quiz || []) as QuizQuestion[]);
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
      else router.push(`/studio/onboarding/${unit.slug}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar avance.");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitQuiz() {
    setSaving(true);
    setMessage("");
    try {
      const payload = quiz.map((question) => ({ question_id: question.id, selected_index: answers[question.id] ?? -1 }));
      if (payload.some((answer) => answer.selected_index < 0)) {
        throw new Error("Debes responder todas las preguntas antes de finalizar.");
      }

      const res = await fetch("/api/studio/onboarding/quiz", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar evaluación.");
      setOnboarding(data.onboarding as Onboarding);
      setMessage("Evaluación formativa enviada. ¡Onboarding completado!");
      router.push("/studio/onboarding");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo enviar evaluación.");
    } finally {
      setSaving(false);
    }
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
  const showQuiz = !next && Boolean(onboarding?.completed_units_done || done);

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
            {next ? "Continuar" : "Finalizar módulos"}
          </button>
          <Link href="/studio/onboarding" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver</Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">Progreso total: {onboarding?.progress ?? 0}% · Último guardado: {timeAgo(onboarding?.last_saved_at)}</p>

        {showQuiz ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-semibold text-slate-900">Evaluación formativa final</h2>
            <p className="mt-1 text-sm text-slate-700">No punitiva: su objetivo es detectar tópicos a reforzar para conversación de alineación.</p>
            <div className="mt-4 space-y-4">
              {quiz.map((question, index) => (
                <fieldset key={question.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <legend className="text-sm font-semibold text-slate-800">{index + 1}. {question.prompt}</legend>
                  <div className="mt-2 grid gap-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={`${question.id}-${optionIndex}`} className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name={question.id}
                          checked={answers[question.id] === optionIndex}
                          onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <button type="button" onClick={onSubmitQuiz} disabled={saving} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              Enviar evaluación formativa
            </button>
          </div>
        ) : null}

        {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
