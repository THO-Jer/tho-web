import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { TICKETS } from "@/content/tickets";
import { PILLAR_META } from "@/lib/brand";

export default function TicketDetailPage({ params }: { params: { slug: string } }) {
  const ticket = TICKETS.find((t) => t.slug === params.slug);
  if (!ticket) return notFound();
  const meta = PILLAR_META[ticket.pillar];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${meta.softBg} ${meta.softBorder} ${meta.ink}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta.accentDot}`} />
              {meta.label}
            </div>

            <h1 className="font-tho-title mt-5 text-3xl font-normal md:text-4xl">{ticket.name}</h1>
            <p className="mt-4 text-slate-600">{ticket.short}</p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold">Para quién</div>
              <p className="mt-2 text-sm text-slate-600">{ticket.forWho}</p>
              <div className="mt-4 text-sm font-semibold">Resultado</div>
              <p className="mt-2 text-sm text-slate-600">{ticket.outcome}</p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold">Entregables</div>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
                {ticket.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-xs text-slate-500">
              Nota: esto es una entrada estratégica. Si el caso lo justifica, avanzamos a estrategia anual y/o implementación.
            </div>
          </div>

          <section className="rounded-2xl bg-slate-900 p-1">
            <div className="rounded-xl bg-slate-900 p-2">
              <ContactForm ticket={ticket.slug} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
