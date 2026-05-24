"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
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

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: "full",
        parseHTML: (el) => el.getAttribute("data-size") ?? "full",
        renderHTML: (attrs) => ({ "data-size": attrs.size ?? "full" }),
      },
      align: {
        default: "center",
        parseHTML: (el) => el.getAttribute("data-align") ?? "center",
        renderHTML: (attrs) => ({ "data-align": attrs.align ?? "center" }),
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
    command: ({ editor, range }) => {
      const url = window.prompt("URL del video de YouTube");
      if (url)
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({ type: "paragraph", content: [{ type: "text", text: url }] })
          .run();
    },
  },
  {
    id: "pdf",
    label: "PDF",
    description: "Embeber documento PDF",
    icon: "📄",
    command: ({ editor, range }) => {
      const url = window.prompt("URL del PDF");
      if (url)
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({ type: "paragraph", content: [{ type: "text", text: url }] })
          .run();
    },
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
      item.command({ editor, range: { from, to } });
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
            Rendered in JSX (same React tree / root) so synthetic events
            work correctly with React 19. Previously used ReactRenderer
            which creates a separate React root — that breaks onMouseDown
            event handling in React 19. */}
        {slash && filteredItems.length > 0 && (
          <div
            style={{
              position: "fixed",
              top: slash.y + 6,
              left: Math.min(slash.x, (typeof window !== "undefined" ? window.innerWidth : 1200) - 260),
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
          </div>
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
                      const url = window.prompt("URL del enlace");
                      if (url) editor.chain().focus().setLink({ href: url }).run();
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
                {(["small", "medium", "full"] as const).map((size) => {
                  const current = editor.getAttributes("image").size ?? "full";
                  return (
                    <button key={size} type="button"
                      title={size === "small" ? "Pequeña (33%)" : size === "medium" ? "Mediana (60%)" : "Completa"}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().updateAttributes("image", { size }).run();
                      }}
                      className={`wysiwyg-bubble-btn${current === size ? " wysiwyg-bubble-btn--active" : ""}`}>
                      {size === "small" ? "S" : size === "medium" ? "M" : "L"}
                    </button>
                  );
                })}

                <div className="wysiwyg-bubble-divider" />

                {(["left", "center", "right"] as const).map((align) => {
                  const current = editor.getAttributes("image").align ?? "center";
                  return (
                    <button key={align} type="button"
                      title={align === "left" ? "Alinear izquierda" : align === "center" ? "Centrar" : "Alinear derecha"}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().updateAttributes("image", { align }).run();
                      }}
                      className={`wysiwyg-bubble-btn${current === align ? " wysiwyg-bubble-btn--active" : ""}`}>
                      {align === "left" ? "←" : align === "center" ? "↔" : "→"}
                    </button>
                  );
                })}
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
