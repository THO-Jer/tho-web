import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { canManageOnboarding, getAdminOverview, getUserQuizAttempts, listOnboardingRecords, resetModuleForUser } from "@/lib/onboardingStore";
import { sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageOnboarding(session.email, session.role, session.canManageAccess)) {
    return NextResponse.json({ error: "Solo admin puede ver panel onboarding." }, { status: 403 });
  }

  const url = new URL(req.url);
  const email = String(url.searchParams.get("email") || "").trim().toLowerCase();
  const track = String(url.searchParams.get("track") || "").trim();
  const moduleKey = String(url.searchParams.get("moduleKey") || "").trim();

  const [records, overview, attempts] = await Promise.all([
    listOnboardingRecords(),
    getAdminOverview(),
    email && track ? getUserQuizAttempts(email, track, moduleKey || undefined) : Promise.resolve([]),
  ]);
  return NextResponse.json({ records, overview, attempts });
}

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageOnboarding(session.email, session.role, session.canManageAccess)) {
    return NextResponse.json({ error: "Solo admin puede ejecutar acciones de onboarding." }, { status: 403 });
  }

  try {
    const payload = (await req.json()) as { action?: string; email?: string; track?: "sales" | "creative_ops" | "advisory_ops" | "general"; moduleKey?: string };
    const action = String(payload.action || "");

    if (action === "send_reminder") {
      const to = String(payload.email || "").trim().toLowerCase();
      if (!to || !to.includes("@")) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
      await sendMail({
        to,
        subject: "Recordatorio · Studio Onboarding THO",
        text: "Hola, te recordamos completar tu Studio Onboarding en THO Studio: /studio/onboarding.",
      });
      return NextResponse.json({ ok: true });
    }

    if (action === "reset_module") {
      const email = String(payload.email || "").trim().toLowerCase();
      const track = payload.track || "general";
      const moduleKey = String(payload.moduleKey || "").trim();
      if (!email || !moduleKey) return NextResponse.json({ error: "Debes indicar email, track y módulo." }, { status: 400 });
      await resetModuleForUser(email, track, moduleKey);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo ejecutar acción." }, { status: 400 });
  }
}
