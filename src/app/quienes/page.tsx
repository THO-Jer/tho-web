import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function QuienesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Quiénes somos</h1>
          <p className="mt-4 text-slate-600">
            THO nace en Concepción y trabaja con un estándar simple: menos espectáculo, más terreno.
            No vendemos “acompañamiento”: vendemos claridad, criterio y decisiones que se sostienen cuando hay presión.
          </p>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            Placeholder: aquí después agregamos historia, equipo, y la parte humana sin cursilería.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
