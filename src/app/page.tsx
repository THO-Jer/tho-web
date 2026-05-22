import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { SERVICES } from "@/content/services";
import { PILLAR_META } from "@/lib/brand";
import MethodTimeline from "@/components/MethodTimeline";
import { ActionGallery } from "@/components/ActionGallery";
import { ResourcesModal } from "@/components/ResourcesModal";
import { TrustSlider } from "@/components/TrustSlider";
import { SocialFloat } from "@/components/SocialFloat";
import { listPublishedPosts } from "@/lib/blogStore";
import { BOOK_URL } from "@/lib/links";

function clampWords(text: string, maxWords = 22) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")} (...)`;
}

export default async function HomePage() {
  const posts = await listPublishedPosts();

  return (
    <div className="min-h-screen">
      <Header />
      <SocialFloat />

      <main id="contenido">
        <ResourcesModal autoOpen />
        {/* HERO — imagen de fondo (atenuada) + texto encima */}
        <section className="relative min-h-[72vh] overflow-visible text-white md:min-h-[80vh] lg:min-h-[88vh]">
        <div className="hero-media-fade pointer-events-none absolute inset-x-0 -bottom-28 top-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/hands.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[20%_36%] opacity-[0.75] md:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.32)_52%,rgba(15,23,42,0.62)_100%)]" />
        </div>

        <div className="relative mx-auto flex h-full min-h-[72vh] max-w-6xl items-end justify-end px-4 pb-16 pt-8 md:min-h-[80vh] md:pb-20 md:pt-12 lg:min-h-[88vh] lg:pb-24 lg:pt-14">
          <div className="max-w-2xl text-right">
            <div className="text-xs uppercase tracking-wide text-white/75">
              Consultoría estratégica · Concepción
            </div>
            <div className="mt-3 ml-auto h-[6px] w-36 rounded-sm brand-block-divider" />

            <p className="mt-5 ml-auto max-w-xl text-base text-white/82 md:text-lg">
              Integramos ESG, relacionamiento comunitario y desarrollo organizacional para construir estrategias
              accionables y decisiones que se sostienen en el tiempo.
            </p>

            <div className="mt-6 flex flex-col items-end gap-3 sm:ml-auto sm:flex-row sm:justify-end">
              {/* CTA primario — cualitativo, intención de conversación/agendamiento */}
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-unified-motion btn-hero-services rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-white/40 hover:ring-white"
              >
                Conversemos tu caso
              </a>
              {/* CTA secundario — exploración */}
              <a
                href="#servicios"
                className="btn-unified-motion rounded-xl border border-white/60 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Ver servicios
              </a>
            </div>
          </div>
        </div>
        </section>

      {/* PROBLEMA — editorial integrado al flujo, sin "tarjeta maqueta" */}
      <section className="hero-transition-panel relative z-30 mt-14 bg-transparent md:mt-20 lg:mt-24">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center md:py-16">
                    <h2 className="font-tho-title mt-6 text-[2.45rem] font-normal text-slate-950 md:text-[3.7rem] lg:text-[5.2rem]">
            Sostenibilidad desintegrada.
            <br />
            Comunidad descontenta.
            <br />
            Organización desalineada.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base text-slate-700 md:text-lg">
            No tienes que llegar ahí. En The Human Org te ayudamos a seguir elevando el estándar.
          </p>
        </div>
      </section>

      <div className="mx-auto h-[6px] w-36 rounded-sm brand-block-divider" aria-hidden />

      <Section
        id="servicios"
        tone="soft"
        title="Nuestros servicios"
        subtitle="Resolvemos problemas críticos a través de tres líneas estratégicas: Sostenibilidad Corporativa, Relacionamiento Comunitario y Desarrollo Organizacional. Revisa los niveles de cada servicio para decidir si te acompañamos en una línea de trabajo o necesitas integrarlas."
      >
        <div className="relative xl:static">
          <div className="services-fade-edge pointer-events-none absolute right-0 top-0 z-10 h-full w-24 xl:hidden" aria-hidden />
          <div className="services-gallery flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 xl:grid xl:grid-cols-3 xl:overflow-visible">
          {SERVICES.map((service) => {
            const meta = PILLAR_META[service.pillar];
            const cardTone =
              service.pillar === "esg"
                ? "service-feature-card--green"
                : service.pillar === "comunidad"
                  ? "service-feature-card--orange"
                  : "service-feature-card--pink";

            return (
              <article key={service.slug} className={`service-feature-card ${cardTone} min-w-[80vw] sm:min-w-[70vw] md:min-w-[50vw] xl:min-w-0 snap-center`}>
                <div className="service-pill-contrast inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  <span className={`h-2 w-2 rounded-full ${meta.accentDot}`} />
                  {service.menuLabel}
                </div>
                <h3 className="mt-4 text-[1.8rem] font-bold text-slate-900 md:text-[2rem] lg:text-[2.2rem]">{service.slug === "sostenibilidad-corporativa" ? "Hacia la reportabilidad integrada" : service.slug === "relacionamiento-comunitario" ? "Comunidades comprometidas" : "Una organización efectiva"}</h3>
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
                  className="btn-unified-motion btn-hero-services mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900"
                >
                  Conoce los niveles
                </a>
              </article>
            );
          })}
          </div>
        </div>
      </Section>

      <Section
        id="metodo"
        title="Cómo trabajamos"
        subtitle="Nuestro método está diseñado para ser adaptable y entregar valor en un entorno complejo y cambiante, garantizando viabilidad. La consultoría en The Human Org seguirá las siguientes etapas durante el proceso."
      >
        <MethodTimeline
          steps={[
            {
              n: "01",
              title: "Lectura del Sistema",
              desc: "Mapeamos fuentes, levantamos datos y desarrollamos diagnósticos que evidencian riesgos, oportunidades y fundamentan el proceso.",
              tone: "com",
            },
            {
              n: "02",
              title: "Diseño de Estrategia",
              desc: "Co-diseñamos rutas, actividades, metas e indicadores para que tu organización sepa qué hacer para alcanzar sus objetivos.",
              tone: "esg",
            },
            {
              n: "03",
              title: "Implementación",
              desc: "Acompañamos la ejecución de la Estrategia en terreno, ajustando en tiempo real y coordinando soluciones que agregan valor.",
              tone: "do",
            },
            {
              n: "04",
              title: "Evaluación y Aprendizaje",
              desc: "Reportamos resultados para evidenciar logros y desafíos, de manera que permita ajustar la Estrategia e iterar desde la evidencia para el próximo ciclo.",
              tone: "neutral",
            },
          ]}
        />
      </Section>

      <section id="accion" className="relative z-30 border-t border-slate-200/70 bg-tho-bg pt-10 md:pt-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] md:py-16">
          <div>
            <h2 className="font-tho-title text-[2.4rem] text-slate-950 md:text-[3.3rem] lg:text-[4.2rem]">THO en Acción</h2>
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


      <Section id="confian" title="Confían en nosotros">
        <TrustSlider />
        <div className="mx-auto mt-10 h-[6px] w-36 rounded-sm brand-block-divider md:mt-12" aria-hidden />
      </Section>

      <Section id="blog" title="Blog" subtitle="Análisis y reflexiones desde el terreno. Exploramos las tendencias que definen el presente y futuro de la estrategia organizacional y territorial.">
        <div className="grid items-start gap-6 lg:grid-cols-[250px_1fr] md:gap-8">
          <Link
            href="/blog"
            className="btn-unified-motion btn-hero-services inline-flex w-fit rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900"
          >
            Ver todas las publicaciones
          </Link>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <article key={p.slug} className="blog-card-flip h-[290px] [perspective:1200px]">
                <div className="blog-card-inner relative h-full w-full">
                  <div
                    className="blog-card-face blog-card-front rounded-2xl border border-slate-200 bg-white p-6 shadow-sm home-blog-card"
                    style={{
                      ["--blog-cover-image" as string]: `url(${p.coverImage || "/hero/4.png"})`,
                    }}
                  >
                    <div className="text-xs text-slate-500">{p.minutes} min</div>
                    <div className="mt-2 text-base font-semibold text-slate-900">{p.title}</div>
                    <p className="mt-2 text-sm text-slate-700">{clampWords(p.excerpt, 22)}</p>
                  </div>
                  <div className="blog-card-face blog-card-back rounded-2xl border border-slate-200 bg-white p-6 shadow-sm home-blog-card">
                    <a
                      href={`/blog/${p.slug}`}
                      className="btn-unified-motion btn-hero-services inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900"
                    >
                      Leer +
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <section className="border-t border-slate-200 bg-slate-900 text-white" id="contacto">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              ¿Hablamos de lo que realmente importa?
            </h2>
            <p className="mt-4 text-slate-200">
              <strong>¿Quieres fortalecer tus estrategias?</strong>
              <br />
              Déjanos tu contacto o agenda una reunión para evaluar una consultoría en Sostenibilidad, Relacionamiento Comunitario o Desarrollo Organizacional.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row">
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-unified-motion btn-hero-services rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900"
              >
                Conversemos tu caso
              </a>
              <a
                href="mailto:hola@tho.cl"
                className="btn-unified-motion btn-hero-services inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900"
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
