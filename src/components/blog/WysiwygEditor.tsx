"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { BubbleMenu, EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Extension, type Editor, type Range } from "@tiptap/core";
import Suggestion, { type SuggestionProps, type SuggestionKeyDownProps } from "@tiptap/suggestion";

// ─────────────────────────────────────────────────────────────────────────────
// Custom Image node — extends the base with size and align attributes.
// These are editor-visual only: size constrains the preview canvas,
// align shifts the image left/center/right. Neither persists to markdown
// (plain markdown has no image sizing syntax), so they reset on reload.
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
      editor?.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
  },
  {
    id: "h3",
    label: "Título H3",
    description: "Sub-sección",
    icon: "H₃",
    command: ({ editor, range }) =>
      editor?.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run(),
  },
  {
    id: "quote",
    label: "Cita",
    description: "Bloque de cita destacada",
    icon: "❝",
    command: ({ editor, range }) =>
      editor?.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    id: "list",
    label: "Lista",
    description: "Lista con viñetas",
    icon: "•",
    command: ({ editor, range }) =>
      editor?.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    id: "divider",
    label: "Separador",
    description: "Línea horizontal",
    icon: "—",
    command: ({ editor, range }) =>
      editor?.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Embeber video de YouTube",
    icon: "▶",
    command: ({ editor, range }) => {
      const url = window.prompt("URL del video de YouTube");
      if (url) {
        editor
          ?.chain()
          .focus()
          .deleteRange(range)
          .insertContent({ type: "paragraph", content: [{ type: "text", text: url }] })
          .run();
      }
    },
  },
  {
    id: "pdf",
    label: "PDF",
    description: "Embeber documento PDF",
    icon: "📄",
    command: ({ editor, range }) => {
      const url = window.prompt("URL del PDF");
      if (url) {
        editor
          ?.chain()
          .focus()
          .deleteRange(range)
          .insertContent({ type: "paragraph", content: [{ type: "text", text: url }] })
          .run();
      }
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Slash-command list (dropdown popup)
// ─────────────────────────────────────────────────────────────────────────────

type SlashListProps = {
  items: SlashItem[];
  command: (item: SlashItem) => void;
};

type SlashListHandle = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

const SlashCommandList = forwardRef<SlashListHandle, SlashListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((i) => (i + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelectedIndex((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          if (items[selectedIndex]) command(items[selectedIndex]);
          return true;
        }
        return false;
      },
    }));

    useEffect(() => { setSelectedIndex(0); }, [items]);

    return (
      <div style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        padding: "4px",
        minWidth: "240px",
        maxHeight: "320px",
        overflowY: "auto",
      }}>
        {items.length === 0 ? (
          <div style={{ padding: "8px 12px", fontSize: "13px", color: "#94a3b8" }}>
            Sin resultados
          </div>
        ) : (
          items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(e) => {
                // Fire on mousedown so the command runs before the editor
                // blurs and Suggestion's onExit destroys the popup.
                e.preventDefault();
                command(item);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                textAlign: "left",
                background: i === selectedIndex ? "#f1f5f9" : "transparent",
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
          ))
        )}
      </div>
    );
  }
);
SlashCommandList.displayName = "SlashCommandList";

// ─────────────────────────────────────────────────────────────────────────────
// Slash-command Tiptap Extension
// ─────────────────────────────────────────────────────────────────────────────

const SlashCommandExtension = Extension.create({
  name: "slashCommand",
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        items: ({ query }: { query: string }) =>
          SLASH_ITEMS.filter(
            (item) =>
              item.label.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
          ),
        render: () => {
          let renderer: ReactRenderer<SlashListHandle>;
          let el: HTMLDivElement;

          const position = (props: SuggestionProps<SlashItem>) => {
            const rect = props.clientRect?.();
            if (rect && el) {
              el.style.top = `${rect.bottom + 6}px`;
              el.style.left = `${Math.min(rect.left, window.innerWidth - 260)}px`;
            }
          };

          return {
            onStart(props: SuggestionProps<SlashItem>) {
              renderer = new ReactRenderer(SlashCommandList, {
                props: {
                  items: props.items,
                  command: (item: SlashItem) =>
                    props.command({ editor: props.editor, range: props.range, props: item }),
                },
                editor: props.editor,
              });

              el = document.createElement("div");
              el.style.cssText = "position:fixed;z-index:9999;";
              el.dataset.slashPopup = "1";
              document.body.appendChild(el);
              el.appendChild(renderer.element);
              position(props);
            },
            onUpdate(props: SuggestionProps<SlashItem>) {
              renderer.updateProps({
                items: props.items,
                command: (item: SlashItem) =>
                  props.command({ editor: props.editor, range: props.range, props: item }),
              });
              position(props);
            },
            onKeyDown(props: SuggestionKeyDownProps) {
              if (props.event.key === "Escape") {
                el?.remove();
                renderer?.destroy();
                return true;
              }
              return renderer.ref?.onKeyDown({ event: props.event }) ?? false;
            },
            onExit() {
              el?.remove();
              renderer?.destroy();
            },
          };
        },
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: SlashItem }) => {
          props.command({ editor, range });
        },
      }),
    ];
  },
});

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

// Helper: returns "left" | "center" | "right" for the current selection.
// TextAlign stores the value as an attribute on paragraph/heading nodes.
function getTextAlign(editor: Editor): "left" | "center" | "right" {
  if (editor.isActive({ textAlign: "center" })) return "center";
  if (editor.isActive({ textAlign: "right" })) return "right";
  return "left";
}

