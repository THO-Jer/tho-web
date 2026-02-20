type Step = {
  n: string;
  title: string;
  desc: string;
  tone: "do" | "com" | "esg" | "neutral";
};

const toneStyles: Record<Step["tone"], { glow: string; chip: string; dot: string; sketch: string }> = {
  do: {
    glow: "from-tho-pink/30 to-tho-pink/10",
    chip: "text-tho-pink border-tho-pink/40 bg-tho-pink/10",
    dot: "bg-tho-pink",
    sketch: "stroke-[rgba(209,60,162,0.45)]",
  },
  com: {
    glow: "from-tho-orange/30 to-tho-orange/10",
    chip: "text-tho-orange border-tho-orange/40 bg-tho-orange/10",
    dot: "bg-tho-orange",
    sketch: "stroke-[rgba(250,127,51,0.45)]",
  },
  esg: {
    glow: "from-tho-green/30 to-tho-green/10",
    chip: "text-tho-green border-tho-green/40 bg-tho-green/10",
    dot: "bg-tho-green",
    sketch: "stroke-[rgba(147,191,36,0.45)]",
  },
  neutral: {
    glow: "from-slate-300/40 to-slate-100/20",
    chip: "text-slate-700 border-slate-300 bg-slate-100",
    dot: "bg-slate-700",
    sketch: "stroke-[rgba(15,23,42,0.3)]",
  },
};

export default function MethodTimeline({ steps }: { steps: Step[] }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 right-4 top-6 hidden h-px border-t border-dashed border-slate-300/80 md:block" />

      <div className="grid gap-5 md:grid-cols-4">
        {steps.map((s) => {
          const st = toneStyles[s.tone];
          return (
            <article
              key={s.n}
              className={`group relative rounded-3xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:[transform:perspective(1100px)_rotateX(3deg)_rotateY(-2deg)]`}
            >
              <div className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${st.glow} opacity-80`} />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${st.dot}`} />
                    <span className="text-sm font-semibold tracking-[0.08em] text-slate-500">{s.n}</span>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${st.chip}`}>
                    Paso
                  </span>
                </div>

                <h3 className="text-2xl font-semibold leading-tight text-slate-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{s.desc}</p>

                <svg className="mt-5 h-5 w-full" viewBox="0 0 320 24" fill="none" aria-hidden>
                  <path
                    d="M8 16 C 42 4, 78 20, 114 12 C 150 4, 182 20, 214 12 C 248 4, 282 20, 314 12"
                    className={`${st.sketch}`}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
