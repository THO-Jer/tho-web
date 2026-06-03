import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Código de ética · The Human Org",
  description:
    "El código de ética que orienta la conducta de The Human Org, sus directores y colaboradores en toda relación profesional.",
  alternates: { canonical: "https://tho.cl/etica" },
  openGraph: {
    type: "website",
    title: "Código de ética · The Human Org",
    description:
      "El código de ética que orienta la conducta de The Human Org, sus directores y colaboradores en toda relación profesional.",
    url: "https://tho.cl/etica",
    siteName: "The Human Org",
    images: [{ url: "https://tho.cl/og.png", width: 1200, height: 630, alt: "The Human Org" }],
  },
};

export default function EticaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Código de ética</h1>
          <p className="mt-2 text-sm text-slate-500">The Human Org (THO) · Versión 1.0 · 2026</p>
          <p className="mt-4 text-slate-700">
            Este Código orienta la conducta de THO, sus directores y colaboradores en toda relación profesional con clientes, comunidades,
            proveedores, instituciones y equipos internos. La ética en THO no es decorativa: es un requisito de legitimidad, sostenibilidad y calidad de ejecución.
          </p>

          <section className="mt-8 rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">1) Principios fundamentales</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Integridad profesional y coherencia entre diagnóstico, recomendación y ejecución.</li>
              <li>Confidencialidad de la información obtenida en relaciones formales y contractuales.</li>
              <li>Independencia técnica frente a presiones políticas, comerciales o reputacionales.</li>
              <li>Responsabilidad social, pertinencia cultural y respeto irrestricto a la dignidad humana.</li>
              <li>Cumplimiento normativo y tolerancia cero a sobornos, favores indebidos o influencias ilegítimas.</li>
            </ul>
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">2) Conflictos de interés e independencia</h2>
            <p className="mt-2 text-sm text-slate-700">
              THO no asume encargos simultáneos que impliquen conflicto directo entre actores de un mismo proceso o territorio. Si existe conflicto potencial
              indirecto, se evalúa su alcance, se informa al cliente antes de aceptar el trabajo y solo se continúa con consentimiento informado y medidas reforzadas de confidencialidad.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              La reputación territorial, la independencia del criterio técnico y la trazabilidad de decisiones son activos estratégicos no transables.
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">3) Confidencialidad y uso de información</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>No divulgamos información estratégica o sensible sin autorización expresa.</li>
              <li>No utilizamos información de clientes para beneficio propio ni de terceros.</li>
              <li>No empleamos antecedentes de proyectos con fines comerciales sin consentimiento formal.</li>
              <li>Aplicamos criterio de mínima exposición y necesidad de conocimiento en toda comunicación interna/externa.</li>
            </ul>
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">4) Integridad comercial y responsabilidad territorial</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Presentamos propuestas transparentes, con alcances, supuestos y límites explícitos.</li>
              <li>No prometemos resultados fuera de nuestro ámbito de control.</li>
              <li>Advertimos tempranamente riesgos sociales, comunitarios o territoriales detectados en la asesoría.</li>
              <li>No realizamos greenwashing ni maquillaje comunicacional; priorizamos gestión real basada en evidencia.</li>
            </ul>
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">5) Diversidad, equidad, inclusión y trato digno</h2>
            <p className="mt-2 text-sm text-slate-700">
              THO promueve ambientes libres de discriminación por género, orientación sexual, identidad de género, etnia, religión, edad o condición socioeconómica.
              Integramos enfoque de género y pertinencia cultural de manera transversal en diseño, facilitación y toma de decisiones.
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">6) Anticorrupción y cumplimiento</h2>
            <p className="mt-2 text-sm text-slate-700">
              Se prohíbe ofrecer, aceptar o facilitar pagos indebidos, sobornos, regalos condicionados, tráfico de influencias o uso de información privilegiada.
              THO mantiene prácticas contractuales y administrativas formales, y ajusta procedimientos cuando cambian exigencias legales o sectoriales.
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">7) Canal de reporte ético</h2>
            <p className="mt-2 text-sm text-slate-700">
              Cualquier persona puede reportar posibles faltas éticas al correo <a className="underline underline-offset-2" href="mailto:hola@tho.cl">hola@tho.cl</a>.
              THO resguarda confidencialidad, investigación diligente y ausencia de represalias.
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              <li>Recepción confidencial del reporte.</li>
              <li>Evaluación inicial por dirección.</li>
              <li>Investigación interna y, cuando corresponda, asesoría externa independiente.</li>
              <li>Resolución formal con medidas proporcionales y trazables.</li>
            </ol>
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">8) Revisión y mejora continua</h2>
            <p className="mt-2 text-sm text-slate-700">
              Este Código se revisa periódicamente para incorporar aprendizajes organizacionales, cambios regulatorios y nuevos riesgos éticos del contexto.
            </p>
          </section>

          <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Criterio operativo THO</p>
            <p className="mt-1">Cuando una decisión es legal pero éticamente riesgosa, privilegiamos el estándar ético más exigente y documentamos su justificación.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
