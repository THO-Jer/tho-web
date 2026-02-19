import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { TicketCard } from "@/components/TicketCard";
import { LeadMagnet } from "@/components/LeadMagnet";
import { ContactForm } from "@/components/ContactForm";
import { TICKETS } from "@/content/tickets";
import { POSTS } from "@/content/posts";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
              Consultoría estratégica en Concepción
            </div>

            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Asegura la viabilidad de tu negocio potenciando tu cultura y tu entorno.
            </h1>

            <p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">
              Sostenibilidad ESG, Gestión Comunitaria y Desarrollo Organizacional — integrado,
              accionable y con foco en resultados.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#tickets"
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Ver Tickets
              </a>
              <a
                href="https://bit.ly/bookTHO"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium hover:bg-slate-50"
              >
                Agendar conversación
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
            <div className="text-sm font-semibold">Mapa rápido de viabilidad</div>
            <p className="mt-2 text-sm text-slate-600">
              Cultura interna + entorno externo. Donde otros separan, nosotros integramos.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold">Riesgos</div>
                <div className="mt-1 text-sm text-slate-600">Se ven antes de explotar</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold">Confianza</div>
                <div className="mt-1 text-sm text-slate-600">Se gestiona, no se promete</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold">Acción</div>
                <div className="mt-1 text-sm text-slate-600">Entregables claros y rápidos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Informes que no se leen. Comunidades que no escuchan. Equipos que no conectan."
        subtitle="El modelo tradicional de consultoría está agotado. En THO rompemos ese ciclo: claridad, evidencia y acción."
      >
        <div />
      </Section>

      <Section
        id="tickets"
        tone="soft"
        title="Tickets estratégicos"
        subtitle="Puertas de entrada claras. Sin precios públicos. Conversación estratégica y decisión con evidencia."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {TICKETS.map((t) => (
            <TicketCard key={t.slug} t={t} />
          ))}
        </div>
      </Section>

      <Section
        id="metodo"
        title="Método THO"
        subtitle="Ticket → Estrategia → Implementación. No como upsell: como continuidad cuando vale la pena."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Nivel 1 — Ticket</div>
            <p className="mt-2 text-sm text-slate-600">
              2 a 3 meses. Claridad + diagnóstico accionable + próximos pasos.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Nivel 2 — Estrategia</div>
            <p className="mt-2 text-sm text-slate-600">
              Horizonte anual. Diseño completo, gobernanza, indicadores y hoja de ruta.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Nivel 3 — Implementación</div>
            <p className="mt-2 text-sm text-slate-600">
              Acompañamiento sostenido. Ejecución, medición, ajuste y mejora continua.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="recursos"
        title="Recursos prácticos"
        subtitle="Para quienes aún están evaluando. Por ahora, un recurso general; luego vendrán recursos por servicio."
      >
        <LeadMagnet />
      </Section>

      <Section id="blog" title="Blog" subtitle="Desde el territorio: análisis y tendencias (placeholder).">
        <div className="grid gap-4 md:grid-cols-3">
          {POSTS.map((p) => (
            <div key={p.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs text-slate-500">{p.minutes} min</div>
              <div className="mt-2 text-base font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              <a
                href={`/blog/${p.slug}`}
                className="mt-5 inline-flex rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
              >
                Leer
              </a>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-t border-slate-200 bg-slate-900 text-white" id="contacto">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              ¿Hablamos de lo que realmente importa?
            </h2>
            <p className="mt-4 text-slate-200">Agenda una conversación estratégica o deja tus datos. Sin spam. Sin humo.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://bit.ly/bookTHO"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100"
              >
                Agendar conversación
              </a>
              <a
                href="mailto:hola@tho.cl"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium hover:bg-white/10"
              >
                Escribir por mail
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
