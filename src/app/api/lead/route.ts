import { NextResponse } from "next/server";

import { CRMRequestError, type LeadPayload, pushToCRM } from "@/lib/crm";
import { sendMail } from "@/lib/mail";

function clean(value: unknown) {
  return String(value || "").trim();
}

function optional(value: unknown) {
  const v = clean(value);
  return v || undefined;
}

function toPayload(body: Record<string, unknown>): LeadPayload {
  return {
    type: body.type as "contact" | "lead_magnet" | "brochure_download",
    name: clean(body.name),
    email: clean(body.email),
    phone: optional(body.phone),
    company: optional(body.company),
    message: optional(body.message),
    ticket: optional(body.ticket),
    pageUrl: optional(body.pageUrl),
    utm: (body.utm as Record<string, string | undefined>) || {},
    source: optional(body.source),
    resourceId: optional(body.resourceId),
    resourceName: optional(body.resourceName),
    serviceSlug: optional(body.serviceSlug),
    serviceName: optional(body.serviceName),
    levelId: optional(body.levelId),
    levelName: optional(body.levelName),
    eventLabel: optional(body.eventLabel),
  };
}

function leadTypeLabel(type: LeadPayload["type"]) {
  if (type === "lead_magnet") return "Lead magnet";
  if (type === "brochure_download") return "Descarga de brochure";
  return "Formulario web";
}

function buildMail(payload: LeadPayload) {
  const context = [
    payload.eventLabel,
    payload.resourceName,
    payload.serviceName,
    payload.levelName,
    payload.ticket,
  ]
    .filter(Boolean)
    .join(" · ");

  const subjectSuffix = context ? ` (${context})` : "";

  const lines = [
    "Nuevo lead capturado",
    "",
    `Tipo: ${leadTypeLabel(payload.type)}`,
    `Evento: ${payload.eventLabel || "-"}`,
    `Nombre: ${payload.name || "-"}`,
    `Email: ${payload.email || "-"}`,
    `Empresa: ${payload.company || "-"}`,
    `Teléfono: ${payload.phone || "-"}`,
    `Mensaje: ${payload.message || "-"}`,
    "",
    "Contexto de origen",
    `Source: ${payload.source || "-"}`,
    `Resource ID: ${payload.resourceId || "-"}`,
    `Resource Name: ${payload.resourceName || "-"}`,
    `Service Slug: ${payload.serviceSlug || "-"}`,
    `Service Name: ${payload.serviceName || "-"}`,
    `Level ID: ${payload.levelId || "-"}`,
    `Level Name: ${payload.levelName || "-"}`,
    `Ticket: ${payload.ticket || "-"}`,
    `URL: ${payload.pageUrl || "-"}`,
    "",
    `UTM: ${JSON.stringify(payload.utm || {}, null, 2)}`,
  ];

  return {
    subject: `Nuevo lead — ${leadTypeLabel(payload.type)}${subjectSuffix}`,
    text: lines.join("\n"),
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    if (body.hp) return NextResponse.json({ ok: true });

    const payload = toPayload(body);

    if (!payload.name || !payload.email || !payload.type) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const mail = buildMail(payload);

    const [mailResult, crmResult] = await Promise.allSettled([
      sendMail({
        to: "hola@tho.cl",
        subject: mail.subject,
        text: mail.text,
      }),
      pushToCRM(payload),
    ]);

    // Mail channel — independiente, no bloquea.
    if (mailResult.status === "rejected") {
      console.error("[LEAD MAIL ERROR]", mailResult.reason);
    }
    const mailOk = mailResult.status === "fulfilled";

    // CRM channel — independiente, no bloquea. Loggeamos detalle upstream para diagnóstico.
    let crmStatus: "ok" | "failed" | "skipped" = "failed";
    if (crmResult.status === "rejected") {
      if (crmResult.reason instanceof CRMRequestError) {
        console.error(
          "[LEAD CRM ERROR] upstream",
          crmResult.reason.status,
          crmResult.reason.endpoint,
          crmResult.reason.responseBody,
        );
      } else {
        console.error("[LEAD CRM ERROR]", crmResult.reason);
      }
    } else if (crmResult.value.skipped) {
      console.error("[LEAD CRM SKIPPED]", crmResult.value.reason);
      crmStatus = "skipped";
    } else {
      console.log("[LEAD CRM OK]", crmResult.value.endpoint, crmResult.value.status);
      crmStatus = "ok";
    }

    // El lead se considera capturado si llegó al correo O al CRM.
    // Sólo fallamos la request si AMBOS canales fallan (sin registro recuperable).
    if (!mailOk && crmStatus !== "ok") {
      return NextResponse.json(
        { ok: false, error: "Lead capture failed in all channels" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      mail: mailOk ? "ok" : "failed",
      crm: crmStatus,
    });
  } catch (error) {
    console.error("[LEAD API ERROR]", error);
    return NextResponse.json({ ok: false, error: "Lead processing failed" }, { status: 500 });
  }
}
