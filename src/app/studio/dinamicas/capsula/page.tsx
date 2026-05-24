"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type Deseo = {
  id: string;
  mensaje: string;
  created_at: string;
};

const EVENTOS = [
  { value: "aniversario_2026", label: "Aniversario 2026" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function StudioCapsulePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [evento, setEvento] = useState("aniversario_2026");
  const [deseos, setDeseos] = useState<Deseo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.canManageAccess) {
          setAuthorized(true);
        } else {
          router.replace("/studio");
        }
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setChecking(false));
  }, [router]);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/deseos?evento=${encodeURIComponent(evento)}`, { credentials: "include" });
      if (!res.ok) throw new Error("Error " + res.status);
      const data = await res.json();
      setDeseos(data.deseos || []);
    } catch {
      setError("No se pudieron cargar los deseos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [evento]);

  useEffect(() => {
    if (authorized) cargar();
  }, [authorized, cargar]);

  function copiarTodo() {
    const texto = deseos.map((d, i) => `${i + 1}. ${d.mensaje}`).join("\n");
    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (checking) return <BrandLoader />;
  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/studio" className="hover:text-slate-700 transition-colors">Studio</Link>
          <span>/</span>
          <Link href="/studio/dinamicas" className="hover:text-slate-700 transition-colors">Dinámicas</Link>
          <span>/</span>
          <span className="text-slate-700">Pecera de los deseos</span>
        </nav>

        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-tho-title text-4xl leading-[0.95] text-slate-950 sm:text-5xl">Pecera de los deseos</h1>
            <p className="mt-2 text-sm text-slate-500">
              Los deseos son anónimos. Solo tú puedes leerlos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={evento}
              onChange={(e) => setEvento(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
            >
              {EVENTOS.map((ev) => (
                <option key={ev.value} value={ev.value}>{ev.label}</option>
              ))}
            </select>
            <button
              onClick={cargar}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition disabled:opacity-40"
            >
              {loading ? "Cargando…" : "Actualizar"}
            </button>
          </div>
        </header>

        {/* Resumen */}
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-slate-400">Total deseos</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">{deseos.length}</p>
          </div>

          {deseos.length > 0 && (
            <button
              onClick={copiarTodo}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition shadow-sm"
            >
              {copied ? "✓ Copiado" : "Copiar todos"}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Lista de deseos */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-slate-400">Cargando deseos…</p>
          </div>
        ) : deseos.length === 0 && !error ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-sm text-slate-400">Aún no hay deseos para este evento.</p>
            <p className="mt-1 text-[12px] text-slate-300">Comparte el enlace tho.cl/deseos para que la gente empiece a escribir.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deseos.map((d, i) => (
              <article
                key={d.id}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-[12px] font-medium text-slate-300">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-[15px] leading-relaxed text-slate-800">{d.mensaje}</p>
                    <p className="mt-2 text-[11px] text-slate-300">{formatDate(d.created_at)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Enlace público */}
        <div className="mt-10 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">Enlace público</p>
          <p className="mt-1 text-sm text-slate-700 font-mono">tho.cl/deseos</p>
          <p className="mt-1 text-[12px] text-slate-400">Comparte esta URL en el evento o conviértela en un código QR para proyectar en pantalla.</p>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <Link href="/studio/dinamicas" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
            ← Volver a Dinámicas
          </Link>
        </div>
      </div>
    </main>
  );
}
