import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServicePage } from "@/components/ServicePage";
import { getServiceBySlug, SERVICES } from "@/content/services";
import { listPublishedPosts } from "@/lib/blogStore";

const SITE = "https://tho.cl";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const title = `${service.menuLabel} · The Human Org`;
  const description = service.problem;
  const canonical = `${SITE}/servicios/${service.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "The Human Org",
      images: [{ url: `${SITE}/og.png`, width: 1200, height: 630, alt: "The Human Org" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og.png`],
    },
  };
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

/**
 * Tags relevantes para cada servicio. Filtramos los posts publicados por estos
 * keywords (case-insensitive, sin #) y mostramos los 3 más recientes en la
 * sección "Lecturas relacionadas".
 */
const RELATED_TAGS: Record<string, string[]> = {
  "sostenibilidad-corporativa": ["esg", "sostenibilidad"],
  "relacionamiento-comunitario": ["comunidad", "social", "territorio"],
  "desarrollo-organizacional": ["cultura", "liderazgo", "organizacional"],
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const tagsForSlug = RELATED_TAGS[service.slug] || [];
  const posts = await listPublishedPosts();
  const relatedPosts = posts
    .filter((post) =>
      post.tags.some((tag) => {
        const normalized = tag.toLowerCase().replace("#", "");
        return tagsForSlug.some((needle) => normalized.includes(needle));
      }),
    )
    .slice(0, 3)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags,
    }));

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.menuLabel,
    description: service.problem,
    url: `${SITE}/servicios/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: "The Human Org",
      url: SITE,
    },
    areaServed: {
      "@type": "Country",
      name: "Chile",
    },
  };

  return (
    <div className="min-h-screen bg-tho-bg dark:bg-slate-950">
      <Script
        id={`ld-service-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <Header />
      <ServicePage service={service} relatedPosts={relatedPosts} />
      <Footer />
    </div>
  );
}
