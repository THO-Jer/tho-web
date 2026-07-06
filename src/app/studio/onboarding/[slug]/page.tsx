"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BrandLoader } from "@/components/BrandLoader";
import { GenericLesson } from "@/components/onboarding/lessons/GenericLesson";
import { LessonA8, type IntegrationAnswers } from "@/components/onboarding/lessons/LessonA8";
import { LessonRenderer } from "@/components/onboarding/LessonRenderer";
import { getLessonDoc } from "@/content/onboarding/lessonDocs";

type ShellProps = { elapsedSeconds: number; reachedEnd: boolean; minLessonSeconds: number };
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

type QuizQuestion = { id: string; prompt: string; options: string[]; topic: string; moduleKey?: string };
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
  const [lessonError, setLessonError] = useState("");
  const [activeLesson, setActiveLesson] = useState(0);
  // Clave de localStorage para persistir la lección activa por módulo.
  // Se inicializa después de conocer el slug (useEffect de carga).
  const lessonStorageKey = slug ? `tho_onboarding_lesson_${slug}` : null;
  const [lessonStartAt, setLessonStartAt] = useState<number>(Date.now());
  const [reachedEnd, setReachedEnd] = useState(false);
  const [minLessonSeconds, setMinLessonSeconds] = useState(12);
  // Avance de actividades interactivas de la lección activa (gating nuevo).
  const [interactionProgress, setInteractionProgress] = useState({ completed: 0, total: 0 });
  const [failedTopics, setFailedTopics] = useState<string[]>([]);
  const [showReinforceModal, setShowReinforceModal] = useState(false);
  const [unlockRequested, setUnlockRequested] = useState(false);
  const [unlockSending, setUnlockSending] = useState(false);
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
        // Restaurar lección activa: preferencia local (localStorage) si existe;
        // si no, reanudar desde el servidor en la primera lección incompleta
        // (permite continuar desde otro dispositivo/navegador).
        if (slug) {
          const saved = localStorage.getItem(`tho_onboarding_lesson_${slug}`);
          const savedIdx = saved !== null ? parseInt(saved, 10) : NaN;
          if (!Number.isNaN(savedIdx) && savedIdx > 0) {
            setActiveLesson(savedIdx);
          } else {
            const unitData = ((data.units || []) as Unit[]).find((item) => item.slug === slug);
            const mk = getModuleKeyFromSlug(slug);
            const completed = new Set<string>((data.onboarding?.completed_units as string[]) || []);
            const lessonList = parseLessons(unitData?.content || []);
            const firstIncomplete = lessonList.findIndex((item) => !completed.has(`${mk}:${item.id}`));
            if (firstIncomplete > 0) setActiveLesson(firstIncomplete);
          }
        }
      } catch {
        router.replace("/studio");
      } finally {
        setLoading(false);
      }
    };
    run().catch(() => undefined);
  }, [router, slug]);

  const unit = useMemo(() => units.find((item) => item.slug === slug), [units, slug]);
  const moduleKey = getModuleKeyFromSlug(unit?.slug || "");
  // Filtra por moduleKey (lo etiqueta el servidor al servir la variante).
  // Fallback a la heurística de tópicos para payloads antiguos sin moduleKey.
  const unitQuiz = useMemo(
    () =>
      unit
        ? quiz.filter((q) => (q.moduleKey ? q.moduleKey === moduleKey : unitTopicMap(unit.slug, q.topic)))
        : [],
    [quiz, unit, moduleKey],
  );
  const lessons = useMemo(() => parseLessons(unit?.content || []), [unit]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Persistir lección activa en localStorage cada vez que cambia
  useEffect(() => {
    if (lessonStorageKey) localStorage.setItem(lessonStorageKey, String(activeLesson));
  }, [activeLesson, lessonStorageKey]);

  const completedSet = useMemo(() => new Set(onboarding?.completed_units || []), [onboarding]);
  const isLessonDone = (lessonId: string) => completedSet.has(`${moduleKey}:${lessonId}`);
  const completedLessonCount = lessons.filter((l) => isLessonDone(l.id)).length;
  const allLessonsDone = lessons.length > 0 && completedLessonCount >= lessons.length;
  const status = onboarding?.module_status?.find((item) => item.moduleKey === moduleKey);

  useEffect(() => {
    setLessonStartAt(Date.now());
    setReachedEnd(false);
    setInteractionProgress({ completed: 0, total: 0 });
  }, [activeLesson, moduleKey]);

  // Callback estable para que LessonRenderer reporte avance sin re-render loop.
  const handleInteractionsChange = useCallback((completed: number, total: number) => {
    setInteractionProgress((prev) =>
      prev.completed === completed && prev.total === total ? prev : { completed, total },
    );
  }, []);

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
  // Gating: si la lección tiene actividades, completar = responderlas todas.
  // Si no tiene (lecciones aún no interactivas), aplica el timer + scroll clásico.
  const isInteractiveLesson = interactionProgress.total > 0;
  const canMarkLesson = isInteractiveLesson
    ? interactionProgress.completed >= interactionProgress.total
    : elapsedSeconds >= minLessonSeconds && reachedEnd;

  async function markLesson(lessonId: string) {
    if (!unit) return;
    setSaving(true);
    setLessonError("");
    try {
      const res = await fetch("/api/studio/onboarding/progress", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          moduleKey,
          lessonId,
          unitSlug: unit.slug,
          elapsedSeconds,
          reachedEnd,
          interactionsCompleted: interactionProgress.completed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar avance.");
      setOnboarding(data.onboarding as Onboarding);
      setLessonError("");
      setActiveLesson((prev) => Math.min(prev + 1, Math.max(0, lessons.length - 1)));
    } catch (error) {
      setLessonError(error instanceof Error ? error.message : "No se pudo guardar avance.");
    } finally {
      setSaving(false);
    }
  }

  // Tras un intento fallido, el servidor genera una variante nueva del quiz
  // (otras preguntas, otro orden). Hay que refrescarla y limpiar respuestas.
  async function refreshQuizVariant() {
    try {
      const res = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.quiz)) {
        setQuiz(data.quiz as QuizQuestion[]);
        setAnswers({});
      }
    } catch {
      // Si falla el refetch, se mantiene la variante actual visible;
      // el servidor rechazará respuestas inconsistentes de todos modos.
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
        const score = typeof data.score === "number" ? data.score : null;
        setMessage(score !== null ? `Módulo validado con ${score}%. ¡Excelente!` : "Módulo validado. Puedes continuar al siguiente.");
        setTimeout(() => router.push("/studio/onboarding"), 2200);
      } else {
        const attempts = data?.moduleStatus?.attempts ?? 0;
        const maxAttempts = data?.moduleStatus?.maxAttempts ?? 3;
        const failedMax = attempts >= maxAttempts;
        const score = typeof data.score === "number" ? data.score : null;
        setShowReinforceModal(Boolean((Array.isArray(data.topics_to_reinforce) ? data.topics_to_reinforce : []).length));
        setMessage(
          `Obtuviste ${score !== null ? `${score}%` : "puntaje insuficiente"}. Intento ${attempts}/${maxAttempts}.${
            failedMax ? "" : " El próximo intento trae preguntas distintas."
          }`,
        );
        if (!failedMax) await refreshQuizVariant();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo completar módulo.");
    } finally {
      setSaving(false);
    }
  }

  async function requestUnlock() {
    if (!unit || unlockRequested) return;
    setUnlockSending(true);
    try {
      const res = await fetch("/api/studio/onboarding", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "request_unlock", moduleKey }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo enviar la solicitud.");
      }
      setUnlockRequested(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo enviar la solicitud.");
    } finally {
      setUnlockSending(false);
    }
  }

  if (loading) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando módulo..." /></main>;
  if (!unit) return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><Link href="/studio/onboarding">Volver</Link></main>;

  const lesson = lessons[activeLesson];
  const visual = moduleVisuals[moduleKey] || moduleVisuals.A;
  const lessonProgressPct = lessons.length ? Math.round((completedLessonCount / lessons.length) * 100) : 0;
  const lessonGuide = lesson ? getLessonGuide(moduleKey, lesson) : null;

  // Resuelve el render de cada lección via el registro data-driven
  // (getLessonDoc + LessonRenderer). LessonA8 se trata aparte porque es
  // interactiva y necesita props de estado propios.
  const renderLesson = () => {
    if (!lesson) return null;
    const shellProps: ShellProps = { elapsedSeconds, reachedEnd, minLessonSeconds };

    if (moduleKey === "A" && lesson.id === "A8") {
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

    const doc = getLessonDoc(moduleKey, lesson.id);
    if (doc) {
      return (
        <LessonRenderer
          key={`${moduleKey}:${lesson.id}`}
          doc={doc}
          moduleKey={moduleKey}
          onInteractionsChange={handleInteractionsChange}
          {...shellProps}
        />
      );
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

        {/* Índice de lecciones: estado por lección y salto directo */}
        {lessons.length > 1 ? (
          <nav aria-label="Índice de lecciones" className="mt-5 flex flex-wrap gap-2">
            {lessons.map((item, idx) => {
              const done = isLessonDone(item.id);
              const current = idx === activeLesson;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveLesson(idx)}
                  aria-current={current ? "step" : undefined}
                  title={item.title}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                    current
                      ? "border-slate-900 bg-slate-900 font-semibold text-white"
                      : done
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span aria-hidden>{done && !current ? "✓" : idx + 1}</span>
                  <span className="hidden max-w-[18ch] truncate sm:inline">{item.title}</span>
                </button>
              );
            })}
          </nav>
        ) : null}

        {lesson ? (
          <article ref={lessonRef} className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {renderLesson()}
            <div ref={lessonEndRef} className="h-0 w-0" />
            <div className="border-t border-slate-200 bg-slate-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Contexto de posición + botón Anterior */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs disabled:opacity-40"
                    onClick={() => setActiveLesson((v) => Math.max(0, v - 1))}
                    disabled={activeLesson <= 0}
                  >
                    ← Anterior
                  </button>
                  <span className="text-xs text-slate-500">
                    Lección {activeLesson + 1} de {lessons.length}
                  </span>
                </div>
                {/* CTA principal: único botón de avance */}
                <div>
                  {isLessonDone(lesson.id) ? (
                    activeLesson < lessons.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveLesson((v) => v + 1)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                      >
                        Siguiente →
                      </button>
                    ) : (
                      <span className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">
                        ✓ Todas las lecciones completadas
                      </span>
                    )
                  ) : canMarkLesson ? (
                    <button
                      type="button"
                      onClick={() => markLesson(lesson.id)}
                      disabled={saving}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {saving ? "Guardando…" : activeLesson < lessons.length - 1 ? "Completar y continuar →" : "Completar lección"}
                    </button>
                  ) : (
                    <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-400">
                      {isInteractiveLesson
                        ? `Actividades ${interactionProgress.completed}/${interactionProgress.total}`
                        : "Termina de leer para continuar"}
                    </span>
                  )}
                </div>
              </div>
              {lessonError ? (
                <p role="alert" className="mt-2 w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {lessonError}
                </p>
              ) : null}
            </div>
          </article>
        ) : null}

        {/* Banner de llamada al quiz — aparece al completar todas las lecciones */}
        {unitQuiz.length && allLessonsDone ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-900">¡Completaste todas las lecciones!</p>
                <p className="mt-0.5 text-xs text-emerald-800">Rinde la evaluación del módulo para validarlo.</p>
              </div>
              <button
                type="button"
                onClick={() => quizSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                Ir a la evaluación ↓
              </button>
            </div>
          </div>
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

        {status?.status === "failed_max_attempts" ? (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-semibold text-rose-800">Alcanzaste el máximo de intentos en este módulo.</p>
            <p className="mt-0.5 text-xs text-rose-700">Un administrador puede resetearlo. Puedes solicitarlo directamente desde acá.</p>
            <button
              type="button"
              onClick={requestUnlock}
              disabled={unlockSending || unlockRequested}
              className="mt-2 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-800 disabled:opacity-60"
            >
              {unlockRequested ? "✓ Solicitud enviada" : unlockSending ? "Enviando…" : "Solicitar desbloqueo"}
            </button>
          </div>
        ) : null}

        {showReinforceModal && failedTopics.length ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-label="Feedback de evaluación">
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900">Reforzar antes de reintentar</h3>
              <p className="mt-1 text-sm text-slate-700">No solo incorrecto: revisa estos tópicos del estándar institucional.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-800">
                {failedTopics.map((topic) => <li key={`modal-${topic}`}>{`Revisar: ${topicReviewLabel[topic] || topic}`}</li>)}
              </ul>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  autoFocus
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                  onClick={() => setShowReinforceModal(false)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setShowReinforceModal(false);
                  }}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-slate-500">Progreso total: {onboarding?.progress ?? 0}% · Último guardado: {onboarding?.last_saved_at || "Sin registro"}</p>
        {message ? <p role="status" aria-live="polite" className="mt-2 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
