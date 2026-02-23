"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  status: "draft" | "published";
  updatedAt: string;
  minutes: number;
  tags: string[];
  category?: string;
};

type PostFilter = "all" | "draft" | "published";

export default function BlogStudioIndexPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<PostFilter>("all");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const notice = params.get("notice");
    const slug = params.get("slug");
    if (notice === "created") setMessage(`Entrada creada correctamente${slug ? `: ${slug}` : "."}`);
    if (notice === "updated") setMessage(`Entrada actualizada correctamente${slug ? `: ${slug}` : "."}`);
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/studio");
          return;
        }
        if (data.email) setEmail(data.email);
      })
      .catch(() => router.replace("/studio"))
      .finally(() => setCheckingAuth(false));
  }, [router]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudieron cargar las entradas.");
      setPosts(data.posts || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error cargando entradas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (checkingAuth) return;
    fetchPosts().catch(() => undefined);
  }, [checkingAuth]);

  async function onDelete(slug: string) {
    if (!confirm(`¿Eliminar ${slug}?`)) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar.");
      setPosts((prev) => prev.filter((post) => post.slug !== slug));
      setMessage("Entrada eliminada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error eliminando entrada.");
    } finally {
      setLoading(false);
    }
  }

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [posts]
  );

  const visiblePosts = useMemo(() => {
    if (filter === "all") return sortedPosts;
    return sortedPosts.filter((post) => post.status === filter);
  }, [filter, sortedPosts]);

  const counters = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((post) => post.status === "published").length,
      draft: posts.filter((post) => post.status === "draft").length,
    }),
    [posts]
  );

  if (checkingAuth) {
    return <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10 text-sm text-slate-600">Verificando sesión del Studio...</main>;
  }

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Studio Blog</h1>
            <p className="mt-2 text-sm text-slate-600">Entraste como {email || "editor"}. Gestiona entradas y abre el asistente de redacción.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 active:scale-[0.99]">Volver al Studio</Link>
            <Link href="/studio/blog/editor?fresh=1" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.99]">Nueva entrada</Link>
          </div>
        </div>

        {message ? <p className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{message}</p> : null}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Entradas ({visiblePosts.length})</h2>
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "published", "draft"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === option ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700"}`}
                >
                  {option === "all" ? `Todas (${counters.all})` : option === "published" ? `Publicadas (${counters.published})` : `Borradores (${counters.draft})`}
                </button>
              ))}
              <button type="button" onClick={() => fetchPosts()} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50" disabled={loading}>
                {loading ? "Actualizando..." : "Recargar"}
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {visiblePosts.map((post) => (
              <article key={post.slug} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-500">{post.status === "published" ? "Publicado" : "Borrador"}</div>
                    <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                    <p className="break-all text-xs text-slate-600">/{post.slug} · {post.minutes} min · Editado: {new Date(post.updatedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">Ver</a>
                    <Link href={`/studio/blog/editor?slug=${encodeURIComponent(post.slug)}`} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50">Editar</Link>
                    <button type="button" onClick={() => onDelete(post.slug)} className="rounded-md border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50" disabled={loading}>Borrar</button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{post.excerpt}</p>
                {post.category ? <p className="mt-2 text-xs text-slate-500">Categoría: <strong>{post.category}</strong></p> : null}
                {post.tags?.length ? <p className="mt-1 text-xs text-slate-500">Tags: {post.tags.join(", ")}</p> : null}
              </article>
            ))}
            {!visiblePosts.length ? <p className="text-sm text-slate-500">No hay entradas para este filtro.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
