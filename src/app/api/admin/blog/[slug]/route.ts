import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { deletePost, getPostBySlug, updatePost } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await readSession(req);
  if (!session || !session.canBlog) return unauthorized();

  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return NextResponse.json({ error: "Post no encontrado." }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo cargar el post." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await readSession(req);
  if (!session || !session.canBlog) return unauthorized();

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
  const session = await readSession(req);
  if (!session || !session.canBlog) return unauthorized();

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
