// Loading boundary global para rutas públicas.
// Antes mostraba un BrandLoader con barra de progreso falsa que perjudicaba LCP
// y daba sensación de sitio lento. Lo reemplazamos por un skeleton mínimo,
// no bloqueante, que se muestra sólo si la navegación tarda.
//
// El BrandLoader sigue usándose en /studio (rutas client con `checking` states reales).

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-tho-bg"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-3 w-24 rounded-full bg-slate-200/70" />
          <div className="h-10 w-3/4 rounded-xl bg-slate-200/70" />
          <div className="h-4 w-2/3 rounded-full bg-slate-200/60" />
          <div className="h-4 w-1/2 rounded-full bg-slate-200/60" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-40 rounded-2xl bg-slate-200/60" />
            <div className="h-40 rounded-2xl bg-slate-200/60" />
            <div className="h-40 rounded-2xl bg-slate-200/60" />
          </div>
        </div>
        <span className="sr-only">Cargando…</span>
      </div>
    </main>
  );
}
