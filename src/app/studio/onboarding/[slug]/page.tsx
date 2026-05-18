"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BrandLoader } from "@/components/BrandLoader";
import { GenericLesson } from "@/components/onboarding/lessons/GenericLesson";
import { LessonA0 } from "@/components/onboarding/lessons/LessonA0";
import { LessonA1 } from "@/components/onboarding/lessons/LessonA1";
import { LessonA2 } from "@/components/onboarding/lessons/LessonA2";
import { LessonA3 } from "@/components/onboarding/lessons/LessonA3";
import { LessonA4 } from "@/components/onboarding/lessons/LessonA4";
import { LessonA5 } from "@/components/onboarding/lessons/LessonA5";
import { LessonA6 } from "@/components/onboarding/lessons/LessonA6";
import { LessonA7 } from "@/components/onboarding/lessons/LessonA7";
import { LessonA8, type IntegrationAnswers } from "@/components/onboarding/lessons/LessonA8";
import { LessonB1 } from "@/components/onboarding/lessons/LessonB1";
import { LessonB2 } from "@/components/onboarding/lessons/LessonB2";
import { topicReviewLabel } from "@/content/onboarding/lessonGuides";
import {
  getLessonGuide,
  getModuleKeyFromSlug,
  moduleVisuals,
  parseLessons,
  topicToLesson,
  unitTopicMap,
} from "@/lib/onboarding";

type Unit = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  content: string[];
  resources?: Array<{ label: string; href: string }>;
};

type QuizQuestion = { id: string; prompt: string; options: string[]; topic: string };
type ModuleStatus = { moduleKey: string; status: "locked" | "in_progress" | "validated" | "failed_max_attempts"; attempts: number; maxAttempts: number };
type Onboarding = {
  completed_units: string[];
  progress: number;
  last_saved_at?: string;
  module_status?: ModuleStatus[];
};

