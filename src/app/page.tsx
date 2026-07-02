import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { SERVICES } from "@/content/services";
import { PILLAR_META } from "@/lib/brand";
import MethodScrolly from "@/components/MethodScrolly";
import { ActionGallery } from "@/components/ActionGallery";
import { ResourcesBanner } from "@/components/ResourcesBanner";
import { ProblemStatement } from "@/components/ProblemStatement";
import { TrustSlider } from "@/components/TrustSlider";
import { SocialFloat } from "@/components/SocialFloat";
import { listPublishedPosts } from "@/lib/blogStore";
import { BOOK_URL } from "@/lib/links";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "The Human Org — Consultora estratégica en Concepción",
  description:
    "Consultora boutique en Concepción especializada en desarrollo organizacional, relacionamiento comunitario y sostenibilidad corporativa (ESG). Atendemos clientes en todo Chile, de forma remota o en terreno según el servicio.",
};

function clampWords(text: string, maxWords = 22) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")} (...)`;
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es The Human Org?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Human Org (THO) es una consultora estratégica boutique con sede en Concepción, Chile, especializada en sostenibilidad corporativa (ESG), relacionamiento comunitario y desarrollo organizacional.",
      },
    },
    {
      "@type": "Question",
      name: "¿Dónde está ubicada la consultora The Human Org?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Human Org tiene su sede en Concepción, Región del Biobío, Chile. Opera en todo el país con especial presencia en la macro-zona centro-sur y norte.",
      },
    },
    {
      "@type": "Question",
      name: "¿En qué servicios se especializa The Human Org?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "THO trabaja en tres líneas estratégicas: (1) Sostenibilidad Corporativa y reportabilidad ESG bajo estándares GRI, CSRD e IFRS S1/S2; (2) Relacionamiento Comunitario y gestión de stakeholders para proyectos con impacto territorial; (3) Desarrollo Organizacional, incluyendo transformación cultural, liderazgo y gestión del cambio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo puedo contratar a The Human Org?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes agendar una reunión directamente desde tho.cl usando el botón 'Conversemos tu caso', o escribirnos a hola@tho.cl. El primer contacto es siempre una conversación para entender tu situación específica.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué diferencia a THO de otras consultoras en Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "THO es una consultora boutique: el equipo que diseña la propuesta es el mismo que ejecuta en terreno. No tercerizamos ni enviamos analistas sin experiencia. Priorizamos viabilidad real y acompañamiento directo sobre recomendaciones teóricas.",
      },
    },
  ],
};

