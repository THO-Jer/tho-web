import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { markLessonCompleted } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (session.canOnboarding === false) return NextResponse.json({ error: "Sin acceso al módulo onboarding." }, { status: 403 });

  try {
    const payload = (await req.json()) as { moduleKey?: string; lessonId?: string; unitSlug?: string; elapsedSeconds?: number; reachedEnd?: boolean };
    const moduleKey = String(payload.moduleKey || "").trim();
    const lessonId = String(payload.lessonId || "").trim();
    const unitSlug = String(payload.unitSlug || "").trim();

    const elapsedSeconds = Number(payload.elapsedSeconds || 0);
    const reachedEnd = Boolean(payload.reachedEnd);

    const data = await markLessonCompleted(session.email, moduleKey, lessonId, unitSlug, elapsedSeconds, reachedEnd);
    return NextResponse.json({ onboarding: { ...data.record, ...data.summary } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar progreso." }, { status: 400 });
  }
}
