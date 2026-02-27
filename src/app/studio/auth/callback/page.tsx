"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";

export default function StudioAuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Completando autenticación...");

  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = hashParams.get("access_token") || queryParams.get("access_token") || "";
    const hashError = hashParams.get("error_description") || hashParams.get("error");
    const queryError = queryParams.get("error_description") || queryParams.get("error");

    const run = async () => {
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
          if (data.ok === false) throw new Error(data.error || "No autorizado.");
        }

        const sessionRes = await fetch("/api/admin/session", { credentials: "include", cache: "no-store" });
        const session = await sessionRes.json();
        if (!session?.authenticated) {
          throw new Error("No se pudo confirmar sesión de Studio.");
        }

        router.replace("/studio");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo completar autenticación.");
      }
    };

    run();
  }, [router]);

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center">
        {message === "Completando autenticación..." ? <BrandLoader message={message} /> : <p className="text-sm text-slate-700">{message}</p>}
        <div className="mt-4">
          <Link href="/studio" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Volver al Studio</Link>
        </div>
      </div>
    </main>
  );
}
