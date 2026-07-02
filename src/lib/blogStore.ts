export type BlogStatus = "draft" | "published";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  minutes: number;
  tags: string[];
  category?: string;
  status: BlogStatus;
  publishedAt: string | null;
  updatedAt: string;
  coverImage?: string;
  coverImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

// Versión liviana para listados: todo menos `content`.
export type BlogPostMeta = Omit<BlogPost, "content">;

type BlogPostInput = Omit<BlogPost, "updatedAt"> & { updatedAt?: string };

type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  minutes: number;
  tags: string[] | null;
  category?: string | null;
  status: BlogStatus;
  published_at: string | null;
  updated_at: string;
  cover_image: string | null;
  cover_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

const BLOG_TABLE = process.env.BLOG_POSTS_TABLE || "blog_posts";

const META_COLUMNS = [
  "slug",
  "title",
  "excerpt",
  "minutes",
  "tags",
  "category",
  "status",
  "published_at",
  "updated_at",
  "cover_image",
  "cover_image_alt",
  "seo_title",
  "seo_description",
];

const ALL_COLUMNS = [...META_COLUMNS, "content"];

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_SUPABASE_PUBLIC_URL || "")
    .trim()
    .replace(/^ttps:\/\//, "https://")
    .replace(/\/$/, "");
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, service };
}

function requireSupabaseEnv() {
  const { url, service } = getSupabaseEnv();
  if (!url || !service) {
    throw new Error(
      "blogStore: Supabase no configurado. Define NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para leer/escribir posts.",
    );
  }
  return { url, service };
}

