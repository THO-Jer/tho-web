"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BrandLoader } from "@/components/BrandLoader";

const modules = [
  {
    title: "Studio Blog",
    desc: "Gestión editorial completa de entradas, SEO y medios.",
    href: "/studio/blog",
    status: "Activo",
  },
  {
    title: "Studio Recursos",
    desc: "Curar y publicar PDFs, guías, plantillas y descargables.",
    href: "#",
    status: "Próximamente",
  },
  {
    title: "Studio Casos y Experiencia",
    desc: "Actualizar casos, resultados e hitos de proyectos por industria.",
    href: "#",
    status: "Próximamente",
  },
  {
    title: "Studio Leads y CRM",
    desc: "Panel para revisar formularios, estado CRM y seguimiento comercial.",
    href: "#",
    status: "Próximamente",
  },
];

const onboardingFlow = [
  {
    title: "Módulo 1 · Contexto estratégico THO",
    readSeconds: 60,
    paragraphs: [
      "Este onboarding no está pensado para leer en diagonal. El objetivo es que entiendas cómo conectamos estrategia, operación y relato para que cada acción en Studio tenga coherencia con el estándar THO.",
      "Antes de publicar o editar contenido, valida siempre tres capas: qué problema resolvemos, para quién lo resolvemos y qué decisión habilita la pieza. Si una publicación no responde esas capas, detén el flujo y ajusta.",
      "Tu rol no es sólo producir contenido; es reducir ambigüedad estratégica. Por eso, cada texto debe traducir procesos complejos en decisiones ejecutables para equipos que trabajan bajo presión.",
    ],
  },
  {
    title: "Módulo 2 · Criterios editoriales y evidencia",
    readSeconds: 90,
    paragraphs: [
      "La voz THO combina precisión técnica con lenguaje claro. Evita promesas grandilocuentes, evita jergas vacías y evita afirmaciones sin evidencia verificable en terreno.",
      "Cada artículo debe integrar al menos un ejemplo aplicado, un riesgo de implementación y una recomendación accionable. Esta triada evita contenido ornamental y mejora la transferencia de conocimiento.",
      "Cuando cites resultados, aclara alcance temporal, contexto y límites. Transparencia metodológica genera confianza, y la confianza es un activo estratégico para cualquier organización que asesoramos.",
    ],
  },
  {
    title: "Módulo 3 · Gobernanza, calidad y publicación",
    readSeconds: 90,
    paragraphs: [
      "Publicar en Studio implica responsabilidad de marca. Revisa consistencia de título, excerpt, categoría y tags para que el contenido sea encontrable y útil, no solo visible.",
      "Antes de cerrar una edición, haz una lectura crítica completa: identifica afirmaciones ambiguas, define próximas acciones y confirma que el lector entiende qué hacer después de leer.",
      "La calidad no se delega al último minuto. Se diseña desde la estructura inicial del texto. Si faltan datos o claridad, prioriza mejorar fondo antes de ajustar forma.",
    ],
  },
];

const evaluationQuestions = [
  {
    question: "¿Qué debe existir siempre antes de publicar?",
    options: [
      "Una pieza visual llamativa, aunque no haya decisión clara.",
      "Un vínculo explícito entre problema, audiencia y decisión habilitada.",
      "Solo un título SEO con alto volumen de búsqueda.",
    ],
    correct: 1,
  },
  {
    question: "¿Qué criterio protege mejor la confianza con clientes?",
    options: [
      "Eliminar límites metodológicos para simplificar el mensaje.",
      "Prometer resultados en cualquier contexto.",
      "Mostrar alcance, contexto y límites de la evidencia.",
    ],
    correct: 2,
  },
  {
    question: "Si el texto está bonito pero no orienta acción, ¿qué corresponde?",
    options: [
      "Publicarlo igual para no atrasar el calendario.",
      "Reestructurarlo hasta que habilite decisiones concretas.",
      "Agregar más adjetivos para que suene más experto.",
    ],
    correct: 1,
  },
] as const;

