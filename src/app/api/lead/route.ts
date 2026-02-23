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

    if (mailResult.status === "rejected") {
      console.error("[LEAD MAIL ERROR]", mailResult.reason);
    }

    if (crmResult.status === "rejected") {
      if (crmResult.reason instanceof CRMRequestError) {
        const upstream = crmResult.reason.responseBody;
        console.error("[LEAD CRM ERROR]", crmResult.reason.message);
        return NextResponse.json(
          {
            ok: false,
            error: "CRM pipeline failed",
            crmStatus: crmResult.reason.status,
            crmEndpoint: crmResult.reason.endpoint,
            crmMessage: upstream,
          },
          { status: 502 }
        );
      }

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
