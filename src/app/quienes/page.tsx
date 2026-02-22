import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function QuienesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white" id="contenido">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="font-tho-title text-[3rem] text-slate-950 md:text-[4rem]">Quiénes somos</h1>
          <p className="mt-5 text-lg text-slate-700">
            Somos una consultora estratégica que trabaja donde la decisión duele: territorio, cultura y sostenibilidad.
            Nuestro propósito es convertir complejidad en decisiones viables, defendibles y ejecutables.
          </p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Manifiesto THO</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 md:text-base">
              <li>No vendemos humo: trabajamos con evidencia y contexto real.</li>
              <li>No maquillamos riesgos: los hacemos visibles y gestionables.</li>
              <li>No dejamos dependencia: transferimos método y capacidad interna.</li>
              <li>No imponemos recetas: diseñamos con la cultura y el territorio.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