export default function StudioIndexPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [oauthBaseUrl, setOauthBaseUrl] = useState("");
  const [moduleStartedAt, setModuleStartedAt] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(Date.now());
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [currentModule, setCurrentModule] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [evaluationReady, setEvaluationReady] = useState(false);
  const [evaluationPassed, setEvaluationPassed] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState("");
  const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/studio`;
  }, []);

  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const hashError = params.get("error_description") || params.get("error");
    const queryParams = new URLSearchParams(window.location.search);
    const queryError = queryParams.get("error_description") || queryParams.get("error");

    const verifySession = async () => {
      const res = await fetch("/api/admin/session", { credentials: "include" });
      const data = await res.json();
      if (data.authenticated) {
        setEmail(data.email ?? null);
      } else {
        setEmail(null);
      }
      if (typeof data.oauthBaseUrl === "string") {
        setOauthBaseUrl(data.oauthBaseUrl);
      }
    };

    const run = async () => {
      setChecking(true);
      try {
        if (hashError || queryError) {
          throw new Error(decodeURIComponent(hashError || queryError || "OAuth error"));
        }

        if (accessToken) {
          const res = await fetch("/api/admin/session", {
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ action: "oauth_login", accessToken }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "No se pudo completar login.");
          setMessage("Sesión iniciada con Microsoft.");
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        await verifySession();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión con Microsoft.");
      } finally {
        setChecking(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    if (!email) return;
    if (completedModules.includes(currentModule)) return;
    setModuleStartedAt(Date.now());
  }, [currentModule, completedModules, email]);

  useEffect(() => {
    if (!moduleStartedAt || completedModules.includes(currentModule)) return;
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [moduleStartedAt, currentModule, completedModules]);

  function onMicrosoftLogin() {
    const supabaseUrl = oauthBaseUrl || publicSupabaseUrl;
    if (!supabaseUrl) {
      setMessage("Falta NEXT_PUBLIC_SUPABASE_URL para OAuth Microsoft.");
      return;
    }

    const authUrl = new URL("/auth/v1/authorize", supabaseUrl);
    authUrl.searchParams.set("provider", "azure");
    authUrl.searchParams.set("redirect_to", redirectTo);
    authUrl.searchParams.set("scopes", "openid profile email");
    authUrl.searchParams.set("prompt", "select_account");
    window.location.href = authUrl.toString();
  }

  async function onLogout() {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
    setEmail(null);
    setMessage("Sesión cerrada.");
  }

  const totalModules = onboardingFlow.length;
  const activeModule = onboardingFlow[currentModule];
  const elapsedSeconds = moduleStartedAt ? Math.max(0, Math.floor((nowTick - moduleStartedAt) / 1000)) : 0;
  const remainingSeconds = Math.max(0, (activeModule?.readSeconds ?? 0) - elapsedSeconds);
  const progress = activeModule ? Math.min(100, Math.round((elapsedSeconds / activeModule.readSeconds) * 100)) : 0;

  function completeCurrentModule() {
    if (!activeModule) return;
    if (remainingSeconds > 0) return;
    setCompletedModules((prev) => (prev.includes(currentModule) ? prev : [...prev, currentModule]));
    if (currentModule < totalModules - 1) {
      setCurrentModule(currentModule + 1);
      return;
    }
    setEvaluationReady(true);
  }

  function submitEvaluation() {
    const score = evaluationQuestions.reduce((acc, item, index) => {
      return answers[index] === item.correct ? acc + 1 : acc;
    }, 0);
    const passed = score >= 3;
    setEvaluationPassed(passed);
    setEvaluationResult(
      passed
        ? "Evaluación completada. Ya puedes avanzar a los módulos del Studio."
        : `Obtuviste ${score}/${evaluationQuestions.length}. Debes lograr 3/3 para desbloquear el acceso.`
    );
  }

  return (
    <div className="studio-shell min-h-screen bg-tho-bg">
      <Header />
      <main className="border-t border-slate-200">
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">THO Studio</h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Acceso interno centralizado. Inicia sesión una vez y luego puedes operar cualquier módulo del Studio.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            {checking ? <BrandLoader message="Verificando acceso al Studio..." /> : null}

            {!checking && !email ? (
              <div>
                <p className="text-sm text-slate-700">Ingresa con Microsoft para acceder al Studio.</p>
                <button
                  onClick={onMicrosoftLogin}
                  className="mt-3 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                  type="button"
                >
                  Ingresar con Microsoft
                </button>
              </div>
            ) : null}

            {!checking && email ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-slate-700">Sesión activa como <strong>{email}</strong>.</div>
                <button onClick={onLogout} className="rounded-lg border border-slate-300 px-3 py-2 text-xs" type="button">
                  Salir
                </button>
              </div>
            ) : null}

            {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
          </div>

          {email ? (
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Onboarding obligatorio</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Debes completar cada módulo para desbloquear el siguiente</h2>
              <p className="mt-3 max-w-3xl text-sm text-slate-700">
                El flujo bloquea el avance por tiempo real de lectura. La evaluación final está anclada al mismo panel para evitar navegación rápida hacia arriba y reforzar comprensión antes de operar el Studio.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">{activeModule.title}</h3>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Paso {currentModule + 1} de {totalModules}</div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {remainingSeconds > 0 ? `Lectura en curso: espera ${remainingSeconds}s para habilitar el siguiente módulo.` : "Tiempo mínimo cumplido. Puedes desbloquear el siguiente módulo."}
                </p>

                <div className="mt-5 grid gap-3">
                  {activeModule.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-slate-700">{paragraph}</p>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={completeCurrentModule}
                  disabled={remainingSeconds > 0}
                  className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {currentModule === totalModules - 1 ? "Finalizar módulo y abrir evaluación" : "Completar módulo y continuar"}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {onboardingFlow.map((module, index) => {
                  const unlocked = index === 0 || completedModules.includes(index - 1);
                  const done = completedModules.includes(index);
                  return (
                    <button
                      type="button"
                      key={module.title}
                      onClick={() => unlocked && setCurrentModule(index)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold ${done ? "border-emerald-200 bg-emerald-50 text-emerald-700" : unlocked ? "border-slate-300 bg-white text-slate-700" : "border-slate-200 bg-slate-100 text-slate-400"}`}
                      disabled={!unlocked}
                    >
                      {done ? "✓" : index + 1}. {module.title}
                    </button>
                  );
                })}
              </div>

              {evaluationReady ? (
                <div className="mt-8 rounded-2xl border border-slate-900 bg-slate-950 p-5 text-white">
                  <h3 className="text-xl font-semibold">Evaluación de cierre (obligatoria)</h3>
                  <p className="mt-2 text-sm text-slate-200">Responde correctamente las 3 preguntas para habilitar los accesos del Studio.</p>

                  <div className="mt-5 grid gap-4">
                    {evaluationQuestions.map((item, index) => (
                      <fieldset key={item.question} className="rounded-xl border border-slate-700 p-4">
                        <legend className="px-1 text-sm font-semibold">{index + 1}. {item.question}</legend>
                        <div className="mt-3 grid gap-2">
                          {item.options.map((option, optionIndex) => (
                            <label key={option} className="flex cursor-pointer items-start gap-2 text-sm text-slate-100">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                checked={answers[index] === optionIndex}
                                onChange={() => setAnswers((prev) => ({ ...prev, [index]: optionIndex }))}
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={submitEvaluation}
                    className="mt-5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-950"
                  >
                    Enviar evaluación
                  </button>
                  {evaluationResult ? <p className="mt-3 text-sm text-slate-200">{evaluationResult}</p> : null}
                </div>
              ) : null}
            </section>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {modules.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.status}</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-700">{item.desc}</p>
                {item.href === "#" ? (
                  <div className="mt-5 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">
                    Se habilita en siguiente fase
                  </div>
                ) : email && evaluationPassed ? (
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Entrar
                  </Link>
                ) : email ? (
                  <div className="mt-5 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">
                    Completa onboarding + evaluación
                  </div>
                ) : (
                  <div className="mt-5 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">
                    Requiere sesión
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
