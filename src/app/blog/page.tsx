import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { listPublishedPosts } from "@/lib/blogStore";

export const revalidate = 3600; // regenerar cada hora

export const metadata: Metadata = {
  title: "Blog · The Human Org",
  description:
    "Análisis y reflexiones desde el terreno: sostenibilidad corporativa, relacionamiento comunitario y desarrollo organizacional.",
  alternates: { canonical: "https://tho.cl/blog" },
  openGraph: {
    type: "website",
    title: "Blog · The Human Org",
    description:
      "Análisis y reflexiones desde el terreno: sostenibilidad corporativa, relacionamiento comunitario y desarrollo organizacional.",
    url: "https://tho.cl/blog",
    siteName: "The Human Org",
    images: [{ url: "https://tho.cl/og.png", width: 1200, height: 630, alt: "The Human Org" }],
  },
};

export default async function BlogPage() {
  const posts = await listPublishedPosts();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="border-t border-slate-200 bg-white">
        <section className="relative min-h-[52vh] overflow-visible text-white md:min-h-[60vh]">
          <div className="hero-media-fade pointer-events-none absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/5.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.78]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(15,23,42,0.1)_0%,rgba(15,23,42,0.4)_52%,rgba(15,23,42,0.72)_100%)]" />
          </div>

          <div className="relative mx-auto flex h-full min-h-[52vh] max-w-6xl items-end justify-end px-4 pb-14 pt-8 md:min-h-[60vh] md:pb-16 md:pt-12">
            <div className="max-w-2xl text-right">
              <div className="mt-3 ml-auto h-[6px] w-36 rounded-sm brand-block-divider" />
              <h1 className="mt-4 font-tho-title text-[3rem] leading-[0.95] text-white md:text-[4.4rem]">Blog</h1>
              <p className="mt-4 ml-auto max-w-xl text-justify text-base text-white/85 md:text-lg">Reflexiones, análisis y discusiones de nuestra consultora aplicadas a realidades complejas y contextos cambiantes en gestión de la sostenibilidad, gestión de stakeholders, gestión de equipos y más.</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <BlogIndexClient posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
