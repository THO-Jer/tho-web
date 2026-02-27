"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

type SessionData = {
  authenticated: boolean;
  permissions?: { canIncidents?: boolean };
};

export default function StudioCanalConfidencialPreparacionPage() {
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
    return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10"><BrandLoader message="Cargando preparación..." /></main>;
  }

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Antes de iniciar tu reporte</h1>

        <div className="mt-5 space-y-4 text-sm text-slate-700">
          <p>
            Te pediremos: tipo de situación, relato descriptivo, fecha del evento y, opcionalmente, personas involucradas y adjuntos.
          </p>
          <p>
            Si eliges <strong>anónimo</strong>, no solicitaremos tu correo. Si eliges <strong>no anónimo</strong>, tu correo será obligatorio
            para comunicaciones del caso.
          </p>
          <p>
            El relato original se resguarda como registro base y no se modifica durante la gestión del caso.
          </p>
          <p>
            El proceso tiene etapas formales (admisibilidad, revisión, medidas y cierre), con trazabilidad y resguardo de confidencialidad.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/studio/canal-confidencial/reportar" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Continuar al formulario
          </Link>
          <Link href="/studio/canal-confidencial" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
            Volver
          </Link>
        </div>
      </section>
    </main>
  );
}
