import Link from "next/link";

import { incidentsCopy } from "@/content/incidentsCopy";

export default function CanalConfidencialPublicLandingPage() {
  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">{incidentsCopy.moduleName}</h1>
        <p className="mt-3 text-sm text-slate-700">{incidentsCopy.internalOnlyMessage}</p>
        <p className="mt-2 text-sm text-slate-600">{incidentsCopy.confidentialityNote}</p>

        <div className="mt-6">
          <Link href="/studio/canal-confidencial" className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Ingresar al Studio
          </Link>
        </div>
      </section>
    </main>
  );
}
