import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const modules = [
  {
    title: "Studio Blog",
    desc: "Gestión editorial completa de entradas, SEO y medios.",
    href: "/studio/blog",
    status: "Activo",
  },
  {
    title: "Studio Recursos",
    desc: "Curar y publicar PDFs, guías, plantillas y descargables.",
    href: "#",
    status: "Próximamente",
  },
  {
    title: "Studio Casos y Experiencia",
    desc: "Actualizar casos, resultados e hitos de proyectos por industria.",
    href: "#",
    status: "Próximamente",
  },
  {
    title: "Studio Leads y CRM",
    desc: "Panel para revisar formularios, estado CRM y seguimiento comercial.",
    href: "#",
    status: "Próximamente",
  },
];

export default function StudioIndexPage() {
  return (
    <div className="min-h-screen bg-tho-bg">
      <Header />
      <main className="border-t border-slate-200">
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="font-tho-title text-5xl text-slate-950">THO Studio</h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Espacio interno para operación de contenido y crecimiento. Hoy está activo el Studio Blog y el resto de
            módulos ya quedó diseñado para expandir el sistema interno del sitio.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {modules.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.status}</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-700">{item.desc}</p>
                {item.href === "#" ? (
                  <div className="mt-5 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-500">
                    Se habilita en siguiente fase
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Entrar
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
