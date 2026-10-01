import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { deletePost, getPostBySlug, updatePost } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

// El sitio público (/, /blog, /blog/[slug], sitemap) se genera estáticamente y se
// regenera cada hora. Sin esto, un post recién publicado no aparecía hasta una
// hora después (y si la URL ya se había visitado como borrador, seguía en 404).
function revalidateBlog(...slugs: (string | null | undefined)[]) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${slug}`);
}

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
    revalidateBlog(slug, post.slug);
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
    revalidateBlog(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo eliminar el post.";
    const status = message.includes("no encontrado") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
