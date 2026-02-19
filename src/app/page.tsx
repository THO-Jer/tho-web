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

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO — limpio: imagen + texto + 2 CTA */}
      <section className="bg-tho-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 text-xs tracking-wide text-slate-600">
              <span className="h-[1px] w-10 bg-tho-blue" />
              <span className="uppercase">Consultoría estratégica · Concepción</span>
            </div>

            <h1 className="font-tho-title mt-6 text-[2.6rem] font-normal leading-[0.95] md:text-[4.2rem]">
              Viabilidad.
              <br />
              Rigor.
              <br />
              Territorio.
            </h1>
            <ScribbleUnderline className="mt-3" />

            <p className="mt-6 max-w-xl text-base text-slate-700 md:text-lg">
              ESG, relacionamiento comunitario y desarrollo organizacional — integrado, accionable y con foco en
              decisiones que se sostienen.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#entradas"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-900"
              >
                Ver soluciones ágiles
              </a>
              <a
                href="https://bit.ly/bookTHO"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300/70 bg-white/40 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-white"
              >
                Agendar una conversación
              </a>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-sm">
              {/* Usamos <img> para asegurar que siempre se vea sin depender de optimización */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero/1.png"
                alt="THO — trabajo en terreno"
                className="h-[320px] w-full object-cover md:h-[420px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider fromClass="bg-tho-bg" toFill="#ffffff" variant="scribble" />

      {/* PROBLEMA — editorial, menos “sección genérica” */}
      <section className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <h2 className="font-tho-title text-3xl font-normal md:text-5xl">
                Cuando la organización se desconecta del entorno, el costo llega igual.
              </h2>
              <div className="mt-4 h-[2px] w-20 bg-tho-orange" />
              <p className="mt-5 max-w-2xl text-base text-slate-700 md:text-lg">
                La pregunta no es si tendrás tensión. La pregunta es si tendrás método, evidencia y gobernanza para
                sostener decisiones cuando aparezca.
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="rounded-[2.2rem] bg-tho-bg p-8">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Rigor sin frialdad</div>
                <p className="mt-3 text-sm text-slate-700">
                  Terreno + análisis. Diseño + gobernanza. Claridad incómoda cuando hace falta — y seguridad cuando
                  hay que decidir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider fromClass="bg-white" toFill="#f4f5f6" variant="scribble" flip />

      {/* SERVICIOS — antes de las entradas rápidas */}
      <Section
        id="servicios"
        tone="soft"
        title="Nuestros servicios"
        subtitle="Tres frentes integrados. A veces el problema se ve ESG, pero nace en la organización o en el territorio. Nosotros lo tratamos completo."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className={`relative overflow-hidden rounded-[2rem] p-7 ${PILLAR_META.esg.softBg}`}>
            <div className="pointer-events-none absolute inset-0">
              <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
                <path d="M14 42c28-22 78-30 130-18 52 12 84 6 120-8 44-17 90-7 122 22" fill="none" stroke="rgba(11,11,12,0.14)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-800">
              <span className={`h-2 w-2 rounded-full ${PILLAR_META.esg.accentDot}`} />
              {PILLAR_META.esg.label}
            </div>
            <p className="mt-3 text-sm text-slate-700">Sostenibilidad con foco en decisiones y ejecución.</p>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-green" />Diagnóstico ESG: materialidad, priorización y matriz de riesgos.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-green" />Hoja de ruta con hitos, indicadores y gobernanza.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-green" />Alineación interna para sostener la estrategia.</li>
            </ul>
          </div>

          <div className={`relative overflow-hidden rounded-[2rem] p-7 ${PILLAR_META.comunidad.softBg}`}>
            <div className="pointer-events-none absolute inset-0">
              <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
                <path d="M18 52c42-30 104-34 150-12 46 22 86 18 122 2 48-20 86-12 112 10" fill="none" stroke="rgba(11,11,12,0.14)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-800">
              <span className={`h-2 w-2 rounded-full ${PILLAR_META.comunidad.accentDot}`} />
              Relacionamiento comunitario
            </div>
            <p className="mt-3 text-sm text-slate-700">Estrategias de vínculo que reducen riesgo y construyen confianza.</p>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-orange" />Diseño y ejecución de participación y consulta.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-orange" />Modelos de gestión comunitaria para proyectos de alto impacto.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-orange" />Prevención y resolución de conflictos con metodologías probadas.</li>
            </ul>
          </div>

          <div className={`relative overflow-hidden rounded-[2rem] p-7 ${PILLAR_META.do.softBg}`}>
            <div className="pointer-events-none absolute inset-0">
              <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
                <path d="M16 46c34-20 78-26 124-12 46 14 82 10 120-6 50-22 98-10 126 14" fill="none" stroke="rgba(11,11,12,0.14)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-800">
              <span className={`h-2 w-2 rounded-full ${PILLAR_META.do.accentDot}`} />
              {PILLAR_META.do.label}
            </div>
            <p className="mt-3 text-sm text-slate-700">Equipos alineados, cultura fuerte y cambios que se sostienen.</p>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-pink" />Fortalecimiento cultural y cohesión interna.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-pink" />Talento y liderazgo para optimizar desempeño.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-tho-pink" />Gestión del cambio y diagnósticos de clima y engagement.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="entradas"
        tone="soft"
        title="Entradas estratégicas"
        subtitle="Servicios acotados (2–3 meses) para decidir con evidencia. Sin precios públicos. Si el caso lo amerita, esto escala a estrategia e implementación anual."
      >
        <div className="mb-6 max-w-3xl text-sm text-slate-700">
          <span className="font-semibold text-slate-900">¿Por qué partir por aquí?</span> Porque a veces lo más caro no es
          “hacer algo”, sino seguir decidiendo sin evidencia. Estas entradas ordenan el problema, hacen visibles riesgos y
          dejan una ruta clara.
        </div>
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
