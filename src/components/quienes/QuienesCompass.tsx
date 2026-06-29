"use client";

import { useEffect, useState } from "react";

export function QuienesCompass() {
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brujula.svg"
      alt=""
      aria-hidden
      className="quienes-compass-bg pointer-events-none absolute right-[2%] top-[68%] z-0 hidden md:block"
      style={{ transform: `translate3d(0, ${scrollY * 0.03}px, 0)` }}
    />
  );
}
