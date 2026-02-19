import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { TICKETS } from "@/content/tickets";

export default function TicketDetailPage({ params }: { params: { slug: string } }) {
  const ticket = TICKETS.find((t) => t.slug === params.slug);
  if (!ticket) return notFound();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
              {ticket.duration}
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">{ticket.name}</h1>
            <p className="mt-4 text-slate-600">{ticket.short}</p>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold">Para quién</div>
              <p className="mt-2 text-sm text-slate-600">{ticket.forWho}</p>
              <div className="mt-4 text-sm font-semibold">Resultado</div>
              <p className="mt-2 text-sm text-slate-600">{ticket.outcome}</p>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold">Entregables</div>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
                {ticket.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-xs text-slate-500">
              Nota: los tickets son puerta de entrada. Si el diagnóstico lo justifica, avanzamos a estrategia anual y/o implementación.
            </div>
          </div>

          <section className="rounded-3xl bg-slate-900 p-1">
            <div className="rounded-[22px] bg-slate-900 p-2">
              <ContactForm ticket={ticket.slug} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
