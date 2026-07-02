"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Extension, type Editor, type Range } from "@tiptap/core";

// ─────────────────────────────────────────────────────────────────────────────
// Custom Image — adds size and align visual attributes.
// Both are editor-only (plain markdown has no sizing syntax).
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Image title encoding helpers
//
// Both size and alignment are stored in the markdown image title attribute so
// they survive the save → load cycle and BlogContent can apply them.
//
// Format: "[size]:[align]"  e.g. "small:left", "medium:right", "full:right"
// Defaults (full + center) are encoded as null → no title in the markdown.
// ─────────────────────────────────────────────────────────────────────────────

type ImgSize  = "small" | "medium" | "full";
type ImgAlign = "left"  | "center" | "right";

function parseImgTitle(title: string | null): { size: ImgSize; align: ImgAlign } {
  if (!title) return { size: "full", align: "center" };
  const [s, a] = title.split(":");
  const size  = (s === "small" || s === "medium") ? s : "full";
  const align = (a === "left"  || a === "right")  ? a : "center";
  return { size, align };
}

function encodeImgTitle(size: ImgSize, align: ImgAlign): string | null {
  if (size === "full" && align === "center") return null;
  if (align === "center") return size;           // "small" | "medium"
  if (size  === "full")   return `full:${align}`; // "full:left" | "full:right"
  return `${size}:${align}`;                      // "small:left" etc.
}

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      // title encodes "[size]:[align]" — serialized by tiptap-markdown as
      // ![alt](src "small:left"), readable by both editor CSS and BlogContent.
      title: {
        default: null,
        parseHTML: (el) => el.getAttribute("title") ?? null,
        renderHTML: (attrs) => attrs.title ? { title: attrs.title } : {},
      },
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Slash-command items
// ─────────────────────────────────────────────────────────────────────────────

type SlashItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
  command: (args: { editor: Editor; range: Range }) => void;
};

