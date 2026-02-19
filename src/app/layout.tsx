import "./globals.css";
import localFont from "next/font/local";

const thocl = localFont({
  src: "./fonts/Thocl-Regular.ttf",
  variable: "--font-thocl",
  display: "swap",
});

export const metadata = {
  title: "The Human Org — Consultoría estratégica",
  description: "ESG, gestión comunitaria y desarrollo organizacional. Concepción, Chile.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={thocl.variable}>
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
