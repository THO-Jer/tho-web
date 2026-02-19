import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { POSTS } from "@/content/posts";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <div className="text-xs text-slate-500">{post.minutes} min</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="mt-4 text-slate-600">{post.excerpt}</p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            Placeholder: luego lo conectamos a contenido real (MDX/Markdown) y traemos los posts desde archivos.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
