import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { OnboardingUnit } from "@/content/onboardingContent";
import { canManageOnboarding, getUnits, setUnits } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

function sanitizeUnits(input: unknown): OnboardingUnit[] {
  if (!Array.isArray(input)) throw new Error("Formato inválido de unidades.");
  const units = input.map((unit) => ({
    slug: String((unit as { slug?: unknown }).slug || "").trim(),
    title: String((unit as { title?: unknown }).title || "").trim(),
    summary: String((unit as { summary?: unknown }).summary || "").trim(),
    durationMinutes: Math.max(1, Number((unit as { durationMinutes?: unknown }).durationMinutes || 10)),
    content: Array.isArray((unit as { content?: unknown[] }).content)
      ? ((unit as { content?: unknown[] }).content || []).map((row) => String(row || "").trim()).filter(Boolean)
      : [],
    resources: Array.isArray((unit as { resources?: unknown[] }).resources)
      ? ((unit as { resources?: unknown[] }).resources || [])
          .map((resource) => ({
            label: String((resource as { label?: unknown }).label || "Recurso").trim(),
            href: String((resource as { href?: unknown }).href || "").trim(),
          }))
          .filter((resource) => resource.href)
      : undefined,
  })).filter((unit) => unit.slug && unit.title && unit.content.length > 0);

  if (!units.length) throw new Error("Debes enviar al menos una unidad válida.");
  return units;
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageOnboarding(session.email, session.role, session.canManageAccess)) {
    return NextResponse.json({ error: "Solo admin puede editar contenido onboarding." }, { status: 403 });
  }

  const units = await getUnits();
  return NextResponse.json({ units });
}

export async function PATCH(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageOnboarding(session.email, session.role, session.canManageAccess)) {
    return NextResponse.json({ error: "Solo admin puede editar contenido onboarding." }, { status: 403 });
  }

  try {
    const payload = (await req.json()) as { units?: unknown };
    const nextUnits = sanitizeUnits(payload.units);
    const units = await setUnits(nextUnits);
    return NextResponse.json({ ok: true, units });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar contenido." }, { status: 400 });
  }
}
