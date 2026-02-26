import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { canManageOnboarding, listOnboardingRecords } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageOnboarding(session.email, session.role, session.canManageAccess)) {
    return NextResponse.json({ error: "Solo admin puede ver panel onboarding." }, { status: 403 });
  }

  const records = await listOnboardingRecords();
  return NextResponse.json({ records });
}
