import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/adminAuth";
import { describeAnalyticsError, isAnalyticsConfigured } from "@/lib/blogAnalytics";
import { BOT_UA, recordWebHit } from "@/lib/webAnalytics";
import { isChannel, isTrackablePath, normalizePath } from "@/lib/webChannels";

export const dynamic = "force-dynamic";

// Límite simple por IP (por instancia): 120 registros cada 10 minutos.
const RATE_MAX = 120;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

export async function POST(req: NextRequest) {
  const done = () => new NextResponse(null, { status: 204 });

  try {
    if (!isAnalyticsConfigured()) return done();

    const ua = req.headers.get("user-agent") || "";
    if (!ua || BOT_UA.test(ua)) return done();

    // El equipo con sesión abierta en Studio no cuenta.
    if (req.cookies.get(SESSION_COOKIE)?.value) return done();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    if (rateLimited(ip)) return done();

    const body = (await req.json().catch(() => ({}))) as {
      path?: unknown;
      page?: unknown;
      visit?: { channel?: unknown; source?: unknown } | null;
    };

    const path = normalizePath(typeof body.path === "string" ? body.path : "");
    if (!path || !isTrackablePath(path)) return done();

    const visit =
      body.visit && isChannel(body.visit.channel)
        ? {
            channel: body.visit.channel,
            source: typeof body.visit.source === "string" ? body.visit.source.toLowerCase().replace(/[^a-z0-9.\-_ ]/g, "").slice(0, 60) : "",
          }
        : null;
    const page = body.page === true;
    if (!page && !visit) return done();

    await recordWebHit({ path, page, visit });
  } catch (error) {
    console.error("[WEB HIT ERROR]", describeAnalyticsError(error));
  }
  return done();
}
