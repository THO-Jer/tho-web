import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TicketCard } from "@/components/TicketCard";
import { TICKETS } from "@/content/tickets";

export default function TicketsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Tickets estratégicos</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Puertas de entrada claras para activar decisiones con evidencia. Sin precios públicos.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TICKETS.map((t) => (
              <TicketCard key={t.slug} t={t} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
