type Step = {
  n: string;
  title: string;
  desc: string;
  tone: "do" | "com" | "esg" | "neutral";
};

const grayScale = [
  {
    card: "from-slate-100 to-slate-200 border-slate-300",
    chip: "bg-slate-100 text-slate-700 border-slate-400/60",
    dot: "bg-slate-500",
    ink: "text-slate-900",
  },
  {
    card: "from-slate-300 to-slate-400 border-slate-500/70",
    chip: "bg-slate-300 text-slate-800 border-slate-600/60",
    dot: "bg-slate-700",
    ink: "text-slate-950",
  },
  {
    card: "from-slate-500 to-slate-600 border-slate-700/80",
    chip: "bg-slate-500 text-slate-100 border-slate-800/70",
    dot: "bg-slate-100",
    ink: "text-white",
  },
  {
    card: "from-slate-700 to-slate-900 border-black/70",
    chip: "bg-slate-800 text-slate-100 border-slate-600/70",
    dot: "bg-white",
    ink: "text-white",
  },
];

export default function MethodTimeline({ steps }: { steps: Step[] }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-6 right-6 top-8 hidden h-px border-t border-dashed border-slate-400/60 md:block" />

      <div className="grid gap-5 md:grid-cols-4">
        {steps.map((s, i) => {
          const st = grayScale[i] ?? grayScale[grayScale.length - 1];
          return (
            <article
              key={s.n}
              className={`method-card group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 transition duration-300 hover:-translate-y-1 hover:[transform:perspective(1100px)_rotateX(4deg)_rotateY(-3deg)] ${st.card}`}
            >
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${st.dot}`} />
                    <span className="text-sm font-semibold tracking-[0.08em] text-inherit/80">{s.n}</span>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${st.chip}`}>
                    Paso
                  </span>
                </div>

                <h3 className={`text-2xl font-semibold leading-tight ${st.ink}`}>{s.title}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${i >= 2 ? "text-slate-100/90" : "text-slate-700"}`}>
                  {s.desc}
                </p>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/20 opacity-0 transition group-hover:opacity-100" />
              <div className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-white/35" />
              <div className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-white/35" />
            </article>
          );
        })}
      </div>
    </div>
  );
}
