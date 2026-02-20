import { redirect } from "next/navigation";

export default async function LegacySolucionesRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/servicios/${slug}`);
}
