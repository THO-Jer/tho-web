type Step = {
  n: string;
  title: string;
  desc: string;
  duration: string;
  tone: "do" | "com" | "esg" | "neutral";
};

const toneStyles: Record<Step["tone"], { bg: string; dot: string; ink: string }> = {
  do: { bg: "bg-[rgba(209,60,162,0.14)]", dot: "bg-[#D13CA2]", ink: "text-slate-900" },
  com: { bg: "bg-[rgba(250,127,51,0.14)]", dot: "bg-[#FA7F33]", ink: "text-slate-900" },
  esg: { bg: "bg-[rgba(147,191,36,0.16)]", dot: "bg-[#93BF24]", ink: "text-slate-900" },
  neutral: { bg: "bg-white", dot: "bg-slate-900", ink: "text-slate-900" },
};

export default function MethodTimeline({ steps }: { steps: Step[] }) {
  return (
    <div className="relative">
      {/* dotted connector */}
      <div className="pointer-events-none absolute left-4 right-4 top-[2.35rem] hidden h-px border-t border-dashed border-slate-300 md:block" />

      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((s) => {
          const st = toneStyles[s.tone];
          return (
            <div
              key={s.n}
              className={`relative overflow-hidden rounded-3xl border border-slate-200/70 ${st.bg} p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)]`}
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-2xl ${st.dot} shadow-sm`} />
                  <span className="text-sm font-semibold tracking-[0.06em] text-slate-600">
                    {s.n}
                  </span>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  {s.duration}
                </span>
              </div>

              <h3 className={`text-xl font-semibold leading-tight ${st.ink}`}>{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{s.desc}</p>

              {/* subtle hand-ish underline */}
              <svg
                className="mt-5 h-4 w-full"
                viewBox="0 0 320 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6 14 C 42 2, 78 18, 112 10 C 148 2, 178 18, 212 10 C 248 2, 278 18, 314 10"
                  stroke="rgba(15,23,42,0.22)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
