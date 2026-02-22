import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BlogContent, getToc } from "@/components/blog/BlogContent";
import { getPublishedPostBySlug, listPublishedPosts } from "@/lib/blogStore";

const SITE = "https://tho-web.vercel.app";

export const dynamic = "force-dynamic";

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
    author: {
      "@type": "Organization",
      name: "The Human Org",
    },
    publisher: {
      "@type": "Organization",
      name: "The Human Org",
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
                <span className="inline-flex rounded-full border border-transparent bg-[linear-gradient(95deg,var(--tho-pink)_0%,var(--tho-blue)_25%,var(--tho-orange)_50%,var(--tho-yellow)_75%,var(--tho-green)_100%)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">Otras lecturas</span>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">También te puede interesar</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {relatedPosts.map((related) => (
                    <Link key={related.slug} href={`/blog/${related.slug}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-white">
                      <div className="text-xs text-slate-500">{related.minutes} min</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">{related.title}</div>
                      <p className="mt-1 text-xs text-slate-600">{related.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {toc.length ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Índice</div>
                <ul className="mt-3 space-y-2">
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                      <a href={`#${item.id}`} className="text-sm text-slate-700 hover:text-slate-900">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>
      </main>
      <Script id={`ld-blog-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer />
    </div>
  );
}
