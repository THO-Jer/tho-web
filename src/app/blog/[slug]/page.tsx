import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BlogContent, getToc } from "@/components/blog/BlogContent";
import { BlogTocClient } from "@/components/blog/BlogTocClient";
import { getPublishedPostBySlug, listPublishedPosts } from "@/lib/blogStore";

const SITE = "https://tho.cl";

export const revalidate = 3600; // regenerar cada hora

export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const title = post.seoTitle || `${post.title} | The Human Org`;
  const description = post.seoDescription || post.excerpt;
  const canonical = `${SITE}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: "The Human Org",
      images: post.coverImage ? [{ url: post.coverImage, alt: post.coverImageAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return notFound();
  const toc = getToc(post.content);

  const allPosts = await listPublishedPosts();
  const currentTags = new Set(post.tags.map((tag) => tag.toLowerCase()));
  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .map((item) => {
      const sharedTags = item.tags.filter((tag) => currentTags.has(tag.toLowerCase())).length;
      const score = sharedTags * 3;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: post.coverImage ? [`${SITE}${post.coverImage}`] : undefined,
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
    keywords: post.tags.join(", ") || undefined,
    articleSection: post.tags[0] ?? undefined,
    inLanguage: "es-CL",
    author: {
      "@type": "Organization",
      name: "The Human Org",
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: "The Human Org",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/brand/logo-negro.svg` },
    },
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_280px]">
          <div className="max-w-3xl">
            <div className="text-xs text-slate-500">{post.minutes} min</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{post.title}</h1>
            <div className="mt-3 h-[6px] w-36 rounded-sm brand-block-divider" />
            <p className="mt-4 text-slate-600">{post.excerpt}</p>

            {post.coverImage ? (
              <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200">
                <Image src={post.coverImage} alt={post.coverImageAlt || post.title} fill className="object-cover" />
              </div>
            ) : null}


            {post.tags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
              Actualizado: {new Date(post.updatedAt).toLocaleDateString("es-CL")}
            </div>

            <div className="mt-8">
              <BlogContent content={post.content} />
            </div>

            {relatedPosts.length ? (
              <section className="mt-10 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">También te puede interesar</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="btn-unified-motion btn-hero-services rounded-xl bg-white p-4 transition"
                    >
                      <div className="text-xs text-slate-500">{related.minutes} min</div>
                      <div className="mt-1 text-base font-semibold text-slate-900">{related.title}</div>
                      <p className="mt-1 text-sm text-slate-600">{related.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {toc.length ? (
            <aside className="hidden lg:block">
              <BlogTocClient toc={toc} />
            </aside>
          ) : null}
        </div>
      </main>
      <Script id={`ld-blog-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer />
    </div>
  );
}
