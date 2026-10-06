"use client";

import { useMemo, useState } from "react";

// Columnas de lecturas por día. Una sola serie: sin leyenda (el título la nombra),
// eje recesivo, tooltip al pasar el cursor y vista de tabla accesible.

const BAR_COLOR = "#1e71b8"; // azul THO (validado: contraste ≥ 3:1 sobre blanco)

function niceMax(value: number) {
  if (value <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 2.5, 5, 10];
  for (const s of steps) {
    if (value <= s * pow) return s * pow;
  }
  return 10 * pow;
}

function formatDay(day: string, long = false) {
  const d = new Date(`${day}T12:00:00Z`);
  return d.toLocaleDateString("es-CL", long ? { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" } : { day: "numeric", month: "short", timeZone: "UTC" });
}

export function DailyViewsChart({ data }: { data: Array<{ day: string; views: number }> }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = useMemo(() => niceMax(Math.max(0, ...data.map((d) => d.views))), [data]);
  const ticks = [0, max / 2, max];
  const total = data.reduce((sum, d) => sum + d.views, 0);
  const peakIndex = data.reduce((best, d, i) => (d.views > (data[best]?.views ?? -1) ? i : best), 0);

  if (!data.length) return null;

  return (
    <div>
      <div className="relative h-48 pl-10">
        {/* Grilla + ticks del eje Y */}
        {ticks.map((t) => (
          <div key={t} className="pointer-events-none absolute left-10 right-0 border-t border-slate-100" style={{ bottom: `${(t / max) * 100}%` }}>
            <span className="absolute -left-10 -translate-y-1/2 pr-2 text-[10px] tabular-nums text-slate-400">{t.toLocaleString("es-CL")}</span>
          </div>
        ))}

        {/* Columnas */}
        <div className="absolute inset-0 left-10 flex items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
          {data.map((d, i) => {
            const h = max ? (d.views / max) * 100 : 0;
            return (
              <div
                key={d.day}
                className="relative flex h-full flex-1 cursor-default items-end justify-center"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${formatDay(d.day, true)}: ${d.views} lecturas`}
              >
                <div
                  className="w-full max-w-[24px] rounded-t-[4px] transition-opacity"
                  style={{
                    height: d.views ? `max(${h}%, 2px)` : "0px",
                    backgroundColor: BAR_COLOR,
                    opacity: hover === null || hover === i ? 1 : 0.45,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {hover !== null && data[hover] ? (
          <div
            className={`pointer-events-none absolute top-0 z-10 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm ${
              (hover + 0.5) / data.length > 0.8 ? "-translate-x-full" : (hover + 0.5) / data.length < 0.2 ? "" : "-translate-x-1/2"
            }`}
            style={{ left: `calc(2.5rem + (100% - 2.5rem) * ${(hover + 0.5) / data.length})` }}
          >
            <div className="text-slate-500">{formatDay(data[hover].day, true)}</div>
            <div className="font-semibold tabular-nums text-slate-900">{data[hover].views.toLocaleString("es-CL")} lecturas</div>
          </div>
        ) : null}
      </div>

      {/* Eje X: primer día, pico y último día */}
      <div className="mt-1 flex justify-between pl-10 text-[10px] text-slate-400">
        <span>{formatDay(data[0].day)}</span>
        {total > 0 ? <span className="text-slate-500">Pico: {formatDay(data[peakIndex].day)} · {data[peakIndex].views} lecturas</span> : <span>Sin lecturas en el período</span>}
        <span>{formatDay(data[data.length - 1].day)}</span>
      </div>

      <details className="mt-3 text-xs text-slate-600">
        <summary className="cursor-pointer select-none text-slate-500 hover:text-slate-700">Ver como tabla</summary>
        <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-slate-200">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-1.5 font-medium">Día</th>
                <th className="px-3 py-1.5 text-right font-medium">Lecturas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.day} className="border-t border-slate-100">
                  <td className="px-3 py-1">{formatDay(d.day, true)}</td>
                  <td className="px-3 py-1 text-right tabular-nums">{d.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
