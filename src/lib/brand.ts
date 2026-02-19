export type Pillar = "esg" | "comunidad" | "do";

export const PILLAR_META: Record<
  Pillar,
  {
    label: string;
    accentDot: string; // e.g. "bg-tho-green"
    accentText: string; // e.g. "text-tho-green"
    softBg: string; // background class for cards/pills
    softBorder: string; // border class
    ink: string; // text class
  }
> = {
  esg: {
    label: "ESG / Sostenibilidad",
    accentDot: "bg-tho-green",
    accentText: "text-tho-green",
    softBg: "bg-tho-green/10",
    softBorder: "border-tho-green/25",
    ink: "text-slate-950",
  },
  comunidad: {
    label: "Relación con el entorno",
    accentDot: "bg-tho-orange",
    accentText: "text-tho-orange",
    softBg: "bg-tho-orange/10",
    softBorder: "border-tho-orange/25",
    ink: "text-slate-950",
  },
  do: {
    label: "Desarrollo Organizacional",
    accentDot: "bg-tho-pink",
    accentText: "text-tho-pink",
    softBg: "bg-tho-pink/10",
    softBorder: "border-tho-pink/25",
    ink: "text-slate-950",
  },
};

