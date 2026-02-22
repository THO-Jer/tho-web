"use client";

import { useMemo, useState } from "react";

type Item = { id: number; col: number; src: string };

const items: Item[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  col: Math.floor(i / 4),
  src: `/accion/${String(i + 1).padStart(2, "0")}.png`,
}));

export function ActionGallery() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [active, setActive] = useState<Item | null>(null);

  const grouped = useMemo(
    () => [0, 1, 2].map((col) => items.filter((item) => item.col === col)),
    []
  );

  return (
    <div className="tho-action-main relative overflow-hidden rounded-[2rem] p-1 md:p-2">
      <div className="tho-action-fade pointer-events-none absolute inset-0 z-10 rounded-[2rem]" />
      <div className="tho-action-boxes relative mx-auto h-[460px] w-full max-w-[1200px] md:h-[620px]">
        {grouped.map((columnItems, colIdx) => {
          const duration = [40, 35, 26][colIdx];
          const direction = colIdx === 0 ? "tho-drift-down" : "tho-drift-up";

          return (
            <div
              key={colIdx}
              className="tho-action-col absolute top-0 h-full w-[33.33%]"
              style={{ left: `${colIdx * 33.33}%` }}
            >
              {columnItems.map((item, idx) => {
                const isHovered = hoveredId === item.id;
                const dimmed = hoveredId !== null && !isHovered;
                const paused = hoveredCol === colIdx;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onMouseEnter={() => {
                      setHoveredCol(colIdx);
                      setHoveredId(item.id);
                    }}
                    onMouseLeave={() => {
                      setHoveredCol(null);
                      setHoveredId(null);
                    }}
                    onClick={() => setActive(item)}
                    className={`tho-photo-box ${direction} ${paused ? "paused" : ""} ${dimmed ? "opacity-35" : ""} ${isHovered ? "is-hovered" : ""}`}
                    style={{
                      backgroundImage: `url(${item.src})`,
                      animationDuration: `${duration}s`,
                      animationDelay: `${(idx / 4) * -duration}s`,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {active ? (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/75 p-4">
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/40 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white"
          >
            Cerrar
          </button>
          <div
            className="h-full w-full max-w-5xl rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${active.src})` }}
          />
        </div>
      ) : null}
    </div>
  );
}
