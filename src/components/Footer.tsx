import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="h-1 w-full bg-gradient-to-r from-tho-blue via-tho-pink to-tho-orange" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image src="/brand/logo-blanco.png" alt="The Human Org" fill className="object-contain" />
            </div>
            <div className="text-xs text-slate-300">
              <div className="font-semibold text-slate-100">The Human Org</div>
              <div>Concepción, Chile</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <Link className="hover:text-white" href="/tickets">
              Tickets
            </Link>
            <Link className="hover:text-white" href="/etica">
              Código de Ética
            </Link>
            <Link className="hover:text-white" href="/quienes">
              Quiénes somos
            </Link>
            <Link className="hover:text-white" href="/nuestra-experiencia">
              Nuestra experiencia
            </Link>
            <Link className="hover:text-white" href="/blog">
              Blog
            </Link>
            <Link className="hover:text-white" href="/studio">
              Acceso editorial
            </Link>
            <a className="hover:text-white" href="mailto:hola@tho.cl">
              hola@tho.cl
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-[11px] text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} The Human Org</div>
          <div className="text-slate-500">Humanidad · Colaboración · Adaptabilidad</div>
        </div>
      </div>
    </footer>
  );
}
