"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BrandLoader } from "@/components/BrandLoader";

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

type Lesson = { id: string; label: string; title: string; subtitle: string; bullets: string[] };

const moduleVisuals: Record<string, { cover: string; accent: string }> = {
  A: { cover: "/ilustraciones/1.png", accent: "text-sky-700" },
  B: { cover: "/ilustraciones/4.png", accent: "text-indigo-700" },
  C: { cover: "/ilustraciones/7.png", accent: "text-violet-700" },
  D: { cover: "/ilustraciones/10.png", accent: "text-emerald-700" },
};

type LessonGuide = {
  whyItMatters: string;
  whatToDo: string;
  commonMistake: string;
  keyLearnings: string[];
};

const moduleALessonGuides: Record<string, LessonGuide> = {
  A0: {
    whyItMatters: "Define el estándar base: onboarding es alineación operativa para evitar ambigüedad, errores repetidos y daño reputacional.",
    whatToDo: "Antes de ejecutar, verifica propósito, criterio de calidad y trazabilidad mínima de tu trabajo.",
    commonMistake: "Tratar el onboarding como lectura pasiva sin traducirlo a decisiones concretas del rol.",
    keyLearnings: ["Entiendo qué protege este onboarding", "Sé qué evidencia dejar en cada entrega", "Identifico cuándo debo escalar dudas"],
  },
  A1: {
    whyItMatters: "El propósito institucional guía prioridades cuando hay tensión entre velocidad, calidad y riesgo.",
    whatToDo: "Conecta cada tarea con impacto organizacional: decisión, riesgo mitigado o legitimidad fortalecida.",
    commonMistake: "Ejecutar tareas aisladas sin evaluar coherencia estratégica.",
    keyLearnings: ["Puedo explicar para qué existe THO", "Relaciono mi rol con ese propósito", "Identifico riesgos de incoherencia"],
  },
  A2: {
    whyItMatters: "Diferenciar propósito y propuesta de valor evita promesas vagas y mejora posicionamiento profesional.",
    whatToDo: "Habla en términos de método: diagnóstico, diseño, acompañamiento, trazabilidad y gestión de riesgos.",
    commonMistake: "Vender entusiasmo o esfuerzo sin explicar estructura ni resultados verificables.",
    keyLearnings: ["Distingo propósito vs. propuesta de valor", "Puedo explicar el método THO", "Evito lenguaje ambiguo en propuestas"],
  },

  A3: {
    whyItMatters: "Eleva el estándar de entrega: calidad no es estética, es decisión trazable y ejecutable.",
    whatToDo: "Antes de cerrar cualquier pieza, valida contexto, evidencia, decisión, riesgos y próximos pasos con responsable.",
    commonMistake: "Dar por terminado algo “bonito” pero sin criterio ni accountability.",
    keyLearnings: ["Problema delimitado", "Decisión explícita", "Riesgos identificados", "Responsable y fecha definidos"],
  },
  A4: {
    whyItMatters: "Los valores son reglas operativas, no slogans. Definen cómo se trabaja bajo presión.",
    whatToDo: "Practica humanidad en el lenguaje, colaboración en documentación y adaptabilidad basada en evidencia.",
    commonMistake: "Invocar valores solo en discurso, pero decidir por conveniencia o orgullo.",
    keyLearnings: ["Cuidé forma y fondo de la comunicación", "Dejé documentación compartida", "Ajusté decisión ante evidencia"],
  },
  A5: {
    whyItMatters: "Los no negociables protegen al equipo, al cliente y a la reputación institucional.",
    whatToDo: "Ante presión por atajos, sostén método mínimo: trazabilidad, resguardo de datos y alcance realista.",
    commonMistake: "Aceptar compromisos inviables para “resolver rápido”.",
    keyLearnings: ["No prometí lo que no puedo sostener", "Resguardé información sensible", "No omití trazabilidad mínima"],
  },
  A6: {
    whyItMatters: "Ética operativa consistente evita conflictos, protege a personas y da legitimidad a la intervención.",
    whatToDo: "Registra decisiones con contexto, declara conflictos tempranamente y usa canales formales.",
    commonMistake: "Resolver por canal informal temas que requieren trazabilidad o control de acceso.",
    keyLearnings: ["Decisión registrada con contexto", "Conflictos declarados", "Canal formal utilizado"],
  },
  A7: {
    whyItMatters: "Escalar a tiempo reduce exposición legal, reputacional y operativa.",
    whatToDo: "Si detectas tensión crítica entre urgencia y calidad, documenta riesgo y escala con recomendación clara.",
    commonMistake: "Normalizar excepciones frecuentes hasta que se vuelven crisis.",
    keyLearnings: ["Riesgo identificado", "Escalamiento ejecutado", "Criterio de decisión documentado"],
  },
  "Reflexión guiada sugerida": {
    whyItMatters: "La reflexión transforma contenido en criterio aplicable al rol.",
    whatToDo: "Formula compromisos concretos: qué harás distinto, qué límites sostendrás y cuándo escalarás.",
    commonMistake: "Responder de forma genérica sin conexión con decisiones reales del trabajo.",
    keyLearnings: ["Definí 2 compromisos operativos", "Identifiqué 1 riesgo de incoherencia", "Definí cómo lo escalaría"],
  },
};

