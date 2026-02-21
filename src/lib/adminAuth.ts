import { NextRequest } from "next/server";

const SESSION_COOKIE = "blog_admin_session";

type EditorRecord = { email: string; active?: boolean };

function getSupabaseEnv() {
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_SUPABASE_PUBLIC_URL;
  const url = rawUrl?.trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
  return { url, anon, service };
}

async function getUserEmailFromToken(token: string) {
  const { url, anon } = getSupabaseEnv();
  if (!url || !anon || !token) return null;

  const res = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const user = (await res.json()) as { email?: string };
  return user.email?.trim().toLowerCase() || null;
}

export async function isAllowedEditorEmail(email: string) {
  const { url, service } = getSupabaseEnv();
  if (!url || !service || !email) return false;

  const query = new URLSearchParams({
    select: "email,active",
    email: `eq.${email.trim().toLowerCase()}`,
    limit: "1",
  });

  const res = await fetch(`${url}/rest/v1/blog_editors?${query.toString()}`, {
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return false;
  const rows = (await res.json()) as EditorRecord[];
  return Boolean(rows[0] && rows[0].active !== false);
}

export async function validateSupabaseAccessToken(token: string) {
  const email = await getUserEmailFromToken(token);
  if (!email) return null;
  const allowed = await isAllowedEditorEmail(email);
  if (!allowed) return null;
  return { email };
}

export async function readSession(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const cookieToken = req.cookies.get(SESSION_COOKIE)?.value || "";
  const token = headerToken || cookieToken;
  if (!token) return null;

  const valid = await validateSupabaseAccessToken(token);
  if (!valid) return null;

  return { email: valid.email, token };
}

export async function isAdminAuthorized(req: NextRequest) {
  return Boolean(await readSession(req));
}

export { SESSION_COOKIE };
