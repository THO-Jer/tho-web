"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cx } from "@/lib/utils";

const HOME_NAV = [
  { id: "tickets", label: "Tickets" },
  { id: "metodo", label: "Método" },
  { id: "recursos", label: "Recursos" },
  { id: "blog", label: "Blog" },
];

const SITE_NAV = [
  { href: "/tickets", label: "Tickets" },
  { href: "/blog", label: "Blog" },
  { href: "/etica", label: "Código de Ética" },
  { href: "/quienes", label: "Quiénes somos" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-2xl bg-white">
            <Image
              src="/brand/logo-small.png"
              alt="The Human Org"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">The Human Org</div>
            <div className="text-xs text-slate-500">Consultoría estratégica · Concepción</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {isHome
            ? HOME_NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cx(
                    "rounded-xl px-3 py-2 text-sm transition",
                    "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {item.label}
                </button>
              ))
            : SITE_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "rounded-xl px-3 py-2 text-sm transition",
                    pathname.startsWith(item.href)
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://bit.ly/bookTHO"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
          >
            Agendar conversación
          </a>
        </div>
      </div>
    </header>
  );
}
