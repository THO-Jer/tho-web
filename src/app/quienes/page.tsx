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

export default function QuienesPage() {
  const [thesisSplit, setThesisSplit] = useState(52);
  const [cubeAngle, setCubeAngle] = useState(0);
  const [activeValue, setActiveValue] = useState(0);
  const [dragState, setDragState] = useState<{ startX: number; startAngle: number } | null>(null);

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
                  organizacional, participación pública, gestión de cambio, análisis social y estrategia.
                </p>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-5 md:py-9" data-reveal>
              <div className="ml-auto rounded-3xl border border-slate-200/80 bg-white/80 p-8 text-right backdrop-blur-sm md:max-w-[68%] md:p-11">
                <p className="text-lg leading-relaxed text-slate-700 md:text-[1.25rem]">
                  Los profesionales que se suman a esta consultora traen sus trayectorias, las cuales buscan sinergia bajo
                  una misma tesis: <strong>Los procesos exitosos tienen a las personas al centro.</strong>
                </p>
                <p className="mt-6 text-base text-slate-700">Cada integrante de THO aporta experiencia previa en:</p>
                <ul className="mt-3 grid gap-2 text-base text-slate-700">
                  <li>- Diagnóstico e intervención organizacional</li>
                  <li>- Diseño de procesos participativos</li>
                  <li>- Análisis de impacto social</li>
                  <li>- Gestión estratégica en entornos complejos</li>
                </ul>
                <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-[1.2rem]">
                  En The Human Org reconocemos estas trayectorias y sabemos que la expertise que cada uno trae profundiza
                  el propósito de la consultora.
                </p>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-14 md:py-16" data-reveal>
              <div className="mission-vision-shell rounded-3xl p-7 md:p-10">
                <div className="relative overflow-hidden rounded-2xl bg-white/88 p-6 md:p-8">
                  <div className="pointer-events-none absolute inset-y-0 left-0 bg-[linear-gradient(120deg,#ffffff_0%,#f8fafc_68%,#e2e8f0_100%)]" style={{ width: `${thesisSplit}%` }} />
                  <div className="pointer-events-none absolute inset-y-0 w-px bg-slate-300" style={{ left: `${thesisSplit}%` }} />
                  <input
                    type="range"
                    min={20}
                    max={80}
                    value={thesisSplit}
                    onChange={(event) => setThesisSplit(Number(event.target.value))}
                    className="absolute inset-x-6 top-4 z-20 accent-slate-700"
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

            <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
              <div data-reveal>
                <h2 className="text-center font-tho-title text-[2.5rem] leading-[0.95] text-slate-950 md:text-[3.5rem]">Nuestra identidad</h2>
                <div className="mx-auto mt-5 h-[6px] w-36 rounded-sm brand-block-divider" />
                <p className="mx-auto mt-8 max-w-4xl text-center text-lg leading-relaxed text-slate-700 md:text-[1.25rem]">
                  Transformamos la asesoría estratégica integrando innovación, humanidad y sostenibilidad, asegurando
                  que las organizaciones no solo alcancen sus objetivos, sino que lo hagan impactando positivamente a sus
                  comunidades y entorno.
                </p>
                <p className="font-tho-title mx-auto mt-4 max-w-4xl text-center text-[1.5rem] text-slate-900 md:text-[2rem]">
                  Nuestra promesa es diseñar soluciones estratégicas y exitosas.
                </p>
              </div>

              <div className="mt-10 grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr]" data-reveal>
                <div>
                  <p className="mb-3 text-center text-xs uppercase tracking-[0.14em] text-slate-500">Arrastra o toca para girar</p>
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
                        setCubeAngle(dragState.startAngle + delta * 0.45);
                      }}
                      onPointerUp={() => {
                        const snapped = Math.round(cubeAngle / 120) * 120;
                        setCubeAngle(snapped);
                        setActiveValue(normalizeIndex(snapped));
                        setDragState(null);
                      }}
                    >
                      <div className="identity-cube-face identity-cube-face--humanidad">
                        <span>H</span>
                        <small>HUMANIDAD</small>
                      </div>
                      <div className="identity-cube-face identity-cube-face--colaboracion">
                        <span>O</span>
                        <small>COLABORACIÓN</small>
                      </div>
                      <div className="identity-cube-face identity-cube-face--adaptabilidad">
                        <span>ADAP
                        <br />TA
                        <br />BILI
                        <br />DAD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/82 p-7 backdrop-blur-sm">
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

            <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
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

                <div className="flex justify-center md:justify-end">
                  <svg viewBox="0 0 280 280" className="h-[240px] w-[240px]" aria-hidden>
                    <defs>
                      <path id="thoCompassTextPath" d="M 140,140 m -88,0 a 88,88 0 1,1 176,0 a 88,88 0 1,1 -176,0" />
                    </defs>
                    <circle cx="140" cy="140" r="118" fill="#ff4f3e" opacity="0.96" />
                    <circle cx="132" cy="132" r="94" fill="#fff" />
                    <text fill="#ef7f35" fontSize="26" fontWeight="700" letterSpacing="3">
                      <textPath href="#thoCompassTextPath">COLABORACIÓN • </textPath>
                    </text>
                    <text x="132" y="160" textAnchor="middle" fontSize="106" fill="#ff4f3e" fontWeight="800">O</text>
                  </svg>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-20" data-reveal>
              <div className="md:ml-auto md:max-w-[62%] md:text-right">
                <p className="text-lg text-slate-800 md:text-xl">Detrás de cada organización hay personas.</p>
                <p className="mt-2 text-lg text-slate-800 md:text-xl">Detrás de cada conflicto hay estructuras.</p>
                <p className="mt-2 text-lg text-slate-800 md:text-xl">Detrás de cada estrategia hay decisiones éticas.</p>
                <p className="mt-6 text-base font-medium text-slate-800 md:text-lg">No trabajamos sobre las organizaciones.</p>
                <p className="text-base font-medium text-slate-800 md:text-lg">Trabajamos con ellas.</p>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
