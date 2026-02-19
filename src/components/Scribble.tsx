export function ScribbleUnderline({
  className = "",
  stroke = "rgba(11,11,12,0.45)",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 260 22"
      className={`block h-4 w-40 ${className}`.trim()}
      aria-hidden
    >
      <path
        d="M3 15c22 6 48 5 70 1 18-3 36-7 56-5 26 3 49 10 76 8 21-1 37-7 52-15"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 18c20 5 46 4 68 0 20-4 38-8 58-6 26 2 49 10 75 9 22-1 39-8 52-16"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
