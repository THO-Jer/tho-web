import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { submitModuleQuiz } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (session.canOnboarding === false) return NextResponse.json({ error: "Sin acceso al módulo onboarding." }, { status: 403 });

  try {
    const payload = (await req.json()) as { moduleKey?: string; answers?: Array<{ question_id?: string; selected_index?: number }> };
    const moduleKey = String(payload.moduleKey || "").trim();
    const answers = Array.isArray(payload.answers)
      ? payload.answers.map((a) => ({ question_id: String(a.question_id || "").trim(), selected_index: Number(a.selected_index || 0) })).filter((a) => a.question_id)
      : [];

    if (!moduleKey) return NextResponse.json({ error: "Debes indicar el módulo." }, { status: 400 });
    if (!answers.length) return NextResponse.json({ error: "Debes responder al menos una pregunta." }, { status: 400 });

    const data = await submitModuleQuiz(session.email, moduleKey, answers);
    return NextResponse.json({ onboarding: { ...data.record, ...data.summary }, moduleStatus: data.moduleStatus, passed: data.passed, topics_to_reinforce: data.topics_to_reinforce });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar evaluación." }, { status: 400 });
  }
}
