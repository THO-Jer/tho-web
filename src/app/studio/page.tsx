"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BrandLoader } from "@/components/BrandLoader";
import { createSupabaseBrowserAuthClient } from "@/lib/supabaseBrowserAuth";

type StudioPermissions = {
  canBlog: boolean;
  canCrm: boolean;
  canIncidents: boolean;
  canOnboarding?: boolean;
};

type ModuleItem = {
  key: string;
  title: string;
  desc: string;
  href: string;
  status: string;
  external: boolean;
  allowed: (perm: StudioPermissions | null) => boolean;
};

const modules: ModuleItem[] = [
  {
    key: "onboarding",
    title: "Studio Onboarding",
    desc: "Inducción obligatoria THO por módulos: identidad, ventas y operación con progreso visible.",
    href: "/studio/onboarding",
    status: "Nuevo",
    external: false,
    allowed: (p) => p?.canOnboarding !== false,
  },
  {
    key: "blog",
    title: "Studio Blog",
    desc: "Gestión editorial completa de entradas, SEO y medios.",
    href: "/studio/blog",
    status: "Activo",
    external: false,
    allowed: (p) => Boolean(p?.canBlog),
  },
  {
    key: "crm",
    title: "Studio Leads y CRM",
    desc: "Acceso directo a CRM para revisar formularios, estado comercial y seguimiento.",
    href: "https://crm-tho.vercel.app",
    status: "Activo",
    external: true,
    allowed: (p) => Boolean(p?.canCrm),
  },
  {
    key: "incidents",
    title: "Canal Confidencial de Incidentes",
    desc: "Recepción formal de denuncias y panel Director con trazabilidad y gestión por estado.",
    href: "/studio/canal-confidencial",
    status: "Activo",
    external: false,
    allowed: (p) => Boolean(p?.canIncidents),
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
  const [canManageAccess, setCanManageAccess] = useState(false);
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState<StudioPermissions | null>(null);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSending, setMagicSending] = useState(false);
  const [magicCooldownUntil, setMagicCooldownUntil] = useState(0);
  const [magicCooldownSeconds, setMagicCooldownSeconds] = useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [onboardingRequired, setOnboardingRequired] = useState(true);
  const [onboardingBlockInternal, setOnboardingBlockInternal] = useState(false);
  const [studioRedirectUrl, setStudioRedirectUrl] = useState("");
  const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const publicSupabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const publicStudioAuthRedirect = (process.env.NEXT_PUBLIC_STUDIO_AUTH_REDIRECT_URL || "").trim();

  const redirectTo = useMemo(() => {
    if (studioRedirectUrl) return studioRedirectUrl;
    const envStudio = (process.env.NEXT_PUBLIC_STUDIO_URL || "").trim().replace(/\/$/, "");
    if (!envStudio) return "";
    return envStudio.endsWith("/studio") ? envStudio : `${envStudio}/studio`;
  }, [studioRedirectUrl]);

  const oauthCallbackUrl = useMemo(() => {
    if (!redirectTo) return "";
    return `${redirectTo.replace(/\/$/, "")}/auth/callback`;
  }, [redirectTo]);

  const magicRedirectTo = useMemo(() => {
    return publicStudioAuthRedirect.replace(/\/$/, "");
  }, [publicStudioAuthRedirect]);

  useEffect(() => {
    if (!magicCooldownUntil) {
      setMagicCooldownSeconds(0);
      return;
    }

    const update = () => {
      const remaining = Math.max(0, Math.ceil((magicCooldownUntil - Date.now()) / 1000));
      setMagicCooldownSeconds(remaining);
      if (remaining <= 0) setMagicCooldownUntil(0);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [magicCooldownUntil]);

  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const hashError = params.get("error_description") || params.get("error");
    const queryParams = new URLSearchParams(window.location.search);
    const queryError = queryParams.get("error_description") || queryParams.get("error");

    if (accessToken || hashError || queryError) {
      const callbackPath = `/studio/auth/callback${window.location.search}${window.location.hash}`;
      window.location.replace(callbackPath);
      return;
    }

    const verifySession = async () => {
      const res = await fetch("/api/admin/session", { credentials: "include" });
      const data = await res.json();
      if (data.authenticated) {
        setEmail(data.email ?? null);
        setPermissions(data.permissions ?? null);

        try {
          const onboardingRes = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
          const onboarding = await onboardingRes.json();
          if (onboardingRes.ok) {
            setOnboardingCompleted(Boolean(onboarding?.onboarding?.completed));
            setOnboardingRequired(Boolean(onboarding?.config?.required ?? true));
            setOnboardingBlockInternal(Boolean(onboarding?.config?.blockInternal ?? false));
          }
        } catch {
          setOnboardingCompleted(false);
        }
      } else {
        setEmail(null);
        setPermissions(null);
      }
      setCanManageAccess(Boolean(data.canManageAccess));
      setRole(String(data.role || ""));
      if (typeof data.oauthBaseUrl === "string") {
        setOauthBaseUrl(data.oauthBaseUrl);
      }
      if (typeof data.studioRedirectUrl === "string") {
        setStudioRedirectUrl(data.studioRedirectUrl);
      }
    };

    const run = async () => {
      setChecking(true);
      try {
        await verifySession();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
      } finally {
        setChecking(false);
      }
    };

    run();
  }, [oauthCallbackUrl]);

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
  function onOAuthLogin() {
    const supabaseUrl = oauthBaseUrl || publicSupabaseUrl;
    if (!supabaseUrl) {
      setMessage("Falta NEXT_PUBLIC_SUPABASE_URL para OAuth.");
      return;
    }

    if (!redirectTo) {
      setMessage("Falta STUDIO_AUTH_REDIRECT_URL (o NEXT_PUBLIC_STUDIO_URL) para forzar redirect del Studio.");
      return;
    }

    const authUrl = new URL("/auth/v1/authorize", supabaseUrl);
    authUrl.searchParams.set("provider", "azure");
    authUrl.searchParams.set("redirect_to", oauthCallbackUrl || redirectTo);
    authUrl.searchParams.set("scopes", "openid profile email");
    authUrl.searchParams.set("prompt", "select_account");
    window.location.href = authUrl.toString();
  }

  async function onSendMagicLink() {
    const supabaseUrl = oauthBaseUrl || publicSupabaseUrl;
    const emailValue = magicEmail.trim().toLowerCase();
    if (!supabaseUrl || !publicSupabaseAnon) {
      setMessage("Faltan variables públicas de Supabase para magic link.");
      return;
    }
    if (!magicRedirectTo) {
      setMessage("Falta NEXT_PUBLIC_STUDIO_AUTH_REDIRECT_URL para forzar redirect del Magic Link.");
      return;
    }
    if (!emailValue || !emailValue.includes("@")) {
      setMessage("Ingresa un correo válido para magic link.");
      return;
    }
    if (magicCooldownSeconds > 0) {
      setMessage(`Espera ${magicCooldownSeconds}s para solicitar un nuevo magic link.`);
      return;
    }

    setMagicSending(true);
    try {
      console.info("[studio] sending magic link with emailRedirectTo", magicRedirectTo);
      const supabase = createSupabaseBrowserAuthClient(supabaseUrl, publicSupabaseAnon);
      const { error, response } = await supabase.auth.signInWithOtp({
        email: emailValue,
        options: {
          emailRedirectTo: magicRedirectTo,
          shouldCreateUser: true,
        },
      });

      if (error) {
        const err = error.message;
        const retryAfter = Number(response?.headers.get("retry-after") || "0");
        const parsedSeconds = Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter
          : Number((err.match(/(\d+)\s*(?:seg|second|min)/i) || ["", "0"])[1] || "0");
        if (parsedSeconds > 0) {
          setMagicCooldownUntil(Date.now() + parsedSeconds * 1000);
          setMessage(`Debes esperar ${parsedSeconds}s antes de solicitar otro magic link.`);
          return;
        }
        setMessage(`No se pudo enviar magic link: ${err}`);
        return;
      }

      setMagicCooldownUntil(Date.now() + 60 * 1000);
      setMessage(`Magic link enviado. Revisa tu correo. Te redirigirá a ${magicRedirectTo} cuando verifiques el enlace.`);
      setMagicEmail("");
    } finally {
      setMagicSending(false);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
    setEmail(null);
    setPermissions(null);
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
            Acceso unificado con Supabase Auth (Microsoft para internos, magic link para externos) y allowlist de roles en Studio.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            {checking ? <BrandLoader message="Verificando acceso al Studio..." /> : null}

            {!checking && !email ? (
              <div>
                <p className="text-sm text-slate-700">Ingresa con Microsoft o solicita magic link si eres externo autorizado.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={onOAuthLogin} className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700" type="button">
                    Ingresar con Microsoft
                  </button>
                </div>
                <div className="mt-4 grid gap-2 sm:max-w-lg sm:grid-cols-[1fr_auto]">
                  <input
                    type="email"
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    placeholder="freelancer@correo.com"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button onClick={onSendMagicLink} disabled={magicSending || magicCooldownSeconds > 0} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60" type="button">
                    {magicSending ? "Enviando..." : magicCooldownSeconds > 0 ? `Reintentar en ${magicCooldownSeconds}s` : "Enviar magic link"}
                  </button>
                </div>
              </div>
            ) : null}

            {!checking && email ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-slate-700">Sesión activa como <strong>{email}</strong>.</div>
                <button onClick={onLogout} className="rounded-lg border border-slate-300 px-3 py-2 text-xs" type="button">Salir</button>
              </div>
            ) : null}

            {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
          </div>

          {canManageAccess ? (
            <div className="mt-4">
              <Link href="/studio/accesos" className="inline-flex rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Control de accesos (superadmin)
              </Link>
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {modules.map((item) => {
              const isSuperAdmin = role === "superadmin";
              const onboardingAllowedPaths = ["/studio/onboarding", "/studio/canal-confidencial"];
              const blockedByOnboarding = onboardingRequired && onboardingBlockInternal && !onboardingCompleted && !isSuperAdmin && !onboardingAllowedPaths.includes(item.href);
              return (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.status}</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-700">{item.desc}</p>
                {!email ? (
                  <div className="mt-5 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">Requiere sesión</div>
                ) : !item.allowed(permissions) ? (
                  <div className="mt-5 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">Sin permiso asignado</div>
                ) : blockedByOnboarding ? (
                  <div className="mt-5 inline-flex flex-wrap items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">Bloqueado hasta completar onboarding · <Link href="/studio/onboarding" className="underline underline-offset-2">Ir a onboarding</Link></div>
                ) : item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Entrar</a>
                ) : (
                  <Link href={item.href} className="mt-5 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Entrar</Link>
                )}
              </article>
            );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
