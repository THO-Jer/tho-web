"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Step = {
  n: string;
  title: string;
  desc: string;
  tone: "do" | "com" | "esg" | "neutral";
};

const BRAND_HOVER = ["var(--tho-blue)", "var(--tho-orange)", "var(--tho-pink)", "var(--tho-green)"];
const GRAYS = ["#d5dbe4", "#c6cfdb", "#b9c4d3", "#acb8ca"];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function donutSlicePath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number) {
  const p1 = polar(cx, cy, rOuter, startDeg);
  const p2 = polar(cx, cy, rOuter, endDeg);
  const p3 = polar(cx, cy, rInner, endDeg);
  const p4 = polar(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
}

function textArcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const p1 = polar(cx, cy, r, startDeg);
  const p2 = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
}

export default function MethodTimeline({ steps }: { steps: Step[] }) {
  const visibleSteps = steps.slice(0, 4);
  const [active, setActive] = useState(0);
  const current = visibleSteps[active] ?? visibleSteps[0];

  const cfg = useMemo(
    () => ({ cx: 560, cy: 590, rOuter: 520, rInner: 250 }),
    []
  );

  return (
    <div className="method-arc-shell relative -mb-20 overflow-visible pt-2 md:-mb-24">
      <div className="method-arc-fade-top pointer-events-none absolute inset-x-0 top-0 z-10 h-12" />
      <div className="method-arc-fade-sides pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-24" />
      <div className="method-arc-fade-sides pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-24 scale-x-[-1]" />

      <div className="method-arc-stage relative mx-auto max-w-6xl">
        <svg viewBox="0 0 1120 670" className="h-[360px] w-full md:h-[520px]" role="img" aria-label="Diagrama iterativo de cuatro etapas">
          <defs>
            {visibleSteps.map((step, i) => {
              const start = 180 + i * 45;
              const end = 225 + i * 45;
              return (
                <path
                  key={step.n}
                  id={`method-text-arc-${i}`}
                  d={textArcPath(cfg.cx, cfg.cy, (cfg.rOuter + cfg.rInner) / 2 + 8, start + 6, end - 6)}
                />
              );
            })}
          </defs>

          {visibleSteps.map((step, i) => {
            const start = 180 + i * 45;
            const end = 225 + i * 45;
            const d = donutSlicePath(cfg.cx, cfg.cy, cfg.rOuter, cfg.rInner, start, end);
            const isActive = active === i;
            const fill = isActive ? BRAND_HOVER[i] : GRAYS[i];

            return (
              <g
                key={step.n}
                className="cursor-pointer"
                onMouseEnter={() => setActive(i)}
                style={{
                  transformOrigin: `${cfg.cx}px ${cfg.cy}px`,
                  transform: isActive ? "translateY(-16px) scale(1.01)" : "translateY(0) scale(1)",
                  transition: "transform 280ms ease, filter 280ms ease",
                  filter: isActive ? "saturate(1.08) brightness(1.03)" : "none",
                }}
              >
                <path d={d} fill={fill} stroke="rgba(255,255,255,0.9)" strokeWidth="7" />
                <text fontSize="19" fontWeight="700" fill="#0f172a" letterSpacing="0.012em">
                  <textPath href={`#method-text-arc-${i}`} startOffset="50%" textAnchor="middle">
                    {step.title}
                  </textPath>
                </text>
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute left-1/2 top-[58%] z-30 h-28 w-64 -translate-x-1/2 -translate-y-1/2 md:h-36 md:w-[22rem]">
          <Image src="/brand/logo-negro.png" alt="The Human Org" fill className="object-contain logo-light" />
          <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain logo-dark" />
        </div>
      </div>

      {current ? (
        <div className="relative z-40 mx-auto mt-2 max-w-3xl rounded-2xl border border-slate-200/80 bg-white/92 p-4 shadow-sm backdrop-blur-sm md:p-5">
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Etapa activa {current.n}</div>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 md:text-xl">{current.title}</h3>
          <p className="mt-2 text-sm text-slate-700 md:text-base">{current.desc}</p>
        </div>
      ) : null}
    </div>
  );
}
