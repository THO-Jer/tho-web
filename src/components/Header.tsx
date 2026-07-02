"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { SERVICES } from "@/content/services";
import { BOOK_URL } from "@/lib/links";

const menuPanelClass =
  "rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900";

const menuLinkClass =
  "main-nav-menu-link block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const tabletServicesRef = useRef<HTMLDetailsElement>(null);
  const tabletQuienesRef = useRef<HTMLDetailsElement>(null);

  const closeMobileMenu = () => setMobileOpen(false);
  const closeTabletMenus = () => {
    tabletServicesRef.current?.removeAttribute("open");
    tabletQuienesRef.current?.removeAttribute("open");
  };

  const isQuienes = pathname === "/quienes" || pathname === "/nuestra-experiencia";
  const isServicios = pathname.startsWith("/servicios");
  const isBlog = pathname.startsWith("/blog");

  return (
    <header className="main-header sticky top-0 z-40 border-b border-slate-200/70 bg-tho-bg/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMobileMenu}>
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/brand/logo-negro.svg"
              alt="The Human Org"
              fill
              sizes="40px"
              className="object-contain logo-light"
              priority
              unoptimized
            />
            <Image
              src="/brand/logo-blanco.svg"
              alt="The Human Org"
              fill
              sizes="40px"
              className="object-contain logo-dark"
              priority
              unoptimized
            />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-[12px] font-bold uppercase tracking-wide italic dark:text-slate-100">The Human Org</div>
            <div className="text-[11px] font-bold tracking-wide text-slate-600 dark:text-slate-400">Consultoría estratégica · Concepción</div>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 xl:flex">
          <div className="group relative">
            <button className={`tho-nav-link ${isServicios ? "is-active" : ""}`} type="button">
              Servicios
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-30 w-72 pt-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className={menuPanelClass}>
                {SERVICES.map((service) => (
                  <Link key={service.slug} href={`/servicios/${service.slug}`} className={menuLinkClass}>
                    {service.menuLabel}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="group relative">
            <button className={`tho-nav-link ${isQuienes ? "is-active" : ""}`} type="button">
              Quiénes somos
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-30 w-64 pt-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className={menuPanelClass}>
                <Link href="/quienes" className={menuLinkClass}>Quiénes somos</Link>
                <Link href="/nuestra-experiencia" className={menuLinkClass}>Nuestra experiencia</Link>
              </div>
            </div>
          </div>
          <Link href="/blog" className={`tho-nav-link ${isBlog ? "is-active" : ""}`}>
            Blog
          </Link>
          <a href={BOOK_URL} target="_blank" rel="noreferrer" className="btn-unified-motion btn-tho-hover-gradient rounded-xl border border-slate-700/20 bg-slate-900 px-4 py-2 text-sm font-bold text-white">
            <span className="relative z-10">Agendar</span>
          </a>
        </nav>

        {/* Tablet */}
        <nav className="hidden items-center gap-5 md:flex xl:hidden">
          <details ref={tabletServicesRef} className="group relative">
            <summary className={`tho-nav-link list-none cursor-pointer ${isServicios ? "is-active" : ""}`}>Servicios</summary>
            <div className={`absolute right-0 z-50 mt-3 w-72 ${menuPanelClass}`}>
              {SERVICES.map((service) => (
                <Link key={`tablet-${service.slug}`} href={`/servicios/${service.slug}`} onClick={closeTabletMenus} className={menuLinkClass}>
                  {service.menuLabel}
                </Link>
              ))}
            </div>
          </details>
          <details ref={tabletQuienesRef} className="group relative">
            <summary className={`tho-nav-link list-none cursor-pointer ${isQuienes ? "is-active" : ""}`}>Quiénes</summary>
            <div className={`absolute right-0 z-50 mt-3 w-56 ${menuPanelClass}`}>
              <Link href="/quienes" onClick={closeTabletMenus} className={menuLinkClass}>Quiénes somos</Link>
              <Link href="/nuestra-experiencia" onClick={closeTabletMenus} className={menuLinkClass}>Nuestra experiencia</Link>
            </div>
          </details>
          <Link href="/blog" onClick={closeTabletMenus} className={`tho-nav-link ${isBlog ? "is-active" : ""}`}>Blog</Link>
          <a href={BOOK_URL} target="_blank" rel="noreferrer" className="btn-unified-motion btn-tho-hover-gradient rounded-xl border border-slate-700/20 bg-slate-900 px-4 py-2 text-sm font-bold text-white">
            <span className="relative z-10">Agendar</span>
          </a>
        </nav>

        {/* Toggle móvil — hamburguesa */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="nav-burger inline-flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-slate-300 md:hidden dark:border-slate-700"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <span className={`nav-burger-line ${mobileOpen ? "is-open-top" : ""}`} />
          <span className={`nav-burger-line ${mobileOpen ? "is-open-mid" : ""}`} />
          <span className={`nav-burger-line ${mobileOpen ? "is-open-bot" : ""}`} />
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="grid gap-1">
            <p className="px-3 pb-1 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Servicios</p>
            {SERVICES.map((service) => (
              <Link
                key={`mobile-${service.slug}`}
                href={`/servicios/${service.slug}`}
                onClick={closeMobileMenu}
                className={menuLinkClass}
              >
                {service.menuLabel}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Nosotros</p>
            <Link href="/quienes" onClick={closeMobileMenu} className={menuLinkClass}>Quiénes somos</Link>
            <Link href="/nuestra-experiencia" onClick={closeMobileMenu} className={menuLinkClass}>Nuestra experiencia</Link>
            <Link href="/blog" onClick={closeMobileMenu} className={menuLinkClass}>Blog</Link>
            <a href={BOOK_URL} target="_blank" rel="noreferrer" className="btn-unified-motion btn-tho-hover-gradient mt-3 inline-flex justify-center rounded-xl border border-slate-700/20 bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">
              <span className="relative z-10">Agendar</span>
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
