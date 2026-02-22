"use client";

import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const BACKGROUND_IMAGES = ["/accion/03.png", "/accion/06.png", "/accion/09.png", "/accion/11.png"] as const;

const IDENTITY_VALUES = [
  {
    key: "humanidad",
    title: "Humanidad",
    color: "text-tho-pink",
    description:
      "Reconocemos que toda organización es un entramado de historias, expectativas y tensiones humanas. Diseñamos desde esa comprensión.",
  },
  {
    key: "colaboracion",
    title: "Colaboración",
    color: "text-tho-orange",
    description:
      "Creemos que las soluciones impuestas duran poco. Las soluciones construidas en conjunto transforman.",
  },
  {
    key: "adaptabilidad",
    title: "Adaptabilidad",
    color: "text-tho-green",
    description:
      "El entorno cambia. Las organizaciones cambian. Las comunidades cambian. Ajustar no es debilidad; es resiliencia estratégica.",
  },
] as const;

function normalizeIndex(angle: number) {
  const idx = ((Math.round(-angle / 120) % 3) + 3) % 3;
  return idx;
}

function splitFromPointer(clientX: number, rect: DOMRect) {
  const raw = ((clientX - rect.left) / rect.width) * 100;
  return Math.max(14, Math.min(86, raw));
}

export default function QuienesPage() {
  const [thesisSplit, setThesisSplit] = useState(50);
  const [cubeAngle, setCubeAngle] = useState(0);
  const [activeValue, setActiveValue] = useState(0);
  const [dragState, setDragState] = useState<{ startX: number; startAngle: number } | null>(null);
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

  const selectedValue = useMemo(() => IDENTITY_VALUES[activeValue], [activeValue]);

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
              <div className="md:mr-[6%] md:ml-auto p-3 text-right md:max-w-[64%] md:p-0">
                <p className="text-justify text-lg leading-relaxed text-slate-700 md:text-[1.28rem]">
                  Los profesionales que se suman a esta consultora traen sus trayectorias, las cuales buscan sinergia bajo
                  una misma tesis: <strong>Los procesos exitosos tienen a las personas al centro.</strong>
                </p>
                <p className="mt-6 text-[1.02rem] text-slate-700">Cada integrante de THO aporta experiencia previa en:</p>
                <ul className="mt-3 ml-auto grid max-w-[31rem] gap-2 text-left text-[1.02rem] text-slate-700">
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

              <div
                className="identity-block-space splitview skewed mt-10"
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  setThesisSplit(splitFromPointer(event.clientX, rect));
                }}
                onTouchMove={(event) => {
                  const touch = event.touches[0];
                  if (!touch) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  setThesisSplit(splitFromPointer(touch.clientX, rect));
                }}
              >
                <div className="panel bottom" style={{ clipPath: `inset(0 0 0 ${thesisSplit}%)` }}>
                  <div className="content">
                    <div className="description">
                      <h3 className="text-[1.35rem] font-semibold text-white md:text-[1.7rem]">Visión</h3>
                      <p className="mt-2 text-xs leading-relaxed text-white md:text-sm">
                        Ser reconocidos como líderes y agentes de cambio en la industria de la asesoría en Latinoamérica,
                        por nuestro compromiso inquebrantable con la ética, la innovación y la humanización.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="panel top" style={{ clipPath: `inset(0 ${100 - thesisSplit}% 0 0)` }}>
                  <div className="content">
                    <div className="description">
                      <h3 className="text-[1.35rem] font-semibold text-white md:text-[1.7rem]">Misión</h3>
                      <p className="mt-2 text-xs leading-relaxed text-white md:text-sm">
                        Inspirar y acompañar procesos de transformación organizacional y comunitaria mediante
                        intervenciones estratégicas técnicamente sólidas y humanamente sostenibles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="handle brand-block-divider" style={{ left: `${thesisSplit}%` }} />
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

              <div className="identity-block-space mt-16 grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="mb-4 text-center text-xs uppercase tracking-[0.14em] text-slate-500">Arrastra o toca para girar</p>
                  <div className="identity-cube-wrap">
                    <div
                      className="identity-cube"
                      style={{ transform: `rotateX(-12deg) rotateY(${cubeAngle}deg)` }}
                      onPointerDown={(event) => {
                        (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
                        setDragState({ startX: event.clientX, startAngle: cubeAngle });
                      }}
                      onPointerMove={(event) => {
                        if (!dragState) return;
                        const delta = event.clientX - dragState.startX;
                        setCubeAngle(dragState.startAngle + delta * 0.3);
                      }}
                      onPointerUp={() => {
                        const snapped = Math.round(cubeAngle / 120) * 120;
                        setCubeAngle(snapped);
                        setActiveValue(normalizeIndex(snapped));
                        setDragState(null);
                      }}
                    >
                      <div className="identity-cube-face identity-cube-face--humanidad">
                        <div className="h-shape-grid">
                          <span>H</span>
                          <span>D</span>
                          <span>U A N I A</span>
                          <span>M</span>
                          <span>D</span>
                        </div>
                      </div>
                      <div className="identity-cube-face identity-cube-face--colaboracion">
                        <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden>
                          <defs>
                            <path id="colabPath" d="M 110,110 m -68,0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0" />
                          </defs>
                          <text fill="white" fontSize="19" fontWeight="700" letterSpacing="2.3">
                            <textPath href="#colabPath">COLABORACIÓN • COLABORACIÓN • </textPath>
                          </text>
                          <text x="110" y="132" textAnchor="middle" fill="white" fontSize="78" fontWeight="800">O</text>
                        </svg>
                      </div>
                      <div className="identity-cube-face identity-cube-face--adaptabilidad">
                        <div className="t-shape-grid">
                          <span>A D A P T A</span>
                          <span>B I L I</span>
                          <span>D A D</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-3xl font-semibold ${selectedValue.color}`}>{selectedValue.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">{selectedValue.description}</p>
                  <div className="mt-6 flex gap-2">
                    {IDENTITY_VALUES.map((item, idx) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setActiveValue(idx);
                          setCubeAngle(-idx * 120);
                        }}
                        className={`h-2.5 w-10 rounded-full ${idx === activeValue ? "bg-slate-700" : "bg-slate-300"}`}
                        aria-label={`Ver valor ${item.title}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 md:py-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brujula.svg"
            alt=""
            aria-hidden
            className="quienes-compass-bg pointer-events-none absolute right-[-8%] top-[-6%]"
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
