import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { getUnits, markUnitCompleted } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const payload = (await req.json()) as { unitSlug?: string };
    const unitSlug = String(payload.unitSlug || "").trim();
    const [record, units] = await Promise.all([
      markUnitCompleted(session.email, unitSlug),
      getUnits(),
    ]);
    const progress = units.length ? Math.round((record.completed_units.length / units.length) * 100) : 0;
    const completed = Boolean(record.completed_at) || (units.length > 0 && record.completed_units.length >= units.length);
    return NextResponse.json({ onboarding: { ...record, progress, completed } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar progreso." }, { status: 400 });
  }
}
