"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Step = {
  n: string;
  title: string;
  desc: string;
};

// Colores de marca por etapa (mismo orden que el diagrama anterior)
const STEP_COLORS = ["#1d71b8", "#fa7f33", "#d13ca2", "#93bf24"];

/**
 * Scrollytelling vertical del método:
 * - Desktop: panel sticky a la izquierda (número grande + progreso de 4 segmentos),
 *   pasos que se activan al scrollear a la derecha.
 * - Móvil: stepper vertical autocontenido con línea de progreso por etapa.
 */
export default function MethodScrolly({ steps }: { steps: Step[] }) {
  const visibleSteps = steps.slice(0, 4);
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        // Franja central del viewport: el paso que la cruza es el activo
        { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const current = visibleSteps[active] ?? visibleSteps[0];

  return (
    <div className="method-scrolly grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      {/* Panel sticky — solo desktop */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <div
            key={active}
            className="method-desc-content font-tho-title text-[7rem] leading-none"
            style={{ color: STEP_COLORS[active] }}
            aria-hidden
          >
            {current.n}
          </div>

          {/* Progreso: 4 segmentos en colores de marca */}
          <div className="mt-6 flex gap-2" aria-hidden>
            {visibleSteps.map((s, i) => (
              <span
                key={s.n}
                className="h-[6px] flex-1 rounded-sm transition-all duration-500"
                style={{
                  background: i <= active ? STEP_COLORS[i] : "rgba(148,163,184,0.3)",
                }}
              />
            ))}
          </div>

          <p className="mt-6 max-w-xs text-sm text-slate-600">
            Un ciclo iterativo: cada etapa alimenta a la siguiente y el aprendizaje
            reinicia el proceso con mejor evidencia.
          </p>

          <div className="relative mt-8 h-16 w-16">
            <Image
              src="/brand/logo-negro.svg"
              alt=""
              fill
              sizes="64px"
              className="object-contain logo-light"
              unoptimized
            />
            <Image
              src="/brand/logo-blanco.svg"
              alt=""
              fill
              sizes="64px"
              className="object-contain logo-dark"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Pasos */}
      <ol className="method-steps relative m-0 list-none p-0">
        {/* Línea guía */}
        <div
          className="method-steps-rail pointer-events-none absolute bottom-6 left-[13px] top-6 w-[2px] rounded-full bg-slate-200 lg:left-[15px]"
          aria-hidden
        />
        {visibleSteps.map((step, i) => {
          const isActive = i === active;
          const isPast = i < active;
          const color = STEP_COLORS[i];

          return (
            <li
              key={step.n}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="method-step relative flex gap-5 py-9 pl-0 md:gap-7 lg:min-h-[38vh] lg:items-center lg:py-12"
            >
              {/* Nodo */}
              <div className="relative z-10 flex flex-col items-center">
                <span
                  className="method-step-dot grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 bg-white text-[10px] font-bold transition-all duration-500 lg:h-8 lg:w-8 lg:text-[11px]"
                  style={{
                    borderColor: isActive || isPast ? color : "rgba(148,163,184,0.55)",
                    color: isActive || isPast ? color : "rgba(100,116,139,0.8)",
                    boxShadow: isActive ? `0 0 0 6px color-mix(in oklab, ${color} 18%, transparent)` : "none",
                  }}
                >
                  {step.n}
                </span>
              </div>

              <div
                className="transition-all duration-500"
                style={{ opacity: isActive ? 1 : 0.42, transform: isActive ? "translateX(0)" : "translateX(-2px)" }}
              >
                <div
                  className="text-[11px] font-bold uppercase tracking-[0.17em]"
                  style={{ color }}
                >
                  Etapa {step.n}
                </div>
                <h3 className="font-tho-title mt-1 text-[1.7rem] text-slate-950 md:text-[2.1rem]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-slate-700 md:text-base">{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
