"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Statement tipográfico con reveal al scroll.
 * Cada línea pasa de gris tenue a tinta plena (con acento del pilar)
 * a medida que entra al viewport. Respeta prefers-reduced-motion vía CSS.
 */
const LINES: { text: string; accent: string }[] = [
  { text: "Sostenibilidad desintegrada.", accent: "var(--tho-green)" },
  { text: "Comunidad descontenta.", accent: "var(--tho-orange)" },
  { text: "Organización desalineada.", accent: "var(--tho-pink)" },
];

export function ProblemStatement() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h2
      ref={ref}
      className="font-tho-title mt-6 text-[2.45rem] font-normal md:text-[3.7rem] lg:text-[5.2rem]"
    >
      {LINES.map((line, i) => (
        <span
          key={line.text}
          className={`statement-line block ${visible ? "is-visible" : ""}`}
          style={{
            ["--line-accent" as string]: line.accent,
            ["--line-delay" as string]: `${i * 180}ms`,
          }}
        >
          {line.text}
        </span>
      ))}
    </h2>
  );
}
