import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { TicketCard } from "@/components/TicketCard";
import { LeadMagnet } from "@/components/LeadMagnet";
import { ContactForm } from "@/components/ContactForm";
import { TICKETS } from "@/content/tickets";
import { POSTS } from "@/content/posts";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO — editorial, fondo gris tenue */}
      <section className="bg-tho-bg">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-14 md:grid-cols-12 md:pb-14 md:pt-20">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 text-xs tracking-wide text-slate-600">
              <span className="h-[1px] w-10 bg-tho-blue" />
              <span className="uppercase">Consultoría estratégica · Concepción</span>
            </div>

            <h1 className="font-tho-title mt-6 text-[2.6rem] font-normal md:text-[4.2rem]">
              Viabilidad.
              <br />
              Rigor.
              <br />
              Territorio.
            </h1>

            <p className="mt-5 max-w-xl text-base text-slate-700 md:text-lg">
              ESG, Gestión Comunitaria y Desarrollo Organizacional — integrado, accionable y con foco en decisiones que
              se sostienen.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#tickets" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-900">
                Ver Tickets
              </a>
              <a
                href="https://bit.ly/bookTHO"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-300/70 bg-white/40 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-white"
              >
                Agendar conversación
              </a>
            </div>

            <div className="mt-10 grid max-w-xl gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-tho-orange" />
                <p className="text-sm text-slate-700">
                  No vendemos “buenas prácticas”. Detectamos fricción real y la convertimos en decisiones.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-tho-pink" />
                <p className="text-sm text-slate-700">
                  Cercanos, sí. Indulgentes, no. Si algo no da, lo decimos.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="relative">
              {/* Accent line */}
              <div className="absolute -left-3 top-6 hidden h-32 w-[2px] bg-tho-yellow md:block" />

              <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-300/70 bg-slate-950 shadow-sm md:translate-y-6">
                <Image src="/hero/1.png" alt="THO — trabajo en terreno" width={1200} height={900} priority className="h-[380px] w-full object-cover opacity-85 md:h-[520px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="grid gap-2 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <div className="text-xs font-bold tracking-wide text-white/80">Cómo trabajamos</div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <MiniPill title="Riesgos" desc="Antes de que exploten" />
                      <MiniPill title="Confianza" desc="Con evidencia" />
                      <MiniPill title="Acción" desc="Entregables claros" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Soft cut */}
              <div className="mt-6 grid gap-3 rounded-[2.2rem] border border-slate-300/60 bg-white/60 p-6 shadow-sm">
                <div className="text-xs font-bold tracking-wide text-slate-700">Lo que evitamos</div>
                <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-blue" />
                    <span>Informes que nadie usa</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-green" />
                    <span>Relatos sin sustento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA — editorial, menos “sección genérica” */}
      <section className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 className="font-tho-title text-3xl font-normal md:text-5xl">
                Cuando la organización se desconecta del entorno, el costo llega igual.
              </h2>
              <div className="mt-4 h-[2px] w-20 bg-tho-orange" />
              <p className="mt-5 max-w-2xl text-base text-slate-700 md:text-lg">
                La pregunta no es si tendrás tensión. La pregunta es si tendrás método, evidencia y gobernanza para
                sostener decisiones cuando aparezca.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-[2.2rem] border border-slate-200 bg-tho-bg p-6">
                <div className="text-xs font-bold tracking-wide text-slate-600">Señales típicas</div>
                <ul className="mt-4 grid gap-3 text-sm text-slate-700">
                  <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-pink" />Se promete más de lo que se sostiene</li>
                  <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-blue" />Se apaga el conflicto “con comunicaciones”</li>
                  <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-yellow" />Se decide sin mapa de riesgos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        subtitle="Entramos rápido, ordenamos con rigor y dejamos un camino claro. Si el caso lo amerita, escalamos sin perder el control."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Exploración rigurosa</div>
            <p className="mt-2 text-sm text-slate-600">2 a 3 meses. Diagnóstico accionable, riesgos visibles y decisión informada.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Diseño estratégico</div>
            <p className="mt-2 text-sm text-slate-600">Modelamos el sistema: gobernanza, indicadores y hoja de ruta con prioridades reales.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Acompañamiento sostenido</div>
            <p className="mt-2 text-sm text-slate-600">Ejecución, medición y ajuste. Lo que funciona se consolida; lo que no, se corrige.</p>
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

function MiniPill({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="text-xs text-white/70">{desc}</div>
    </div>
  );
}
