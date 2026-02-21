"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

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

export default function StudioIndexPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [oauthBaseUrl, setOauthBaseUrl] = useState("");
  const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/studio`;
  }, []);

  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

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
        setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
      } finally {
        setChecking(false);
      }
    };

    run();
  }, []);

  function onMicrosoftLogin() {
    const supabaseUrl = oauthBaseUrl || publicSupabaseUrl;
    if (!supabaseUrl) {
      setMessage("Falta NEXT_PUBLIC_SUPABASE_URL para OAuth Microsoft.");
      return;
    }

    const url = `${supabaseUrl}/auth/v1/authorize?provider=azure&redirect_to=${encodeURIComponent(redirectTo)}`;
    window.location.href = url;
  }

  async function onLogout() {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
    setEmail(null);
    setMessage("Sesión cerrada.");
  }

  return (
    <div className="min-h-screen bg-tho-bg">
      <Header />
      <main className="border-t border-slate-200">
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="font-tho-title text-5xl text-slate-950">THO Studio</h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Acceso interno centralizado. Inicia sesión una vez y luego puedes operar cualquier módulo del Studio.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            {checking ? <p className="text-sm text-slate-600">Verificando sesión...</p> : null}

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
                ) : email ? (
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Entrar
                  </Link>
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
