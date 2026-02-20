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

    await sendMail({
      to: "hola@tho.cl",
      subject: mailSubject,
      text: JSON.stringify(payload, null, 2),
    });

    await pushToCRM(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[LEAD API ERROR]", error);
    return NextResponse.json({ ok: false, error: "Lead processing failed" }, { status: 500 });
  }
}
