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

function row(label: string, value: string | undefined) {
  const v = value || "-";
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#94a3b8;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;vertical-align:top;word-break:break-all;">${v}</td>
    </tr>`;
}

function buildMailHtml(payload: LeadPayload, typeLabel: string): string {
  const utmEntries = Object.entries(payload.utm || {})
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ") || "-";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Nuevo lead — THO</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f1117;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Brand divider top -->
          <tr>
            <td style="height:5px;border-radius:4px 4px 0 0;background:linear-gradient(90deg,#d13ca2 0 20%,#1e71b8 20% 40%,#fa7f33 40% 60%,#f2b705 60% 80%,#93bf24 80% 100%);"></td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#161b24;border:1px solid rgba(71,85,105,0.45);border-top:0;border-radius:0 0 12px 12px;padding:32px 32px 28px;">

              <!-- Logo / Header -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td>
                    <span style="font-size:20px;font-weight:800;letter-spacing:-0.04em;color:#f8fafc;">THO</span>
                    <span style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#475569;margin-left:10px;">Notificación interna</span>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:rgba(147,191,36,0.15);color:#93bf24;font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;padding:4px 10px;border-radius:999px;border:1px solid rgba(147,191,36,0.35);">${typeLabel}</span>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;letter-spacing:-0.04em;color:#f8fafc;line-height:1.1;">Nuevo lead capturado</h1>
              ${payload.eventLabel ? `<p style="margin:0 0 24px;font-size:14px;color:#64748b;">${payload.eventLabel}</p>` : `<p style="margin:0 0 24px;"></p>`}

              <!-- Contact info -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e2535;border-radius:8px;padding:4px 16px;margin-bottom:20px;">
                <tbody>
                  ${row("Nombre", payload.name)}
                  ${row("Email", payload.email)}
                  ${row("Empresa", payload.company)}
                  ${row("Teléfono", payload.phone)}
                  ${payload.message ? row("Mensaje", payload.message) : ""}
                </tbody>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:rgba(71,85,105,0.4);margin:20px 0;"></div>

              <!-- Origin context -->
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#475569;">Contexto de origen</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e2535;border-radius:8px;padding:4px 16px;margin-bottom:20px;">
                <tbody>
                  ${row("Source", payload.source)}
                  ${row("Resource", payload.resourceName || payload.resourceId)}
                  ${row("Servicio", payload.serviceName || payload.serviceSlug)}
                  ${row("Nivel", payload.levelName || payload.levelId)}
                  ${row("Ticket", payload.ticket)}
                  ${row("URL", payload.pageUrl)}
                  ${row("UTM", utmEntries)}
                </tbody>
              </table>

              <!-- Footer -->
              <p style="margin:28px 0 0;font-size:11px;color:#334155;text-align:center;">
                Este correo fue generado automáticamente por <strong style="color:#475569;">tho.cl</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
  const typeLabel = leadTypeLabel(payload.type);

  const lines = [
    "Nuevo lead capturado",
    "",
    `Tipo: ${typeLabel}`,
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
    subject: `Nuevo lead — ${typeLabel}${subjectSuffix}`,
    text: lines.join("\n"),
    html: buildMailHtml(payload, typeLabel),
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
        html: mail.html,
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
