import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { listPublishedPosts } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await listPublishedPosts();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Blog</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Análisis aplicados para decisiones complejas: DO, comunidad y sostenibilidad.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                <div className="text-xs text-slate-500">{post.minutes} min</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{post.title}</div>
                <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                {post.tags.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
