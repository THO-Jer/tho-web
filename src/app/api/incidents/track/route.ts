import { NextRequest, NextResponse } from "next/server";

import { getIncidentByTracking } from "@/lib/incidentsStore";

export const dynamic = "force-dynamic";

const ATTEMPTS = new Map<string, { count: number; windowStart: number; blockedUntil: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const BLOCK_MS = 15 * 60 * 1000;

function getSourceIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function getBucketKey(ip: string, trackingCode: string) {
  return `${ip}:${trackingCode}`;
}

function checkRateLimit(key: string, now: number) {
  const current = ATTEMPTS.get(key);
  if (!current) return { allowed: true };

  if (current.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((current.blockedUntil - now) / 1000) };
  }

  if (now - current.windowStart > WINDOW_MS) {
    ATTEMPTS.set(key, { count: 0, windowStart: now, blockedUntil: 0 });
  }

  return { allowed: true };
}

function registerFailure(key: string, now: number) {
  const current = ATTEMPTS.get(key);
  if (!current || now - current.windowStart > WINDOW_MS) {
    ATTEMPTS.set(key, { count: 1, windowStart: now, blockedUntil: 0 });
    return;
  }

  const nextCount = current.count + 1;
  const blockedUntil = nextCount >= MAX_ATTEMPTS ? now + BLOCK_MS : 0;
  ATTEMPTS.set(key, { count: nextCount, windowStart: current.windowStart, blockedUntil });
}

function resetFailures(key: string) {
  ATTEMPTS.delete(key);
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const trackingCode = String(payload.tracking_code || "").trim().toUpperCase();
    const pin = String(payload.pin || "").trim();

    if (!trackingCode || !pin) {
      return NextResponse.json({ error: "Debes enviar código de seguimiento y PIN." }, { status: 400 });
    }

    const now = Date.now();
    const key = getBucketKey(getSourceIp(req), trackingCode);
    const rate = checkRateLimit(key, now);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Demasiados intentos. Intenta nuevamente más tarde.", retryAfterSec: rate.retryAfterSec }, { status: 429 });
    }

    const snapshot = await getIncidentByTracking(trackingCode, pin);
    if (!snapshot) {
      registerFailure(key, now);
      return NextResponse.json({ error: "Código/PIN inválidos." }, { status: 404 });
    }

    resetFailures(key);
    return NextResponse.json({ incident: snapshot });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo consultar el caso." }, { status: 400 });
  }
}
