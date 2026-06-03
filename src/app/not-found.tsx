import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BOOK_URL } from "@/lib/links";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto h-[6px] w-24 rounded-sm brand-block-divider" aria-hidden />

        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Error 404
        </p>
        <h1 className="font-tho-title mt-3 text-[3rem] text-slate-950 md:text-[4.5rem]">
          Página no encontrada
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-slate-600">
          La página que buscas no existe o fue movida. Desde acá puedes volver al inicio o explorar nuestros servicios.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-unified-motion btn-hero-services rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            Ir al inicio
          </Link>
          <Link
            href="/#servicios"
            className="btn-unified-motion rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Ver servicios
          </Link>
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-unified-motion rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Agendar reunión
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
