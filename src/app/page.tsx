import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { TicketCard } from "@/components/TicketCard";
import { LeadMagnet } from "@/components/LeadMagnet";
import { ContactForm } from "@/components/ContactForm";
import { TICKETS } from "@/content/tickets";
import { POSTS } from "@/content/posts";
import { SectionDivider } from "@/components/SectionDivider";
import { ScribbleUnderline } from "@/components/Scribble";
import { PILLAR_META } from "@/lib/brand";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO — imagen atenuada de fondo + texto protagonista */}
      <section className="relative overflow-hidden bg-tho-bg">
        <Image
          src="/hero/1.png"
          alt="THO — trabajo en terreno"
          fill
          priority
          className="object-cover opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tho-bg via-tho-bg/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tho-bg to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 md:pb-16 md:pt-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-xs tracking-wide text-slate-600">
              <span className="h-[1px] w-10 bg-tho-blue" />
              <span className="uppercase">Consultoría estratégica · Concepción</span>
            </div>

            <h1 className="font-tho-title mt-6 text-[2.8rem] font-normal md:text-[4.4rem]">
              Viabilidad.
              <br />
              Rigor.
              <br />
              Territorio.
            </h1>
            <ScribbleUnderline className="mt-3" />

            <p className="mt-5 max-w-xl text-base text-slate-700 md:text-lg">
              ESG, relación con el entorno y desarrollo organizacional — integrado, accionable y con foco en decisiones
              que se sostienen.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#servicios"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-900"
              >
                Ver lo que hacemos
              </a>
              <a
                href="https://bit.ly/bookTHO"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300/70 bg-white/40 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-white"
              >
                Agendar conversación
              </a>
            </div>

            <div className="mt-10 grid max-w-xl gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-tho-orange" />
                <p className="text-sm text-slate-700">No vendemos “buenas prácticas”. Convertimos fricción en decisiones.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-tho-pink" />
                <p className="text-sm text-slate-700">Cercanos, sí. Indulgentes, no. Si algo no da, lo decimos.</p>
              </div>
            </div>
          </div>

          {/* Quick credibility strip */}
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            <div className={`rounded-2xl border p-4 ${PILLAR_META.esg.softBg} ${PILLAR_META.esg.softBorder}`}>
              <div className="text-xs font-bold tracking-wide text-slate-800">ESG</div>
              <div className="mt-1 text-sm text-slate-700">Riesgos, materialidad y ruta accionable.</div>
            </div>
            <div className={`rounded-2xl border p-4 ${PILLAR_META.comunidad.softBg} ${PILLAR_META.comunidad.softBorder}`}>
              <div className="text-xs font-bold tracking-wide text-slate-800">Entorno</div>
              <div className="mt-1 text-sm text-slate-700">Mapa de actores y licencia para operar.</div>
            </div>
            <div className={`rounded-2xl border p-4 ${PILLAR_META.do.softBg} ${PILLAR_META.do.softBorder}`}>
              <div className="text-xs font-bold tracking-wide text-slate-800">Organización</div>
              <div className="mt-1 text-sm text-slate-700">Cultura, liderazgo y cambio con evidencia.</div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider fromClass="bg-tho-bg" toFill="#ffffff" />

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

      <SectionDivider fromClass="bg-white" toFill="#f4f5f6" flip />

      {/* SERVICIOS — antes de las entradas rápidas */}
      <Section
        id="servicios"
        tone="soft"
        title="Lo que hacemos"
        subtitle="Tres frentes integrados. A veces el problema se ve ESG, pero nace en la organización o en el territorio. Nosotros lo tratamos completo."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className={`rounded-2xl border p-6 ${PILLAR_META.esg.softBg} ${PILLAR_META.esg.softBorder}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-800">
              <span className={`h-2 w-2 rounded-full ${PILLAR_META.esg.accentDot}`} />
              {PILLAR_META.esg.label}
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Diagnósticos y hojas de ruta que aterrizan riesgos, prioridades e indicadores sin perder foco.
            </p>
          </div>

          <div className={`rounded-2xl border p-6 ${PILLAR_META.comunidad.softBg} ${PILLAR_META.comunidad.softBorder}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-800">
              <span className={`h-2 w-2 rounded-full ${PILLAR_META.comunidad.accentDot}`} />
              Relacionamiento comunitario
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Lectura territorial, actores clave, riesgos socioambientales y estrategias de vínculo que se sostienen.
            </p>
          </div>

          <div className={`rounded-2xl border p-6 ${PILLAR_META.do.softBg} ${PILLAR_META.do.softBorder}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-800">
              <span className={`h-2 w-2 rounded-full ${PILLAR_META.do.accentDot}`} />
              {PILLAR_META.do.label}
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Cultura, liderazgo y cambio: evidencia breve, acuerdos claros y acompañamiento cuando el caso lo exige.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white/60 p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Cómo se ve hacia afuera</div>
          <p className="mt-2 max-w-3xl text-sm text-slate-700">
            Podemos entrar con un trabajo acotado (2–3 meses) para ordenar evidencia y decisiones. Si el caso lo amerita,
            escalamos a estrategia e implementación anual sin perder método.
          </p>
        </div>
      </Section>

      <Section
        id="entradas"
        tone="soft"
        title="Entradas estratégicas (2–3 meses)"
        subtitle="Servicios acotados para decidir con evidencia. Sin precios públicos. Si el caso lo amerita, esto escala a estrategia e implementación."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {TICKETS.map((t) => (
            <TicketCard key={t.slug} t={t} />
          ))}
        </div>
      </Section>

      <SectionDivider fromClass="bg-tho-bg" toFill="#ffffff" />

      <Section
        id="metodo"
        title="Método THO"
        subtitle="Entramos rápido, ordenamos con rigor y dejamos un camino claro. Si el caso lo amerita, escalamos sin perder el control."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Exploración rigurosa</div>
            <p className="mt-2 text-sm text-slate-600">2 a 3 meses. Diagnóstico accionable, riesgos visibles y decisión informada.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Diseño estratégico</div>
            <p className="mt-2 text-sm text-slate-600">Modelamos el sistema: gobernanza, indicadores y hoja de ruta con prioridades reales.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold">Acompañamiento sostenido</div>
            <p className="mt-2 text-sm text-slate-600">Ejecución, medición y ajuste. Lo que funciona se consolida; lo que no, se corrige.</p>
          </div>
        </div>
      </Section>

      <SectionDivider fromClass="bg-white" toFill="#f4f5f6" flip />

      <Section
        id="recursos"
        title="Recursos prácticos"
        subtitle="Para quienes aún están evaluando. Por ahora, un recurso general; luego vendrán recursos por servicio."
      >
        <LeadMagnet />
      </Section>

      <SectionDivider fromClass="bg-tho-bg" toFill="#ffffff" />

      <Section id="blog" title="Blog" subtitle="Desde el territorio: análisis y tendencias (placeholder).">
        <div className="grid gap-4 md:grid-cols-3">
          {POSTS.map((p) => (
            <div key={p.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs text-slate-500">{p.minutes} min</div>
              <div className="mt-2 text-base font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              <a
                href={`/blog/${p.slug}`}
                className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
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
