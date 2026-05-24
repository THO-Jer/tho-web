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

const SPEED = 0.5; // px per frame

export function TrustSlider() {
  // Duplicate logos for seamless infinite loop
  const items = [...logos, ...logos];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);        // current translateX in px (≤ 0)
  const halfWidthRef = useRef(0);
  const drag = useRef({ active: false, startX: 0, startOffset: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait one frame so the DOM has rendered and scrollWidth is accurate
    const init = () => {
      halfWidthRef.current = track.scrollWidth / 2;

      const step = () => {
        if (!drag.current.active) {
          offsetRef.current -= SPEED;
          // Seamless loop: once we've shifted one full set, jump back
          if (offsetRef.current <= -halfWidthRef.current) {
            offsetRef.current += halfWidthRef.current;
          }
          track.style.transform = `translateX(${offsetRef.current}px)`;
        }
        rafRef.current = requestAnimationFrame(step);
      };

      rafRef.current = requestAnimationFrame(step);
    };

    const timer = setTimeout(init, 50);
    return () => {
      clearTimeout(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    drag.current = { active: true, startX: e.clientX, startOffset: offsetRef.current };
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;

    const delta = e.clientX - drag.current.startX;
    let next = drag.current.startOffset + delta;

    // Wrap to keep offset in (-halfWidth, 0]
    const half = halfWidthRef.current;
    if (half > 0) {
      next = next % half;
      if (next > 0) next -= half;
    }

    offsetRef.current = next;
    track.style.transform = `translateX(${next}px)`;
  };

  const stopDrag = () => { drag.current.active = false; };

  return (
    <div
      ref={containerRef}
      className="trust-slider overflow-hidden py-5"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
      onPointerCancel={stopDrag}
    >
      <div
        ref={trackRef}
        className="trust-track flex w-max items-center gap-2 px-3 md:gap-3 md:px-4"
      >
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
