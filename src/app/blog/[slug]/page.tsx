import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BlogContent } from "@/components/blog/BlogContent";
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
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
        <div className="mx-auto max-w-3xl px-4 py-14">
          <div className="text-xs text-slate-500">{post.minutes} min</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{post.title}</h1>
          <p className="mt-4 text-slate-600">{post.excerpt}</p>

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
        </div>
      </main>
      <Script id={`ld-blog-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer />
    </div>
  );
}
