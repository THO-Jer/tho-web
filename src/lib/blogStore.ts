import { promises as fs } from "node:fs";
import path from "node:path";

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

type BlogPostInput = Omit<BlogPost, "updatedAt"> & { updatedAt?: string };

type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  minutes: number;
  tags: string[] | null;
  category: string | null;
  status: BlogStatus;
  published_at: string | null;
  updated_at: string;
  cover_image: string | null;
  cover_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

const BLOG_PATH = path.join(process.cwd(), "data", "blog", "posts.json");
const BLOG_TABLE = process.env.BLOG_POSTS_TABLE || "blog_posts";

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_SUPABASE_PUBLIC_URL || "")
    .trim()
    .replace(/^ttps:\/\//, "https://")
    .replace(/\/$/, "");
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || "").trim();
  return { url, service };
}

function hasSupabaseStore() {
  const { url, service } = getSupabaseEnv();
  return Boolean(url && service);
}

function isMissingSupabaseTableError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return error.message.includes("PGRST205") || error.message.includes("Could not find the table");
}

async function supabaseRequest(pathname: string, init?: RequestInit) {
  const { url, service } = getSupabaseEnv();
  if (!url || !service) throw new Error("Supabase store no configurado");

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

function rowToPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
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

async function ensureStore() {
  await fs.mkdir(path.dirname(BLOG_PATH), { recursive: true });
  try {
    await fs.access(BLOG_PATH);
  } catch {
    await fs.writeFile(BLOG_PATH, "[]", "utf8");
  }
}

async function readFileStore(): Promise<BlogPost[]> {
  await ensureStore();
  const raw = await fs.readFile(BLOG_PATH, "utf8");
  const parsed = JSON.parse(raw) as BlogPost[];
  return parsed.sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}

async function writeFileStore(posts: BlogPost[]) {
  await ensureStore();
  await fs.writeFile(BLOG_PATH, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
}

function ensureUniqueSlug(baseSlug: string, posts: BlogPost[]) {
  let candidate = baseSlug;
  let counter = 2;
  const existing = new Set(posts.map((post) => post.slug));
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

export async function listAllPosts() {
  if (hasSupabaseStore()) {
    try {
      const query = new URLSearchParams({
        select: "slug,title,excerpt,content,minutes,tags,category,status,published_at,updated_at,cover_image,cover_image_alt,seo_title,seo_description",
        order: "updated_at.desc",
      });
      const rows = (await supabaseRequest(`/rest/v1/${BLOG_TABLE}?${query.toString()}`)) as BlogPostRow[];
      return rows.map(rowToPost);
    } catch (error) {
      if (isMissingSupabaseTableError(error)) {
        return readFileStore();
      }
      throw error;
    }
  }

  return readFileStore();
}

export async function listPublishedPosts() {
  const posts = await listAllPosts();
  return posts.filter((post) => post.status === "published");
}

export async function getPublishedPostBySlug(slug: string) {
  const posts = await listPublishedPosts();
  return posts.find((post) => post.slug === slug);
}

export async function createPost(input: Partial<BlogPostInput>) {
  const posts = await listAllPosts();
  const next = sanitizePostInput(input);
  const uniqueSlug = ensureUniqueSlug(next.slug, posts);
  const created: BlogPost = { ...next, slug: uniqueSlug, updatedAt: new Date().toISOString() };

  if (hasSupabaseStore()) {
    const rows = (await supabaseRequest(`/rest/v1/${BLOG_TABLE}`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(postToRowInput(created)),
    })) as BlogPostRow[];
    return rowToPost(rows[0]);
  }

  await writeFileStore([created, ...posts]);
  return created;
}

export async function updatePost(slug: string, input: Partial<BlogPostInput>) {
  const posts = await listAllPosts();
  const normalizedParamSlug = normalizeSlug(slug);
  const normalizedInputSlug = typeof input.slug === "string" ? normalizeSlug(input.slug) : "";

  let index = posts.findIndex((post) => post.slug === normalizedParamSlug);
  if (index === -1 && normalizedInputSlug) {
    index = posts.findIndex((post) => post.slug === normalizedInputSlug);
  }
  if (index === -1) throw new Error("Post no encontrado.");

  const current = posts[index];
  const merged = sanitizePostInput({
    ...current,
    ...input,
    title: input.title?.trim() ? input.title : current.title,
    excerpt: input.excerpt?.trim() ? input.excerpt : current.excerpt,
    content: input.content?.trim() ? input.content : current.content,
    slug: input.slug?.trim() ? input.slug : current.slug,
  });

  if (merged.slug !== current.slug && posts.some((post, i) => i !== index && post.slug === merged.slug)) {
    throw new Error("Ya existe otro post con ese slug.");
  }

  const updated: BlogPost = { ...merged, updatedAt: new Date().toISOString() };

  if (hasSupabaseStore()) {
    const query = new URLSearchParams({
      slug: `eq.${current.slug}`,
      select: "slug,title,excerpt,content,minutes,tags,category,status,published_at,updated_at,cover_image,cover_image_alt,seo_title,seo_description",
    });
    const rows = (await supabaseRequest(`/rest/v1/${BLOG_TABLE}?${query.toString()}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(postToRowInput(updated)),
    })) as BlogPostRow[];
    if (!rows.length) throw new Error("Post no encontrado.");
    return rowToPost(rows[0]);
  }

  const clone = [...posts];
  clone[index] = updated;
  await writeFileStore(clone);
  return updated;
}

export async function deletePost(slug: string) {
  const posts = await listAllPosts();
  const target = posts.find((post) => post.slug === slug);
  if (!target) throw new Error("Post no encontrado.");

  if (hasSupabaseStore()) {
    const query = new URLSearchParams({ slug: `eq.${target.slug}` });
    await supabaseRequest(`/rest/v1/${BLOG_TABLE}?${query.toString()}`, { method: "DELETE" });
    return;
  }

  const filtered = posts.filter((post) => post.slug !== slug);
  await writeFileStore(filtered);
}
