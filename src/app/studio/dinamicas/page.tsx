"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type Dinamica = {
  key: string;
  title: string;
  desc: string;
  href: string;
  tipo: "externa" | "interna";
  estado: "activa" | "archivada" | "próximamente";
  evento: string;
};

const DINAMICAS: Dinamica[] = [
  {
    key: "capsula",
    title: "Pecera de los deseos",
    desc: "Los participantes escriben un deseo anónimo que se guarda en una pecera digital. Pensada para aniversarios o cierres de año.",
    href: "/studio/dinamicas/capsula",
    tipo: "externa",
    estado: "activa",
    evento: "aniversario_2026",
  },
  {
    key: "clima",
    title: "Encuesta de clima organizacional",
    desc: "Pulso periódico del equipo en cinco dimensiones: bienestar, equipo, liderazgo, propósito y crecimiento. Respuestas anónimas, resultados agregados.",
    href: "/studio/dinamicas/clima",
    tipo: "interna",
    estado: "activa",
    evento: "recurrente",
  },
];

const TIPO_LABEL: Record<Dinamica["tipo"], string> = {
  externa: "Externa",
  interna: "Interna",
};

const ESTADO_STYLES: Record<Dinamica["estado"], string> = {
  activa: "bg-green-50 text-green-700 border border-green-200",
  archivada: "bg-slate-100 text-slate-500 border border-slate-200",
  "próximamente": "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function StudioDinamicasPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthorized(true);
        } else {
          router.replace("/studio");
        }
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) return <BrandLoader />;
  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/studio" className="hover:text-slate-700 transition-colors">Studio</Link>
          <span>/</span>
          <span className="text-slate-700">Dinámicas</span>
        </nav>

        <header className="mb-8">
          <h1 className="font-tho-title text-4xl leading-[0.95] text-slate-950 sm:text-5xl">Dinámicas</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Actividades interactivas para eventos internos o externos de THO. Cada dinámica tiene su propio espacio de gestión.
          </p>
        </header>

        {/* Lista de dinámicas */}
        <div className="space-y-3">
          {DINAMICAS.map((d) => (
            <Link
              key={d.key}
              href={d.href}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-900">{d.title}</h2>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${ESTADO_STYLES[d.estado]}`}>
                      {d.estado.charAt(0).toUpperCase() + d.estado.slice(1)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                      {TIPO_LABEL[d.tipo]}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500">{d.desc}</p>
                  <p className="mt-2 text-[11px] text-slate-300">Evento: {d.evento}</p>
                </div>
                <svg className="mt-1 shrink-0 text-slate-300" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {DINAMICAS.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-slate-400">Aún no hay dinámicas configuradas.</p>
          </div>
        )}

        <div className="mt-10 border-t border-slate-100 pt-6">
          <Link href="/studio" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
            ← Volver al Studio
          </Link>
        </div>
      </div>
    </main>
  );
}
