import Image from "next/image";

const logos = [
  { src: "/confian/1.svg", alt: "Organización cliente 1" },
  { src: "/confian/2.svg", alt: "Organización cliente 2" },
  { src: "/confian/3.svg", alt: "Organización cliente 3" },
  { src: "/confian/4.svg", alt: "Organización cliente 4" },
  { src: "/confian/5.svg", alt: "Organización cliente 5" },
  { src: "/confian/6.svg", alt: "Organización cliente 6" },
  { src: "/confian/7.svg", alt: "Organización cliente 7" },
  { src: "/confian/8.svg", alt: "Organización cliente 8" },
  { src: "/confian/9.svg", alt: "Organización cliente 9" },
];

export function TrustSlider() {
  const marquee = [...logos, ...logos];

  return (
    <div className="trust-slider overflow-hidden py-5">
      <div className="trust-track flex w-max items-center gap-2 px-3 md:gap-3 md:px-4">
        {marquee.map((logo, idx) => (
          <div key={`${logo.src}-${idx}`} className="trust-logo-slot relative h-[74px] w-[190px] shrink-0 md:h-[84px] md:w-[220px]">
            <Image src={logo.src} alt={logo.alt} fill className="trust-logo-card object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
