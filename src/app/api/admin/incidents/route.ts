import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { listIncidents } from "@/lib/incidentsStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session || !session.canIncidents || !session.isSuperAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const incidents = await listIncidents();
  return NextResponse.json({ incidents });
}
