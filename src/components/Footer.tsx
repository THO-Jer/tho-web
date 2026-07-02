import Image from "next/image";
import Link from "next/link";

const kickerClass = "text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400";
const linkClass = "footer-link w-fit text-slate-300 transition-colors hover:text-white sm:ml-auto";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      {/* Franja de marca completa (5 colores) */}
      <div className="h-1 w-full brand-block-divider" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-start gap-3">
              <div className="relative mt-0.5 h-10 w-10 shrink-0">
                <Image
                  src="/brand/logo-blanco.svg"
                  alt="The Human Org"
                  fill
                  sizes="40px"
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="text-xs text-slate-300">
                <div className="font-semibold text-slate-100">The Human Org</div>
                <div>Concepción, Chile</div>
              </div>
            </div>
            <p className="font-tho-title mt-6 max-w-[16rem] text-2xl leading-tight text-slate-100">
              Estrategias que se sostienen en el tiempo.
            </p>
          </div>

          <div className="grid gap-8 text-left sm:text-right md:grid-cols-2 lg:grid-cols-3 md:gap-10">
            <div className="space-y-3 text-sm">
              <div className={kickerClass}>Servicios</div>
              <div className="flex flex-col gap-2">
                <Link className={linkClass} href="/servicios/sostenibilidad-corporativa">
                  Sostenibilidad Corporativa
                </Link>
                <Link className={linkClass} href="/servicios/relacionamiento-comunitario">
                  Relacionamiento Comunitario
                </Link>
                <Link className={linkClass} href="/servicios/desarrollo-organizacional">
                  Desarrollo Organizacional
                </Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className={kickerClass}>Nosotros</div>
              <div className="flex flex-col gap-2">
                <Link className={linkClass} href="/quienes">
                  Quiénes somos
                </Link>
                <Link className={linkClass} href="/nuestra-experiencia">
                  Nuestra experiencia
                </Link>
                <Link className={linkClass} href="/etica">
                  Código de Ética
                </Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className={kickerClass}>Recursos</div>
              <div className="flex flex-col gap-2">
                <Link className={linkClass} href="/blog">
                  Blog
                </Link>
                <a className={linkClass} href="mailto:hola@tho.cl">
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-800 pt-6 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} The Human Org</div>
          <div className="text-slate-500">Humanidad · Colaboración · Adaptabilidad</div>
        </div>
      </div>
    </footer>
  );
}
