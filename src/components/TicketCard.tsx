import { Ticket } from "@/content/tickets";
import { PILLAR_META } from "@/lib/brand";

export function TicketCard({ t }: { t: Ticket }) {
  const meta = PILLAR_META[t.pillar];
  return (
    <div
      className={`group relative overflow-hidden bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md rounded-[2rem]`}
    >
      {/* Soft color wash + hand-drawn hint */}
      <div className={`pointer-events-none absolute inset-0 ${meta.softBg} opacity-[0.55]`} />
      <div className="pointer-events-none absolute inset-0">
        <svg viewBox="0 0 420 260" className="h-full w-full" aria-hidden>
          <path
            d="M18 62c46-34 122-42 182-18 60 24 112 20 162 0 34-14 58-14 76-6"
            fill="none"
            stroke="rgba(11,11,12,0.14)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Accent rail */}
      <div className={`pointer-events-none absolute left-0 top-0 h-full w-[3px] ${meta.accentDot} opacity-70`} />

      <div className="relative">

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-2 rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-800`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.accentDot}`} />
          {meta.label}
        </div>
        <div className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{t.duration}</div>
      </div>

      <h3 className="font-tho-title title-tho-strong mt-4 text-[1.95rem] leading-[1.02] text-slate-950 md:text-[2.2rem]">{t.name}</h3>
      <p className="mt-3 text-sm text-slate-600">{t.short}</p>

      <p className="mt-3 text-sm text-slate-600">
        <span className="font-medium text-slate-800">Para quién: </span>
        {t.forWho}
      </p>

      <p className="mt-2 text-sm text-slate-600">
        <span className="font-medium text-slate-800">Resultado: </span>
        {t.outcome}
      </p>

      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-700">Entregables</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          {t.deliverables.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>

      <a
        href={`/tickets/${t.slug}`}
        className={`btn-tho-hover-gradient mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition`}
      >
        Ver detalle
      </a>

      </div>
    </div>
  );
}
