"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SERVICES } from "@/content/services";

const ABOUT_MENU = [
  { href: "/quienes", label: "Quiénes somos" },
  { href: "/etica", label: "Código de Ética" },
  { href: "/nuestra-experiencia", label: "Nuestra experiencia" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="main-header sticky top-0 z-40 border-b border-slate-200/70 bg-tho-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-3 px-4 py-3 md:flex-nowrap md:gap-y-0">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
          <div className="relative h-9 w-32">
            <Image src="/brand/logo-negro.png" alt="The Human Org" fill className="object-contain logo-light" priority />
            <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain logo-dark" priority />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-[12px] font-bold uppercase tracking-wide italic">The Human Org</div>
            <div className="text-[11px] font-bold tracking-wide text-slate-600">Consultoría estratégica · Concepción</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <div className="group relative">
            <button className="tho-nav-chip" type="button">
              Servicios
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-30 w-72 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
                {SERVICES.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/servicios/${service.slug}`}
                    className="main-nav-menu-link block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    {service.menuLabel}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="group relative">
            <button className="tho-nav-chip" type="button">
              Nosotros
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-30 w-64 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
                {ABOUT_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="main-nav-menu-link block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/blog" className={`tho-nav-chip ${pathname.startsWith("/blog") ? "text-slate-950" : "text-slate-700"}`}>
            Blog
          </Link>
        </nav>

        <div className="order-3 flex w-full items-center justify-end gap-2 md:hidden">
          <Link href="/blog" className={`tho-nav-chip ${pathname.startsWith("/blog") ? "text-slate-950" : "text-slate-700"}`}>
            Blog
          </Link>

          <details className="group relative">
            <summary className="list-none tho-nav-chip cursor-pointer">Servicios</summary>
            <div className="absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
              {SERVICES.map((service) => (
                <Link
                  key={`mobile-${service.slug}`}
                  href={`/servicios/${service.slug}`}
                  className="main-nav-menu-link block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {service.menuLabel}
                </Link>
              ))}
            </div>
          </details>

          <details className="group relative">
            <summary className="list-none tho-nav-chip cursor-pointer">Nosotros</summary>
            <div className="absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
              {ABOUT_MENU.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className="main-nav-menu-link block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>

        <div className="order-2 flex items-center gap-2 md:order-none">
          <a
            href="https://bit.ly/bookTHO"
            target="_blank"
            rel="noreferrer"
            className="btn-unified-motion btn-tho-hover-gradient rounded-xl border border-slate-700/20 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white"
          >
            <span className="relative z-10 sm:hidden">Agendar</span>
            <span className="relative z-10 hidden sm:inline">Agendar conversación</span>
          </a>
        </div>
      </div>
    </header>
  );
}