function getLessonGuide(moduleKey: string, lesson: Lesson): LessonGuide {
  if (moduleKey === "A" && moduleALessonGuides[lesson.id]) return moduleALessonGuides[lesson.id];
  return {
    whyItMatters: `Esta lección define criterio operativo para ${moduleKey}.`,
    whatToDo: "Traduce el contenido en una acción concreta, registra decisión y responsable.",
    commonMistake: "Leer y seguir avanzando sin convertir el contenido en criterio aplicable.",
    keyLearnings: [
      lesson.subtitle || "Identifica la idea principal",
      lesson.bullets[0] || "Define una acción aplicable a tu rol",
      "Documenta el criterio para continuidad del equipo",
    ],
  };
}

function parseLessons(content: string[]): Lesson[] {
  return content.map((paragraph, index) => {
    const normalized = paragraph.replace(/\s+/g, " ").trim();
    const match = normalized.match(/^([A-Z]\d+|Reflexión guiada sugerida|Venta consultiva en THO|Cierre del módulo)\s*[—:-]\s*(.+)$/i);
    const id = match ? String(match[1]).trim() : `L${index + 1}`;
    const label = match ? String(match[1]).trim() : `Lección ${index + 1}`;
    const body = match ? String(match[2]).trim() : normalized;
    const colonIdx = body.indexOf(":");
    const title = colonIdx > 0 ? body.slice(0, colonIdx).trim() : body.split(/\.\s+/)[0].trim();
    const remainder = colonIdx > 0 ? body.slice(colonIdx + 1).trim() : body;
    const segments = remainder.split(/\.\s+/).map((segment) => segment.trim()).filter(Boolean);
    const subtitle = segments[0] || remainder || title;
    const bullets = segments.slice(1).map((segment) => segment.replace(/\.$/, ""));
    return { id, label, title, subtitle, bullets };
  });
}


function unitTopicMap(slug: string, topic: string) {
  const t = topic.toLowerCase();
  const byUnit: Record<string, string[]> = {
    "identidad-tho": ["identidad", "onboarding"],
    "ventas-tho": ["ventas"],
    "operacion-creativa": ["operacion_creativa", "operacion"],
    "operacion-asesorias": ["operacion_asesorias", "seguridad"],
  };
  return (byUnit[slug] || []).some((prefix) => t.startsWith(prefix));
}

