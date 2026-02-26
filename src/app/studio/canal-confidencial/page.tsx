"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type SessionData = {
  authenticated: boolean;
  permissions?: { canIncidents?: boolean };
};

export default function StudioCanalConfidencialLandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data: SessionData) => {
        if (!data.authenticated || !data.permissions?.canIncidents) {
          router.replace("/studio");
          return;
        }
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando Canal Confidencial..." /></main>;
  }

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Canal Confidencial de Incidentes</h1>
        <p className="mt-3 text-sm text-slate-700">
          En THO promovemos una cultura del cuidado, respeto y debido proceso. Este canal interno está disponible para trabajadores y
          colaboradores asociados (incluye freelancers), con tratamiento confidencial y revisión formal de cada caso.
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Situaciones aplicables (ejemplos)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Acoso laboral o sexual.</li>
            <li>Maltrato, hostigamiento o represalias.</li>
            <li>Conflictos éticos y conductas no alineadas al código de ética.</li>
            <li>Situaciones de riesgo psicosocial relevante para convivencia laboral.</li>
          </ul>
        </div>

        <p className="mt-4 text-sm text-slate-700">
          La confidencialidad se resguarda de manera estricta. Si reportas en modalidad anónima, no se solicitará correo de contacto.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/studio/canal-confidencial/preparacion" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Iniciar reporte confidencial
          </Link>
          <Link href="/canal-confidencial/seguimiento" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
            Consultar un caso existente
          </Link>
          <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
            Volver al Studio
          </Link>
        </div>
      </section>
    </main>
  );
}
