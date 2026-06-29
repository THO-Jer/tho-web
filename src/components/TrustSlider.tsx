"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

const logos = [
  { src: "/confian/1.svg",  alt: "Barbería Club34",                   href: "https://instagram.com/club34barberia" },
  { src: "/confian/2.svg",  alt: "INDAMA S.A.",                       href: "https://indama.cl" },
  { src: "/confian/3.svg",  alt: "Conce Con Todos",                   href: "https://instagram.com/concecontodos" },
  { src: "/confian/4.svg",  alt: "Cámara Chilena de la Construcción", href: "https://conceconstruye.cl" },
  { src: "/confian/5.svg",  alt: "Círculo de Mujeres CChC" },
  { src: "/confian/6.svg",  alt: "Credyhogar",                        href: "https://instagram.com/credyhogar" },
  { src: "/confian/7.svg",  alt: "Vanrom",                            href: "https://instagram.com/empresas_vanrom" },
  { src: "/confian/8.svg",  alt: "IAP2 Latinoamérica",                href: "https://iap2latinoamerica.org" },
  { src: "/confian/9.svg",  alt: "Melissa Valenzuela Contadora" },
  { src: "/confian/10.svg", alt: "PaleoAndes",                        href: "https://paleoandes.cl" },
];

const SPEED = 0.5; // px per frame

export function TrustSlider() {
  // Duplicate logos for seamless infinite loop
  const items = [...logos, ...logos];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);        // current translateX in px (≤ 0)
  const halfWidthRef = useRef(0);
  const drag = useRef({ active: false, startX: 0, startOffset: 0, moved: false });
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
    drag.current = { active: true, startX: e.clientX, startOffset: offsetRef.current, moved: false };
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    if (Math.abs(e.clientX - drag.current.startX) > 4) drag.current.moved = true;
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
        className="trust-track flex w-max items-center gap-1 px-2 md:gap-2 md:px-3"
      >
        {items.map((logo, idx) => {
          const slot = (
            <div
              key={`${logo.src}-${idx}`}
              className="trust-logo-slot relative h-[58px] w-[150px] shrink-0 md:h-[68px] md:w-[175px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="trust-logo-card object-contain"
                draggable={false}
              />
            </div>
          );

          if (!logo.href) return slot;

          return (
            <a
              key={`${logo.src}-${idx}`}
              href={logo.href}
              target="_blank"
              rel="noreferrer"
              aria-label={logo.alt}
              onPointerUp={(e) => {
                // Solo abrir si no fue un drag (mouse/touch).
                // Activación por teclado (Enter/Space) no pasa por onPointerUp,
                // así que el href actúa normalmente en ese caso.
                if (drag.current.moved) e.preventDefault();
              }}
              className="shrink-0"
            >
              <div className="trust-logo-slot relative h-[58px] w-[150px] md:h-[68px] md:w-[175px]">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="trust-logo-card object-contain"
                  draggable={false}
                />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