const SLASH_ITEMS: SlashItem[] = [
  {
    id: "h2",
    label: "Título H2",
    description: "Subtítulo de sección",
    icon: "H₂",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
  },
  {
    id: "h3",
    label: "Título H3",
    description: "Sub-sección",
    icon: "H₃",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run(),
  },
  {
    id: "quote",
    label: "Cita",
    description: "Bloque de cita destacada",
    icon: "❝",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    id: "list",
    label: "Lista",
    description: "Lista con viñetas",
    icon: "•",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    id: "divider",
    label: "Separador",
    description: "Línea horizontal",
    icon: "—",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Embeber video de YouTube",
    icon: "▶",
    // La URL se pide vía diálogo propio (ver urlDialog en el componente).
    command: () => {},
  },
  {
    id: "pdf",
    label: "PDF",
    description: "Embeber documento PDF",
    icon: "📄",
    // La URL se pide vía diálogo propio (ver urlDialog en el componente).
    command: () => {},
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Slash menu state type
// ─────────────────────────────────────────────────────────────────────────────

type SlashState = {
  query: string;
  from: number; // document position of the "/" character
  x: number;    // screen x (left edge of cursor)
  y: number;    // screen y (bottom of cursor line)
} | null;

// ── URL dialog (reemplaza window.prompt) ─────────────────────────────────────

type UrlDialogState = {
  mode: "link" | "youtube" | "pdf";
  range?: Range; // rango del comando slash a borrar al confirmar
} | null;

const URL_DIALOG_COPY: Record<"link" | "youtube" | "pdf", { title: string; placeholder: string }> = {
  link: { title: "Insertar enlace", placeholder: "https://ejemplo.com o /blog/mi-post" },
  youtube: { title: "Embeber video de YouTube", placeholder: "https://www.youtube.com/watch?v=..." },
  pdf: { title: "Embeber documento PDF", placeholder: "https://.../documento.pdf" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Public handle & component
// ─────────────────────────────────────────────────────────────────────────────

export interface WysiwygEditorHandle {
  insertImage: (src: string, alt?: string) => void;
  insertLink: (text: string, url: string) => void;
}

interface WysiwygEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
}

function getTextAlign(editor: Editor): "left" | "center" | "right" {
  if (editor.isActive({ textAlign: "center" })) return "center";
  if (editor.isActive({ textAlign: "right" })) return "right";
  return "left";
}

export const WysiwygEditor = forwardRef<WysiwygEditorHandle, WysiwygEditorProps>(
  ({ value, onChange, disabled = false }, ref) => {
    // ── Stable onChange ref ───────────────────────────────────────────────
    const onChangeRef = useRef(onChange);
    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

    // ── Slash menu state ──────────────────────────────────────────────────
    const [slash, setSlash] = useState<SlashState>(null);
    const [slashIndex, setSlashIndex] = useState(0);

    // ── URL dialog state ──────────────────────────────────────────────────
    const [urlDialog, setUrlDialog] = useState<UrlDialogState>(null);
    const [urlValue, setUrlValue] = useState("");
    const urlInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (urlDialog) urlInputRef.current?.focus();
    }, [urlDialog]);

    // Refs for the keyboard extension (created once, reads latest values)
    const slashRef = useRef<SlashState>(null);
    const slashIndexRef = useRef(0);
    const filteredRef = useRef<SlashItem[]>([]);
    const executeItemRef = useRef<((item: SlashItem) => void) | undefined>(undefined);

    useEffect(() => { slashRef.current = slash; }, [slash]);
    useEffect(() => { slashIndexRef.current = slashIndex; }, [slashIndex]);

    // ── Keyboard extension ────────────────────────────────────────────────
    // Created once (empty deps) — all mutable state accessed via refs.
    // This intercepts ArrowUp/Down/Enter/Escape so ProseMirror doesn't
    // act on them while the slash menu is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const slashKeyboardExt = useMemo(() =>
      Extension.create({
        name: "slashKeyboard",
        addKeyboardShortcuts() {
          return {
            ArrowUp: () => {
              if (!slashRef.current) return false;
              const len = filteredRef.current.length;
              if (!len) return false;
              setSlashIndex((i) => (i + len - 1) % len);
              return true;
            },
            ArrowDown: () => {
              if (!slashRef.current) return false;
              const len = filteredRef.current.length;
              if (!len) return false;
              setSlashIndex((i) => (i + 1) % len);
              return true;
            },
            Enter: () => {
              if (!slashRef.current) return false;
              const item = filteredRef.current[slashIndexRef.current];
              if (item) executeItemRef.current?.(item);
              return true;
            },
            Escape: () => {
              if (!slashRef.current) return false;
              setSlash(null);
              return true;
            },
          };
        },
      }),
    []);

    // ── Editor ────────────────────────────────────────────────────────────
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Markdown as any).configure({
          html: false,
          bulletListMarker: "-",
          transformPastedText: true,
        }),
        CustomImage.configure({ inline: false, allowBase64: false }),
        TiptapLink.configure({ openOnClick: false, autolink: false, linkOnPaste: false }),
        Placeholder.configure({
          placeholder: 'Escribe "/" para insertar un bloque, o empieza a escribir...',
        }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Underline,
        slashKeyboardExt,
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor: e }) => {
        // Serialize to markdown
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const md = (e.storage.markdown as any).getMarkdown() as string;
        onChangeRef.current(md);

        // ── Slash command detection ──────────────────────────────────────
        // Only trigger when the entire current block is "/" or "/query".
        // This avoids false positives inside URLs or mid-paragraph slashes.
        const { selection } = e.state;
        if (!selection.empty) { setSlash(null); return; }

        const { $from } = selection;
        const textBefore = $from.parent.textBetween(0, $from.parentOffset);
        const match = textBefore.match(/^\/(\S*)$/);

        if (match) {
          const coords = e.view.coordsAtPos(selection.from);
          setSlash({
            query: match[1] ?? "",
            from: selection.from - match[0].length,
            x: coords.left,
            y: coords.bottom,
          });
          setSlashIndex(0);
        } else {
          setSlash(null);
        }
      },
    });

    // ── Filtered items ────────────────────────────────────────────────────
    const filteredItems = useMemo(() => {
      if (!slash) return [];
      const q = slash.query.toLowerCase();
      return q
        ? SLASH_ITEMS.filter(
            (item) =>
              item.label.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q)
          )
        : SLASH_ITEMS;
    }, [slash]);

    // Keep filtered ref in sync
    useEffect(() => { filteredRef.current = filteredItems; }, [filteredItems]);

    // ── Execute slash command ─────────────────────────────────────────────
    function executeItem(item: SlashItem) {
      if (!editor || !slashRef.current) return;
      const from = slashRef.current.from;
      const to = editor.state.selection.from;
      setSlash(null);
      if (item.id === "youtube" || item.id === "pdf") {
        setUrlValue("");
        setUrlDialog({ mode: item.id, range: { from, to } });
        return;
      }
      item.command({ editor, range: { from, to } });
    }

    // ── URL dialog handlers ───────────────────────────────────────────────
    function confirmUrlDialog() {
      const dialog = urlDialog;
      const url = urlValue.trim();
      setUrlDialog(null);
      setUrlValue("");
      if (!editor || !dialog || !url) return;

      if (dialog.mode === "link") {
        editor.chain().focus().setLink({ href: url }).run();
        return;
      }

      const chain = editor.chain().focus();
      if (dialog.range) chain.deleteRange(dialog.range);
      chain.insertContent({ type: "paragraph", content: [{ type: "text", text: url }] }).run();
    }

    function cancelUrlDialog() {
      setUrlDialog(null);
      setUrlValue("");
      editor?.chain().focus().run();
    }
    // Keep ref in sync for keyboard extension
    executeItemRef.current = executeItem;

    // ── Sync external value changes (e.g. fillForm) ───────────────────────
    const prevValueRef = useRef(value);
    useEffect(() => {
      if (!editor) return;
      if (prevValueRef.current === value) return;
      prevValueRef.current = value;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const current = (editor.storage.markdown as any).getMarkdown() as string;
      if (current !== value) editor.commands.setContent(value, false);
    }, [value, editor]);

    useEffect(() => {
      if (!editor) return;
      editor.setEditable(!disabled);
    }, [disabled, editor]);

    // ── Imperative handle ─────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      insertImage: (src, alt = "") => {
        editor?.chain().focus().setImage({ src, alt }).run();
      },
      insertLink: (text, url) => {
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "text", text, marks: [{ type: "link", attrs: { href: url } }] })
          .unsetMark("link")
          .insertContent(" ")
          .run();
      },
    }));

    // ── Render ────────────────────────────────────────────────────────────
    return (
      <div className="wysiwyg-root">

        {/* ── Slash command menu ─────────────────────────────────────────
            Portal to document.body so the div sits outside ProseMirror's
            DOM subtree (prevents the React/ProseMirror insertBefore clash)
            while still belonging to the same React root (so React 19
            synthetic events like onMouseDown fire correctly). */}
        {slash && filteredItems.length > 0 && typeof document !== "undefined" && createPortal(
          <div
            style={{
              position: "fixed",
              top: slash.y + 6,
              left: Math.min(slash.x, window.innerWidth - 260),
              zIndex: 9999,
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: "4px",
              minWidth: "240px",
              maxHeight: "320px",
              overflowY: "auto",
            }}
          >
            {filteredItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeItem(item);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  textAlign: "left",
                  background: i === slashIndex ? "#f1f5f9" : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{
                  width: "32px", height: "32px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: "6px", fontSize: "13px", fontWeight: "700",
                  flexShrink: 0, color: "#334155",
                }}>
                  {item.icon}
                </span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", lineHeight: 1.3 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.3 }}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>,
          document.body
        )}

        {/* ── URL dialog ─────────────────────────────────────────────── */}
        {urlDialog && typeof document !== "undefined" && createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4"
            onMouseDown={cancelUrlDialog}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-slate-900">{URL_DIALOG_COPY[urlDialog.mode].title}</h3>
              <input
                ref={urlInputRef}
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); confirmUrlDialog(); }
                  if (e.key === "Escape") { e.preventDefault(); cancelUrlDialog(); }
                }}
                placeholder={URL_DIALOG_COPY[urlDialog.mode].placeholder}
                className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={cancelUrlDialog} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancelar</button>
                <button type="button" onClick={confirmUrlDialog} disabled={!urlValue.trim()} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">Insertar</button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {editor && (
          <>
            {/* ── Text bubble menu ──────────────────────────────────────── */}
            <BubbleMenu
              editor={editor}
              shouldShow={({ state }) => !state.selection.empty && !editor.isActive("image")}
              tippyOptions={{ duration: 100, placement: "top" }}
            >
              <div className="wysiwyg-bubble-menu">
                <button type="button" title="Negrita (Ctrl+B)"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`wysiwyg-bubble-btn${editor.isActive("bold") ? " wysiwyg-bubble-btn--active" : ""}`}>
                  <strong>B</strong>
                </button>
                <button type="button" title="Cursiva (Ctrl+I)"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`wysiwyg-bubble-btn${editor.isActive("italic") ? " wysiwyg-bubble-btn--active" : ""}`}>
                  <em>I</em>
                </button>
                <button type="button" title="Subrayado (Ctrl+U)"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`wysiwyg-bubble-btn${editor.isActive("underline") ? " wysiwyg-bubble-btn--active" : ""}`}>
                  <u>U</u>
                </button>

                <div className="wysiwyg-bubble-divider" />

                {editor.isActive("link") ? (
                  <button type="button" title="Quitar enlace"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="wysiwyg-bubble-btn">🔗✕</button>
                ) : (
                  <button type="button" title="Insertar enlace"
                    onClick={() => {
                      setUrlValue(String(editor.getAttributes("link").href || ""));
                      setUrlDialog({ mode: "link" });
                    }}
                    className="wysiwyg-bubble-btn">🔗</button>
                )}

                <div className="wysiwyg-bubble-divider" />

                <button type="button" title="H2"
                  onClick={() =>
                    editor.isActive("heading", { level: 2 })
                      ? editor.chain().focus().setParagraph().run()
                      : editor.chain().focus().setNode("heading", { level: 2 }).run()
                  }
                  className={`wysiwyg-bubble-btn${editor.isActive("heading", { level: 2 }) ? " wysiwyg-bubble-btn--active" : ""}`}>
                  H₂
                </button>
                <button type="button" title="H3"
                  onClick={() =>
                    editor.isActive("heading", { level: 3 })
                      ? editor.chain().focus().setParagraph().run()
                      : editor.chain().focus().setNode("heading", { level: 3 }).run()
                  }
                  className={`wysiwyg-bubble-btn${editor.isActive("heading", { level: 3 }) ? " wysiwyg-bubble-btn--active" : ""}`}>
                  H₃
                </button>

                <div className="wysiwyg-bubble-divider" />

                {(["left", "center", "right"] as const).map((align) => (
                  <button key={align} type="button"
                    title={align === "left" ? "Izquierda" : align === "center" ? "Centrado" : "Derecha"}
                    onClick={() => editor.chain().focus().setTextAlign(align).run()}
                    className={`wysiwyg-bubble-btn${getTextAlign(editor) === align ? " wysiwyg-bubble-btn--active" : ""}`}>
                    {align === "left" ? "←" : align === "center" ? "↔" : "→"}
                  </button>
                ))}
              </div>
            </BubbleMenu>

            {/* ── Image bubble menu ─────────────────────────────────────── */}
            <BubbleMenu
              editor={editor}
              shouldShow={({ editor: e }) => e.isActive("image")}
              tippyOptions={{ duration: 100, placement: "bottom" }}
            >
              <div className="wysiwyg-bubble-menu">
                {(() => {
                  const { size: curSize, align: curAlign } = parseImgTitle(
                    editor.getAttributes("image").title ?? null
                  );
                  return (
                    <>
                      {(["small", "medium", "full"] as const).map((size) => (
                        <button key={size} type="button"
                          title={size === "small" ? "Pequeña (33%)" : size === "medium" ? "Mediana (60%)" : "Completa"}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            editor.chain().focus().updateAttributes("image", {
                              title: encodeImgTitle(size, curAlign),
                            }).run();
                          }}
                          className={`wysiwyg-bubble-btn${curSize === size ? " wysiwyg-bubble-btn--active" : ""}`}>
                          {size === "small" ? "S" : size === "medium" ? "M" : "L"}
                        </button>
                      ))}

                      <div className="wysiwyg-bubble-divider" />

                      {(["left", "center", "right"] as const).map((align) => (
                        <button key={align} type="button"
                          title={align === "left" ? "Alinear izquierda" : align === "center" ? "Centrar" : "Alinear derecha"}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            editor.chain().focus().updateAttributes("image", {
                              title: encodeImgTitle(curSize, align),
                            }).run();
                          }}
                          className={`wysiwyg-bubble-btn${curAlign === align ? " wysiwyg-bubble-btn--active" : ""}`}>
                          {align === "left" ? "←" : align === "center" ? "↔" : "→"}
                        </button>
                      ))}
                    </>
                  );
                })()}
              </div>
            </BubbleMenu>
          </>
        )}

        <EditorContent editor={editor} className="wysiwyg-content" />
      </div>
    );
  }
);
WysiwygEditor.displayName = "WysiwygEditor";