export default async function HomePage() {
  const posts = await listPublishedPosts();

  return (
    <div className="min-h-screen">
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Header />
      <SocialFloat />

      <main id="contenido">
        <ResourcesBanner />
        {/* HERO — tipografía protagonista, imagen como soporte */}
        <section className="relative min-h-[72vh] overflow-visible text-white md:min-h-[80vh] lg:min-h-[88vh]">
        <div className="hero-media-fade pointer-events-none absolute inset-x-0 -bottom-28 top-0">
          <Image
            src="/hero/hands.png"
            alt=""
            fill
            className="object-cover object-[20%_36%] opacity-[0.7] md:object-center"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(288deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.38)_52%,rgba(15,23,42,0.68)_100%)]" />
        </div>

        <div className="relative mx-auto flex h-full min-h-[72vh] max-w-6xl items-end px-4 pb-16 pt-8 md:min-h-[80vh] md:pb-20 md:pt-12 lg:min-h-[88vh] lg:pb-24 lg:pt-14">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-wide text-white/75">
              The Human Org · Consultoría estratégica · Concepción
            </p>
            <div className="mt-3 h-[6px] w-36 rounded-sm brand-block-divider" />

            <h1 className="hero-headline font-tho-title mt-6 text-[3rem] leading-[1.02] text-white md:text-[4.4rem] lg:text-[5.6rem]">
              Estrategias que se sostienen en el tiempo.
            </h1>

            <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">
              Integramos ESG, relacionamiento comunitario y desarrollo organizacional
              para construir decisiones accionables.
            </p>

            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row">
              {/* CTA primario — conversación/agendamiento */}
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

      {/* PROBLEMA — statement tipográfico con reveal al scroll */}
      <section className="hero-transition-panel relative z-30 mt-14 bg-transparent md:mt-20 lg:mt-24">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center md:py-16">
          <ProblemStatement />
          <p className="mx-auto mt-8 max-w-3xl text-base text-slate-700 md:text-lg">
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

          {/* Fila bento complementaria — diferenciador + terreno */}
          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <div className="rounded-[2rem] bg-slate-900 p-7 text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] xl:col-span-2">
              <div className="h-[5px] w-24 rounded-sm brand-block-divider" aria-hidden />
              <p className="font-tho-title mt-5 text-[1.6rem] leading-tight text-white md:text-[2rem]">
                Boutique de verdad: el equipo que diseña la propuesta es el mismo que ejecuta en terreno.
              </p>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
                No tercerizamos ni enviamos analistas sin experiencia. Si no sabes por dónde partir,
                partamos por una conversación.
              </p>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-unified-motion btn-hero-services mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900"
              >
                Conversemos tu caso
              </a>
            </div>

            <a href="#accion" className="bento-photo-card group block min-h-[220px]">
              <Image
                src="/accion/04.png"
                alt="Equipo THO trabajando en terreno"
                fill
                sizes="(min-width: 1280px) 30vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_35%,rgba(15,23,42,0.72)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[11px] font-bold uppercase tracking-[0.17em] text-white/80">
                  THO en acción
                </div>
                <div className="mt-1 text-base font-semibold">
                  Terreno real, no diapositivas →
                </div>
              </div>
            </a>
          </div>
        </div>
      </Section>

      <Section
        id="metodo"
        title="Cómo trabajamos"
        subtitle="Nuestro método está diseñado para ser adaptable y entregar valor en un entorno complejo y cambiante, garantizando viabilidad. La consultoría en The Human Org seguirá las siguientes etapas durante el proceso."
      >
        <MethodScrolly
          steps={[
            {
              n: "01",
              title: "Lectura del Sistema",
              desc: "Mapeamos fuentes, levantamos datos y desarrollamos diagnósticos que evidencian riesgos, oportunidades y fundamentan el proceso.",
            },
            {
              n: "02",
              title: "Diseño de Estrategia",
              desc: "Co-diseñamos rutas, actividades, metas e indicadores para que tu organización sepa qué hacer para alcanzar sus objetivos.",
            },
            {
              n: "03",
              title: "Implementación",
              desc: "Acompañamos la ejecución de la Estrategia en terreno, ajustando en tiempo real y coordinando soluciones que agregan valor.",
            },
            {
              n: "04",
              title: "Evaluación y Aprendizaje",
              desc: "Reportamos resultados para evidenciar logros y desafíos, de manera que permita ajustar la Estrategia e iterar desde la evidencia para el próximo ciclo.",
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

      <Section id="blog" tone="soft" title="Blog" subtitle="Análisis y reflexiones desde el terreno. Exploramos las tendencias que definen el presente y futuro de la estrategia organizacional y territorial.">
        <div className="grid items-start gap-6 lg:grid-cols-[250px_1fr] md:gap-8">
          <Link
            href="/blog"
            className="btn-unified-motion btn-hero-services inline-flex w-fit rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900"
          >
            Ver todas las publicaciones
          </Link>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="blog-card-v2 rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative h-36 shrink-0 overflow-hidden">
                  <div
                    className="blog-card-v2-cover absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${p.coverImage || "/hero/4.png"})` }}
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-xs text-slate-500">{p.minutes} min de lectura</div>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-700">{clampWords(p.excerpt, 18)}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-slate-900">
                    Leer artículo
                    <span className="blog-card-v2-arrow" aria-hidden>→</span>
                  </span>
                </div>
              </Link>
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
            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {/* CTA primario — agenda */}
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-unified-motion btn-hero-services rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900"
              >
                Conversemos tu caso
              </a>
              {/* CTA secundario — mail como enlace */}
              <a
                href="mailto:hola@tho.cl"
                className="text-sm font-semibold text-slate-200 underline underline-offset-4 transition-colors hover:text-white"
              >
                o escríbenos a hola@tho.cl
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
