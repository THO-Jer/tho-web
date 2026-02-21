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
  status: BlogStatus;
  publishedAt: string | null;
  updatedAt: string;
  coverImage?: string;
  coverImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type BlogPostInput = Omit<BlogPost, "updatedAt"> & { updatedAt?: string };

const BLOG_PATH = path.join(process.cwd(), "data", "blog", "posts.json");

async function ensureStore() {
  await fs.mkdir(path.dirname(BLOG_PATH), { recursive: true });
  try {
    await fs.access(BLOG_PATH);
  } catch {
    await fs.writeFile(BLOG_PATH, "[]", "utf8");
  }
}

async function readStore(): Promise<BlogPost[]> {
  await ensureStore();
  const raw = await fs.readFile(BLOG_PATH, "utf8");
  const parsed = JSON.parse(raw) as BlogPost[];
  return parsed.sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}

async function writeStore(posts: BlogPost[]) {
  await ensureStore();
  await fs.writeFile(BLOG_PATH, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
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
  const status: BlogStatus = input.status === "draft" ? "draft" : "published";
  const publishedAt =
    status === "published" ? input.publishedAt ?? new Date().toISOString() : null;

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
    status,
    publishedAt,
    coverImage: input.coverImage?.trim() || undefined,
    coverImageAlt: input.coverImageAlt?.trim() || undefined,
    seoTitle: input.seoTitle?.trim() || undefined,
    seoDescription: input.seoDescription?.trim() || undefined,
  };
}

export async function listAllPosts() {
  return readStore();
}

export async function listPublishedPosts() {
  const posts = await readStore();
  return posts.filter((post) => post.status === "published");
}

export async function getPublishedPostBySlug(slug: string) {
  const posts = await listPublishedPosts();
  return posts.find((post) => post.slug === slug);
}

export async function createPost(input: Partial<BlogPostInput>) {
  const posts = await readStore();
  const next = sanitizePostInput(input);
  if (posts.some((post) => post.slug === next.slug)) {
    throw new Error("Ya existe un post con ese slug.");
  }
  const created: BlogPost = { ...next, updatedAt: new Date().toISOString() };
  await writeStore([created, ...posts]);
  return created;
}

export async function updatePost(slug: string, input: Partial<BlogPostInput>) {
  const posts = await readStore();
  const normalizedParamSlug = normalizeSlug(slug);
  const normalizedInputSlug = typeof input.slug === "string" ? normalizeSlug(input.slug) : "";

  let index = posts.findIndex((post) => post.slug === normalizedParamSlug);

  // Fallback for stale editor state: if URL slug is outdated, try payload slug.
  if (index === -1 && normalizedInputSlug) {
    index = posts.findIndex((post) => post.slug === normalizedInputSlug);
  }

  if (index === -1) throw new Error("Post no encontrado.");

  const current = posts[index];
  const merged = sanitizePostInput({ ...current, ...input });

  if (merged.slug !== slug && posts.some((post, i) => i !== index && post.slug === merged.slug)) {
    throw new Error("Ya existe otro post con ese slug.");
  }

  const updated: BlogPost = { ...merged, updatedAt: new Date().toISOString() };
  const clone = [...posts];
  clone[index] = updated;
  await writeStore(clone);
  return updated;
}

export async function deletePost(slug: string) {
  const posts = await readStore();
  const filtered = posts.filter((post) => post.slug !== slug);
  if (filtered.length === posts.length) {
    throw new Error("Post no encontrado.");
  }
  await writeStore(filtered);
}
