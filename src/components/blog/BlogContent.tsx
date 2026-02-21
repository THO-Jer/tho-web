import Image from "next/image";

type Props = { content: string };

type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function headingInfo(line: string) {
  if (line.startsWith("### ")) return { level: 3 as const, text: line.replace(/^###\s/, "") };
  if (line.startsWith("## ")) return { level: 2 as const, text: line.replace(/^##\s/, "") };
  if (line.startsWith("# ")) return { level: 1 as const, text: line.replace(/^#\s/, "") };
  return null;
}

function renderBlock(block: string, index: number) {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const first = lines[0];
  const heading = headingInfo(first);
  if (heading?.level === 1) return <h1 key={index} className="mt-10 text-3xl font-semibold text-slate-900">{heading.text}</h1>;
  if (heading?.level === 2) {
    const id = slugify(heading.text);
    return <h2 id={id} key={index} className="mt-9 scroll-mt-24 text-2xl font-semibold text-slate-900">{heading.text}</h2>;
  }
  if (heading?.level === 3) {
    const id = slugify(heading.text);
    return <h3 id={id} key={index} className="mt-8 scroll-mt-24 text-xl font-semibold text-slate-900">{heading.text}</h3>;
  }

  if (first === "---") return <hr key={index} className="my-8 border-slate-200" />;

  if (lines.every((line) => line.startsWith("> "))) {
    return (
      <blockquote key={index} className="mt-6 border-l-4 border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 italic">
        {lines.map((line) => line.replace(/^>\s/, "")).join(" ")}
      </blockquote>
    );
  }

  if (lines.every((line) => line.startsWith("- "))) {
    return (
      <ul key={index} className="mt-5 list-disc space-y-2 pl-6 text-slate-700">
        {lines.map((line) => (
          <li key={line}>{line.replace(/^-\s/, "")}</li>
        ))}
      </ul>
    );
  }

  const imageMatch = first.match(/^!\[(.*?)\]\((.*?)\)$/);
  if (imageMatch) {
    const [, alt, src] = imageMatch;
    return (
      <figure key={index} className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative aspect-[16/9] w-full">
          <Image src={src} alt={alt || "Imagen del artículo"} fill className="object-cover" />
        </div>
        {alt ? <figcaption className="px-4 py-2 text-xs text-slate-500">{alt}</figcaption> : null}
      </figure>
    );
  }

  return (
    <p key={index} className="mt-5 leading-7 text-slate-700">
      {lines.join(" ")}
    </p>
  );
}

export function getToc(content: string): TocItem[] {
  const blocks = content.split(/\n\s*\n/g);
  return blocks
    .map((block) => block.split("\n").map((line) => line.trim()).find(Boolean) || "")
    .map((line) => headingInfo(line))
    .filter((h): h is { level: 2 | 3; text: string } => Boolean(h && h.level !== 1))
    .map((h) => ({ id: slugify(h.text), text: h.text, level: h.level }));
}

export function BlogContent({ content }: Props) {
  const blocks = content.split(/\n\s*\n/g);
  return <article>{blocks.map((block, index) => renderBlock(block, index))}</article>;
}
