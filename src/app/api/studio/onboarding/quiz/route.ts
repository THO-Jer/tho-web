import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { submitQuiz } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (session.canOnboarding === false) return NextResponse.json({ error: "Sin acceso al módulo onboarding." }, { status: 403 });

  try {
    const payload = (await req.json()) as { answers?: Array<{ question_id?: string; selected_index?: number }> };
    const answers = Array.isArray(payload.answers)
      ? payload.answers
          .map((answer) => ({ question_id: String(answer.question_id || "").trim(), selected_index: Number(answer.selected_index || 0) }))
          .filter((answer) => answer.question_id)
      : [];

    if (!answers.length) {
      return NextResponse.json({ error: "Debes responder al menos una pregunta." }, { status: 400 });
    }

    const record = await submitQuiz(session.email, answers);
    return NextResponse.json({ onboarding: record });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar evaluación." }, { status: 400 });
  }
}
