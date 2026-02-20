import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { POSTS } from "@/content/posts";

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Blog</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Desde el territorio: análisis y tendencias (placeholder).</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {POSTS.map((p) => (
              <a
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
              >
                <div className="text-xs text-slate-500">{p.minutes} min</div>
                <div className="mt-2 text-lg font-semibold">{p.title}</div>
                <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
