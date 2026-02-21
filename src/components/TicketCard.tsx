import { Ticket } from "@/content/tickets";
import { PILLAR_META } from "@/lib/brand";

export function TicketCard({ t }: { t: Ticket }) {
  const meta = PILLAR_META[t.pillar];
  const actionTone = t.pillar === "esg" ? "btn-brand-accent-green" : t.pillar === "comunidad" ? "btn-brand-accent-orange" : "btn-brand-accent-pink";
  return (
    <div
      className={`group relative overflow-hidden bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md rounded-[2rem]`}
    >
      {/* Soft color wash */}
      <div className={`pointer-events-none absolute inset-0 ${meta.softBg} opacity-[0.55]`} />

      {/* Accent rail */}
      <div className={`pointer-events-none absolute left-0 top-0 h-full w-[3px] ${meta.accentDot} opacity-70`} />

      <div className="relative">

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-2 rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-800`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.accentDot}`} />
          {meta.label}
        </div>
      </div>

      <h3 className="font-tho-title title-tho-strong mt-4 text-[2.2rem] leading-[1.02] text-slate-950 md:text-[2.6rem]">{t.name}</h3>
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
        className={`btn-unified-motion btn-brand-accent ${actionTone} mt-6 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition`}
      >
        Ver detalle
      </a>

      </div>
    </div>
  );
}