function getMissingSupabaseColumn(error: unknown) {
  if (!(error instanceof Error)) return null;
  const pgMatch = error.message.match(/column\s+[^.]+\.([a-zA-Z0-9_]+)\s+does not exist/i);
  if (pgMatch?.[1]) return pgMatch[1];

  const postgrestMatch = error.message.match(/Could not find the ['"]([a-zA-Z0-9_]+)['"] column/i);
  if (postgrestMatch?.[1]) return postgrestMatch[1];

  return null;
}

async function supabaseRequest(pathname: string, init?: RequestInit) {
  const { url, service } = requireSupabaseEnv();

  const res = await fetch(`${url}${pathname}`, {
    ...init,
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase blog store error (${res.status}): ${body}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Select helper ───────────────────────────────────────────────────────────
// Consulta con filtros PostgREST y reintenta sin `category` si la columna no
// existe todavía (tablas legacy sin migrar).
async function selectRows(
  filters: Record<string, string>,
  columns: string[],
  order?: string,
): Promise<BlogPostRow[]> {
  const buildPath = (cols: string[]) => {
    const query = new URLSearchParams({ select: cols.join(","), ...(order ? { order } : {}), ...filters });
    return `/rest/v1/${BLOG_TABLE}?${query.toString()}`;
  };

  try {
    return ((await supabaseRequest(buildPath(columns))) || []) as BlogPostRow[];
  } catch (error) {
    if (getMissingSupabaseColumn(error) === "category" && columns.includes("category")) {
      const rows = ((await supabaseRequest(buildPath(columns.filter((col) => col !== "category")))) || []) as BlogPostRow[];
      return rows.map((row) => ({ ...row, category: null }));
    }
    throw error;
  }
}

// Escritura (POST/PATCH) con el mismo reintento sin `category`.
async function writeRows(
  pathname: string,
  method: "POST" | "PATCH",
  payload: Record<string, unknown>,
): Promise<BlogPostRow[]> {
  const doRequest = (body: Record<string, unknown>) =>
    supabaseRequest(pathname, {
      method,
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(body),
    }) as Promise<BlogPostRow[]>;

  try {
    return await doRequest(payload);
  } catch (error) {
    if (getMissingSupabaseColumn(error) === "category" && "category" in payload) {
      const { category: _omit, ...rest } = payload;
      void _omit;
      const rows = await doRequest(rest);
      return rows.map((row) => ({ ...row, category: null }));
    }
    throw error;
  }
}

function rowToPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content ?? "",
    minutes: row.minutes,
    tags: row.tags || [],
    category: row.category || undefined,
    status: row.status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    coverImage: row.cover_image || undefined,
    coverImageAlt: row.cover_image_alt || undefined,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
  };
}

function rowToMeta(row: BlogPostRow): BlogPostMeta {
  const { content: _content, ...meta } = rowToPost(row);
  void _content;
  return meta;
}

function toChronologicalTime(post: { publishedAt: string | null; updatedAt: string }) {
  const primary = post.publishedAt ? new Date(post.publishedAt).getTime() : Number.NaN;
  if (!Number.isNaN(primary)) return primary;
  const fallback = post.updatedAt ? new Date(post.updatedAt).getTime() : 0;
  return Number.isNaN(fallback) ? 0 : fallback;
}

function sortPostsByEditorialDate<T extends { publishedAt: string | null; updatedAt: string }>(posts: T[]) {
  return [...posts].sort((a, b) => toChronologicalTime(b) - toChronologicalTime(a));
}

function postToRowInput(post: BlogPost) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    minutes: post.minutes,
    tags: post.tags,
    category: post.category ?? null,
    status: post.status,
    published_at: post.publishedAt,
    updated_at: post.updatedAt,
    cover_image: post.coverImage ?? null,
    cover_image_alt: post.coverImageAlt ?? null,
    seo_title: post.seoTitle ?? null,
    seo_description: post.seoDescription ?? null,
  };
}

function ensureUniqueSlug(baseSlug: string, existingSlugs: Iterable<string>) {
  let candidate = baseSlug;
  let counter = 2;
  const existing = new Set(existingSlugs);
  while (existing.has(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return candidate;
}

function normalizeSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function listSlugs(): Promise<string[]> {
  const rows = await selectRows({}, ["slug"]);
  return rows.map((row) => row.slug);
}

export function sanitizePostInput(input: Partial<BlogPostInput>) {
  const title = (input.title ?? "").trim();
  const slug = normalizeSlug(input.slug || title);
  const excerpt = (input.excerpt ?? "").trim();
  const content = (input.content ?? "").trim();
  const minutes = Number(input.minutes ?? 5);
  const tags = Array.isArray(input.tags) ? input.tags.map((t) => t.trim()).filter(Boolean) : [];
  const category = (input.category ?? "").trim();
  const status: BlogStatus = input.status === "draft" ? "draft" : "published";
  const publishedAt = status === "published" ? input.publishedAt ?? new Date().toISOString() : null;

  if (!title || !slug || !excerpt || !content) {
    throw new Error("Campos obligatorios faltantes: title, slug, excerpt, content.");
  }

  return {
    slug,
    title,
    excerpt,
    content,
    minutes: Number.isFinite(minutes) && minutes > 0 ? minutes : 5,
    tags,
    category: category || undefined,
    status,
    publishedAt,
    coverImage: input.coverImage?.trim() || undefined,
    coverImageAlt: input.coverImageAlt?.trim() || undefined,
    seoTitle: input.seoTitle?.trim() || undefined,
    seoDescription: input.seoDescription?.trim() || undefined,
  };
}

// ── Lecturas ────────────────────────────────────────────────────────────────

// Listado liviano para paneles de administración (sin `content`).
export async function listPostsMeta(): Promise<BlogPostMeta[]> {
  const rows = await selectRows({}, META_COLUMNS, "updated_at.desc");
  return sortPostsByEditorialDate(rows.map(rowToMeta));
}

// Listado liviano de publicados para el sitio público (sin `content`).
export async function listPublishedPosts(): Promise<BlogPostMeta[]> {
  const rows = await selectRows({ status: "eq.published" }, META_COLUMNS, "updated_at.desc");
  return sortPostsByEditorialDate(rows.map(rowToMeta));
}

// Post completo por slug, cualquier estado (uso administrativo).
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const rows = await selectRows({ slug: `eq.${normalizeSlug(slug)}` }, ALL_COLUMNS);
  return rows.length ? rowToPost(rows[0]) : undefined;
}

// Post completo publicado por slug (sitio público).
export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const rows = await selectRows({ slug: `eq.${normalizeSlug(slug)}`, status: "eq.published" }, ALL_COLUMNS);
  return rows.length ? rowToPost(rows[0]) : undefined;
}

// ── Escrituras ──────────────────────────────────────────────────────────────

export async function createPost(input: Partial<BlogPostInput>) {
  const next = sanitizePostInput(input);
  const uniqueSlug = ensureUniqueSlug(next.slug, await listSlugs());
  const created: BlogPost = { ...next, slug: uniqueSlug, updatedAt: new Date().toISOString() };

  const rows = await writeRows(`/rest/v1/${BLOG_TABLE}`, "POST", postToRowInput(created));
  return rowToPost(rows[0]);
}

export async function updatePost(slug: string, input: Partial<BlogPostInput>) {
  const normalizedParamSlug = normalizeSlug(slug);
  const normalizedInputSlug = typeof input.slug === "string" ? normalizeSlug(input.slug) : "";

  let current = await getPostBySlug(normalizedParamSlug);
  if (!current && normalizedInputSlug && normalizedInputSlug !== normalizedParamSlug) {
    current = await getPostBySlug(normalizedInputSlug);
  }
  if (!current) throw new Error("Post no encontrado.");

  const merged = sanitizePostInput({
    ...current,
    ...input,
    title: input.title?.trim() ? input.title : current.title,
    excerpt: input.excerpt?.trim() ? input.excerpt : current.excerpt,
    content: input.content?.trim() ? input.content : current.content,
    slug: input.slug?.trim() ? input.slug : current.slug,
  });

  if (merged.slug !== current.slug) {
    const clash = await selectRows({ slug: `eq.${merged.slug}` }, ["slug"]);
    if (clash.length) throw new Error("Ya existe otro post con ese slug.");
  }

  const updated: BlogPost = { ...merged, updatedAt: new Date().toISOString() };

  const query = new URLSearchParams({ slug: `eq.${current.slug}` });
  const rows = await writeRows(`/rest/v1/${BLOG_TABLE}?${query.toString()}`, "PATCH", postToRowInput(updated));
  if (!rows.length) throw new Error("Post no encontrado.");
  return rowToPost(rows[0]);
}

export async function deletePost(slug: string) {
  const target = await getPostBySlug(slug);
  if (!target) throw new Error("Post no encontrado.");

  const query = new URLSearchParams({ slug: `eq.${target.slug}` });
  await supabaseRequest(`/rest/v1/${BLOG_TABLE}?${query.toString()}`, { method: "DELETE" });
}
