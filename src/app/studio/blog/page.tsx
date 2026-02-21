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
};

export default function BlogStudioIndexPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState("");

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
    setMessage("");
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

  if (checkingAuth) {
    return <main className="min-h-screen bg-tho-bg px-4 py-10 text-sm text-slate-600">Verificando sesión del Studio...</main>;
  }

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-5xl text-slate-950">Studio Blog</h1>
            <p className="mt-2 text-sm text-slate-600">Entraste como {email || "editor"}. Gestiona entradas y abre el asistente de redacción.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio" className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Volver al Studio</Link>
            <Link href="/studio/blog/editor" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Nueva entrada</Link>
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Entradas ({sortedPosts.length})</h2>
            <button type="button" onClick={() => fetchPosts()} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs" disabled={loading}>
              Recargar
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {sortedPosts.map((post) => (
              <article key={post.slug} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-500">{post.status}</div>
                    <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                    <p className="text-xs text-slate-600">/{post.slug} · {post.minutes} min · {new Date(post.updatedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs">Ver</a>
                    <Link href={`/studio/blog/editor?slug=${encodeURIComponent(post.slug)}`} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs">Editar</Link>
                    <button type="button" onClick={() => onDelete(post.slug)} className="rounded-md border border-rose-200 px-3 py-1.5 text-xs text-rose-700" disabled={loading}>Borrar</button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{post.excerpt}</p>
                {post.tags?.length ? <p className="mt-2 text-xs text-slate-500">Tags: {post.tags.join(", ")}</p> : null}
              </article>
            ))}
            {!sortedPosts.length ? <p className="text-sm text-slate-500">No hay entradas aún.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
