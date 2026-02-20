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
  provider?: "endpoint" | "supabase";
  skipped?: boolean;
  reason?: string;
};

async function pushToEndpoint(payload: LeadPayload): Promise<CRMResult> {
  const endpoint = process.env.CRM_ENDPOINT;
  const apiKey = process.env.CRM_API_KEY;

  if (!endpoint) return { ok: false, skipped: true, reason: "missing CRM_ENDPOINT" };

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
    throw new Error(`CRM endpoint error (${response.status}): ${err}`);
  }

  return { ok: true, pushed: true, provider: "endpoint" };
}

async function pushToSupabase(payload: LeadPayload): Promise<CRMResult> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.CRM_TABLE || "crm_leads";

  if (!supabaseUrl || !serviceRole) {
    return { ok: false, skipped: true, reason: "missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" };
  }

  const restUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`;
  const row = {
    type: payload.type,
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? null,
    company: payload.company ?? null,
    message: payload.message ?? null,
    ticket: payload.ticket ?? null,
    page_url: payload.pageUrl ?? null,
    utm: payload.utm ?? {},
    source: "web",
  };

  const response = await fetch(restUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`CRM supabase error (${response.status}): ${err}`);
  }

  return { ok: true, pushed: true, provider: "supabase" };
}

export async function pushToCRM(payload: LeadPayload): Promise<CRMResult> {
  const endpointResult = await pushToEndpoint(payload);
  if (endpointResult.ok) return endpointResult;

  const supabaseResult = await pushToSupabase(payload);
  if (supabaseResult.ok) return supabaseResult;

  console.log("[CRM STUB] no CRM destination configured", payload.type, payload.email);
  return { ok: true, skipped: true, reason: "no destination" };
}
