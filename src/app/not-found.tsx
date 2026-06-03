import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BOOK_URL } from "@/lib/links";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="relative overflow-hidden">
        {/* Fondo con hero/1.png — foto a la izquierda, degradé hacia la derecha */}
        <section className="relative min-h-[88vh]">
          <div className="pointer-events-none absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/1.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-left opacity-80"
            />
            {/* Degradé: transparente a la izquierda, oscuro a la derecha */}
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.55)_45%,rgba(15,23,42,0.88)_100%)]" />
          </div>

          {/* Signo de pregunta flotante — ilustración 12.png */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ilustraciones/12.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[5%] h-[55vh] w-auto select-none opacity-20 md:opacity-30"
            style={{ animation: "tho-404-float 6s ease-in-out infinite" }}
          />

          {/* Contenido — alineado a la derecha */}
          <div className="relative mx-auto flex min-h-[88vh] max-w-6xl items-center justify-end px-6 py-20">
            <div className="max-w-xl text-right">
              {/* Divisor de marca */}
              <div className="ml-auto h-[6px] w-28 rounded-sm brand-block-divider" aria-hidden />

              {/* 404 grande */}
              <p
                className="font-tho-title mt-6 text-[6rem] leading-none text-white/20 md:text-[10rem]"
                style={{ animation: "tho-404-in 0.6s ease both" }}
              >
                404
              </p>

              <h1
                className="font-tho-title -mt-4 text-[2.6rem] leading-tight text-white md:text-[3.8rem]"
                style={{ animation: "tho-404-in 0.6s 0.1s ease both" }}
              >
                Territorio<br />inexplorado.
              </h1>

              <p
                className="mt-4 ml-auto max-w-sm text-base text-white/75 md:text-lg"
                style={{ animation: "tho-404-in 0.6s 0.2s ease both" }}
              >
                Esta página no existe —  pero el problema que te trajo hasta acá probablemente sí. ¿Volvemos al mapa?
              </p>

              {/* Botones con entrada escalonada */}
              <div
                className="mt-8 flex flex-col items-end gap-3 sm:flex-row sm:justify-end"
                style={{ animation: "tho-404-in 0.6s 0.35s ease both" }}
              >
                <Link
                  href="/"
                  className="btn-unified-motion btn-hero-services rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-white/40 hover:ring-white"
                >
                  Volver al inicio
                </Link>
                <Link
                  href="/#servicios"
                  className="btn-unified-motion rounded-xl border border-white/50 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Ver servicios
                </Link>
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-unified-motion rounded-xl border border-white/50 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Agendar reunión
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Keyframes globales para esta página */}
        <style>{`
          @keyframes tho-404-in {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes tho-404-float {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50%       { transform: translateY(-18px) rotate(2deg); }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  );
}
