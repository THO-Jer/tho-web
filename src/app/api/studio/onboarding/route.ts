import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { getOnboardingConfig, getOrCreateOnboardingRecord, getQuizForParticipant, getRecommendationsFromTopics, getUnits } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [units, record, quiz] = await Promise.all([
    getUnits(),
    getOrCreateOnboardingRecord(session.email),
    getQuizForParticipant(),
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
  const recommendations = getRecommendationsFromTopics(units, record.quiz_result?.topics_to_reinforce || []);

  return NextResponse.json({
    config: getOnboardingConfig(),
    track: record.track,
    units: applicableUnits,
    quiz,
    onboarding: {
      ...record,
      completed_units: completedApplicable,
      progress,
      completed,
      completed_units_done: completedUnitsDone,
      last_saved_at: record.last_access_at,
      recommendations,
    },
  });
}