export const WysiwygEditor = forwardRef<WysiwygEditorHandle, WysiwygEditorProps>(
  ({ value, onChange, disabled = false }, ref) => {
    // Keep a stable ref to onChange so the useEditor closure never goes stale.
    // useEditor captures callbacks at mount time and doesn't re-run when props change.
    const onChangeRef = useRef(onChange);
    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

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
        SlashCommandExtension,
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor: e }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const md = (e.storage.markdown as any).getMarkdown() as string;
        onChangeRef.current(md);
      },
    });

    // If the component unmounts while the slash menu is open, Tiptap's Suggestion
    // plugin does NOT call onExit, so the popup div stays in document.body.
    useEffect(() => {
      return () => {
        document.querySelectorAll("[data-slash-popup]").forEach((el) => el.remove());
      };
    }, []);

    // Sync when a different post is loaded externally (fillForm)
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

    useImperativeHandle(ref, () => ({
      insertImage: (src, alt = "") => {
        editor?.chain().focus().setImage({ src, alt }).run();
      },
      insertLink: (text, url) => {
        // Insert linked text then immediately exit the link mark so the cursor
        // lands in plain text rather than staying "inside" the hyperlink.
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "text", text, marks: [{ type: "link", attrs: { href: url } }] })
          .unsetMark("link")
          .insertContent(" ")
          .run();
      },
    }));

    return (
      <div className="wysiwyg-root">
        {editor && (
          <>
            {/* ── Text bubble menu ─────────────────────────────────────────── */}
            <BubbleMenu
              editor={editor}
              shouldShow={({ state }) => !state.selection.empty && !editor.isActive("image")}
              tippyOptions={{ duration: 100, placement: "top" }}
            >
              <div className="wysiwyg-bubble-menu">
                <button
                  type="button"
                  title="Negrita (Ctrl+B)"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`wysiwyg-bubble-btn${editor.isActive("bold") ? " wysiwyg-bubble-btn--active" : ""}`}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  title="Cursiva (Ctrl+I)"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`wysiwyg-bubble-btn${editor.isActive("italic") ? " wysiwyg-bubble-btn--active" : ""}`}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  title="Subrayado (Ctrl+U)"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`wysiwyg-bubble-btn${editor.isActive("underline") ? " wysiwyg-bubble-btn--active" : ""}`}
                >
                  <u>U</u>
                </button>

                <div className="wysiwyg-bubble-divider" />

                {editor.isActive("link") ? (
                  <button type="button" title="Quitar enlace" onClick={() => editor.chain().focus().unsetLink().run()} className="wysiwyg-bubble-btn">
                    🔗✕
                  </button>
                ) : (
                  <button
                    type="button"
                    title="Insertar enlace"
                    onClick={() => {
                      const url = window.prompt("URL del enlace");
                      if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className="wysiwyg-bubble-btn"
                  >
                    🔗
                  </button>
                )}

                <div className="wysiwyg-bubble-divider" />

                <button
                  type="button"
                  title="H2"
                  onClick={() =>
                    editor.isActive("heading", { level: 2 })
                      ? editor.chain().focus().setParagraph().run()
                      : editor.chain().focus().setNode("heading", { level: 2 }).run()
                  }
                  className={`wysiwyg-bubble-btn${editor.isActive("heading", { level: 2 }) ? " wysiwyg-bubble-btn--active" : ""}`}
                >
                  H₂
                </button>
                <button
                  type="button"
                  title="H3"
                  onClick={() =>
                    editor.isActive("heading", { level: 3 })
                      ? editor.chain().focus().setParagraph().run()
                      : editor.chain().focus().setNode("heading", { level: 3 }).run()
                  }
                  className={`wysiwyg-bubble-btn${editor.isActive("heading", { level: 3 }) ? " wysiwyg-bubble-btn--active" : ""}`}
                >
                  H₃
                </button>

                <div className="wysiwyg-bubble-divider" />

                {/* Text alignment */}
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    title={align === "left" ? "Izquierda" : align === "center" ? "Centrado" : "Derecha"}
                    onClick={() => editor.chain().focus().setTextAlign(align).run()}
                    className={`wysiwyg-bubble-btn${getTextAlign(editor) === align ? " wysiwyg-bubble-btn--active" : ""}`}
                  >
                    {align === "left" ? "←" : align === "center" ? "↔" : "→"}
                  </button>
                ))}
              </div>
            </BubbleMenu>

            {/* ── Image bubble menu ────────────────────────────────────────── */}
            <BubbleMenu
              editor={editor}
              shouldShow={({ editor: e }) => e.isActive("image")}
              tippyOptions={{ duration: 100, placement: "bottom" }}
            >
              <div className="wysiwyg-bubble-menu">
                {/* Size */}
                {(["small", "medium", "full"] as const).map((size) => {
                  const current = editor.getAttributes("image").size ?? "full";
                  return (
                    <button
                      key={size}
                      type="button"
                      title={size === "small" ? "Pequeña (33%)" : size === "medium" ? "Mediana (60%)" : "Completa"}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().updateAttributes("image", { size }).run();
                      }}
                      className={`wysiwyg-bubble-btn${current === size ? " wysiwyg-bubble-btn--active" : ""}`}
                    >
                      {size === "small" ? "S" : size === "medium" ? "M" : "L"}
                    </button>
                  );
                })}

                <div className="wysiwyg-bubble-divider" />

                {/* Alignment */}
                {(["left", "center", "right"] as const).map((align) => {
                  const current = editor.getAttributes("image").align ?? "center";
                  return (
                    <button
                      key={align}
                      type="button"
                      title={align === "left" ? "Alinear izquierda" : align === "center" ? "Centrar" : "Alinear derecha"}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        editor.chain().focus().updateAttributes("image", { align }).run();
                      }}
                      className={`wysiwyg-bubble-btn${current === align ? " wysiwyg-bubble-btn--active" : ""}`}
                    >
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
