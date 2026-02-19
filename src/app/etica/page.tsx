import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function EticaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Código de ética</h1>
          <p className="mt-4 text-slate-600">
            Esto no es “valores en la pared”. Es cómo trabajamos cuando hay tensión.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold">Confidencialidad</div>
              <p className="mt-2 text-sm text-slate-600">
                Tratamos información sensible con cuidado. Lo que no se puede prometer, se explicita.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold">No maquillaje</div>
              <p className="mt-2 text-sm text-slate-600">
                No hacemos greenwashing ni “gestión de percepciones”. Hacemos gestión real.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold">Pertinencia territorial</div>
              <p className="mt-2 text-sm text-slate-600">
                Diseñamos procesos que respetan contexto, cultura y límites del territorio.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
