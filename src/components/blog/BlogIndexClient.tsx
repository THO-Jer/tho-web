"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  minutes: number;
  coverImage?: string;
  coverImageAlt?: string;
  tags: string[];
  category?: string;
};

export function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const values = Array.from(new Set(posts.map((post) => post.category).filter(Boolean))) as string[];
    return values.sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const byCategory = category === "all" || post.category === category;
      if (!byCategory) return false;
      if (!q) return true;
      return `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.category || ""}`.toLowerCase().includes(q);
    });
  }, [posts, query, category]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, tema o tag"
          className="min-w-[260px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">Todas las categorías</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            {post.coverImage ? (
              <div className="relative aspect-[16/9] w-full">
                <Image src={post.coverImage} alt={post.coverImageAlt || post.title} fill className="object-cover" />
              </div>
            ) : null}
            <div className="p-6">
              <div className="text-xs text-slate-500">{post.minutes} min</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{post.title}</div>
              <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
              {post.category ? <div className="mt-2 text-xs text-slate-500">Categoría: {post.category}</div> : null}
              {post.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">#{tag}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
