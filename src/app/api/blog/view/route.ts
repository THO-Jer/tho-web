import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/adminAuth";
import { describeAnalyticsError, isAnalyticsConfigured, isValidSlug, recordBlogView } from "@/lib/blogAnalytics";
import { getPublishedPostBySlug } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

// Bots, previsualizadores de enlaces y herramientas de auditoría no cuentan.
const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|embedly|headless|lighthouse|pagespeed|gtmetrix|monitor|uptime|curl|wget|python|axios|node-fetch/i;

// Límite simple por IP (por instancia): 60 lecturas cada 10 minutos.
const RATE_MAX = 60;
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

// Cache corto de slugs publicados para no consultar Supabase en cada lectura.
const publishedCache = new Map<string, { ok: boolean; until: number }>();

async function isPublished(slug: string) {
  const cached = publishedCache.get(slug);
  if (cached && cached.until > Date.now()) return cached.ok;
  const post = await getPublishedPostBySlug(slug);
  const ok = Boolean(post);
  publishedCache.set(slug, { ok, until: Date.now() + 5 * 60 * 1000 });
  return ok;
}

export async function POST(req: NextRequest) {
  // Respuesta siempre 204: el navegador no necesita saber si se contó.
  const done = () => new NextResponse(null, { status: 204 });

  try {
    if (!isAnalyticsConfigured()) return done();

    const ua = req.headers.get("user-agent") || "";
    if (!ua || BOT_UA.test(ua)) return done();

    // Las lecturas del equipo con sesión abierta en Studio no cuentan.
    if (req.cookies.get(SESSION_COOKIE)?.value) return done();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    if (rateLimited(ip)) return done();

    const body = (await req.json().catch(() => ({}))) as { slug?: unknown };
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    if (!isValidSlug(slug)) return done();
    if (!(await isPublished(slug))) return done();

    await recordBlogView(slug);
  } catch (error) {
    console.error("[BLOG VIEW ERROR]", describeAnalyticsError(error));
  }
  return done();
}
