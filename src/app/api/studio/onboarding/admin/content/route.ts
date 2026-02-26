import { NextRequest, NextResponse } from "next/server";

import { OnboardingQuizQuestion, OnboardingUnit } from "@/content/onboardingContent";
import { readSession } from "@/lib/adminAuth";
import { canManageOnboarding, getQuizForAdmin, getUnits, setQuiz, setUnits } from "@/lib/onboardingStore";

export const dynamic = "force-dynamic";

function sanitizeUnits(input: unknown): OnboardingUnit[] {
  if (!Array.isArray(input)) throw new Error("Formato inválido de unidades.");
  const units = input.map((unit) => ({
    slug: String((unit as { slug?: unknown }).slug || "").trim(),
    title: String((unit as { title?: unknown }).title || "").trim(),
    summary: String((unit as { summary?: unknown }).summary || "").trim(),
    durationMinutes: Math.max(1, Number((unit as { durationMinutes?: unknown }).durationMinutes || 10)),
    content: Array.isArray((unit as { content?: unknown[] }).content)
      ? ((unit as { content?: unknown[] }).content || []).map((row) => String(row || "").trim()).filter(Boolean)
      : [],
    resources: Array.isArray((unit as { resources?: unknown[] }).resources)
      ? ((unit as { resources?: unknown[] }).resources || [])
          .map((resource) => ({
            label: String((resource as { label?: unknown }).label || "Recurso").trim(),
            href: String((resource as { href?: unknown }).href || "").trim(),
          }))
          .filter((resource) => resource.href)
      : undefined,
  })).filter((unit) => unit.slug && unit.title && unit.content.length > 0);

  if (!units.length) throw new Error("Debes enviar al menos una unidad válida.");
  return units;
}

function sanitizeQuiz(input: unknown): OnboardingQuizQuestion[] {
  if (!Array.isArray(input)) throw new Error("Formato inválido de evaluación.");
  const quiz = input
    .map((question, idx) => ({
      id: String((question as { id?: unknown }).id || `q${idx + 1}`).trim(),
      prompt: String((question as { prompt?: unknown }).prompt || "").trim(),
      options: Array.isArray((question as { options?: unknown[] }).options)
        ? ((question as { options?: unknown[] }).options || []).map((opt) => String(opt || "").trim()).filter(Boolean)
        : [],
      correctIndex: Math.max(0, Number((question as { correctIndex?: unknown }).correctIndex || 0)),
      topic: String((question as { topic?: unknown }).topic || "general").trim(),
    }))
    .filter((question) => question.id && question.prompt && question.options.length >= 2 && question.correctIndex < question.options.length);

  if (quiz.length < 8 || quiz.length > 12) {
    throw new Error("La evaluación debe tener entre 8 y 12 preguntas.");
  }

  return quiz;
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageOnboarding(session.email, session.role, session.canManageAccess)) {
    return NextResponse.json({ error: "Solo admin puede editar contenido onboarding." }, { status: 403 });
  }

  const [units, quiz] = await Promise.all([getUnits(), getQuizForAdmin()]);
  return NextResponse.json({ units, quiz });
}

export async function PATCH(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageOnboarding(session.email, session.role, session.canManageAccess)) {
    return NextResponse.json({ error: "Solo admin puede editar contenido onboarding." }, { status: 403 });
  }

  try {
    const payload = (await req.json()) as { units?: unknown; quiz?: unknown };
    const nextUnits = sanitizeUnits(payload.units);
    const nextQuiz = sanitizeQuiz(payload.quiz);
    const [units, quiz] = await Promise.all([setUnits(nextUnits), setQuiz(nextQuiz)]);
    return NextResponse.json({ ok: true, units, quiz });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar contenido." }, { status: 400 });
  }
}
