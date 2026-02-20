"use client";

import Image from "next/image";
import { useState } from "react";

type Step = {
  n: string;
  title: string;
  desc: string;
  tone: "do" | "com" | "esg" | "neutral";
};

const BRAND_HOVER = ["var(--tho-blue)", "var(--tho-orange)", "var(--tho-pink)", "var(--tho-green)"];
const GRAYS = ["#d1d5db", "#c4c9d2", "#b7bdc8", "#aab2bf"];

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
  const [active, setActive] = useState<number | null>(null);
  const visibleSteps = steps.slice(0, 4);
  const cx = 500;
  const cy = 500;
  const rOuter = 460;
  const rInner = 220;

  return (
    <div className="method-arc-shell relative overflow-hidden rounded-[2.6rem] bg-white/95 p-2 ring-1 ring-slate-200/80 md:p-4">
      <div className="method-arc-stage relative mx-auto max-w-6xl" onMouseLeave={() => setActive(null)}>
        <svg viewBox="0 0 1000 590" className="h-[360px] w-full md:h-[520px]">
          <defs>
            {visibleSteps.map((step, i) => {
              const start = 180 + i * 45;
              const end = 225 + i * 45;
              return <path key={step.n} id={`method-text-arc-${i}`} d={textArcPath(cx, cy, (rOuter + rInner) / 2, start + 8, end - 8)} />;
            })}
          </defs>

          {visibleSteps.map((step, i) => {
            const start = 180 + i * 45;
            const end = 225 + i * 45;
            const d = donutSlicePath(cx, cy, rOuter, rInner, start, end);
            const fill = active === null ? GRAYS[i] : active === i ? BRAND_HOVER[i] : "#9ca3af";

            return (
              <g
                key={step.n}
                className="cursor-pointer transition duration-300"
                onMouseEnter={() => setActive(i)}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: active === i ? "translateY(-12px)" : "translateY(0)",
                }}
              >
                <path d={d} fill={fill} stroke="rgba(255,255,255,0.92)" strokeWidth="7" />
                <text fontSize="18" fontWeight="700" fill="#0f172a" letterSpacing="0.015em">
                  <textPath href={`#method-text-arc-${i}`} startOffset="50%" textAnchor="middle">
                    {step.title}
                  </textPath>
                </text>
                <text fontSize="13" fill="#1e293b" letterSpacing="0.01em">
                  <textPath href={`#method-text-arc-${i}`} startOffset="50%" textAnchor="middle" dy="24">
                    {step.desc}
                  </textPath>
                </text>
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute left-1/2 top-[58%] z-20 h-28 w-60 -translate-x-1/2 -translate-y-1/2 md:h-36 md:w-80">
          <Image src="/brand/logo-negro.png" alt="The Human Org" fill className="object-contain logo-light" />
          <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain logo-dark" />
        </div>

        <div className="method-arc-cut pointer-events-none absolute inset-x-[-8%] bottom-[-62px] z-30 h-40 bg-tho-bg" />
      </div>
    </div>
  );
}
