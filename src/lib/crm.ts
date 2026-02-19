export type LeadPayload = {
  type: "contact" | "lead_magnet";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  ticket?: string;
  pageUrl?: string;
  utm?: Record<string, string | undefined>;
};

export async function pushToCRM(_payload: LeadPayload) {
  // Stub: el CRM aún no recibe leads.
  // Cuando el dev vuelva, esto se transforma en un fetch a tu endpoint.
  // Ej:
  // await fetch(process.env.CRM_ENDPOINT!, { method: "POST", headers: {...}, body: JSON.stringify(_payload) })
  return { ok: true, skipped: true };
}
