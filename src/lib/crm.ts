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

export async function pushToCRM(payload: LeadPayload) {
  const endpoint = process.env.CRM_ENDPOINT;
  const apiKey = process.env.CRM_API_KEY;

  if (!endpoint) {
    console.log("[CRM STUB] missing CRM_ENDPOINT", payload.type, payload.email);
    return { ok: true, skipped: true };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`CRM error (${response.status}): ${err}`);
  }

  return { ok: true, pushed: true };
}
