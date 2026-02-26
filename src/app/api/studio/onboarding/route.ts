import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { getOnboardingConfig, getOrCreateOnboardingRecord, getUnits } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [units, record] = await Promise.all([
    getUnits(),
    getOrCreateOnboardingRecord(session.email),
  ]);
  const progress = units.length ? Math.round((record.completed_units.length / units.length) * 100) : 0;
  const completed = Boolean(record.completed_at) || (units.length > 0 && record.completed_units.length >= units.length);

  return NextResponse.json({
    config: getOnboardingConfig(),
    units,
    onboarding: {
      ...record,
      progress,
      completed,
    },
  });
}
