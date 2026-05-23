"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

const logos = [
  { src: "/confian/1.svg", alt: "Organización cliente 1" },
  { src: "/confian/2.svg", alt: "Organización cliente 2" },
  { src: "/confian/3.svg", alt: "Organización cliente 3" },
  { src: "/confian/4.svg", alt: "Organización cliente 4" },
  { src: "/confian/5.svg", alt: "Organización cliente 5" },
  { src: "/confian/6.svg", alt: "Organización cliente 6" },
  { src: "/confian/7.svg", alt: "Organización cliente 7" },
  { src: "/confian/8.svg", alt: "Organización cliente 8" },
  { src: "/confian/9.svg", alt: "Organización cliente 9" },
];

const SCROLL_SPEED = 0.5; // px per frame

export function TrustSlider() {
  // Duplicate logos for seamless infinite loop
  const items = [...logos, ...logos];

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const step = () => {
      if (!drag.current.active) {
        container.scrollLeft += SCROLL_SPEED;
        // Seamless loop: when we've scrolled one full set, jump back
        const half = container.scrollWidth / 2;
        if (container.scrollLeft >= half) {
          container.scrollLeft -= half;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    drag.current = { active: true, startX: e.clientX, startScroll: container.scrollLeft };
    container.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const container = containerRef.current;
    if (!container) return;

    const delta = e.clientX - drag.current.startX;
    let next = drag.current.startScroll - delta;

    // Keep within the loopable range
    const half = container.scrollWidth / 2;
    next = ((next % half) + half) % half;
    container.scrollLeft = next;
  };

  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      className="trust-slider py-5"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="trust-track flex w-max items-center gap-2 px-3 md:gap-3 md:px-4">
        {items.map((logo, idx) => (
          <div
            key={`${logo.src}-${idx}`}
            className="trust-logo-slot relative h-[74px] w-[190px] shrink-0 md:h-[84px] md:w-[220px]"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              className="trust-logo-card object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
