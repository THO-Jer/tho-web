"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandLoader } from "@/components/BrandLoader";
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
  publishedAt: string;
  status: "draft" | "published";
  coverImage: string;
  coverImageAlt: string;
  seoTitle: string;
  seoDescription: string;
};


type RepoTreeNode = {
  kind: "dir" | "file";
  name: string;
  path: string;
  children?: RepoTreeNode[];
};

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  minutes: "5",
  tags: "",
  publishedAt: "",
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
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 16) : "",
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


function renderRepoTree(nodes: RepoTreeNode[], onPick: (path: string) => void, depth = 0) {
  return (
    <ul className={depth === 0 ? "space-y-1" : "ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3"}>
      {nodes.map((node) => (
        <li key={`${node.kind}:${node.path}`}>
          {node.kind === "dir" ? (
            <details open>
              <summary className="cursor-pointer rounded px-1 py-0.5 text-xs text-slate-700 hover:bg-slate-100">📁 {node.name}</summary>
              {node.children?.length ? renderRepoTree(node.children, onPick, depth + 1) : null}
            </details>
          ) : (
            <button
              type="button"
              onClick={() => onPick(node.path)}
              className="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-100">
                <img src={node.path} alt={node.name} className="h-full w-full object-cover" loading="lazy" />
              </span>
              <span className="min-w-0">
                <span className="block truncate">🖼️ {node.name}</span>
                <span className="block truncate text-[11px] text-slate-500">{node.path}</span>
              </span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function BlogStudioPage() {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState("");
  const [startFresh, setStartFresh] = useState(false);
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [blockedByOnboarding, setBlockedByOnboarding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [repoPickerMode, setRepoPickerMode] = useState<"cover" | "inline" | null>(null);
  const [pickerSource, setPickerSource] = useState<"repo" | "storage">("repo");
  const [repoTree, setRepoTree] = useState<RepoTreeNode[]>([]);
  const [repoTreeLoading, setRepoTreeLoading] = useState(false);
  const [repoTreeError, setRepoTreeError] = useState("");
  const [storageTree, setStorageTree] = useState<RepoTreeNode[]>([]);
  const [storageTreeLoading, setStorageTreeLoading] = useState(false);
  const [storageTreeError, setStorageTreeError] = useState("");
  const [lastUploadedUrl, setLastUploadedUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSelectedSlug(params.get("slug") || "");
    setStartFresh(params.get("fresh") === "1");
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data.authenticated) {
          router.replace("/studio");
          return;
        }
        setAuthenticated(true);
        if (data.email) setEmail(data.email);
        const isSuperAdmin = String(data.role || "") === "superadmin";
        if (!isSuperAdmin) {
          const onboardingRes = await fetch("/api/studio/onboarding", { credentials: "include", cache: "no-store" });
          const onboarding = await onboardingRes.json();
          if (onboardingRes.ok) {
            const required = Boolean(onboarding?.config?.required ?? true);
            const blockInternal = Boolean(onboarding?.config?.blockInternal ?? false);
            const completed = Boolean(onboarding?.onboarding?.completed);
            setBlockedByOnboarding(required && blockInternal && !completed);
          }
        }

      })
      .catch(() => {
        router.replace("/studio");
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  const draftKey = useMemo(() => `${DRAFT_KEY_PREFIX}:${email || "editor"}`, [email]);

  useEffect(() => {
    if (!authenticated) return;
    if (selectedSlug || startFresh) {
      setForm(EMPTY_FORM);
      setEditingSlug(null);
      localStorage.removeItem(draftKey);
      return;
    }

    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved) as FormState;
        if (parsed.title || parsed.content || parsed.excerpt) setForm(parsed);
      }
    } catch {
      // ignore malformed drafts
    }
  }, [authenticated, draftKey, selectedSlug, startFresh]);

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


  function insertLink() {
    const text = window.prompt("Texto del enlace", "Ver más");
    const url = window.prompt("URL del enlace", "https://");
    if (!text || !url) return;
    const snippet = `\n\n[${text}](${url})\n\n`;
    setForm((prev) => ({ ...prev, content: `${prev.content}${snippet}` }));
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

      setLastUploadedUrl(String(data.url || ""));
      setMessage(mode === "cover" ? `Portada subida a Storage: ${data.url}` : `Imagen subida a Storage e insertada: ${data.url}`);
      await Promise.all([fetchRepoTree(true), fetchStorageTree(true)]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al subir imagen");
    } finally {
      setLoading(false);
    }
  }


  async function fetchRepoTree(force = false) {
    if (!force && repoTree.length) return;

    setRepoTreeLoading(true);
    setRepoTreeError("");
    try {
      const res = await fetch("/api/admin/upload?tree=1", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo leer el directorio");
      setRepoTree(data.tree || []);
    } catch (error) {
      setRepoTreeError(error instanceof Error ? error.message : "No se pudo leer el directorio");
    } finally {
      setRepoTreeLoading(false);
    }
  }

  async function fetchStorageTree(force = false) {
    if (!force && storageTree.length) return;

    setStorageTreeLoading(true);
    setStorageTreeError("");
    try {
      const res = await fetch("/api/admin/upload?storageTree=1", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo leer Storage");
      setStorageTree(data.tree || []);
    } catch (error) {
      setStorageTreeError(error instanceof Error ? error.message : "No se pudo leer Storage");
    } finally {
      setStorageTreeLoading(false);
    }
  }

  async function openRepoPicker(mode: "cover" | "inline", source: "repo" | "storage" = "repo") {
    setRepoPickerMode(mode);
    setPickerSource(source);
    if (source === "repo") await fetchRepoTree();
    else await fetchStorageTree();
  }

  function selectRepoImage(path: string) {
    if (repoPickerMode === "cover") {
      setForm((prev) => ({ ...prev, coverImage: path }));
      setMessage(`Portada seleccionada: ${path}`);
    } else if (repoPickerMode === "inline") {
      const filename = path.split("/").pop() || "Imagen";
      const alt = filename.replace(/\.[a-z0-9]+$/i, "").replace(/[\-_]+/g, " ");
      setForm((prev) => ({ ...prev, content: `${prev.content}

![${alt}](${path})

` }));
      setMessage(`Imagen insertada: ${path}`);
    }
    setRepoPickerMode(null);
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

  async function savePost(endpoint: string, method: "POST" | "PATCH", payload: Record<string, unknown>) {
    const res = await fetch(endpoint, {
      method,
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { res, data };
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
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
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
      let { res, data } = await savePost(endpoint, method, payload);

      if (!res.ok && method === "PATCH" && payload.slug && payload.slug !== editingSlug && (res.status === 400 || res.status === 404)) {
        const retryEndpoint = `/api/admin/blog/${encodeURIComponent(String(payload.slug))}`;
        ({ res, data } = await savePost(retryEndpoint, "PATCH", payload));
      }

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

  if (blockedByOnboarding) {
    return (
      <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-2xl font-semibold text-amber-900">Bloqueado hasta completar onboarding</h1>
          <p className="mt-2 text-sm text-amber-900">Para acceder a este módulo interno primero debes completar Studio Onboarding.</p>
          <div className="mt-4 flex gap-2">
            <Link href="/studio/onboarding" className="rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white">Ir a onboarding</Link>
            <Link href="/studio/canal-confidencial" className="rounded-lg border border-amber-400 px-4 py-2 text-sm text-amber-900">Canal confidencial</Link>
          </div>
        </section>
      </main>
    );
  }

  if (checkingAuth) {
    return (
      <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10 text-sm text-slate-600">
        <BrandLoader message="Cargando editor de contenidos..." />
      </main>
    );
  }

  return (
    <main className="studio-shell min-h-screen bg-tho-bg px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-tho-title text-4xl text-slate-950 sm:text-5xl">Asistente de Redacción</h1>
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
                <button type="button" onClick={() => openRepoPicker("inline", "repo")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Imagen repo</button>
                <button type="button" onClick={() => openRepoPicker("inline", "storage")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Imagen storage</button>
                <label htmlFor="inline-upload-input" className="cursor-pointer rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Imagen subir</label>
                <button type="button" onClick={() => insertTemplate("youtube")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">YouTube</button>
                <button type="button" onClick={() => insertTemplate("pdf")} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">PDF</button>
                <button type="button" onClick={insertLink} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Link</button>
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, content: `${prev.content}**texto en negrita**` }))} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Negrita</button>
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, content: `${prev.content}*texto en cursiva*` }))} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs">Cursiva</button>
              </div>

              <input id="cover-upload-input" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onUploadCover} />
              <input id="inline-upload-input" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onUploadInline} />

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

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-700">Imagen principal (cabecera/tarjeta)</div>
                  <p className="mt-1 text-xs text-slate-500">Elige una del repo o súbela desde tu computador.</p>
                  <p className="mt-1 text-[11px] text-slate-500">La subida envía la imagen a Supabase Storage y retorna una URL pública lista para usar en el post. No se guarda en <code>/public</code> ni hace commit al repositorio Git.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => openRepoPicker("cover", "repo")} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs">Usar imagen del repo</button>
                    <button type="button" onClick={() => openRepoPicker("cover", "storage")} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs">Usar imagen de Storage</button>
                    <label htmlFor="cover-upload-input" className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs">Examinar...</label>
                  </div>
                  {form.coverImage ? <p className="mt-2 text-xs text-slate-600">Actual: {form.coverImage}</p> : null}
                  {lastUploadedUrl ? (
                    <p className="mt-1 text-xs text-emerald-700">
                      Última URL subida: <a className="underline" href={lastUploadedUrl} target="_blank" rel="noreferrer">{lastUploadedUrl}</a>
                    </p>
                  ) : null}
                </div>
                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Texto alternativo de portada" value={form.coverImageAlt} onChange={(e) => setForm({ ...form, coverImageAlt: e.target.value })} />

                <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Tags (separados por coma)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                <label className="text-xs text-slate-600">Fecha de publicación
                  <input type="datetime-local" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
                </label>
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

      {repoPickerMode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Seleccionar imagen</h3>
                <p className="text-xs text-slate-500">Elige desde repo/public o desde Supabase Storage.</p>
              </div>
              <button type="button" className="rounded-md border border-slate-300 px-3 py-1 text-xs" onClick={() => setRepoPickerMode(null)}>Cerrar</button>
            </div>

            <div className="mt-3 flex gap-2">
              <button type="button" className={`rounded-md border px-3 py-1 text-xs ${pickerSource === "repo" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"}`} onClick={() => { setPickerSource("repo"); void fetchRepoTree(); }}>Repo/public</button>
              <button type="button" className={`rounded-md border px-3 py-1 text-xs ${pickerSource === "storage" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"}`} onClick={() => { setPickerSource("storage"); void fetchStorageTree(); }}>Supabase Storage</button>
            </div>

            <div className="mt-3 max-h-[60vh] overflow-auto rounded-lg border border-slate-200 p-3">
              {pickerSource === "repo" ? (
                <>
                  {repoTreeLoading ? <p className="text-sm text-slate-500">Cargando directorio...</p> : null}
                  {repoTreeError ? <p className="text-sm text-rose-700">{repoTreeError}</p> : null}
                  {!repoTreeLoading && !repoTreeError && !repoTree.length ? (
                    <p className="text-sm text-slate-500">No se encontraron imágenes en /public.</p>
                  ) : null}
                  {!repoTreeLoading && !repoTreeError && repoTree.length ? renderRepoTree(repoTree, selectRepoImage) : null}
                </>
              ) : (
                <>
                  {storageTreeLoading ? <p className="text-sm text-slate-500">Cargando Storage...</p> : null}
                  {storageTreeError ? <p className="text-sm text-rose-700">{storageTreeError}</p> : null}
                  {!storageTreeLoading && !storageTreeError && !storageTree.length ? (
                    <p className="text-sm text-slate-500">No se encontraron imágenes en Supabase Storage (prefijo blog).</p>
                  ) : null}
                  {!storageTreeLoading && !storageTreeError && storageTree.length ? renderRepoTree(storageTree, selectRepoImage) : null}
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
