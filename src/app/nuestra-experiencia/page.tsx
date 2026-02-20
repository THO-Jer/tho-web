import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NuestraExperienciaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white" id="contenido">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="font-tho-title text-[3rem] text-slate-950 md:text-[4rem]">Nuestra experiencia</h1>
          <p className="mt-5 text-lg text-slate-700">
            THO nace en Concepción para acompañar organizaciones que operan bajo presión reputacional, social y operacional.
            Nuestra historia combina consultoría estratégica, trabajo en terreno y diseño de implementación.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Etapa 1</div>
              <h2 className="mt-2 text-base font-semibold text-slate-900">Diagnóstico de realidad</h2>
              <p className="mt-2 text-sm text-slate-700">Partimos leyendo riesgos, actores y capacidades internas sin filtro.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Etapa 2</div>
              <h2 className="mt-2 text-base font-semibold text-slate-900">Diseño de ruta</h2>
              <p className="mt-2 text-sm text-slate-700">Convertimos hallazgos en una hoja de ruta priorizada y defendible.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Etapa 3</div>
              <h2 className="mt-2 text-base font-semibold text-slate-900">Implementación</h2>
              <p className="mt-2 text-sm text-slate-700">Acompañamos ejecución y dejamos capacidades instaladas para sostener resultados.</p>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
