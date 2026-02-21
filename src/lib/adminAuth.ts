import { NextRequest } from "next/server";

export function isAdminAuthorized(req: NextRequest) {
  const expected = process.env.BLOG_ADMIN_TOKEN;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-token") || "";
  return provided === expected;
}
