import { NextRequest } from "next/server";

const SESSION_COOKIE = "blog_admin_session";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getAllowedEmails() {
  const raw = process.env.BLOG_ADMIN_ALLOWED_EMAILS || "";
  return raw
    .split(",")
    .map((email) => normalize(email))
    .filter(Boolean);
}

export function isAllowedEditorEmail(email: string) {
  const allowlist = getAllowedEmails();
  if (allowlist.length === 0) return true;
  return allowlist.includes(normalize(email));
}

export function buildSessionValue(email: string, token: string) {
  return `${normalize(email)}::${token}`;
}

export function readSession(req: NextRequest) {
  const expected = process.env.BLOG_ADMIN_TOKEN;
  if (!expected) return null;

  const headerToken = req.headers.get("x-admin-token") || "";
  if (headerToken && headerToken === expected) {
    return { email: "header-auth", via: "header" as const };
  }

  const cookie = req.cookies.get(SESSION_COOKIE)?.value || "";
  if (!cookie.includes("::")) return null;

  const [email, token] = cookie.split("::");
  if (!email || token !== expected) return null;
  if (!isAllowedEditorEmail(email)) return null;

  return { email, via: "cookie" as const };
}

export function isAdminAuthorized(req: NextRequest) {
  return Boolean(readSession(req));
}

export { SESSION_COOKIE };
