import "./globals.css";
import localFont from "next/font/local";

const thocl = localFont({
  src: "./fonts/Thocl-Regular.ttf",
  variable: "--font-thocl",
  display: "swap",
});

const ttFirsNeue = localFont({
  src: [
    { path: "./fonts/TTFirsNeue-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/TTFirsNeue-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/TTFirsNeue-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-tt",
  display: "swap",
});

export const metadata = {
  title: "The Human Org — Consultoría estratégica",
  description: "ESG, gestión comunitaria y desarrollo organizacional. Concepción, Chile.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${thocl.variable} ${ttFirsNeue.variable}`}>
      <body className="bg-tho-bg text-slate-950 antialiased">{children}</body>
    </html>
  );
}
