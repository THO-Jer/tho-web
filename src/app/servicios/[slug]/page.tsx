import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BrochureLeadForm } from "@/components/BrochureLeadForm";
import { DesarrolloOrganizacionalServiceView } from "@/components/DesarrolloOrganizacionalServiceView";
import { RelacionamientoServiceView } from "@/components/RelacionamientoServiceView";
import { SostenibilidadServiceView } from "@/components/SostenibilidadServiceView";
import { getServiceBySlug, SERVICES } from "@/content/services";
import { TICKETS } from "@/content/tickets";
import { PILLAR_META } from "@/lib/brand";
import { listPublishedPosts } from "@/lib/blogStore";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const related = SERVICES.filter((item) => item.slug !== service.slug);
  const leadTicket = TICKETS.find((ticket) => ticket.slug === service.leadTicketSlug);
  const meta = PILLAR_META[service.pillar];

  if (service.slug === "sostenibilidad-corporativa") {
    const posts = await listPublishedPosts();
    const relatedPosts = posts
      .filter((post) => post.tags.some((tag) => {
        const normalized = tag.toLowerCase().replace("#", "");
        return normalized.includes("esg") || normalized.includes("sostenibilidad");
      }))
      .slice(0, 3)
      .map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, tags: post.tags }));

    return (
      <div className="min-h-screen bg-tho-bg">
        <Header />
        <SostenibilidadServiceView relatedPosts={relatedPosts} />
        <Footer />
      </div>
    );
  }

  if (service.slug === "relacionamiento-comunitario") {
    const posts = await listPublishedPosts();
    const relatedPosts = posts
      .filter((post) => post.tags.some((tag) => {
        const normalized = tag.toLowerCase().replace("#", "");
        return normalized.includes("comunidad") || normalized.includes("social") || normalized.includes("territorio");
      }))
      .slice(0, 3)
      .map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, tags: post.tags }));

    return (
      <div className="min-h-screen bg-tho-bg">
        <Header />
        <RelacionamientoServiceView relatedPosts={relatedPosts} />
        <Footer />
      </div>
    );
  }

  if (service.slug === "desarrollo-organizacional") {
    const posts = await listPublishedPosts();
    const relatedPosts = posts
      .filter((post) => post.tags.some((tag) => {
        const normalized = tag.toLowerCase().replace("#", "");
        return normalized.includes("cultura") || normalized.includes("liderazgo") || normalized.includes("organizacional");
      }))
      .slice(0, 3)
      .map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, tags: post.tags }));

    return (
      <div className="min-h-screen bg-tho-bg">
        <Header />
        <DesarrolloOrganizacionalServiceView relatedPosts={relatedPosts} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tho-bg">
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${meta.softBorder} ${meta.accentText} ${meta.softBg}`}>
              <span className={`h-2 w-2 rounded-full ${meta.accentDot}`} />
              Solución THO
            </div>
            <h1 className="font-tho-title mt-4 text-[2.8rem] leading-[1.02] text-slate-950 md:text-[4.2rem]">{service.heroTitle}</h1>
            <p className="mt-5 max-w-4xl text-base text-slate-700 md:text-lg">{service.problem}</p>
            <p className="mt-3 max-w-4xl text-base font-semibold text-slate-900 md:text-lg">{service.promise}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://bit.ly/bookTHO"
                target="_blank"
                rel="noreferrer"
                className="btn-unified-motion btn-tho-hover-gradient rounded-xl border border-slate-700/25 bg-slate-900 px-5 py-3 text-sm font-bold text-white"
              >
                Cotizar este servicio
              </a>
              <Link
                href="/#contacto"
                className="btn-unified-motion btn-brand-neutral rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900"
              >
                Hablar con consultor
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:py-14">
          <h2 className="text-2xl font-semibold text-slate-950 md:text-3xl">Niveles de servicio</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            Cada nivel aumenta profundidad y soporte. Partimos con claridad rápida y escalamos hasta implementación anual.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {service.levels.map((level) => (
              <article key={level.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{level.name}</h3>
                <p className="mt-2 text-sm text-slate-700">{level.summary}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {level.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>

                {level.cta ? (
                  <BrochureLeadForm
                    serviceSlug={service.slug}
                    serviceName={service.navLabel}
                    levelId={level.id}
                    levelName={level.name}
                    hint={level.cta.hint}
                    buttonLabel={level.cta.label}
                  />
                ) : null}
              </article>
            ))}
          </div>

          {leadTicket ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Entrada recomendada</div>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{leadTicket.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{leadTicket.short}</p>
              <Link href={`/tickets/${leadTicket.slug}`} className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4">
                Ver ficha de solución ágil
              </Link>
            </div>
          ) : null}
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-semibold text-slate-950">Integra con otras soluciones</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
              Este servicio se potencia cuando se articula con los otros frentes de trabajo. Explora cómo combinarlos.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link key={item.slug} href={`/servicios/${item.slug}`} className="rounded-2xl border border-slate-200 bg-tho-bg p-5 transition hover:-translate-y-0.5">
                  <div className="text-lg font-semibold text-slate-900">{item.menuLabel}</div>
                  <p className="mt-2 text-sm text-slate-600">{item.promise}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
