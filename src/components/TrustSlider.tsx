import Image from "next/image";

const logos = [
  { src: "/confian/andes-industrial.svg", alt: "Andes Industrial" },
  { src: "/confian/puerto-sur.svg", alt: "Puerto Sur" },
  { src: "/confian/biobosque.svg", alt: "Biobosque" },
  { src: "/confian/energia-pacifico.svg", alt: "Energía Pacífico" },
  { src: "/confian/red-salud-sur.svg", alt: "Red Salud Sur" },
  { src: "/confian/valle-limpio.svg", alt: "Valle Limpio" },
  { src: "/confian/consorcio-austral.svg", alt: "Consorcio Austral" },
  { src: "/confian/agroruta.svg", alt: "Agroruta" },
];

export function TrustSlider() {
  const marquee = [...logos, ...logos];

  return (
    <div className="trust-slider overflow-hidden py-5">
      <div className="trust-track flex w-max items-center gap-4 px-4 md:gap-6 md:px-6">
        {marquee.map((logo, idx) => (
          <div key={`${logo.src}-${idx}`} className="trust-logo-slot relative h-[74px] w-[190px] shrink-0 md:h-[84px] md:w-[220px]">
            <Image src={logo.src} alt={logo.alt} fill className="trust-logo-card object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
