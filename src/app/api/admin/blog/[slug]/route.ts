import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/adminAuth";
import { deletePost, updatePost } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const { slug } = await params;
    const post = await updatePost(slug, payload);
    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo actualizar el post.";
    const status = message.includes("no encontrado") ? 404 : message.includes("Ya existe") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    await deletePost(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo eliminar el post.";
    const status = message.includes("no encontrado") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
