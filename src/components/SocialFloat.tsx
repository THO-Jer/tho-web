import Link from "next/link";

const items = [
  {
    href: "https://wa.me/+56998270982",
    label: "Hablemos por Wsp",
    aria: "Contactar por WhatsApp",
    tone: "bg-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.52 0 .19 5.33.19 11.88c0 2.1.55 4.16 1.6 5.97L0 24l6.34-1.66a11.8 11.8 0 0 0 5.73 1.46h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.15-3.44-8.44ZM12.08 21.8h-.01a9.8 9.8 0 0 1-4.99-1.36l-.36-.22-3.76.99 1-3.66-.24-.38a9.82 9.82 0 0 1-1.53-5.29c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.03 6.95 2.89a9.78 9.78 0 0 1 2.88 6.94c0 5.42-4.42 9.83-9.84 9.83Zm5.39-7.36c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.5-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.07 4.47.71.31 1.27.5 1.7.64.71.22 1.35.19 1.86.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"/>
      </svg>
    ),
  },
  {
    href: "https://instagram.com/thehumanorg/",
    label: "Síguenos en Instagram",
    aria: "Abrir Instagram de The Human Org",
    tone: "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 6.85a5.15 5.15 0 1 1 0 10.3 5.15 5.15 0 0 1 0-10.3Zm0 1.8a3.35 3.35 0 1 0 0 6.7 3.35 3.35 0 0 0 0-6.7Z"/>
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/company/thocl",
    label: "Síguenos en LinkedIn",
    aria: "Abrir LinkedIn de The Human Org",
    tone: "bg-[#0A66C2]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M4.98 3.5a2.49 2.49 0 1 1 0 4.98 2.49 2.49 0 0 1 0-4.98ZM2.8 9.4h4.36V21H2.8V9.4Zm7.03 0h4.18v1.58h.06c.58-1.1 2-2.27 4.11-2.27 4.39 0 5.2 2.89 5.2 6.65V21h-4.35v-5.06c0-1.2-.02-2.75-1.68-2.75-1.68 0-1.94 1.31-1.94 2.66V21H9.83V9.4Z"/>
      </svg>
    ),
  },
];

export function SocialFloat() {
  return (
    <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.aria}
          className="group relative"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-transform duration-200 group-hover:scale-110 ${item.tone}`}
          >
            {item.icon}
          </span>
          <span className="pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 rounded-md bg-slate-900 px-2.5 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
