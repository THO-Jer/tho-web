import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="h-1 w-full bg-gradient-to-r from-tho-blue via-tho-pink to-tho-orange" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="relative mt-0.5 h-10 w-10 shrink-0">
              <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain" />
            </div>
            <div className="text-xs text-slate-300">
              <div className="font-semibold text-slate-100">The Human Org</div>
              <div>Concepción, Chile</div>
            </div>
          </div>

          <div className="grid gap-8 text-left sm:text-right md:grid-cols-2 lg:grid-cols-3 md:gap-10">
            <div className="space-y-2 text-xs">
              <div className="font-bold italic text-slate-100">Nuestros Servicios</div>
              <div className="flex flex-col gap-1.5">
                <Link className="hover:text-white" href="/servicios/sostenibilidad-corporativa">
                  Sostenibilidad Corporativa
                </Link>
                <Link className="hover:text-white" href="/servicios/relacionamiento-comunitario">
                  Relacionamiento Comunitario
                </Link>
                <Link className="hover:text-white" href="/servicios/desarrollo-organizacional">
                  Desarrollo Organizacional
                </Link>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold italic text-slate-100">Nosotros</div>
              <div className="flex flex-col gap-1.5">
                <Link className="hover:text-white" href="/quienes">
                  Quiénes somos
                </Link>
                <Link className="hover:text-white" href="/etica">
                  Código de Ética
                </Link>
                <Link className="hover:text-white" href="/nuestra-experiencia">
                  Nuestra experiencia
                </Link>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div aria-hidden className="h-4" />
              <div className="flex flex-col gap-1.5">
                <Link className="hover:text-white" href="/blog">
                  Blog
                </Link>
                <a className="hover:text-white" href="mailto:hola@tho.cl">
                  Contacto
                </a>
                <div aria-hidden className="h-4" />
                <Link className="hover:text-white" href="/studio">
                  Interno
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} The Human Org</div>
          <div className="text-slate-500">Humanidad · Colaboración · Adaptabilidad</div>
        </div>
      </div>
    </footer>
  );
}
