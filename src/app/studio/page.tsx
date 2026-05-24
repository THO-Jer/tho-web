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
  canManageAccess?: boolean;
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
  {
    key: "clima",
    title: "Encuesta de clima",
    desc: "Responde la encuesta de clima del equipo cuando haya una ronda activa. Anónima y toma menos de 5 minutos.",
    href: "/studio/clima",
    status: "Nuevo",
    external: false,
    allowed: () => true,
  },
  {
    key: "dinamicas",
    title: "Dinámicas · Admin",
    desc: "Gestión de dinámicas interactivas para eventos internos y externos: pecera de deseos, clima organizacional y más.",
    href: "/studio/dinamicas",
    status: "Nuevo",
    external: false,
    allowed: (p) => Boolean(p?.canManageAccess),
  },
];

export default function StudioIndexPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [oauthBaseUrl, setOauthBaseUrl] = useState("");
  const [canManageAccess, setCanManageAccess] = useState(false);
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState<StudioPermissions | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [onboardingAccess, setOnboardingAccess] = useState<{ blog?: boolean; incidents?: boolean; crmStudio?: boolean }>({});
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
        setPermissions(data.permissions ? { ...data.permissions, canManageAccess: Boolean(data.canManageAccess) } : null);

        try {
          const onboardingRes = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
          const onboarding = await onboardingRes.json();
          if (onboardingRes.ok) {
            setOnboardingCompleted(Boolean(onboarding?.onboarding?.completed));
            setOnboardingRequired(Boolean(onboarding?.config?.required ?? true));
            setOnboardingBlockInternal(Boolean(onboarding?.config?.blockInternal ?? false));
            setOnboardingAccess(onboarding?.onboarding?.can_access || {});
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

  async function onOAuthLogin(provider: "google" | "azure") {
    const supabaseUrl = oauthBaseUrl || publicSupabaseUrl;
    if (!supabaseUrl || !publicSupabaseAnon) {
      setMessage("Faltan variables públicas de Supabase para OAuth.");
      return;
    }

    const redirectTarget = publicStudioAuthRedirect || "https://tho.cl/studio";
    const supabase = createSupabaseBrowserAuthClient(supabaseUrl, publicSupabaseAnon);
    const providerOptions = provider === "azure"
      ? {
          redirectTo: redirectTarget,
          scopes: "openid profile email",
          queryParams: { prompt: "select_account" },
        }
      : {
          redirectTo: redirectTarget,
          scopes: "email profile",
          queryParams: { prompt: "select_account" },
        };

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: providerOptions,
    });

    if (error) {
      setMessage(`No se pudo iniciar con ${provider === "azure" ? "Microsoft" : "Google"}: ${error.message}`);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
    setEmail(null);
    setPermissions(null);
    setMessage("Sesión cerrada.");
  }

  return (
    <div className="studio-shell min-h-screen bg-tho-bg">
      <Header />
      <main className="border-t border-slate-200">
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">THO Studio</h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Acceso unificado con Supabase Auth vía Microsoft y Google OAuth, con allowlist de roles en Studio.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            {checking ? <BrandLoader message="Verificando acceso al Studio..." /> : null}

            {!checking && !email ? (
              <div>
                <p className="text-sm text-slate-700">Ingresa con Microsoft o Google OAuth para acceder al Studio.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => { void onOAuthLogin("azure"); }} className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700" type="button">
                    Ingresar con Microsoft
                  </button>
                  <button onClick={() => { void onOAuthLogin("google"); }} className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700" type="button">
                    Ingresar con Google
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
              const blockedByOnboardingBase = onboardingRequired && onboardingBlockInternal && !onboardingCompleted && !isSuperAdmin && !onboardingAllowedPaths.includes(item.href);
              const blockedByModuleRule = !isSuperAdmin && ((item.key === "blog" && onboardingAccess.blog === false) || (item.key === "incidents" && onboardingAccess.incidents === false) || (item.key === "crm" && onboardingAccess.crmStudio === false));
              const blockedByOnboarding = blockedByOnboardingBase || blockedByModuleRule;
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
