"use client";

import { useEffect, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const BACKGROUND_IMAGES = ["/ilustraciones/2.png", "/ilustraciones/6.png", "/ilustraciones/9.png", "/ilustraciones/12.png"] as const;

const IDENTITY_VALUES = [
  {
    key: "adaptabilidad",
    title: "Adaptabilidad",
    image: "/brand/T_valor.png",
    description:
      "El entorno cambia. Las organizaciones cambian. Las comunidades cambian. Ajustar no es debilidad; es resiliencia estratégica.",
  },
  {
    key: "humanidad",
    title: "Humanidad",
    image: "/brand/H_valor.png",
    description:
      "Reconocemos que toda organización es un entramado de historias, expectativas y tensiones humanas. Diseñamos desde esa comprensión.",
  },
  {
    key: "colaboracion",
    title: "Colaboración",
    image: "/brand/O_valor.png",
    description:
      "Creemos que las soluciones impuestas duran poco. Las soluciones construidas en conjunto transforman.",
  },
] as const;

export default function QuienesPage() {
  const [scrollY, setScrollY] = useState(0);

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

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

        <section className="relative overflow-hidden pb-10">
          <div className="pointer-events-none absolute inset-0">
            {BACKGROUND_IMAGES.map((imagePath, idx) => (
              <figure
                key={imagePath}
                className={`quienes-bg-image quienes-bg-image-${idx + 1}`}
                style={{ transform: `translate3d(0, ${scrollY * (0.03 + idx * 0.012)}px, 0)` }}
              >
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
                  organizacional, participación pública, gestión de cambio, análisis social y estrategia.
                </p>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-6 md:py-10" data-reveal>
              <div className="mx-auto p-3 md:max-w-[760px] md:p-0">
                <p className="text-justify text-lg leading-relaxed text-slate-700 md:text-[1.28rem]">
                  Los profesionales que se suman a esta consultora traen sus trayectorias, las cuales buscan sinergia bajo
                  una misma tesis: <strong>Los procesos exitosos tienen a las personas al centro.</strong>
                </p>
                <p className="mt-6 text-[1.02rem] text-slate-700 md:text-center">Cada integrante de THO aporta experiencia previa en:</p>
                <ul className="mt-3 grid gap-2 text-left text-[1.02rem] text-slate-700 md:mx-auto md:max-w-[31rem]">
                  <li>• Diagnóstico e intervención organizacional</li>
                  <li>• Diseño de procesos participativos</li>
                  <li>• Análisis de impacto social</li>
                  <li>• Gestión estratégica en entornos complejos</li>
                </ul>
                <p className="mt-6 text-justify text-lg leading-relaxed text-slate-700 md:text-[1.2rem]">
                  En The Human Org reconocemos estas trayectorias y sabemos que la expertise que cada uno trae profundiza
                  el propósito de la consultora.
                </p>
              </div>
            </section>

            <section className="identity-section mx-auto max-w-6xl px-4 py-16 md:py-20" data-reveal>
              <h2 className="text-center font-tho-title text-[2.5rem] leading-[0.95] text-slate-950 md:text-[3.6rem]">Nuestra identidad</h2>
              <div className="mx-auto mt-5 h-[6px] w-36 rounded-sm brand-block-divider" />

              <p className="identity-block-space mx-auto mt-14 max-w-4xl text-justify text-lg leading-relaxed text-slate-700 md:text-[1.22rem]">
                Transformamos la asesoría estratégica integrando innovación, humanidad y sostenibilidad, asegurando que
                las organizaciones no solo alcancen sus objetivos, sino que lo hagan impactando positivamente a sus
                comunidades y entorno. Esta mirada integra nuestra misión y visión en una misma dirección estratégica.
              </p>

              <div className="identity-block-space mt-10 grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-8">
                <div className="text-left">
                  <h3 className="text-[1.35rem] font-semibold text-slate-900 md:text-[1.7rem]">Misión</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
                    Inspirar y acompañar procesos de transformación organizacional y comunitaria mediante intervenciones
                    estratégicas técnicamente sólidas y humanamente sostenibles.
                  </p>
                </div>

                <div className="hidden h-full w-px rounded-full bg-slate-300/70 md:block" aria-hidden />

                <div className="text-left">
                  <h3 className="text-[1.35rem] font-semibold text-slate-900 md:text-[1.7rem]">Visión</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
                    Ser reconocidos como líderes y agentes de cambio en la industria de la asesoría en Latinoamérica,
                    por nuestro compromiso inquebrantable con la ética, la innovación y la humanización.
                  </p>
                </div>
              </div>

              <p className="identity-block-space font-tho-title mt-10 max-w-3xl text-justify text-[1.75rem] leading-[1.04] text-slate-900 md:text-[2.2rem]">
                Nuestra promesa es diseñar
                <br />
                soluciones estratégicas y exitosas.
              </p>
              <p className="identity-block-space mt-4 max-w-4xl text-justify text-base leading-relaxed text-slate-700 md:text-lg">
                Desde esta promesa, la identidad se vuelve práctica: misión, visión y experiencia se entrelazan en
                criterios que orientan decisiones concretas. Por eso, nuestros valores no son solo conceptos, sino
                articuladores de sentido y conducta en cada relación, intervención y proceso que acompañamos.
              </p>

              <div className="identity-block-space mt-16 space-y-10">
                {IDENTITY_VALUES.map((value) => (
                  <article key={value.key} className="grid items-center gap-6 md:grid-cols-[150px_1fr] md:gap-10">
                    <div className="mx-auto w-[120px] md:w-[150px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={value.image} alt={`Símbolo del valor ${value.title}`} className="h-auto w-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold text-slate-900">{value.title}</h3>
                      <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">{value.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl overflow-visible px-4 py-16 md:py-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brujula.svg"
            alt=""
            aria-hidden
            className="quienes-compass-bg pointer-events-none absolute right-[-4%] top-[-2%]"
            style={{ transform: `translate3d(0, ${scrollY * 0.045}px, 0)` }}
          />

          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center" data-reveal>
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

            <div className="hidden md:block" aria-hidden />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-36 pt-14 md:pb-44 md:pt-24" data-reveal>
          <div className="md:ml-auto md:max-w-[62%] md:text-right">
            <p className="text-lg text-slate-800 md:text-xl">Detrás de cada organización hay personas.</p>
            <p className="mt-2 text-lg text-slate-800 md:text-xl">Detrás de cada conflicto hay estructuras.</p>
            <p className="mt-2 text-lg text-slate-800 md:text-xl">Detrás de cada estrategia hay decisiones éticas.</p>
            <p className="mt-7 text-base font-medium text-slate-800 md:text-lg">No trabajamos sobre las organizaciones.</p>
            <p className="text-base font-medium text-slate-800 md:text-lg">Trabajamos con ellas.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
