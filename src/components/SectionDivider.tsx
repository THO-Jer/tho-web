type Variant = "curve" | "scribble";

export function SectionDivider({
  fromClass = "bg-tho-bg",
  toFill = "#ffffff",
  variant = "curve",
  flip = false,
}: {
  fromClass?: string;
  toFill?: string;
  variant?: Variant;
  flip?: boolean;
}) {
  // The divider is an SVG that creates a softer, less abrupt transition between sections.
  // Use `from` as the background behind the SVG, and `to` as the fill color of the SVG.
  return (
    <div className={`${fromClass} ${flip ? "rotate-180" : ""}`.trim()} aria-hidden>
      {variant === "curve" ? (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block h-10 w-full md:h-14">
          <path
            d="M0,0V46.29c47.79,22,103.59,29.05,158,17.73C230.28,49.75,284.11,8.62,339.22,0c54.51-8.52,104.71,19.27,158.2,33.37C576.2,52.5,645.7,51.53,714,31.7c66.48-19.31,123.64-56.86,190-61.84C982.9-35.09,1049.2,2.2,1105.5,23.93c32.19,12.5,63.57,19.49,94.5,20.32V0Z"
            style={{ fill: toFill }}
          />
        </svg>
      ) : (
        <div className="relative h-10 md:h-14" style={{ background: toFill }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path
              d="M0,96 C150,120 300,60 450,88 C600,116 750,70 900,90 C1050,110 1120,80 1200,96"
              fill="none"
              stroke="rgba(11,11,12,0.20)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
