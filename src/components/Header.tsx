"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SERVICES } from "@/content/services";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="main-header sticky top-0 z-40 border-b border-slate-200/70 bg-tho-bg/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMobileMenu}>
          <div className="relative h-9 w-32">
            <Image src="/brand/logo-negro.png" alt="The Human Org" fill className="object-contain logo-light" priority />
            <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain logo-dark" priority />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-[12px] font-bold uppercase tracking-wide italic dark:text-slate-100">The Human Org</div>
            <div className="text-[11px] font-bold tracking-wide text-slate-600 dark:text-slate-400">Consultoría estratégica · Concepción</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          <div className="group relative">
            <button className="tho-nav-chip" type="button">Servicios</button>
            <div className="pointer-events-none absolute left-0 top-full z-30 w-72 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-md dark:border-slate-700 dark:bg-slate-900">
                {SERVICES.map((service) => (
                  <Link key={service.slug} href={`/servicios/${service.slug}`} className="main-nav-menu-link block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                    {service.menuLabel}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/quienes" className={`tho-nav-chip ${pathname === "/quienes" ? "text-slate-950 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>Quiénes somos</Link>
          <Link href="/blog" className={`tho-nav-chip ${pathname.startsWith("/blog") ? "text-slate-950 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>Blog</Link>
          <a href="https://bit.ly/bookTHO" target="_blank" rel="noreferrer" className="btn-unified-motion btn-tho-hover-gradient rounded-xl border border-slate-700/20 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
            <span className="relative z-10">Agendar</span>
          </a>
        </nav>

        <nav className="hidden items-center gap-2 md:flex xl:hidden">
          <details className="group relative">
            <summary className="list-none tho-nav-chip cursor-pointer">Servicios</summary>
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-md dark:border-slate-700 dark:bg-slate-900">
              {SERVICES.map((service) => (
                <Link key={`tablet-${service.slug}`} href={`/servicios/${service.slug}`} className="main-nav-menu-link block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                  {service.menuLabel}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/quienes" className={`tho-nav-chip ${pathname === "/quienes" ? "text-slate-950 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>Quiénes</Link>
          <Link href="/blog" className={`tho-nav-chip ${pathname.startsWith("/blog") ? "text-slate-950 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>Blog</Link>
          <a href="https://bit.ly/bookTHO" target="_blank" rel="noreferrer" className="btn-unified-motion btn-tho-hover-gradient rounded-xl border border-slate-700/20 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
            <span className="relative z-10">Agendar</span>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 md:hidden dark:border-slate-700 dark:text-slate-200"
          aria-expanded={mobileOpen}
          aria-label="Abrir menú"
        >
          Menú
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-2">
            <div className="rounded-xl border border-slate-200 p-2 dark:border-slate-700">
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Servicios</p>
              {SERVICES.map((service) => (
                <Link
                  key={`mobile-${service.slug}`}
                  href={`/servicios/${service.slug}`}
                  onClick={closeMobileMenu}
                  className="main-nav-menu-link block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  {service.menuLabel}
                </Link>
              ))}
            </div>
            <Link href="/quienes" onClick={closeMobileMenu} className="tho-nav-chip text-slate-700 dark:text-slate-300">Quiénes somos</Link>
            <Link href="/blog" onClick={closeMobileMenu} className="tho-nav-chip text-slate-700 dark:text-slate-300">Blog</Link>
            <a href="https://bit.ly/bookTHO" target="_blank" rel="noreferrer" className="btn-unified-motion btn-tho-hover-gradient inline-flex justify-center rounded-xl border border-slate-700/20 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
              <span className="relative z-10">Agendar</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
