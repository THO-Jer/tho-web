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
const GRAYS = ["#dbe1ea", "#ccd5e1", "#becadb", "#b0bfd3"];

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

  const cfg = useMemo(() => ({ cx: 560, cy: 630, rOuter: 560, rInner: 300 }), []);

  return (
    <div className="method-arc-shell relative -mb-32 overflow-visible pb-2 pt-1 md:-mb-44 md:pb-0">
      {current ? (
        <div className="relative z-40 mx-auto mb-3 max-w-5xl px-1 md:mb-2">
          <div className="method-hover-panel rounded-[1.7rem] p-3 md:p-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.17em] text-slate-500">Etapa activa {current.n}</div>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 md:text-2xl">{current.title}</h3>
              <p className="mt-2 max-w-3xl text-sm text-slate-700 md:text-base">{current.desc}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="method-arc-stage relative mx-auto max-w-7xl">
        <svg viewBox="0 0 1120 740" className="h-[340px] w-full md:h-[560px]" role="img" aria-label="Diagrama iterativo de cuatro etapas">
          <defs>
            {visibleSteps.map((step, i) => {
              const start = 180 + i * 45;
              const end = 225 + i * 45;
              return (
                <path
                  key={step.n}
                  id={`method-text-arc-${i}`}
                  d={textArcPath(cfg.cx, cfg.cy, (cfg.rOuter + cfg.rInner) / 2 + 8, start + 2, end - 2)}
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
                  transform: isActive ? "translateY(-10px) scale(1.012)" : "translateY(0) scale(1)",
                  transition: "transform 220ms ease, filter 220ms ease",
                  filter: isActive ? "saturate(1.1) brightness(1.02)" : "none",
                }}
              >
                <path d={d} fill={fill} stroke="rgba(255,255,255,0.92)" strokeWidth="6" />
                <text className="method-arc-label" fontSize="21" fontWeight="800" fill="currentColor" letterSpacing="0.005em">
                  <textPath href={`#method-text-arc-${i}`} startOffset="50%" textAnchor="middle">
                    {step.title}
                  </textPath>
                </text>
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute left-1/2 top-[63%] z-30 h-24 w-56 -translate-x-1/2 -translate-y-1/2 md:h-36 md:w-[22rem]">
          <div className="method-logo-glow absolute inset-0 rounded-full" />
          <Image src="/brand/logo-negro.png" alt="The Human Org" fill className="object-contain logo-light" />
          <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain logo-dark" />
        </div>
      </div>
    </div>
  );
}
