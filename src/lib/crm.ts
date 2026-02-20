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
};

type CRMResult = {
  ok: boolean;
  pushed?: boolean;
  provider?: "endpoint";
  skipped?: boolean;
  reason?: string;
};

export async function pushToCRM(payload: LeadPayload): Promise<CRMResult> {
  const endpoint = process.env.CRM_ENDPOINT;
  const leadsApiKey = process.env.LEADS_API_KEY || process.env.CRM_API_KEY;

  if (!endpoint) {
    return { ok: true, skipped: true, reason: "missing CRM_ENDPOINT" };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(leadsApiKey ? { Authorization: `Bearer ${leadsApiKey}` } : {}),
      ...(leadsApiKey ? { "x-api-key": leadsApiKey } : {}),
    },
    body: JSON.stringify({
      ...payload,
      ...(leadsApiKey ? { apiKey: leadsApiKey } : {}),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`CRM endpoint error (${response.status}): ${err}`);
  }

  return { ok: true, pushed: true, provider: "endpoint" };
}
