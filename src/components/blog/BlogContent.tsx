import Image from "next/image";
import { type ReactNode } from "react";

type Props = { content: string };

// ── Inline markdown parser ────────────────────────────────────────────────
// Handles **bold**, *italic*, [link](url) within paragraph text.
function parseInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

    type MatchEntry = { type: "bold" | "italic" | "link"; match: RegExpMatchArray };
    const candidates: MatchEntry[] = [];
    if (boldMatch) candidates.push({ type: "bold", match: boldMatch });
    if (italicMatch) candidates.push({ type: "italic", match: italicMatch });
    if (linkMatch) candidates.push({ type: "link", match: linkMatch });

    if (candidates.length === 0) { parts.push(remaining); break; }

    candidates.sort((a, b) => (a.match.index ?? 0) - (b.match.index ?? 0));
    const first = candidates[0];
    const idx = first.match.index ?? 0;

    if (idx > 0) parts.push(remaining.slice(0, idx));

    if (first.type === "bold") {
      parts.push(<strong key={key++}>{first.match[1]}</strong>);
    } else if (first.type === "italic") {
      parts.push(<em key={key++}>{first.match[1]}</em>);
    } else if (first.type === "link") {
      const isInternal = /^\//.test(first.match[2]);
      parts.push(
        <a key={key++} href={first.match[2]}
          className="text-slate-900 underline underline-offset-2 hover:opacity-70"
          {...(isInternal ? {} : { target: "_blank", rel: "noreferrer" })}>
          {first.match[1]}
        </a>
      );
    }
    remaining = remaining.slice(idx + first.match[0].length);
  }
  return <>{parts}</>;
}

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

function extractYoutubeEmbed(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function renderAutoEmbed(url: string, key: number) {
  const yt = extractYoutubeEmbed(url);
  if (yt) {
    return (
      <div key={key} className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="aspect-video w-full">
          <iframe src={yt} className="h-full w-full" title="Video embebido" allowFullScreen loading="lazy" />
        </div>
      </div>
    );
  }

  if (url.toLowerCase().endsWith(".pdf")) {
    return (
      <div key={key} className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <iframe src={url} className="h-[540px] w-full" title="Documento PDF" loading="lazy" />
      </div>
    );
  }

  return (
    <a
      key={key}
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-6 block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
    >
      Enlace externo: {url}
    </a>
  );
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

  // Title encodes "[size]:[align]" set from the editor, e.g. "small:left".
  // Defaults (full + center) are omitted → no title in the markdown.
  const imageMatch = first.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
  if (imageMatch) {
    const [, alt, src, imgTitle] = imageMatch;
    const [sizeToken, alignToken] = (imgTitle ?? "").split(":");
    const size  = sizeToken  === "small"  || sizeToken  === "medium" ? sizeToken  : "full";
    const align = alignToken === "left"   || alignToken === "right"  ? alignToken : "center";

    const widthClass = size  === "small"  ? "w-1/3" : size  === "medium" ? "w-3/5" : "w-full";
    const alignClass = align === "left"   ? "ml-0 mr-auto"
                     : align === "right"  ? "ml-auto mr-0"
                     : "mx-auto";
    return (
      <figure key={index} className={`mt-8 ${widthClass} ${alignClass} overflow-hidden rounded-2xl border border-slate-200 bg-slate-50`}>
        <div className="relative aspect-[16/9] w-full">
          <Image src={src} alt={alt || "Imagen del artículo"} fill className="object-cover" />
        </div>
        {alt ? <figcaption className="px-4 py-2 text-xs text-slate-500">{alt}</figcaption> : null}
      </figure>
    );
  }

  if (lines.length === 1 && isHttpUrl(first)) {
    return renderAutoEmbed(first, index);
  }

  return (
    <p key={index} className="mt-5 leading-7 text-slate-700">
      {parseInline(lines.join(" "))}
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
