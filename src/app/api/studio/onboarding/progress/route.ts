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
    const applicableUnits = units.filter((_, index) => {
      const moduleKey = ["A", "B", "C", "D"][index] || String(index + 1);
      if (record.track === "sales") return ["A", "B"].includes(moduleKey);
      if (record.track === "creative_ops") return ["A", "C"].includes(moduleKey);
      if (record.track === "advisory_ops") return ["A", "D"].includes(moduleKey);
      return moduleKey === "A";
    });
    const applicableSlugs = new Set(applicableUnits.map((unit) => unit.slug));
    const completedApplicable = (record.completed_units || []).filter((slug) => applicableSlugs.has(slug));
    const progress = applicableUnits.length ? Math.round((completedApplicable.length / applicableUnits.length) * 100) : 0;
    const completedUnitsDone = applicableUnits.length > 0 && completedApplicable.length >= applicableUnits.length;
    const completed = Boolean(record.completed_at) || completedUnitsDone;
    return NextResponse.json({ onboarding: { ...record, completed_units: completedApplicable, progress, completed, completed_units_done: completedUnitsDone, last_saved_at: record.last_access_at } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar progreso." }, { status: 400 });
  }
}
