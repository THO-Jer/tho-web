import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { getOnboardingConfig, getOnboardingSnapshot, getRecommendationsFromTopics } from "@/lib/onboardingStore";
import { sendMail } from "@/lib/mail";

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

export async function POST(req: NextRequest) {
  try {
    const session = await readSession(req);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (session.canOnboarding === false) return NextResponse.json({ error: "Sin acceso al módulo onboarding." }, { status: 403 });

    const payload = (await req.json()) as { action?: string; moduleKey?: string };
    if (String(payload.action || "") !== "request_unlock") {
      return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
    }

    const moduleKey = String(payload.moduleKey || "").trim();
    if (!moduleKey) return NextResponse.json({ error: "Debes indicar el módulo." }, { status: 400 });

    const adminEmail = (process.env.ADMIN_NOTIFY_EMAIL || process.env.MAIL_FROM || "").replace(/^.*<(.+)>$/, "$1").trim();
    if (!adminEmail || !adminEmail.includes("@")) {
      return NextResponse.json({ error: "No hay dirección de admin configurada para notificaciones." }, { status: 500 });
    }

    await sendMail({
      to: adminEmail,
      subject: `Solicitud de desbloqueo · Módulo ${moduleKey} · ${session.email}`,
      text: `El usuario ${session.email} ha agotado sus intentos en el módulo ${moduleKey} del onboarding y solicita un reset.\n\nPuedes resetearlo desde el panel admin: /studio/onboarding/admin`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo enviar solicitud." }, { status: 500 });
  }
}
