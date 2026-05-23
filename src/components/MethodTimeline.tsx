"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Step = {
  n: string;
  title: string;
  desc: string;
  tone: "do" | "com" | "esg" | "neutral";
};

// Brand colors as RGB for gradient stops
const BRAND_RGB = ["29,113,184", "250,127,51", "209,60,162", "147,191,36"];
// Lighter tint for inactive segment base (white-ish glass effect)
const INACTIVE_RGB = ["219,229,240", "204,213,225", "190,202,219", "176,191,211"];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function donutSlicePath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
) {
  const p1 = polar(cx, cy, rOuter, startDeg);
  const p2 = polar(cx, cy, rOuter, endDeg);
  const p3 = polar(cx, cy, rInner, endDeg);
  const p4 = polar(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
}

// Midpoint angle of a segment — used to place the step number
function midpointOfSegment(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
) {
  const midAngle = (startDeg + endDeg) / 2;
  const r = (rOuter + rInner) / 2;
  return polar(cx, cy, r, midAngle);
}

export default function MethodTimeline({ steps }: { steps: Step[] }) {
  const visibleSteps = steps.slice(0, 4);
  const [active, setActive] = useState(0);
  const current = visibleSteps[active] ?? visibleSteps[0];

  const cfg = useMemo(() => ({ cx: 560, cy: 630, rOuter: 560, rInner: 300 }), []);

  return (
    <div className="method-arc-shell relative -mb-32 overflow-visible pb-2 pt-1 md:-mb-44 md:pb-0">
      {/* Description panel — fixed height prevents layout shift */}
      <div className="relative z-40 mx-auto mb-3 max-w-5xl px-1 md:mb-2">
        <div className="method-hover-panel min-h-[6rem] rounded-[1.7rem] p-3 md:min-h-[7rem] md:p-4">
          {current ? (
            <div key={active} className="method-desc-content text-center">
              <div
                className="text-[11px] font-bold uppercase tracking-[0.17em]"
                style={{ color: `rgb(${BRAND_RGB[active]})` }}
              >
                {current.title}
              </div>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-700 md:text-base">{current.desc}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Arc diagram */}
      <div className="method-arc-stage relative mx-auto max-w-7xl">
        <svg
          viewBox="0 0 1120 740"
          className="h-[340px] w-full md:h-[560px]"
          role="img"
          aria-label="Diagrama iterativo de cuatro etapas"
        >
          <defs>
            {visibleSteps.map((step, i) => {
              const start = 181 + i * 45;
              const end = 224 + i * 45;
              const rgb = BRAND_RGB[i];
              const inactiveRgb = INACTIVE_RGB[i];

              // Gradient direction: top-right → bottom-left (≈158°, matching service cards)
              // For inactive segment: white → light tint
              // For active segment: white → brand color
              return (
                <g key={step.n}>
                  {/* Inactive gradient */}
                  <linearGradient
                    id={`method-grad-${i}`}
                    x1="1"
                    y1="0"
                    x2="0"
                    y2="1"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0%" stopColor={`rgba(255,255,255,0.92)`} />
                    <stop offset="100%" stopColor={`rgba(${inactiveRgb},0.55)`} />
                  </linearGradient>
                  {/* Active gradient — richer brand color */}
                  <linearGradient
                    id={`method-grad-${i}-a`}
                    x1="1"
                    y1="0"
                    x2="0"
                    y2="1"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0%" stopColor={`rgba(255,255,255,0.97)`} />
                    <stop offset="100%" stopColor={`rgba(${rgb},0.72)`} />
                  </linearGradient>
                </g>
              );
            })}
          </defs>

          {visibleSteps.map((step, i) => {
            const start = 181 + i * 45;
            const end = 224 + i * 45;
            const d = donutSlicePath(cfg.cx, cfg.cy, cfg.rOuter, cfg.rInner, start, end);
            const isActive = active === i;
            const fill = isActive ? `url(#method-grad-${i}-a)` : `url(#method-grad-${i})`;
            const strokeColor = `rgba(${BRAND_RGB[i]},${isActive ? "0.55" : "0.28"})`;
            const mid = midpointOfSegment(cfg.cx, cfg.cy, cfg.rOuter, cfg.rInner, start, end);

            return (
              <g
                key={step.n}
                className="cursor-pointer"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{
                  transformOrigin: `${cfg.cx}px ${cfg.cy}px`,
                  transform: isActive ? "translateY(-10px) scale(1.012)" : "translateY(0) scale(1)",
                  transition: "transform 350ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <path d={d} fill={fill} stroke={strokeColor} strokeWidth="3" />
                {/* Step number centered on segment */}
                <text
                  x={mid.x}
                  y={mid.y + 10}
                  textAnchor="middle"
                  fontSize="38"
                  fontWeight="800"
                  fontFamily="inherit"
                  letterSpacing="-0.01em"
                  fill={isActive ? `rgb(${BRAND_RGB[i]})` : "rgba(30,41,59,0.45)"}
                  style={{ transition: "fill 350ms cubic-bezier(0.22,1,0.36,1)", userSelect: "none" }}
                >
                  {step.n}
                </text>
              </g>
            );
          })}
        </svg>

        {/* THO logo — centered in donut hole, unchanged from original */}
        <div className="pointer-events-none absolute left-1/2 top-[63%] z-30 h-24 w-24 -translate-x-1/2 -translate-y-1/2 md:h-36 md:w-36">
          <div className="method-logo-glow absolute inset-0 rounded-full" />
          <Image
            src="/brand/logo-negro.svg"
            alt="The Human Org"
            fill
            sizes="(min-width: 768px) 144px, 96px"
            className="object-contain logo-light"
            unoptimized
          />
          <Image
            src="/brand/logo-blanco.svg"
            alt="The Human Org"
            fill
            sizes="(min-width: 768px) 144px, 96px"
            className="object-contain logo-dark"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
