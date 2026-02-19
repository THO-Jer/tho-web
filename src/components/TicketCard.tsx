import { Ticket } from "@/content/tickets";

export function TicketCard({ t }: { t: Ticket }) {
  return (
    <div className="group relative rounded-[2.2rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute left-6 top-0 h-[3px] w-20 rounded-full bg-tho-blue opacity-70" />
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-slate-500">Ticket estratégico</div>
        <div className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{t.duration}</div>
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
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-tho-bg"
      >
        Ver detalle
      </a>
    </div>
  );
}