/**
 * Orquestador de la vista de una lección del onboarding.
 *
 * Mantiene todo el estado y los efectos (fetch inicial, ticking del cronómetro,
 * observer del final de lección, persistencia de avance, evaluación del quiz),
 * y delega el render de cada lección al componente correspondiente en
 * src/components/onboarding/lessons/.
 *
 * Para profundizar otro módulo: crear el componente Lesson{X}{n}.tsx con su
 * dato editorial en src/content/onboarding/, y agregar un case más abajo en el
 * switch de render por id de lección.
 */
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
  const [activeLesson, setActiveLesson] = useState(0);
  const [lessonStartAt, setLessonStartAt] = useState<number>(Date.now());
  const [reachedEnd, setReachedEnd] = useState(false);
  const [minLessonSeconds, setMinLessonSeconds] = useState(12);
  const [failedTopics, setFailedTopics] = useState<string[]>([]);
  const [showReinforceModal, setShowReinforceModal] = useState(false);
  const [tick, setTick] = useState(() => Date.now());
  const [integrationAnswers, setIntegrationAnswers] = useState<IntegrationAnswers>({
    pressure: null,
    "critical-tension": null,
    "method-cut": null,
    discomfort: null,
  });
  const [integrationConfirmed, setIntegrationConfirmed] = useState(false);
  const lessonRef = useRef<HTMLElement | null>(null);
  const lessonEndRef = useRef<HTMLDivElement | null>(null);
  const quizSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok) return router.replace("/studio");
        setUnits((data.units || []) as Unit[]);
        setQuiz((data.quiz || []) as QuizQuestion[]);
        setOnboarding(data.onboarding as Onboarding);
        setMinLessonSeconds(Number(data?.config?.minLessonTimeSeconds || 12));
      } catch {
        router.replace("/studio");
      } finally {
        setLoading(false);
      }
    };
    run().catch(() => undefined);
  }, [router]);

  const unit = useMemo(() => units.find((item) => item.slug === slug), [units, slug]);
  const moduleKey = getModuleKeyFromSlug(unit?.slug || "");
  const unitQuiz = useMemo(() => (unit ? quiz.filter((q) => unitTopicMap(unit.slug, q.topic)) : []), [quiz, unit]);
  const lessons = useMemo(() => parseLessons(unit?.content || []), [unit]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const completedSet = useMemo(() => new Set(onboarding?.completed_units || []), [onboarding]);
  const isLessonDone = (lessonId: string) => completedSet.has(`${moduleKey}:${lessonId}`);
  const completedLessonCount = lessons.filter((l) => isLessonDone(l.id)).length;
  const allLessonsDone = lessons.length > 0 && completedLessonCount >= lessons.length;
  const status = onboarding?.module_status?.find((item) => item.moduleKey === moduleKey);

  useEffect(() => {
    setLessonStartAt(Date.now());
    setReachedEnd(false);
  }, [activeLesson, moduleKey]);

  useEffect(() => {
    lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeLesson]);

  useEffect(() => {
    const marker = lessonEndRef.current;
    if (!marker) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setReachedEnd(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, [activeLesson, lessons.length]);

  const elapsedSeconds = Math.floor((tick - lessonStartAt) / 1000);
  const canMarkLesson = elapsedSeconds >= minLessonSeconds && reachedEnd;

  async function markLesson(lessonId: string) {
    if (!unit) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/studio/onboarding/progress", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ moduleKey, lessonId, unitSlug: unit.slug, elapsedSeconds, reachedEnd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar avance.");
      setOnboarding(data.onboarding as Onboarding);
      setActiveLesson((prev) => Math.min(prev + 1, Math.max(0, lessons.length - 1)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar avance.");
    } finally {
      setSaving(false);
    }
  }

  async function completeModule() {
    if (!unit) return;
    if (!allLessonsDone) return setMessage("Debes completar todas las lecciones antes de rendir el quiz del módulo.");
    if (unitQuiz.some((question) => answers[question.id] === undefined || answers[question.id] < 0)) {
      return setMessage("Responde todas las preguntas para completar el módulo.");
    }

    setSaving(true);
    setMessage("");
    try {
      const payload = unitQuiz.map((question) => ({ question_id: question.id, selected_index: answers[question.id] ?? -1 }));
      const res = await fetch("/api/studio/onboarding/quiz", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ moduleKey, answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar evaluación.");
      setOnboarding(data.onboarding as Onboarding);
      setFailedTopics(Array.isArray(data.topics_to_reinforce) ? data.topics_to_reinforce : []);
      if (data.passed) {
        setMessage("Módulo validado. Puedes continuar al siguiente.");
        router.push("/studio/onboarding");
      } else {
        const attempts = data?.moduleStatus?.attempts ?? 0;
        const maxAttempts = data?.moduleStatus?.maxAttempts ?? 3;
        setShowReinforceModal(Boolean((Array.isArray(data.topics_to_reinforce) ? data.topics_to_reinforce : []).length));
        setMessage(`No alcanzaste el puntaje mínimo. Intento ${attempts}/${maxAttempts}.`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo completar módulo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando módulo..." /></main>;
  if (!unit) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><Link href="/studio/onboarding">Volver</Link></main>;

  const lesson = lessons[activeLesson];
  const visual = moduleVisuals[moduleKey] || moduleVisuals.A;
  const lessonProgressPct = lessons.length ? Math.round((completedLessonCount / lessons.length) * 100) : 0;
  const lessonGuide = lesson ? getLessonGuide(moduleKey, lesson) : null;

  // Cada lección hand-crafted se identifica por (moduleKey, lesson.id).
  // Si una lección no calza con ningún case, cae al fallback GenericLesson.
  const renderLesson = () => {
    if (!lesson) return null;

    const shellProps = { elapsedSeconds, reachedEnd, minLessonSeconds };

    if (moduleKey === "A") {
      switch (lesson.id) {
        case "A0":
          return <LessonA0 {...shellProps} />;
        case "A1":
          return <LessonA1 {...shellProps} />;
        case "A2":
          return <LessonA2 {...shellProps} />;
        case "A3":
          return <LessonA3 {...shellProps} />;
        case "A4":
          return <LessonA4 {...shellProps} />;
        case "A5":
          return <LessonA5 {...shellProps} />;
        case "A6":
          return <LessonA6 {...shellProps} />;
        case "A7":
          return <LessonA7 {...shellProps} />;
        case "Reflexión guiada sugerida":
          return (
            <LessonA8
              {...shellProps}
              integrationAnswers={integrationAnswers}
              setIntegrationAnswers={setIntegrationAnswers}
              integrationConfirmed={integrationConfirmed}
              setIntegrationConfirmed={setIntegrationConfirmed}
              onContinueToQuiz={() => quizSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            />
          );
      }
    }

    if (moduleKey === "B") {
      switch (lesson.id) {
        case "B1":
          return <LessonB1 {...shellProps} />;
        case "B2":
          return <LessonB2 {...shellProps} />;
      }
    }

    return (
      <GenericLesson
        lesson={lesson}
        lessonIndex={activeLesson}
        visual={visual}
        lessonGuide={lessonGuide}
        moduleKey={moduleKey}
        elapsedSeconds={elapsedSeconds}
        reachedEnd={reachedEnd}
        minLessonSeconds={minLessonSeconds}
      />
    );
  };

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className={`rounded-2xl border p-4 ${visual.heroBorder} ${visual.hero}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image src="/brand/logo-negro.svg" alt="THO" width={40} height={40} className="opacity-90" unoptimized />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Programa de Onboarding</div>
                <h1 className="text-lg font-semibold text-slate-900">{unit.title}</h1>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-600">{lessonProgressPct}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/70">
            <div className={`h-2 rounded-full ${visual.progress}`} style={{ width: `${lessonProgressPct}%` }} />
          </div>
          <div className="mt-4 h-[4px] w-full rounded-sm brand-block-divider" aria-hidden />
        </div>

        {lesson ? (
          <article ref={lessonRef} className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {renderLesson()}
            <div ref={lessonEndRef} className="h-0 w-0" />
            <div className="border-t border-slate-200 bg-slate-50/60 p-4">
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-xs" onClick={() => setActiveLesson((v) => Math.max(0, v - 1))} disabled={activeLesson <= 0}>Anterior</button>
                <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-xs" onClick={() => setActiveLesson((v) => Math.min(lessons.length - 1, v + 1))} disabled={activeLesson >= lessons.length - 1}>Siguiente</button>
                {isLessonDone(lesson.id) ? (
                  <span className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">Lección completada</span>
                ) : canMarkLesson ? (
                  <button type="button" onClick={() => markLesson(lesson.id)} disabled={saving} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                    Marcar como completada
                  </button>
                ) : (
                  <span className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">Completa lectura + tiempo mínimo para habilitar</span>
                )}
              </div>
            </div>
          </article>
        ) : null}

        {unitQuiz.length && allLessonsDone ? (
          <div ref={quizSectionRef} className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <h2 className="text-lg font-semibold text-indigo-900">Evaluación del módulo</h2>
            <p className="mt-1 text-sm text-indigo-900">Debes aprobar para validar este módulo.</p>
            <div className="mt-4 space-y-4">
              {unitQuiz.map((question, index) => (
                <fieldset key={question.id} className="rounded-lg border border-indigo-100 bg-white p-3">
                  <legend className="text-sm font-semibold text-slate-800">{index + 1}. {question.prompt}</legend>
                  <div className="mt-2 grid gap-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={`${question.id}-${optionIndex}`} className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))} />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
        ) : null}

        {unitQuiz.length && !allLessonsDone ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Evaluación del módulo bloqueada temporalmente</h2>
            <p className="mt-1 text-sm text-slate-700">
              El quiz aparece al finalizar y completar todas las lecciones del módulo ({completedLessonCount}/{lessons.length}).
            </p>
          </div>
        ) : null}

        {failedTopics.length ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-900">Tópicos a reforzar</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
              {failedTopics.map((topic, idx) => {
                const lessonRefItem = topicToLesson(topic, lessons);
                return (
                  <li key={`${topic}-${idx}`}>
                    {`Revisar: ${topicReviewLabel[topic] || topic}`} · {lessonRefItem ? <button type="button" onClick={() => setActiveLesson(Math.max(0, lessons.findIndex((item) => item.id === lessonRefItem.id)))} className="underline underline-offset-2">ir a {lessonRefItem.label}</button> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {allLessonsDone ? (
            <button type="button" onClick={completeModule} disabled={saving || status?.status === "failed_max_attempts"} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              Completar módulo
            </button>
          ) : null}
          <Link href="/studio/onboarding" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Volver</Link>
        </div>

        {status?.status === "failed_max_attempts" ? <p className="mt-2 text-sm text-rose-700">Alcanzaste el máximo de intentos. Solicita reset a un superadmin.</p> : null}

        {showReinforceModal && failedTopics.length ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-label="Feedback de evaluación">
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900">Reforzar antes de reintentar</h3>
              <p className="mt-1 text-sm text-slate-700">No solo incorrecto: revisa estos tópicos del estándar institucional.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-800">
                {failedTopics.map((topic) => <li key={`modal-${topic}`}>{`Revisar: ${topicReviewLabel[topic] || topic}`}</li>)}
              </ul>
              <div className="mt-4 flex justify-end">
                <button type="button" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white" onClick={() => setShowReinforceModal(false)}>
                  Entendido
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-slate-500">Progreso total: {onboarding?.progress ?? 0}% · Último guardado: {onboarding?.last_saved_at || "Sin registro"}</p>
        {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
