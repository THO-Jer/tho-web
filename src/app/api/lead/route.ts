import { NextResponse } from "next/server";

import { pushToCRM } from "@/lib/crm";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot anti-spam
    if (body.hp) return NextResponse.json({ ok: true });

    const payload = {
      type: body.type as "contact" | "lead_magnet" | "brochure_download",
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim() || undefined,
      company: String(body.company || "").trim() || undefined,
      message: String(body.message || "").trim() || undefined,
      ticket: String(body.ticket || "").trim() || undefined,
      pageUrl: String(body.pageUrl || "").trim() || undefined,
      utm: body.utm || {},
    };

    if (!payload.name || !payload.email) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const mailSubject =
      payload.type === "lead_magnet"
        ? "Nuevo lead — Lead magnet (Manual Diversidad)"
        : payload.type === "brochure_download"
          ? "Nuevo lead — Descarga de brochure"
          : "Nuevo lead — Formulario web";

    const [mailResult, crmResult] = await Promise.allSettled([
      sendMail({
        to: "hola@tho.cl",
        subject: mailSubject,
        text: JSON.stringify(payload, null, 2),
      }),
      pushToCRM(payload),
    ]);

    if (mailResult.status === "rejected") {
      console.error("[LEAD MAIL ERROR]", mailResult.reason);
    }

    if (crmResult.status === "rejected") {
      console.error("[LEAD CRM ERROR]", crmResult.reason);
      return NextResponse.json({ ok: false, error: "CRM pipeline failed" }, { status: 502 });
    }

    if (crmResult.value.skipped) {
      console.error("[LEAD CRM ERROR]", crmResult.value.reason);
      return NextResponse.json({ ok: false, error: "CRM pipeline not configured" }, { status: 500 });
    }

    console.log("[LEAD CRM OK]", crmResult.value.endpoint, crmResult.value.status);
    return NextResponse.json({ ok: true, crm: crmResult.value.provider, crmStatus: crmResult.value.status });
  } catch (error) {
    console.error("[LEAD API ERROR]", error);
    return NextResponse.json({ ok: false, error: "Lead processing failed" }, { status: 500 });
  }
}
