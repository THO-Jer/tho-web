import Image from "next/image";

const logos = [
  { src: "/confian/1.svg",  alt: "Barbería Club34",                   href: "https://instagram.com/club34barberia" },
  { src: "/confian/2.svg",  alt: "INDAMA S.A.",                       href: "https://indama.cl" },
  { src: "/confian/3.svg",  alt: "Conce Con Todos",                   href: "https://instagram.com/concecontodos" },
  { src: "/confian/4.svg",  alt: "Cámara Chilena de la Construcción", href: "https://conceconstruye.cl" },
  { src: "/confian/5.svg",  alt: "Círculo de Mujeres CChC" },
  { src: "/confian/6.svg",  alt: "Credyhogar",                        href: "https://instagram.com/credyhogar" },
  { src: "/confian/7.svg",  alt: "Vanrom",                            href: "https://instagram.com/empresas_vanrom" },
  { src: "/confian/8.svg",  alt: "IAP2 Latinoamérica",                href: "https://iap2latinoamerica.org" },
  { src: "/confian/9.svg",  alt: "Melissa Valenzuela Contadora" },
  { src: "/confian/10.svg", alt: "PaleoAndes",                        href: "https://paleoandes.cl" },
];

/**
 * Marquee CSS puro (sin JS): lista duplicada + animación infinita.
 * - Fade lateral con mask-image.
 * - Pausa al hover.
 * - prefers-reduced-motion: sin animación, scroll horizontal nativo.
 */
export function TrustSlider() {
  const items = [...logos, ...logos];

  return (
    <div className="trust-slider overflow-hidden py-5">
      <div className="trust-track flex w-max items-center gap-1 px-2 md:gap-2 md:px-3">
        {items.map((logo, idx) => {
          const isDuplicate = idx >= logos.length;
          const slot = (
            <div className="trust-logo-slot relative h-[58px] w-[150px] shrink-0 md:h-[68px] md:w-[175px]">
              <Image
                src={logo.src}
                alt={isDuplicate ? "" : logo.alt}
                fill
                className="trust-logo-card object-contain"
                draggable={false}
              />
            </div>
          );

          if (!logo.href) {
            return (
              <div key={`${logo.src}-${idx}`} aria-hidden={isDuplicate}>
                {slot}
              </div>
            );
          }

          return (
            <a
              key={`${logo.src}-${idx}`}
              href={logo.href}
              target="_blank"
              rel="noreferrer"
              aria-label={logo.alt}
              aria-hidden={isDuplicate}
              tabIndex={isDuplicate ? -1 : 0}
              className="shrink-0"
            >
              {slot}
            </a>
          );
        })}
      </div>
    </div>
  );
}
