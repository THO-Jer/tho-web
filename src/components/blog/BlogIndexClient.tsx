"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useMemo, useState } from "react";

function normalizeCategory(value?: string) {
  return (value || "").trim().toLowerCase();
}

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  minutes: number;
  publishedAt?: string | null;
  updatedAt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  tags: string[];
  category?: string;
};

export function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [categoryKey, setCategoryKey] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");

  const categories = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number }>();
    for (const post of posts) {
      const key = normalizeCategory(post.category);
      if (!key) continue;
      if (!map.has(key)) {
        map.set(key, { key, label: (post.category || "").trim(), count: 1 });
      } else {
        map.get(key)!.count += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .filter((post) => {
        const byCategory = categoryKey === "all" || normalizeCategory(post.category) === categoryKey;
        if (!byCategory) return false;

        const byTag = !selectedTag || post.tags.some((tag) => tag.toLowerCase() === selectedTag);
        if (!byTag) return false;

        if (!q) return true;
        return `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.category || ""}`.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const aTime = new Date(a.publishedAt || a.updatedAt || 0).getTime();
        const bTime = new Date(b.publishedAt || b.updatedAt || 0).getTime();
        return bTime - aTime;
      });
  }, [posts, query, categoryKey, selectedTag]);

  const clearFilters = () => {
    setQuery("");
    setCategoryKey("all");
    setSelectedTag("");
  };

  const onTagClick = (event: MouseEvent<HTMLButtonElement>, tag: string) => {
    event.preventDefault();
    event.stopPropagation();
    const key = tag.toLowerCase();
    setSelectedTag((current) => (current === key ? "" : key));
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, tema o tag"
          className="min-w-[260px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">Todas las categorías</option>
          {categories.map((item) => (
            <option key={item.key} value={item.key}>{item.label} ({item.count})</option>
          ))}
        </select>
        {(query || categoryKey !== "all" || selectedTag) ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {selectedTag ? (
        <p className="mt-3 text-sm text-slate-600">Filtrando por tag: <span className="font-semibold text-slate-900">#{selectedTag}</span></p>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="p-4 md:p-5">
              <div className="text-xs text-slate-500">{post.minutes} min</div>
              <div className="mt-1.5 text-base font-semibold text-slate-900 md:text-lg">{post.title}</div>
              <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
              {post.category ? <div className="mt-2 text-xs text-slate-500">Categoría: {post.category}</div> : null}
              {post.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 4).map((tag) => {
                    const isActive = selectedTag === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={(event) => onTagClick(event, tag)}
                        className={`rounded-full px-2.5 py-1 text-xs transition ${isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                  {post.tags.length > 4 ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">y más</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
