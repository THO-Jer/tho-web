type Props = { content: string };

function renderBlock(block: string, index: number) {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const first = lines[0];
  if (first.startsWith("### ")) return <h3 key={index} className="mt-8 text-xl font-semibold text-slate-900">{first.replace(/^###\s/, "")}</h3>;
  if (first.startsWith("## ")) return <h2 key={index} className="mt-9 text-2xl font-semibold text-slate-900">{first.replace(/^##\s/, "")}</h2>;
  if (first.startsWith("# ")) return <h1 key={index} className="mt-10 text-3xl font-semibold text-slate-900">{first.replace(/^#\s/, "")}</h1>;

  if (lines.every((line) => line.startsWith("- "))) {
    return (
      <ul key={index} className="mt-5 list-disc space-y-2 pl-6 text-slate-700">
        {lines.map((line) => (
          <li key={line}>{line.replace(/^-\s/, "")}</li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="mt-5 leading-7 text-slate-700">
      {lines.join(" ")}
    </p>
  );
}

export function BlogContent({ content }: Props) {
  const blocks = content.split(/\n\s*\n/g);
  return <article>{blocks.map((block, index) => renderBlock(block, index))}</article>;
}