function topicToLesson(topic: string, lessons: Array<{ id: string; label: string }>) {
  const t = topic.toLowerCase();
  if (t.startsWith("identidad") || t.startsWith("onboarding")) return lessons.find((l) => l.id.startsWith("A")) || lessons[0];
  if (t.startsWith("ventas")) return lessons.find((l) => l.id.startsWith("B")) || lessons[0];
  if (t.startsWith("operacion_creativa") || t.startsWith("operacion")) return lessons.find((l) => l.id.startsWith("C")) || lessons[0];
  if (t.startsWith("operacion_asesorias") || t.startsWith("seguridad")) return lessons.find((l) => l.id.startsWith("D")) || lessons[0];
  return lessons[0];
}

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
  const [tick, setTick] = useState(() => Date.now());
  const lessonRef = useRef<HTMLElement | null>(null);
  const lessonEndRef = useRef<HTMLDivElement | null>(null);

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
  const currentIndex = unit ? units.findIndex((item) => item.slug === unit.slug) : -1;
  const moduleKey = ["A", "B", "C", "D"][currentIndex] || "A";
  const next = currentIndex >= 0 ? units[currentIndex + 1] : null;
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
    const marker = lessonEndRef.current;
    if (!marker) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setReachedEnd(true);
    }, { threshold: 0.25 });
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
        if (next) router.push(`/studio/onboarding/${next.slug}`);
        else router.push("/studio/onboarding");
      } else {
        const attempts = data?.moduleStatus?.attempts ?? 0;
        const maxAttempts = data?.moduleStatus?.maxAttempts ?? 3;
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

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-sky-50 via-white to-violet-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Módulo {moduleKey} · {unit.durationMinutes} min</div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{unit.title}</h1>
              <p className="mt-2 text-sm text-slate-700">{unit.summary}</p>
              <p className="mt-2 text-xs text-slate-500">Lecciones completadas: {completedLessonCount}/{lessons.length} · Intentos quiz: {status?.attempts ?? 0}/{status?.maxAttempts ?? 3}</p>
              <div className="mt-3 max-w-md">
                <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span>Avance del módulo</span>
                  <span>{lessonProgressPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-slate-900" style={{ width: `${lessonProgressPct}%` }} />
                </div>
              </div>
            </div>
            <Image src="/brand/logo-negro.png" alt="THO" width={90} height={90} className="opacity-80" />
          </div>
        </div>

        {lesson ? (
          <article ref={lessonRef} className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lección {activeLesson + 1}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{lesson.title}</h2>
                <p className={`mt-2 text-base font-medium ${visual.accent}`}>{lesson.subtitle}</p>
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Puntos de clarificación</p>
                  {lesson.bullets.length ? (
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                      {lesson.bullets.map((bullet, idx) => (
                        <li key={`${lesson.id}-bullet-${idx}`}>{bullet}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">No hay aclaraciones adicionales en esta lección.</p>
                  )}
                </div>

                {lessonGuide ? (
                  <div className="mt-4 space-y-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Por qué importa</p>
                      <p className="mt-1 text-sm text-slate-700">{lessonGuide.whyItMatters}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Qué debes hacer en THO</p>
                      <p className="mt-1 text-sm text-slate-700">{lessonGuide.whatToDo}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Error frecuente</p>
                      <p className="mt-1 text-sm text-slate-700">{lessonGuide.commonMistake}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Aprendizajes clave</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {lessonGuide.keyLearnings.slice(0, 3).map((item) => (
                          <li key={`${lesson.id}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}

                <p className="mt-4 text-xs text-slate-500">Anti-trampa suave: llega al final y permanece al menos {minLessonSeconds}s en la lección.</p>
                <div className="mt-1 text-xs text-slate-500">Tiempo actual: {elapsedSeconds}s · Final alcanzado: {reachedEnd ? "sí" : "no"}</div>
              </div>
              <div className="relative min-h-44 bg-slate-50">
                <Image src={visual.cover} alt={`Ilustración módulo ${moduleKey}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
            </div>
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
          <div className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
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
                    {topic} · {lessonRefItem ? <button type="button" onClick={() => setActiveLesson(Math.max(0, lessons.findIndex((item) => item.id === lessonRefItem.id)))} className="underline underline-offset-2">ir a {lessonRefItem.label}</button> : null}
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
        <p className="mt-4 text-xs text-slate-500">Progreso total: {onboarding?.progress ?? 0}% · Último guardado: {onboarding?.last_saved_at || "Sin registro"}</p>
        {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
