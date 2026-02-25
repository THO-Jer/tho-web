"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BrandLoader } from "@/components/BrandLoader";

type StudioPermissions = {
  canBlog: boolean;
  canCrm: boolean;
  canIncidents: boolean;
};

type ModuleItem = {
  title: string;
  desc: string;
  href: string;
  status: string;
  external: boolean;
  allowed: (perm: StudioPermissions | null) => boolean;
};

const modules: ModuleItem[] = [
  {
    title: "Studio Blog",
    desc: "Gestión editorial completa de entradas, SEO y medios.",
    href: "/studio/blog",
    status: "Activo",
    external: false,
    allowed: (p) => Boolean(p?.canBlog),
  },
  {
    title: "Studio Leads y CRM",
    desc: "Acceso directo a CRM para revisar formularios, estado comercial y seguimiento.",
    href: "https://crm-tho.vercel.app",
    status: "Activo",
    external: true,
    allowed: (p) => Boolean(p?.canCrm),
  },
  {
    title: "Canal Confidencial de Incidentes",
    desc: "Recepción formal de denuncias y panel Director con trazabilidad y gestión por estado.",
    href: "/studio/incidentes",
    status: "Activo",
    external: false,
    allowed: (p) => Boolean(p?.canIncidents),
  },
];

export default function StudioIndexPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [oauthBaseUrl, setOauthBaseUrl] = useState("");
  const [canManageAccess, setCanManageAccess] = useState(false);
  const [permissions, setPermissions] = useState<StudioPermissions | null>(null);
  const [localEmail, setLocalEmail] = useState("");
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
        setPermissions(data.permissions ?? null);
      } else {
        setEmail(null);
        setPermissions(null);
      }
      setCanManageAccess(Boolean(data.canManageAccess));
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
          if (data.ok === false) {
            setMessage(data.error || "No autorizado.");
          } else {
            setMessage(data.requestCreated ? "Solicitud enviada a superadmin." : "Sesión iniciada correctamente.");
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        await verifySession();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
      } finally {
        setChecking(false);
      }
    };

    run();
  }, []);

  function onOAuthLogin(provider: "azure" | "google") {
    const supabaseUrl = oauthBaseUrl || publicSupabaseUrl;
    if (!supabaseUrl) {
      setMessage("Falta NEXT_PUBLIC_SUPABASE_URL para OAuth.");
      return;
    }

    const authUrl = new URL("/auth/v1/authorize", supabaseUrl);
    authUrl.searchParams.set("provider", provider);
    authUrl.searchParams.set("redirect_to", redirectTo);
    authUrl.searchParams.set("scopes", "openid profile email");
    authUrl.searchParams.set("prompt", "select_account");
    window.location.href = authUrl.toString();
  }

  async function onLocalLogin() {
    try {
      const email = localEmail.trim().toLowerCase();
      if (!email || !email.includes("@")) {
        setMessage("Ingresa un correo válido.");
        return;
      }

      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "local_login", email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo iniciar sesión local.");

      if (data.ok === false) {
        setMessage(data.error || "No autorizado.");
        return;
      }

      setMessage("Sesión local iniciada correctamente.");
      setLocalEmail("");
      setEmail(data.email ?? null);
      setPermissions(data.permissions ?? null);
      setCanManageAccess(Boolean(data.canManageAccess));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión local.");
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
            Puedes entrar con OAuth (Microsoft/Google) o con ingreso local por correo autorizado desde Control de Accesos.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            {checking ? <BrandLoader message="Verificando acceso al Studio..." /> : null}

            {!checking && !email ? (
              <div>
                <p className="text-sm text-slate-700">Puedes ingresar con OAuth o con correo local autorizado.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => onOAuthLogin("azure")} className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700" type="button">
                    Ingresar con Microsoft
                  </button>
                  <button onClick={() => onOAuthLogin("google")} className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700" type="button">
                    Ingresar con Google
                  </button>
                </div>
                <div className="mt-4 grid gap-2 sm:max-w-lg sm:grid-cols-[1fr_auto]">
                  <input
                    type="email"
                    value={localEmail}
                    onChange={(e) => setLocalEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button onClick={() => onLocalLogin()} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700" type="button">
                    Ingreso local por correo
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
            {modules.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.status}</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-700">{item.desc}</p>
                {!email ? (
                  <div className="mt-5 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">Requiere sesión</div>
                ) : !item.allowed(permissions) ? (
                  <div className="mt-5 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">Sin permiso asignado</div>
                ) : item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Entrar</a>
                ) : (
                  <Link href={item.href} className="mt-5 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Entrar</Link>
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
