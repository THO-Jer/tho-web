"use client";

import { useEffect, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const BACKGROUND_IMAGES = [
  "/ilustraciones/2.png",
  "/ilustraciones/5.png",
  "/ilustraciones/8.png",
  "/ilustraciones/10.png",
  "/ilustraciones/12.png",
] as const;

const IDENTITY_VALUES = [
  {
    key: "adaptabilidad",
    title: "Adaptabilidad",
    color: "text-tho-green",
    icon: "/brand/T_valor.svg",
    description:
      "El entorno cambia. Las organizaciones cambian. Las comunidades cambian. Ajustar no es debilidad; es resiliencia estratégica.",
  },
  {
    key: "humanidad",
    title: "Humanidad",
    color: "text-tho-pink",
    icon: "/brand/H_valor.svg",
    description:
      "Reconocemos que toda organización es un entramado de historias, expectativas y tensiones humanas. Diseñamos desde esa comprensión.",
  },
  {
    key: "colaboracion",
    title: "Colaboración",
    color: "text-tho-orange",
    icon: "/brand/O_valor.svg",
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
              <div className="mx-auto max-w-[48rem] p-3 md:pr-12 md:pl-0 lg:pr-20">
                <p className="text-justify text-lg leading-relaxed text-slate-700 md:pr-8 md:text-[1.28rem] lg:pr-14">
                  Los profesionales que se suman a esta consultora traen sus trayectorias, las cuales buscan sinergia bajo
                  una misma tesis: <strong>Los procesos exitosos tienen a las personas al centro.</strong>
                </p>
                <p className="mt-6 text-[1.02rem] text-slate-700">Cada integrante de THO aporta experiencia previa en:</p>
                <ul className="mt-3 grid max-w-[34rem] gap-2 text-left text-[1.02rem] text-slate-700">
                  <li>• Diagnóstico e intervención organizacional</li>
                  <li>• Diseño de procesos participativos</li>
                  <li>• Análisis de impacto social</li>
                  <li>• Gestión estratégica en entornos complejos</li>
                </ul>
                <p className="mt-6 max-w-[44rem] text-justify text-lg leading-relaxed text-slate-700 md:text-[1.2rem]">
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

              <div className="identity-block-space mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2 md:gap-10">
                <div className="pr-0 md:pr-8">
                  <h3 className="text-[1.4rem] font-semibold text-slate-900 md:text-[1.7rem]">Misión</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
                    Inspirar y acompañar procesos de transformación organizacional y comunitaria mediante intervenciones
                    estratégicas técnicamente sólidas y humanamente sostenibles.
                  </p>
                </div>
                <div className="border-l border-slate-200 pl-6 md:pl-10">
                  <h3 className="text-[1.4rem] font-semibold text-slate-900 md:text-[1.7rem]">Visión</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
                    Ser reconocidos como líderes y agentes de cambio en la industria de la asesoría en Latinoamérica, por
                    nuestro compromiso inquebrantable con la ética, la innovación y la humanización.
                  </p>
                </div>
              </div>

              <div className="identity-block-space mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center md:gap-6">
                <p className="font-tho-title max-w-3xl text-justify text-[2.05rem] leading-[1.02] text-slate-900 md:text-[2.7rem]">
                  Nuestra promesa es diseñar
                  <br />
                  soluciones estratégicas y exitosas.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ilustraciones/6.png"
                  alt="Ilustración de apoyo"
                  className="h-16 w-16 shrink-0 object-contain md:h-20 md:w-20"
                />
              </div>
              <p className="identity-block-space mt-4 max-w-4xl text-justify text-base leading-relaxed text-slate-700 md:text-lg">
                Desde esta promesa, la identidad se vuelve práctica: misión, visión y experiencia se entrelazan en
                criterios que orientan decisiones concretas. Por eso, nuestros valores no son solo conceptos, sino
                articuladores de sentido y conducta en cada relación, intervención y proceso que acompañamos.
              </p>

              <div className="identity-block-space mt-14 space-y-10 md:space-y-12">
                {IDENTITY_VALUES.map((value) => (
                  <article key={value.key} className="grid gap-5 md:grid-cols-[130px_1fr] md:items-center md:gap-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value.icon} alt="" aria-hidden className="mx-auto h-24 w-24 object-contain md:h-28 md:w-28" />
                    <div className="md:mr-36 lg:mr-52 xl:mr-64">
                      <h3 className={`text-2xl font-semibold ${value.color}`}>{value.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">{value.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl border-0 bg-transparent px-4 py-16 shadow-none md:min-h-[34rem] md:py-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brujula.svg"
            alt=""
            aria-hidden
            className="quienes-compass-bg pointer-events-none absolute right-[2%] top-1/2 z-0 hidden -translate-y-1/2 md:block"
            style={{ transform: `translate3d(0, calc(-50% + ${scrollY * 0.03}px), 0)` }}
          />

          <div className="relative z-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center" data-reveal>
            <div className="max-w-3xl border-0 bg-transparent shadow-none">
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
