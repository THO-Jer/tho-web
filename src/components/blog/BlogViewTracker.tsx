"use client";

import { useEffect } from "react";

import { claimDailyView, markBlogRead } from "@/lib/blogReadTracking";

// Cuenta una lectura cuando la entrada estuvo visible al menos 5 segundos
// (descarta rebotes y aperturas accidentales). Una por navegador y día.
const MIN_VISIBLE_MS = 5000;

export function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let done = false;

    const fire = () => {
      if (done) return;
      done = true;
      markBlogRead(slug);
      if (!claimDailyView(slug)) return;
      fetch("/api/blog/view", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).catch(() => undefined);
    };

    const start = () => {
      if (done || timer || document.visibilityState !== "visible") return;
      timer = setTimeout(fire, MIN_VISIBLE_MS);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        start();
      } else if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (timer) clearTimeout(timer);
    };
  }, [slug]);

  return null;
}
