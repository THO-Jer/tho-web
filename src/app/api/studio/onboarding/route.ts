import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { getOnboardingConfig, getOnboardingSnapshot, getRecommendationsFromTopics } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await readSession(req);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (session.canOnboarding === false) return NextResponse.json({ error: "Sin acceso al módulo onboarding." }, { status: 403 });

    const snapshot = await getOnboardingSnapshot(session.email, session.role);
    const recommendations = getRecommendationsFromTopics(snapshot.units, snapshot.record.quiz_result?.topics_to_reinforce || []);

    return NextResponse.json({
      config: getOnboardingConfig(),
      track: snapshot.record.track,
      units: snapshot.units,
      quiz: snapshot.quiz,
      onboarding: {
        ...snapshot.record,
        ...snapshot.summary,
        recommendations,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo cargar onboarding." }, { status: 500 });
  }
}
