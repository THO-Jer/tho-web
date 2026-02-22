import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { SERVICES } from "@/content/services";
import { PILLAR_META } from "@/lib/brand";
import MethodTimeline from "@/components/MethodTimeline";
import { ActionGallery } from "@/components/ActionGallery";
import { ResourcesModal } from "@/components/ResourcesModal";
import { listPublishedPosts } from "@/lib/blogStore";

export default async function HomePage() {
  const posts = await listPublishedPosts();

  return (
    <div className="min-h-screen">
      <Header />

      <main id="contenido">
        <ResourcesModal autoOpen />
        {/* HERO — imagen de fondo (atenuada) + texto encima */}
        <section className="relative overflow-visible text-white">
        <div className="hero-media-fade pointer-events-none absolute inset-x-0 -bottom-28 top-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/hands.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.75]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.32)_52%,rgba(15,23,42,0.62)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex justify-end">
          <div className="max-w-2xl text-right">
            <div className="flex items-center justify-end gap-3 text-xs tracking-wide text-white/70">
              <span className="brand-block-divider h-[6px] w-36 rounded-sm" />
              <span className="uppercase">Consultoría estratégica · Concepción</span>
            </div>

            <h1 className="font-tho-title mt-6 text-[3.2rem] font-normal leading-[0.94] md:text-[5.6rem]">
              Fortalece tu organización,
              <br />
              conecta con tu entorno
            </h1>

            <p className="mt-6 ml-auto max-w-xl text-base text-white/80 md:text-lg">
              Integramos ESG, relacionamiento comunitario y desarrollo organizacional para construir estrategias
              accionables y decisiones que se sostienen en el tiempo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:ml-auto sm:flex-row sm:justify-end">
              <a
                href="#servicios"
                className="btn-unified-motion btn-brand-neutral rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900"
              >
                Ver servicios
              </a>
              <a
                href="https://bit.ly/bookTHO"
                target="_blank"
                rel="noreferrer"
                className="btn-unified-motion btn-tho-hover-gradient rounded-xl border border-white/35 bg-white/5 px-5 py-3 text-sm font-bold text-white"
              >
                Agendar una conversación
              </a>
            </div>
          </div>
          </div>
        </div>
        </section>

      {/* PROBLEMA — editorial integrado al flujo, sin "tarjeta maqueta" */}
      <section className="hero-transition-panel relative z-30 -mt-10 bg-transparent">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center md:py-16">
          <div className="mx-auto h-px w-24 bg-slate-300/70" />
          <h2 className="font-tho-title mt-6 text-[3rem] font-normal text-slate-950 md:text-[5.2rem]">
            Cuando la organización se desconecta del entorno, el costo llega igual.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base text-slate-700 md:text-lg">
            La pregunta no es si tendrás tensión. La pregunta es si tendrás método, evidencia y gobernanza para
            sostener decisiones cuando aparezca.
          </p>
        </div>
      </section>


      <Section
        id="experiencia"
        tone="soft"
        title="Se ve serio porque lo es"
        subtitle="Trabajamos con equipos que no pueden fallar: decisiones con costo reputacional, social y financiero. Aportamos método, claridad y ejecución."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-7 ring-1 ring-slate-200/70">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Enfoque</div>
            <p className="mt-2 text-sm text-slate-700">
              Viabilidad primero: lo que proponemos debe funcionar con tu estructura, tu presión y tu contexto.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-7 ring-1 ring-slate-200/70">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Terreno</div>
            <p className="mt-2 text-sm text-slate-700">
              No asesoramos desde una planilla: leemos el sistema real, con actores reales, y con tiempos reales.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-7 ring-1 ring-slate-200/70">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Transferencia</div>
            <p className="mt-2 text-sm text-slate-700">
              Dejamos capacidades instaladas: herramientas, criterios y gobernanza para sostener el avance.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-[2.2rem] bg-white p-6 ring-1 ring-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Señales de rigor</div>
              <p className="mt-1 text-sm text-slate-700">
                Documentación clara, trazabilidad y entregables que se pueden defender en comité.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Matriz de riesgos",
                "Mapa de actores",
                "Hoja de ruta",
                "Gobernanza & KPIs",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-950/5 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="servicios"
        tone="soft"
        title="Nuestros servicios"
        subtitle="Tres líneas estratégicas para resolver problemas críticos. Entra al servicio que más te duele hoy y escala desde ahí."
      >
        <div className="services-gallery flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:overflow-visible">
          {SERVICES.map((service) => {
            const meta = PILLAR_META[service.pillar];
            const cardTone =
              service.pillar === "esg"
                ? "service-feature-card--green"
                : service.pillar === "comunidad"
                  ? "service-feature-card--orange"
                  : "service-feature-card--pink";

            return (
              <article key={service.slug} className={`service-feature-card ${cardTone} min-w-[88vw] snap-center md:min-w-0`}>
                <div className="service-pill-contrast inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  <span className={`h-2 w-2 rounded-full ${meta.accentDot}`} />
                  {service.menuLabel}
                </div>
                <h3 className="mt-4 text-[2rem] font-bold text-slate-900 md:text-[2.2rem]">{service.navLabel}</h3>
                <p className="mt-2 text-sm text-slate-800">{service.problem}</p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-800">
                  {service.teaser.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className={`mt-2 h-1.5 w-1.5 rounded-full ${meta.accentDot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={`/servicios/${service.slug}`}
                  className="btn-unified-motion btn-brand-neutral mt-6 inline-flex rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-900"
                >
                  Ver detalle del servicio
                </a>
              </article>
            );
          })}
        </div>
      </Section>

      <Section
        id="metodo"
        title="Cómo trabajamos"
        subtitle="Un método que aguanta auditoría: claridad, puntos de control y foco en viabilidad. Si el caso lo amerita, escalamos sin perder control."
      >
        <MethodTimeline
          steps={[
            {
              n: "01",
              title: "Lectura del sistema",
              desc: "Mapeamos actores, riesgos, cultura y señales críticas del contexto.",
              tone: "com",
            },
            {
              n: "02",
              title: "Diseño de estrategia",
              desc: "Definimos decisiones, prioridades y hoja de ruta viable.",
              tone: "esg",
            },
            {
              n: "03",
              title: "Implementación",
              desc: "Acompañamos ejecución, coordinación y gobernanza en terreno.",
              tone: "do",
            },
            {
              n: "04",
              title: "Evaluación y aprendizaje",
              desc: "Medimos resultados, ajustamos y reiniciamos el ciclo con evidencia.",
              tone: "neutral",
            },
          ]}
        />
      </Section>

      <section id="accion" className="relative z-30 border-t border-slate-200/70 bg-tho-bg pt-10 md:pt-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-16">
          <div>
            <h2 className="font-tho-title text-[3rem] text-slate-950 md:text-[4.2rem]">THO en Acción</h2>
            <p className="mt-3 text-sm text-slate-700 md:text-base">
              Lo que ves aquí es terreno real: procesos, facilitación, sesiones ejecutivas y acompañamiento en momentos críticos.
              Diseñamos con evidencia, ejecutamos con equipos y dejamos capacidad instalada.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-800 md:text-base">
              Haz click en una foto para verla en detalle.
            </p>
          </div>
          <ActionGallery />
        </div>
      </section>

      <Section id="blog" title="Blog" subtitle="Desde el territorio: análisis y tendencias (placeholder).">
        <div className="grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <div key={p.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs text-slate-500">{p.minutes} min</div>
              <div className="mt-2 text-base font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              <a
                href={`/blog/${p.slug}`}
                className="btn-unified-motion btn-brand-neutral mt-5 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900"
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
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              ¿Hablamos de lo que realmente importa?
            </h2>
            <p className="mt-4 text-slate-200">Agenda una conversación estratégica o deja tus datos. Sin spam. Sin humo.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://bit.ly/bookTHO"
                target="_blank"
                rel="noreferrer"
                className="btn-unified-motion btn-tho-hover-gradient inline-flex items-center justify-center rounded-2xl border border-black/60 bg-white px-5 py-3 text-sm font-medium text-slate-900"
              >
                Agendar conversación
              </a>
              <a
                href="mailto:hola@tho.cl"
                className="btn-unified-motion btn-brand-neutral inline-flex items-center justify-center rounded-2xl border border-black/60 bg-white/5 px-5 py-3 text-sm font-medium text-white"
              >
                Escribir por mail
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
