"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  minutes: number;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string;
  coverImage?: string;
  coverImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type FormState = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  minutes: string;
  tags: string;
  status: "draft" | "published";
  coverImage: string;
  coverImageAlt: string;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  minutes: "5",
  tags: "",
  status: "published",
  coverImage: "",
  coverImageAlt: "",
  seoTitle: "",
  seoDescription: "",
};

export default function BlogStudioPage() {
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("blog_admin_token");
    if (cached) setToken(cached);
  }, []);

  const canSubmit = useMemo(() => Boolean(token && form.title && form.excerpt && form.content), [token, form]);

  async function fetchPosts(currentToken: string) {
    const res = await fetch("/api/admin/blog", {
      headers: { "x-admin-token": currentToken },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudieron cargar los posts");
    setPosts(data.posts);
  }

  async function onLoad() {
    if (!token) return;
    setLoading(true);
    setMessage("");
    try {
      await fetchPosts(token);
      localStorage.setItem("blog_admin_token", token);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al cargar.");
    } finally {
      setLoading(false);
    }
  }

  function fillForm(post: BlogPost) {
    setEditingSlug(post.slug);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      minutes: String(post.minutes),
      tags: post.tags.join(", "),
      status: post.status,
      coverImage: post.coverImage ?? "",
      coverImageAlt: post.coverImageAlt ?? "",
      seoTitle: post.seoTitle ?? "",
      seoDescription: post.seoDescription ?? "",
    });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
  }

  function insertTemplate(type: "h2" | "h3" | "quote" | "divider" | "toc" | "image") {
    const snippets: Record<typeof type, string> = {
      h2: "\n\n## Nuevo subtítulo\n\n",
      h3: "\n\n### Sub-sección\n\n",
      quote: "\n\n> Cita destacada\n\n",
      divider: "\n\n---\n\n",
      toc: "\n\n## Índice\n\n- Punto 1\n- Punto 2\n\n",
      image: "\n\n![Texto alternativo](/uploads/blog/tu-imagen.jpg)\n\n",
    };
    setForm((prev) => ({ ...prev, content: `${prev.content}${snippets[type]}` }));
  }

  async function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen");
      setForm((prev) => ({
        ...prev,
        coverImage: prev.coverImage || data.url,
        content: `${prev.content}\n\n![${file.name}](${data.url})\n\n`,
      }));
      setMessage(`Imagen subida: ${data.url}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al subir imagen");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      minutes: Number(form.minutes),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      status: form.status,
      coverImage: form.coverImage,
      coverImageAlt: form.coverImageAlt,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
    };

    const endpoint = editingSlug ? `/api/admin/blog/${editingSlug}` : "/api/admin/blog";
    const method = editingSlug ? "PATCH" : "POST";

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "content-type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error guardando");
      await fetchPosts(token);
      setMessage(editingSlug ? "Post actualizado." : "Post creado.");
      if (!editingSlug) resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error guardando.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(slug: string) {
    if (!confirm(`Eliminar ${slug}?`)) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar");
      await fetchPosts(token);
      setMessage("Post eliminado.");
      if (editingSlug === slug) resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error eliminando.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-tho-title text-5xl text-slate-950">Studio Blog</h1>
        <p className="mt-2 text-sm text-slate-600">Editor nativo con bloques rápidos, portada, citas, separadores, índice e imágenes.</p>

        <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <label className="grow text-sm">
            Token administrador
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="BLOG_ADMIN_TOKEN"
            />
          </label>
          <button onClick={onLoad} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white" type="button">
            Cargar posts
          </button>
        </div>

        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">{editingSlug ? `Editar: ${editingSlug}` : "Nuevo post"}</h2>
            <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <button type="button" onClick={() => insertTemplate("h2")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">H2</button>
              <button type="button" onClick={() => insertTemplate("h3")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">H3</button>
              <button type="button" onClick={() => insertTemplate("quote")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Cita</button>
              <button type="button" onClick={() => insertTemplate("divider")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Separador</button>
              <button type="button" onClick={() => insertTemplate("image")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Imagen</button>
            </div>
            <div className="mt-4 grid gap-3">
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Slug (opcional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <textarea className="min-h-20 rounded-lg border border-slate-300 px-3 py-2" placeholder="Extracto" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              <textarea className="min-h-56 rounded-lg border border-slate-300 px-3 py-2" placeholder="Contenido (markdown enriquecido)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <div className="grid gap-3 md:grid-cols-2">
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Minutos de lectura" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} />
                <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}>
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Imagen principal URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Alt imagen principal" value={form.coverImageAlt} onChange={(e) => setForm({ ...form, coverImageAlt: e.target.value })} />
              <label className="text-xs text-slate-600">
                Subir imagen (jpg/png/webp)
                <input type="file" accept="image/png,image/jpeg,image/webp" className="mt-1 block w-full text-xs" onChange={onUpload} />
              </label>
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Tags (separados por coma)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              <textarea className="min-h-20 rounded-lg border border-slate-300 px-3 py-2" placeholder="SEO description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
            </div>

            <div className="mt-4 flex gap-3">
              <button disabled={!canSubmit || loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" type="submit">
                {editingSlug ? "Guardar cambios" : "Crear post"}
              </button>
              <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm" type="button" onClick={resetForm}>
                Limpiar
              </button>
            </div>
          </form>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">Entradas ({posts.length})</h2>
            <div className="mt-4 grid gap-3">
              {posts.map((post) => (
                <article key={post.slug} className="rounded-xl border border-slate-200 p-3">
                  <div className="text-xs font-semibold uppercase text-slate-500">{post.status}</div>
                  <h3 className="mt-1 font-semibold text-slate-900">{post.title}</h3>
                  <p className="mt-1 text-xs text-slate-600">/{post.slug}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs" onClick={() => fillForm(post)}>
                      Editar
                    </button>
                    <button type="button" className="rounded-md border border-rose-200 px-3 py-1.5 text-xs text-rose-700" onClick={() => onDelete(post.slug)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
              {!posts.length ? <p className="text-sm text-slate-500">Sin posts cargados.</p> : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
