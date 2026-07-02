"use client";

import { useEffect } from "react";

/** Observa todos los elementos [data-reveal] del documento y les agrega
 *  la clase `is-visible` al entrar al viewport. No renderiza nada visible. */
export function RevealObserver() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
