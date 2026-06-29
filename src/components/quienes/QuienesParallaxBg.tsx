"use client";

import { useEffect, useState } from "react";

const BACKGROUND_IMAGES = [
  "/ilustraciones/2.png",
  "/ilustraciones/5.png",
  "/ilustraciones/8.png",
  "/ilustraciones/10.png",
] as const;

export function QuienesParallaxBg() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      {BACKGROUND_IMAGES.map((imagePath, idx) => (
        <figure
          key={imagePath}
          className={`quienes-bg-image quienes-bg-image-${idx + 1}`}
          style={{ transform: `translate3d(0, ${scrollY * (0.03 + idx * 0.012)}px, 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePath} alt="" className="h-full w-full object-cover" />
        </figure>
      ))}
    </div>
  );
}
