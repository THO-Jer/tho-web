import { BrandLoader } from "@/components/BrandLoader";

export default function Loading() {
  return (
    <main className="min-h-screen bg-tho-bg">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <BrandLoader message="Cargando contenidos..." />
      </div>
    </main>
  );
}
