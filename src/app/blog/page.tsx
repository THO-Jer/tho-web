import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
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

          <BlogIndexClient posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
