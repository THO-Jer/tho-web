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
import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

// ─────────────────────────────────────────────────────────────────────────────
// Slash-command items
// ─────────────────────────────────────────────────────────────────────────────

type SlashItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
  command: (args: { editor: ReturnType<typeof useEditor>; range: { from: number; to: number } }) => void;
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
    id: "image",
    label: "Imagen (URL)",
    description: "Insertar imagen desde URL",
    icon: "🖼",
    command: ({ editor, range }) => {
      const url = window.prompt("URL de la imagen");
      if (url) editor?.chain().focus().deleteRange(range).setImage({ src: url }).run();
    },
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
              onClick={() => command(item)}
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

          return {
            onStart(props: Record<string, unknown>) {
              const items = props.items as SlashItem[];
              renderer = new ReactRenderer(SlashCommandList, {
                props: {
                  items,
                  command: (item: SlashItem) =>
                    (props.command as (args: { editor: unknown; range: unknown; props: unknown }) => void)({
                      editor: props.editor,
                      range: props.range,
                      props: item,
                    }),
                },
                editor: props.editor as Parameters<typeof ReactRenderer>[1]["editor"],
              });

              el = document.createElement("div");
              el.style.cssText = "position:fixed;z-index:9999;";
              document.body.appendChild(el);
              el.appendChild(renderer.element);

              const rect = (props.clientRect as (() => DOMRect | null) | null)?.();
              if (rect) {
                el.style.top = `${rect.bottom + 6}px`;
                el.style.left = `${Math.min(rect.left, window.innerWidth - 260)}px`;
              }
            },
            onUpdate(props: Record<string, unknown>) {
              const items = props.items as SlashItem[];
              renderer.updateProps({
                items,
                command: (item: SlashItem) =>
                  (props.command as (args: { editor: unknown; range: unknown; props: unknown }) => void)({
                    editor: props.editor,
                    range: props.range,
                    props: item,
                  }),
              });
              const rect = (props.clientRect as (() => DOMRect | null) | null)?.();
              if (rect) {
                el.style.top = `${rect.bottom + 6}px`;
                el.style.left = `${Math.min(rect.left, window.innerWidth - 260)}px`;
              }
            },
            onKeyDown(props: Record<string, unknown>) {
              if ((props.event as KeyboardEvent).key === "Escape") {
                el?.remove();
                renderer?.destroy();
                return true;
              }
              return renderer.ref?.onKeyDown(props as { event: KeyboardEvent }) ?? false;
            },
            onExit() {
              el?.remove();
              renderer?.destroy();
            },
          };
        },
        command: ({
          editor,
          range,
          props,
        }: {
          editor: ReturnType<typeof useEditor>;
          range: { from: number; to: number };
          props: SlashItem;
        }) => {
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

export const WysiwygEditor = forwardRef<WysiwygEditorHandle, WysiwygEditorProps>(
  ({ value, onChange, disabled = false }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Markdown as any).configure({
          html: false,
          bulletListMarker: "-",
          transformPastedText: true,
        }),
        TiptapImage.configure({ inline: false, allowBase64: false }),
        TiptapLink.configure({ openOnClick: false, autolink: false, linkOnPaste: false }),
        Placeholder.configure({
          placeholder: 'Escribe "/" para insertar un bloque, o empieza a escribir...',
        }),
        SlashCommandExtension,
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor: e }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const md = (e.storage.markdown as any).getMarkdown() as string;
        onChange(md);
      },
    });

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
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "text", text, marks: [{ type: "link", attrs: { href: url } }] })
          .run();
      },
    }));

    return (
      <div className="wysiwyg-root">
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100, placement: "top" }}>
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
            </div>
          </BubbleMenu>
        )}
        <EditorContent editor={editor} className="wysiwyg-content" />
      </div>
    );
  }
);
WysiwygEditor.displayName = "WysiwygEditor";
