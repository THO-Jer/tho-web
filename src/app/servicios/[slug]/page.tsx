import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DesarrolloOrganizacionalServiceView } from "@/components/DesarrolloOrganizacionalServiceView";
import { RelacionamientoServiceView } from "@/components/RelacionamientoServiceView";
import { SostenibilidadServiceView } from "@/components/SostenibilidadServiceView";
import { getServiceBySlug, SERVICES } from "@/content/services";
import { listPublishedPosts } from "@/lib/blogStore";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

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
      <div className="min-h-screen bg-tho-bg dark:bg-slate-950">
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
      <div className="min-h-screen bg-tho-bg dark:bg-slate-950">
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
      <div className="min-h-screen bg-tho-bg dark:bg-slate-950">
        <Header />
        <DesarrolloOrganizacionalServiceView relatedPosts={relatedPosts} />
        <Footer />
      </div>
    );
  }

  // El tipo Service['slug'] está limitado a los 3 valores manejados arriba,
  // así que este punto es estáticamente inalcanzable. notFound() como red de seguridad.
  notFound();
}
