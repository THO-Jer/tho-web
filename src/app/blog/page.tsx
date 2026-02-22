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
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <section className="relative overflow-hidden rounded-3xl">
            <div
              className="relative h-[230px] md:h-[280px]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(15,23,42,0.25) 0%, rgba(15,23,42,0.7) 100%), url('/hero/4.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-end p-6 md:p-8">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">Blog</h1>
                  <p className="mt-3 max-w-2xl text-slate-100">Análisis aplicados para decisiones complejas: DO, comunidad y sostenibilidad.</p>
                </div>
              </div>
            </div>
          </section>

          <BlogIndexClient posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
