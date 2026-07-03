import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { content: string };

// ── Nodos hast (árbol HTML que produce react-markdown) ──────────────────────

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
};

function nodeText(node: HastNode | undefined | null): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(nodeText).join("");
}

// ── TOC ──────────────────────────────────────────────────────────────────────
// Se calcula sobre el markdown fuente (lo usa también el editor del Studio).

type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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

export function getToc(content: string): TocItem[] {
  const blocks = content.split(/\n\s*\n/g);
  return blocks
    .map((block) => block.split("\n").map((line) => line.trim()).find(Boolean) || "")
    .map((line) => headingInfo(line))
    .filter((h): h is { level: 2 | 3; text: string } => Boolean(h && h.level !== 1))
    .map((h) => ({ id: slugify(h.text), text: h.text, level: h.level }));
}

// ── Auto-embeds ──────────────────────────────────────────────────────────────
// Un párrafo que contiene solo una URL se convierte en embed (YouTube, PDF)
// o en tarjeta de enlace externo.

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

function AutoEmbed({ url }: { url: string }) {
  const yt = extractYoutubeEmbed(url);
  if (yt) {
    return (
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="aspect-video w-full">
          <iframe src={yt} className="h-full w-full" title="Video embebido" allowFullScreen loading="lazy" />
        </div>
      </div>
    );
  }

  if (url.toLowerCase().endsWith(".pdf")) {
    return (
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <iframe src={url} className="h-[540px] w-full" title="Documento PDF" loading="lazy" />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-6 block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
    >
      Enlace externo: {url}
    </a>
  );
}

// ── Imagen con tamaño/alineación ─────────────────────────────────────────────
// El editor codifica "[size]:[align]" en el atributo title del markdown,
// p. ej. ![alt](src "small:left"). Defaults (full + center) no llevan title.

function MarkdownImage({ src, alt, title }: { src?: string; alt?: string; title?: string }) {
  const [sizeToken, alignToken] = (title ?? "").split(":");
  const size = sizeToken === "small" || sizeToken === "medium" ? sizeToken : "full";
  const align = alignToken === "left" || alignToken === "right" ? alignToken : sizeToken === "left" || sizeToken === "right" ? sizeToken : "center";

  const widthClass = size === "small" ? "w-1/3" : size === "medium" ? "w-3/5" : "w-full";
  const alignClass = align === "left" ? "ml-0 mr-auto" : align === "right" ? "ml-auto mr-0" : "mx-auto";

  return (
    <figure className={`mt-8 ${widthClass} ${alignClass} overflow-hidden rounded-2xl border border-slate-200 bg-slate-50`}>
      <div className="relative aspect-[16/9] w-full">
        <Image src={src || ""} alt={alt || "Imagen del artículo"} fill className="object-cover" />
      </div>
      {alt ? <figcaption className="px-4 py-2 text-xs text-slate-500">{alt}</figcaption> : null}
    </figure>
  );
}

// ── Componentes de render ────────────────────────────────────────────────────

const LONE_URL = /^https?:\/\/\S+$/i;

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="mt-10 text-3xl font-semibold text-slate-900">{children}</h1>,
  h2: ({ node, children }) => (
    <h2 id={slugify(nodeText(node as HastNode))} className="mt-9 scroll-mt-24 text-2xl font-semibold text-slate-900">
      {children}
    </h2>
  ),
  h3: ({ node, children }) => (
    <h3 id={slugify(nodeText(node as HastNode))} className="mt-8 scroll-mt-24 text-xl font-semibold text-slate-900">
      {children}
    </h3>
  ),
  p: ({ node, children }) => {
    const el = node as HastNode;
    const kids = (el.children ?? []).filter((child) => !(child.type === "text" && !(child.value ?? "").trim()));

    // Párrafo que solo contiene una imagen: no envolver en <p> (la figura es block).
    if (kids.length === 1 && kids[0].tagName === "img") return <>{children}</>;

    // Párrafo que solo contiene una URL: auto-embed.
    const text = nodeText(el).trim();
    if (LONE_URL.test(text)) return <AutoEmbed url={text} />;

    return <p className="mt-5 leading-7 text-slate-700">{children}</p>;
  },
  a: ({ href, children }) => {
    const url = href ?? "";
    const isInternal = url.startsWith("/") || url.startsWith("#");
    return (
      <a
        href={url}
        className="text-slate-900 underline underline-offset-2 hover:opacity-70"
        {...(isInternal ? {} : { target: "_blank", rel: "noreferrer" })}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt, title }) => <MarkdownImage src={typeof src === "string" ? src : ""} alt={alt} title={title ?? undefined} />,
  ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-slate-700">{children}</ol>,
  li: ({ children }) => <li className="leading-7 [&>p]:mt-2 [&>p:first-child]:mt-0 [&>ul]:mt-2 [&>ol]:mt-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-4 border-slate-300 bg-slate-50 px-4 py-3 italic text-slate-700 [&>p]:mt-2 [&>p:first-child]:mt-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-slate-200" />,
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={`rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 ${className ?? ""}`}>
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-slate-700">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-900">{children}</th>,
  td: ({ children }) => <td className="border border-slate-200 px-3 py-2">{children}</td>,
};

export function BlogContent({ content }: Props) {
  return (
    <article>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
