"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function BrandLoader(props?: { message?: string }) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 96) return value;
        return Math.min(96, value + Math.floor(Math.random() * 9 + 2));
      });
    }, 180);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-[42vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="relative h-16 w-44">
        <Image src="/brand/logo-negro.png" alt="The Human Org" fill className="object-contain logo-light" priority />
        <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain logo-dark" priority />
      </div>

      <div className="w-full max-w-xs">
        <div className="h-2 overflow-hidden rounded-full bg-slate-300/50 dark:bg-slate-700/60">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--tho-blue),var(--tho-pink),var(--tho-orange),var(--tho-green))] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">Cargando {progress}%</p>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">{props?.message || "Preparando experiencia THO..."}</p>
    </div>
  );
}
