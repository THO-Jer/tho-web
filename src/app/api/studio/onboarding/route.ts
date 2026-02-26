import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { getOnboardingConfig, getOrCreateOnboardingRecord, getQuizForParticipant, getUnits } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [units, record, quiz] = await Promise.all([
    getUnits(),
    getOrCreateOnboardingRecord(session.email),
    getQuizForParticipant(),
  ]);

  const progress = units.length ? Math.round((record.completed_units.length / units.length) * 100) : 0;
  const completedUnitsDone = units.length > 0 && record.completed_units.length >= units.length;
  const completed = Boolean(record.completed_at) || completedUnitsDone;

  return NextResponse.json({
    config: getOnboardingConfig(),
    units,
    quiz,
    onboarding: {
      ...record,
      progress,
      completed,
      completed_units_done: completedUnitsDone,
      last_saved_at: record.updated_at,
    },
  });
}
