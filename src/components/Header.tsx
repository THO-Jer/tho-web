"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SERVICES } from "@/content/services";
import { cx } from "@/lib/utils";

const HOME_NAV = [{ id: "blog", label: "Blog", tone: "btn-brand-accent-green" }];

const ABOUT_MENU = [
  { href: "/quienes", label: "Quiénes somos" },
  { href: "/etica", label: "Código de Ética" },
  { href: "/#experiencia", label: "Nuestra experiencia" },
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
          <div className="relative h-9 w-32">
            <Image src="/brand/logo-negro.png" alt="The Human Org" fill className="object-contain logo-light" priority />
            <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain logo-dark" priority />
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-bold uppercase tracking-wide">The Human Org</div>
            <div className="text-[11px] font-bold tracking-wide text-slate-600">Consultoría estratégica · Concepción</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <div className="group relative">
            <button
              className="btn-unified-motion btn-brand-accent btn-brand-accent-pink rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-700"
              type="button"
              onClick={() => {
                if (isHome) scrollTo("servicios");
              }}
            >
              Servicios
            </button>
            <div className="pointer-events-none absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-md transition group-hover:pointer-events-auto group-hover:opacity-100">
              {SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/soluciones/${service.slug}`}
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {service.menuLabel}
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative">
            <button
              className="btn-unified-motion btn-brand-accent btn-brand-accent-orange rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-700"
              type="button"
            >
              Nosotros
            </button>
            <div className="pointer-events-none absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-md transition group-hover:pointer-events-auto group-hover:opacity-100">
              {ABOUT_MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

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
                    pathname.startsWith(item.href) ? "text-slate-950" : "text-slate-700"
                  )}
                >
                  {item.label}
                </Link>
              ))}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <details className="group relative">
            <summary className="list-none btn-unified-motion btn-brand-accent btn-brand-accent-pink cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-700">
              Servicios
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
              {SERVICES.map((service) => (
                <Link
                  key={`mobile-${service.slug}`}
                  href={`/soluciones/${service.slug}`}
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {service.menuLabel}
                </Link>
              ))}
            </div>
          </details>

          <details className="group relative">
            <summary className="list-none btn-unified-motion btn-brand-accent btn-brand-accent-orange cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-700">
              Nosotros
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
              {ABOUT_MENU.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>

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
