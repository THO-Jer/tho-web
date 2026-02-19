import { Ticket } from "@/content/tickets";
import { PILLAR_META } from "@/lib/brand";

export function TicketCard({ t }: { t: Ticket }) {
  const meta = PILLAR_META[t.pillar];
  return (
    <div className={`group relative border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${meta.softBorder} rounded-2xl`}>
      {/* Accent rail */}
      <div className={`pointer-events-none absolute left-0 top-0 h-full w-[3px] ${meta.accentDot} opacity-80`} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${meta.softBg} ${meta.softBorder} ${meta.ink}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.accentDot}`} />
          {meta.label}
        </div>
        <div className="rounded-full bg-slate-950/5 px-2.5 py-1 text-xs font-semibold text-slate-700">{t.duration}</div>
      </div>

      <h3 className="font-tho-title mt-3 text-2xl">{t.name}</h3>
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
        className={`mt-5 inline-flex w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-bold transition hover:opacity-95 ${meta.softBorder} ${meta.softBg}`}
      >
        Ver detalle
      </a>
    </div>
  );
}
