import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { sendMail } from "@/lib/mail";
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

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageOnboarding(session.email, session.role, session.canManageAccess)) {
    return NextResponse.json({ error: "Solo admin puede enviar recordatorios." }, { status: 403 });
  }

  try {
    const payload = (await req.json()) as { action?: string; email?: string };
    if (String(payload.action || "") !== "send_reminder") {
      return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
    }

    const to = String(payload.email || "").trim().toLowerCase();
    if (!to || !to.includes("@")) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    await sendMail({
      to,
      subject: "Recordatorio · Studio Onboarding THO",
      text: "Hola, te recordamos completar tu Studio Onboarding en THO Studio: /studio/onboarding. Es un proceso formativo y obligatorio para alineación operativa.",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo enviar recordatorio." }, { status: 400 });
  }
}
