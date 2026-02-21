"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BlogContent, getToc } from "@/components/blog/BlogContent";

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

const DRAFT_KEY_PREFIX = "blog_studio_draft";

function toFormState(post: BlogPost): FormState {
  return {
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
  };
}

function cleanWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[#>*`\-\[\]()!.,:;"']/g, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2);
}

export default function BlogStudioPage() {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState("");
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSelectedSlug(params.get("slug") || "");
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/studio");
          return;
        }
        setAuthenticated(true);
        if (data.email) setEmail(data.email);
      })
      .catch(() => {
        router.replace("/studio");
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  const draftKey = useMemo(() => `${DRAFT_KEY_PREFIX}:${email || "editor"}`, [email]);

  useEffect(() => {
    if (!authenticated) return;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved) as FormState;
        if (parsed.title || parsed.content || parsed.excerpt) setForm(parsed);
      }
    } catch {
      // ignore malformed drafts
    }
  }, [authenticated, draftKey]);

  useEffect(() => {
    if (!authenticated) return;
    localStorage.setItem(draftKey, JSON.stringify(form));
  }, [authenticated, draftKey, form]);

  const contentWords = useMemo(() => cleanWords(form.content).length, [form.content]);
  const smartMinutes = useMemo(() => Math.max(1, Math.ceil(contentWords / 200)), [contentWords]);
  const toc = useMemo(() => getToc(form.content), [form.content]);

  const readability = useMemo(() => {
    if (contentWords < 120) return "Muy corto: agrega más contexto para SEO y comprensión.";
    if (contentWords < 350) return "Bien para lectura rápida. Puedes sumar un caso o ejemplo.";
    if (contentWords < 900) return "Buen largo para una entrada sólida.";
    return "Entrada extensa: revisa subtítulos y párrafos para mantener claridad.";
  }, [contentWords]);

  const internalSuggestions = useMemo(() => {
    const currentTags = form.tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    const currentWords = new Set(cleanWords(`${form.title} ${form.excerpt} ${form.content}`).slice(0, 120));

    return posts
      .filter((post) => post.slug !== editingSlug)
      .map((post) => {
        const postTags = post.tags.map((tag) => tag.toLowerCase());
        const tagMatches = postTags.filter((tag) => currentTags.includes(tag)).length;
        const postWords = cleanWords(`${post.title} ${post.excerpt}`);
        const wordMatches = postWords.filter((word) => currentWords.has(word)).length;
        const score = tagMatches * 3 + wordMatches;
        return { post, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [posts, form, editingSlug]);

  const canSubmit = useMemo(() => Boolean(authenticated && form.title && form.excerpt && form.content), [authenticated, form]);

  async function fetchPosts() {
    const res = await fetch("/api/admin/blog", {
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudieron cargar los posts");
    setPosts(data.posts);
  }

  useEffect(() => {
    if (!authenticated) return;
    fetchPosts().catch(() => undefined);
  }, [authenticated]);

  useEffect(() => {
    if (!selectedSlug || !posts.length) return;
    const selected = posts.find((post) => post.slug === selectedSlug);
    if (selected) {
      fillForm(selected);
      return;
    }
    setMessage(`No se encontró la entrada ${selectedSlug}.`);
  }, [selectedSlug, posts]);

  function fillForm(post: BlogPost) {
    setEditingSlug(post.slug);
    setForm(toFormState(post));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
    localStorage.removeItem(draftKey);
  }

  function restoreSuggestedMinutes() {
    setForm((prev) => ({ ...prev, minutes: String(smartMinutes) }));
  }

  function insertTemplate(type: "h2" | "h3" | "quote" | "divider" | "image" | "youtube" | "pdf") {
    const snippets: Record<typeof type, string> = {
      h2: "\n\n## Nuevo subtítulo\n\n",
      h3: "\n\n### Sub-sección\n\n",
      quote: "\n\n> Cita destacada\n\n",
      divider: "\n\n---\n\n",
      image: "\n\n![Texto alternativo](/uploads/blog/tu-imagen.jpg)\n\n",
      youtube: "\n\nhttps://www.youtube.com/watch?v=VIDEO_ID\n\n",
      pdf: "\n\nhttps://tu-dominio.com/archivo.pdf\n\n",
    };
    setForm((prev) => ({ ...prev, content: `${prev.content}${snippets[type]}` }));
  }

  function insertInternalLink(post: BlogPost) {
    const snippet = `\n\n[Leer también: ${post.title}](/blog/${post.slug})\n\n`;
    setForm((prev) => ({ ...prev, content: `${prev.content}${snippet}` }));
    setMessage(`Link interno insertado: /blog/${post.slug}`);
  }

  async function uploadImage(file: File, mode: "cover" | "inline") {
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen");

      setForm((prev) => ({
        ...prev,
        coverImage: mode === "cover" ? data.url : prev.coverImage || data.url,
        coverImageAlt: mode === "cover" && !prev.coverImageAlt ? file.name : prev.coverImageAlt,
        content: mode === "inline" ? `${prev.content}\n\n![${file.name}](${data.url})\n\n` : prev.content,
      }));

      setMessage(mode === "cover" ? `Portada subida: ${data.url}` : `Imagen insertada: ${data.url}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al subir imagen");
    } finally {
      setLoading(false);
    }
  }

  async function onUploadCover(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadImage(file, "cover");
    e.target.value = "";
  }

  async function onUploadInline(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadImage(file, "inline");
    e.target.value = "";
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    if (selectedSlug && !editingSlug) {
      setMessage("Todavía estamos cargando la entrada. Intenta guardar nuevamente en unos segundos.");
      return;
    }

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
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const reason = data.error || "Error guardando";
        if (res.status === 404) {
          await fetchPosts();
          throw new Error(`La entrada ya no existe o cambió de slug. ${reason}`);
        }
        throw new Error(reason);
      }
      if (data.post) {
        setEditingSlug(data.post.slug);
        setForm(toFormState(data.post as BlogPost));
        if (typeof window !== "undefined") {
          const nextUrl = `/studio/blog/editor?slug=${encodeURIComponent(data.post.slug as string)}`;
          window.history.replaceState({}, document.title, nextUrl);
        }
      }
      const savedSlug = data.post?.slug || editingSlug || form.slug;
      await fetchPosts();
      router.replace(`/studio/blog?notice=${editingSlug ? "updated" : "created"}&slug=${encodeURIComponent(savedSlug)}`);
      return;
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
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar");
      await fetchPosts();
      setMessage("Post eliminado.");
      if (editingSlug === slug) resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error eliminando.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return <main className="min-h-screen bg-tho-bg px-4 py-10 text-sm text-slate-600">Verificando sesión del Studio...</main>;
  }

  return (
    <main className="min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-5xl text-slate-950">Asistente de Redacción</h1>
            <p className="mt-2 text-sm text-slate-600">Sesión heredada desde /studio. Todo lo que edites aquí usa ese acceso común.</p>
          </div>
          <Link href="/studio/blog" className="rounded-lg border border-slate-300 px-3 py-2 text-xs">Volver al listado</Link>
        </div>

        {message ? <p className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{message}</p> : null}
        {loading ? <p className="mt-3 text-xs text-slate-500">Procesando cambios...</p> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5">
            <fieldset disabled={!authenticated || loading} className="contents">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">{editingSlug ? `Editar: ${editingSlug}` : "Nuevo post"}</h2>
                <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" checked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} />
                  Preview en vivo
                </label>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                <button type="button" onClick={() => insertTemplate("h2")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">H2</button>
                <button type="button" onClick={() => insertTemplate("h3")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">H3</button>
                <button type="button" onClick={() => insertTemplate("quote")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Cita</button>
                <button type="button" onClick={() => insertTemplate("divider")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Separador</button>
                <button type="button" onClick={() => insertTemplate("image")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Imagen</button>
                <button type="button" onClick={() => insertTemplate("youtube")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">YouTube</button>
                <button type="button" onClick={() => insertTemplate("pdf")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">PDF</button>
              </div>

              <div className="mt-4 grid gap-3">
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Slug (opcional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                <textarea className="min-h-20 rounded-lg border border-slate-300 px-3 py-2" placeholder="Extracto (resumen simple)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                <textarea className="min-h-56 rounded-lg border border-slate-300 px-3 py-2" placeholder="Contenido del artículo" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Minutos de lectura" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} />
                    <button type="button" onClick={restoreSuggestedMinutes} className="text-xs text-slate-600 underline">Usar sugerencia automática: {smartMinutes} min</button>
                  </div>
                  <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}>
                    <option value="published">Publicado</option>
                    <option value="draft">Borrador</option>
                  </select>
                </div>

                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Imagen principal URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Texto alternativo de portada" value={form.coverImageAlt} onChange={(e) => setForm({ ...form, coverImageAlt: e.target.value })} />
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs text-slate-600">Subir portada
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="mt-1 block w-full text-xs" onChange={onUploadCover} />
                  </label>
                  <label className="text-xs text-slate-600">Subir imagen dentro del artículo
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="mt-1 block w-full text-xs" onChange={onUploadInline} />
                  </label>
                </div>

                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Tags (separados por coma)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
                <textarea className="min-h-20 rounded-lg border border-slate-300 px-3 py-2" placeholder="SEO description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
              </div>

              {showPreview ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Preview en vivo</div>
                  <div className="rounded-xl bg-white p-4">
                    <h3 className="text-2xl font-semibold text-slate-900">{form.title || "Título del artículo"}</h3>
                    <p className="mt-2 text-sm text-slate-600">{form.excerpt || "Extracto del artículo"}</p>
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <BlogContent content={form.content || "# Empieza a escribir\n\nAgrega bloques para previsualizar el contenido."} />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex gap-3">
                <button disabled={!canSubmit || loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50" type="submit">{loading ? "Guardando..." : editingSlug ? "Guardar cambios" : "Crear post"}</button>
                <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-50 active:scale-[0.99]" type="button" onClick={resetForm}>Limpiar</button>
              </div>
            </fieldset>
          </form>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold text-slate-900">Checklist editorial</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>{form.title ? "✅" : "⚠️"} Título definido</li>
                <li>{form.excerpt.length > 80 ? "✅" : "⚠️"} Extracto claro (&gt;80 caracteres)</li>
                <li>{form.coverImage ? "✅" : "⚠️"} Imagen principal</li>
                <li>{form.seoTitle ? "✅" : "⚠️"} SEO title</li>
                <li>{form.seoDescription ? "✅" : "⚠️"} SEO description</li>
                <li>{toc.length ? "✅" : "⚠️"} Secciones para índice (H2/H3)</li>
              </ul>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                Palabras: <strong>{contentWords}</strong> · Lectura sugerida: <strong>{smartMinutes} min</strong> · Secciones índice: <strong>{toc.length}</strong>
                <div className="mt-2">{readability}</div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold text-slate-900">Sugerencias de links internos</h2>
              <p className="mt-1 text-xs text-slate-500">Basado en tags y tema del contenido actual.</p>
              <div className="mt-3 grid gap-2">
                {internalSuggestions.map(({ post, score }) => (
                  <div key={post.slug} className="rounded-lg border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Relevancia: {score}</div>
                    <div className="text-sm font-semibold text-slate-900">{post.title}</div>
                    <div className="mt-2 flex gap-2">
                      <button type="button" className="rounded-md border border-slate-300 px-2.5 py-1 text-xs" onClick={() => insertInternalLink(post)}>Insertar link</button>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 px-2.5 py-1 text-xs">Ver</a>
                    </div>
                  </div>
                ))}
                {!internalSuggestions.length ? <p className="text-sm text-slate-500">Sin sugerencias aún. Agrega más texto o tags.</p> : null}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold text-slate-900">Entradas ({posts.length})</h2>
              <div className="mt-4 grid gap-3">
                {posts.map((post) => (
                  <article key={post.slug} className="rounded-xl border border-slate-200 p-3">
                    <div className="text-xs font-semibold uppercase text-slate-500">{post.status}</div>
                    <h3 className="mt-1 font-semibold text-slate-900">{post.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">/{post.slug}</p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs" onClick={() => fillForm(post)}>Editar</button>
                      <button type="button" className="rounded-md border border-rose-200 px-3 py-1.5 text-xs text-rose-700" onClick={() => onDelete(post.slug)}>Eliminar</button>
                    </div>
                  </article>
                ))}
                {!posts.length ? <p className="text-sm text-slate-500">Sin posts cargados.</p> : null}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
