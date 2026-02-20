"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cx } from "@/lib/utils";

const HOME_NAV = [
  { id: "servicios", label: "Servicios", tone: "btn-brand-accent-pink" },
  { id: "entradas", label: "Soluciones", tone: "btn-brand-accent-blue" },
  { id: "metodo", label: "Método", tone: "btn-brand-accent-orange" },
  { id: "recursos", label: "Recursos", tone: "btn-brand-accent-yellow" },
  { id: "blog", label: "Blog", tone: "btn-brand-accent-green" },
];

const SITE_NAV = [
  { href: "/tickets", label: "Tickets", tone: "btn-brand-accent-blue" },
  { href: "/blog", label: "Blog", tone: "btn-brand-accent-green" },
  { href: "/etica", label: "Código de Ética", tone: "btn-brand-accent-orange" },
  { href: "/quienes", label: "Quiénes somos", tone: "btn-brand-accent-pink" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-tho-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo completo + texto lateral en TT Firs Neue */}
          <div className="relative h-9 w-32">
            <Image
              src="/brand/logo-negro.png"
              alt="The Human Org"
              fill
              className="object-contain logo-light"
              priority
            />
            <Image
              src="/brand/logo-blanco.png"
              alt="The Human Org"
              fill
              className="object-contain logo-dark"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-bold uppercase tracking-wide">The Human Org</div>
            <div className="text-[11px] font-bold tracking-wide text-slate-600">
              Consultoría estratégica · Concepción
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {isHome
            ? HOME_NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cx(
                    "btn-unified-motion btn-brand-accent rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 transition",
                    item.tone
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
                    "btn-unified-motion btn-brand-accent rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide transition",
                    item.tone,
                    pathname.startsWith(item.href)
                      ? "text-slate-950"
                      : "text-slate-700"
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
            className="btn-unified-motion btn-tho-hover-gradient rounded-xl border border-slate-700/20 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white"
          >
            <span className="relative z-10">Agendar conversación</span>
          </a>
        </div>
      </div>
    </header>
  );
}
