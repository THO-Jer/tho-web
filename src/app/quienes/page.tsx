"use client";

import { useEffect, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const BACKGROUND_IMAGES = [
  "/accion/03.png",
  "/accion/06.png",
  "/accion/09.png",
  "/accion/11.png",
] as const;

export default function QuienesPage() {
  const [thesisSplit, setThesisSplit] = useState(52);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-tho-bg">
      <Header />
      <main className="border-t border-slate-200" id="contenido">
        <section className="relative min-h-[58vh] overflow-visible text-white md:min-h-[68vh]" data-reveal>
          <div className="hero-media-fade pointer-events-none absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero/4.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.76]" />
            <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.42)_54%,rgba(15,23,42,0.75)_100%)]" />
          </div>

          <div className="relative mx-auto flex h-full min-h-[58vh] max-w-6xl items-end justify-end px-4 pb-16 pt-10 md:min-h-[68vh] md:pb-20">
            <div className="max-w-3xl text-right">
              <div className="mt-3 ml-auto h-[6px] w-36 rounded-sm brand-block-divider" />
              <p className="mt-6 font-sans text-xl font-bold leading-tight text-white md:text-[2.1rem]">
                Fortalecemos organizaciones y las conectamos con su entorno desde una mirada técnica,
                estratégica y profundamente humana.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            {BACKGROUND_IMAGES.map((imagePath, idx) => (
              <figure key={imagePath} className={`quienes-bg-image quienes-bg-image-${idx + 1}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePath} alt="" className="h-full w-full object-cover" />
              </figure>
            ))}
          </div>

          <div className="relative z-10">
            <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
              <div data-reveal>
                <h1 className="font-tho-title text-[2.8rem] leading-[0.95] text-slate-950 md:text-[4rem]">Trayectorias que convergen</h1>
                <p className="mt-6 max-w-2xl text-justify text-base leading-relaxed text-slate-700 md:text-lg">
                  THO se construye de los conocimientos acumulados de su equipo. Desde experiencias en desarrollo
                  organizacional, participación pública, gestión de cambio, análisis social y estrategia. Este texto está
                  a la izquierda porque a la derecha aparecen imágenes que se funden con el entorno. Esta sección se
                  alimenta de imágenes en <strong>public/accion</strong>.
                </p>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-4 md:py-8" data-reveal>
              <div className="rounded-3xl border border-slate-200/80 bg-white/78 p-7 backdrop-blur-sm md:p-10">
                <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                  Los profesionales que se suman a esta consultora traen sus trayectorias, las cuales buscan sinergia bajo
                  una misma tesis: <strong>Los procesos exitosos tienen a las personas al centro.</strong>
                </p>
                <p className="mt-6 text-sm text-slate-700 md:text-base">Cada integrante de THO aporta experiencia previa en:</p>
                <ul className="mt-3 grid gap-2 text-sm text-slate-700 md:text-base">
                  <li>- Diagnóstico e intervención organizacional</li>
                  <li>- Diseño de procesos participativos</li>
                  <li>- Análisis de impacto social</li>
                  <li>- Gestión estratégica en entornos complejos</li>
                </ul>
                <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
                  En The Human Org reconocemos estas trayectorias y sabemos que la expertise que cada uno trae profundiza
                  el propósito de la consultora.
                </p>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
              <div className="md:ml-auto md:max-w-[62%] md:text-right" data-reveal>
                <h2 className="font-tho-title text-[2.6rem] leading-[0.95] text-slate-950 md:text-[3.6rem]">Nuestra tesis</h2>
                <div className="mt-5 ml-auto h-[6px] w-36 rounded-sm brand-block-divider" />
                <div className="mt-6 space-y-2 text-lg text-slate-800 md:text-xl">
                  <p>Detrás de cada organización hay personas.</p>
                  <p>Detrás de cada conflicto hay estructuras.</p>
                  <p>Detrás de cada estrategia hay decisiones éticas.</p>
                </div>
                <div className="mt-7 space-y-2 text-base font-medium text-slate-800 md:text-lg">
                  <p>No trabajamos sobre las organizaciones.</p>
                  <p>Trabajamos con ellas.</p>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
              <div data-reveal>
                <h2 className="text-center font-tho-title text-[2.5rem] leading-[0.95] text-slate-950 md:text-[3.5rem]">Nuestros Valores</h2>
                <div className="mx-auto mt-5 h-[6px] w-36 rounded-sm brand-block-divider" />
              </div>

              <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-3" data-reveal>
                <article className="space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-slate-900">Humanidad</h3>
                  <p className="text-sm leading-relaxed text-slate-700 md:text-base">Reconocemos que toda organización es un entramado de historias, expectativas y tensiones humanas. Diseñamos desde esa comprensión.</p>
                </article>
                <article className="space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-slate-900">Colaboración</h3>
                  <p className="text-sm leading-relaxed text-slate-700 md:text-base">Creemos que las soluciones impuestas duran poco. Las soluciones construidas en conjunto transforman.</p>
                </article>
                <article className="space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-slate-900">Adaptabilidad</h3>
                  <p className="text-sm leading-relaxed text-slate-700 md:text-base">El entorno cambia. Las organizaciones cambian. Las comunidades cambian. Ajustar no es debilidad; es resiliencia estratégica.</p>
                </article>
              </div>

              <p className="mx-auto mt-8 max-w-3xl text-center text-base text-slate-700" data-reveal>
                Estos valores no son declarativos. Son criterios de decisión.
              </p>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-20" data-reveal>
              <div className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                <div className="relative overflow-hidden rounded-3xl p-7 md:p-10">
                  <div className="pointer-events-none absolute inset-y-0 left-0 bg-[linear-gradient(120deg,#ffffff_0%,#f8fafc_68%,#e2e8f0_100%)]" style={{ width: `${thesisSplit}%` }} />
                  <div className="pointer-events-none absolute inset-y-0 w-px bg-slate-300" style={{ left: `${thesisSplit}%` }} />
                  <input
                    type="range"
                    min={20}
                    max={80}
                    value={thesisSplit}
                    onChange={(event) => setThesisSplit(Number(event.target.value))}
                    className="absolute inset-x-6 top-5 z-20 accent-slate-700"
                    aria-label="Comparar misión y visión"
                  />
                  <div className="relative z-10 grid gap-7 pt-6 md:grid-cols-2 md:gap-10">
                    <article>
                      <h3 className="text-2xl font-semibold text-slate-900">Misión</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">Inspirar y acompañar procesos de transformación organizacional y comunitaria mediante intervenciones estratégicas técnicamente sólidas y humanamente sostenibles, asegurando que cada proyecto fortalezca tanto a la organización como a su entorno.</p>
                    </article>
                    <article>
                      <h3 className="text-2xl font-semibold text-slate-900">Visión</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">Ser reconocidos como líderes y agentes de cambio en la industria de la asesoría en Latinoamérica, por nuestro compromiso inquebrantable con la ética, la innovación y la humanización, potenciando así el bienestar de las comunidades y el crecimiento sostenible de las organizaciones que servimos.</p>
                    </article>
                  </div>
                </div>
              </div>
            </section>

            <section className="quienes-ethics-wrap pb-20 pt-14 md:pt-16">
              <div className="mx-auto max-w-6xl px-4">
                <div className="quienes-ethics-panel" data-reveal>
                  <div className="max-w-3xl">
                    <h2 className="font-tho-title text-[2.5rem] leading-[0.95] text-slate-950 md:text-[3.5rem]">Nuestra ética</h2>
                    <div className="mt-3 h-[6px] w-36 rounded-sm brand-block-divider" />
                    <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
                      <p>Nuestra ética no es decorativa. Es operativa.</p>
                      <p>Decimos lo que otros prefieren suavizar.</p>
                      <p>No maquillamos diagnósticos para incomodar menos.</p>
                      <p>No sostenemos estrategias que sabemos que no funcionan.</p>
                      <p>Si trabajamos juntos, lo hacemos con claridad.</p>
                      <p>
                        <a href="/etica" className="text-slate-800 underline decoration-slate-400 underline-offset-4 hover:text-slate-950">
                          → Ver Código de Ética
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
