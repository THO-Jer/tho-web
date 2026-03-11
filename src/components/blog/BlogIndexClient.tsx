"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type MouseEvent } from "react";

import type { BlogPost } from "@/lib/blogStore";

type BlogMonthYearOption = {
  value: string;
  label: string;
  year: string;
  month: string;
};

export function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const monthYearOptions = useMemo(() => {
    const map = new Map<string, BlogMonthYearOption>();
    for (const post of posts) {
      const date = new Date(post.publishedAt || post.updatedAt || 0);
      if (Number.isNaN(date.getTime())) continue;
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;
      if (!map.has(value)) {
        map.set(value, {
          value,
          year,
          month,
          label: date.toLocaleDateString("es-CL", { month: "long", year: "numeric" }),
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => (a.value < b.value ? 1 : -1));
  }, [posts]);

  const years = useMemo(() => {
    return Array.from(new Set(monthYearOptions.map((item) => item.year))).sort((a, b) => Number(b) - Number(a));
  }, [monthYearOptions]);

  const monthsForSelectedYear = useMemo(() => {
    if (!selectedYear) return [];
    return monthYearOptions
      .filter((item) => item.year === selectedYear)
      .map((item) => ({ value: item.month, label: item.label }));
  }, [monthYearOptions, selectedYear]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .filter((post) => {
        const byTag = !selectedTag || post.tags.some((tag) => tag.toLowerCase() === selectedTag);
        if (!byTag) return false;

        const date = new Date(post.publishedAt || post.updatedAt || 0);
        if (selectedYear && String(date.getFullYear()) !== selectedYear) return false;
        if (selectedMonth && String(date.getMonth() + 1).padStart(2, "0") !== selectedMonth) return false;

        if (!q) return true;
        return `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const aTime = new Date(a.publishedAt || a.updatedAt || 0).getTime();
        const bTime = new Date(b.publishedAt || b.updatedAt || 0).getTime();
        return bTime - aTime;
      });
  }, [posts, query, selectedTag, selectedYear, selectedMonth]);

  const clearFilters = () => {
    setQuery("");
    setSelectedTag("");
    setSelectedYear("");
    setSelectedMonth("");
  };

  const onTagClick = (event: MouseEvent<HTMLButtonElement>, tag: string) => {
    event.preventDefault();
    event.stopPropagation();
    const key = tag.toLowerCase();
    setSelectedTag((current) => (current === key ? "" : key));
  };

  return (
    <>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título o tag"
          className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />

        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSelectedMonth("");
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="">Año</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          disabled={!selectedYear}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900"
        >
          <option value="">Mes</option>
          {monthsForSelectedYear.map((month) => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>

        {(query || selectedTag || selectedYear || selectedMonth) ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {selectedTag ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Filtrando por tag: <span className="font-semibold text-slate-900 dark:text-slate-100">#{selectedTag}</span></p>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            {post.coverImage ? (
              <div className="relative aspect-[16/9] w-full">
                <Image src={post.coverImage} alt={post.coverImageAlt || post.title} fill className="object-cover" />
              </div>
            ) : null}
            <div className="p-4 md:p-5">
              <div className="text-xs text-slate-500 dark:text-slate-400">{post.minutes} min</div>
              <div className="mt-1.5 text-base font-semibold text-slate-900 md:text-lg dark:text-slate-100">{post.title}</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
              {post.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 4).map((tag) => {
                    const isActive = selectedTag === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={(event) => onTagClick(event, tag)}
                        className={`rounded-full px-2.5 py-1 text-xs transition ${isActive ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"}`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                  {post.tags.length > 4 ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-100">y más</span>
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
