export type LeadPayload = {
  type: "contact" | "lead_magnet" | "brochure_download";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  ticket?: string;
  pageUrl?: string;
  utm?: Record<string, string | undefined>;
  source?: string;
  resourceId?: string;
  resourceName?: string;
  serviceSlug?: string;
  serviceName?: string;
  levelId?: string;
  levelName?: string;
  eventLabel?: string;
};

type CRMResult = {
  ok: boolean;
  pushed?: boolean;
  provider?: "endpoint";
  skipped?: boolean;
  reason?: string;
  endpoint?: string;
  status?: number;
};

export class CRMRequestError extends Error {
  status: number;
  endpoint: string;
  responseBody: string;

  constructor(opts: { status: number; endpoint: string; responseBody: string }) {
    super(`CRM endpoint error (${opts.status}): ${opts.responseBody}`);
    this.name = "CRMRequestError";
    this.status = opts.status;
    this.endpoint = opts.endpoint;
    this.responseBody = opts.responseBody;
  }
}

const DEFAULT_CRM_ENDPOINT = "https://crm-tho.vercel.app/api/public/leads";

export async function pushToCRM(payload: LeadPayload): Promise<CRMResult> {
  // Soportamos ambos nombres por compatibilidad: CRM_LEADS_ENDPOINT (nuevo, descriptivo)
  // tiene prioridad sobre CRM_ENDPOINT (legacy). Si ninguno está seteado, fallback al default.
  const endpoint =
    process.env.CRM_LEADS_ENDPOINT || process.env.CRM_ENDPOINT || DEFAULT_CRM_ENDPOINT;
  const leadsApiKey = process.env.LEADS_API_KEY || process.env.CRM_API_KEY;

  if (!leadsApiKey) {
    return { ok: true, skipped: true, reason: "missing LEADS_API_KEY", endpoint };
  }

  const body = {
    ...payload,
    apiKey: leadsApiKey,
  };

  console.log("[CRM PUSH REQUEST]", "POST", endpoint, "email=", payload.email, "type=", payload.type);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${leadsApiKey}`,
      "x-api-key": leadsApiKey,
    },
    body: JSON.stringify(body),
  });

  const responseBody = await response.text();
  console.log("[CRM PUSH RESPONSE]", response.status, endpoint, "email=", payload.email, "body=", responseBody);

  if (!response.ok) {
    throw new CRMRequestError({
      status: response.status,
      endpoint,
      responseBody,
    });
  }

  return { ok: true, pushed: true, provider: "endpoint", endpoint, status: response.status };
}
