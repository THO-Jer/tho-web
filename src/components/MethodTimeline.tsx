"use client";

type Step = {
  n: string;
  title: string;
  desc: string;
  tone: "do" | "com" | "esg" | "neutral";
};

const BRAND_HOVER = ["var(--tho-blue)", "var(--tho-orange)", "var(--tho-pink)", "var(--tho-green)"];
const GRAYS = ["#cbd5e1", "#b8c3d2", "#a5b4c8", "#94a3b8"];

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
  const cx = 500;
  const cy = 460;
  const rOuter = 430;
  const rInner = 210;

  return (
    <div className="relative overflow-hidden rounded-[2.2rem] bg-white p-4 ring-1 ring-slate-200/70 md:p-6">
      <div className="mx-auto max-w-5xl">
        <svg viewBox="0 0 1000 540" className="h-[340px] w-full md:h-[460px]">
          <defs>
            {visibleSteps.map((step, i) => {
              const start = 180 + i * 45;
              const end = 225 + i * 45;
              return <path key={step.n} id={`method-text-arc-${i}`} d={textArcPath(cx, cy, (rOuter + rInner) / 2, start + 6, end - 6)} />;
            })}
          </defs>

          <circle cx={cx} cy={cy} r={rInner - 6} fill="var(--background)" />

          {visibleSteps.map((step, i) => {
            const start = 180 + i * 45;
            const end = 225 + i * 45;
            const d = donutSlicePath(cx, cy, rOuter, rInner, start, end);
            const label = `${step.title} · ${step.desc}`;

            return (
              <g key={step.n} className="group cursor-pointer">
                <path
                  d={d}
                  fill={GRAYS[i]}
                  className="transition duration-300 group-hover:brightness-110"
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                  }}
                >
                  <animate attributeName="fill" dur="0.2s" begin="mouseover" fill="freeze" to={BRAND_HOVER[i]} />
                  <animate attributeName="fill" dur="0.2s" begin="mouseout" fill="freeze" to={GRAYS[i]} />
                </path>
                <path d={d} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="6" />
                <text fontSize="18" fontWeight="700" fill="#0f172a" letterSpacing="0.02em">
                  <textPath href={`#method-text-arc-${i}`} startOffset="50%" textAnchor="middle">
                    {label}
                  </textPath>
                </text>
              </g>
            );
          })}

          <text x={cx} y={cy - 15} textAnchor="middle" fontSize="34" fontWeight="700" fill="#0f172a">
            Proceso iterativo
          </text>
          <text x={cx} y={cy + 20} textAnchor="middle" fontSize="18" fill="#475569">
            Método THO
          </text>
        </svg>
      </div>
    </div>
  );
}
