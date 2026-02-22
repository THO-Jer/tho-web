"use client";

import { useEffect, useMemo, useState } from "react";

type TocItem = { id: string; text: string; level: 2 | 3 };

export function BlogTocClient({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id || "");

  const tocIds = useMemo(() => toc.map((item) => item.id), [toc]);

  useEffect(() => {
    if (!tocIds.length) return;

    const headings = tocIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.3, 0.6],
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [tocIds]);

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Índice</div>
      <ul className="mt-3 space-y-2">
        {toc.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
              <a
                href={`#${item.id}`}
                className={`text-sm transition ${isActive ? "font-bold text-slate-950" : "text-slate-700 hover:text-slate-900"}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
