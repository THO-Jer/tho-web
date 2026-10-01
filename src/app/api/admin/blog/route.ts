import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { createPost, listPostsMeta } from "@/lib/blogStore";

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

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session || !session.canBlog) return unauthorized();

  // Listado liviano: no incluye `content` (usar GET /api/admin/blog/[slug]).
  const posts = await listPostsMeta();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session || !session.canBlog) return unauthorized();

  try {
    const payload = await req.json();
    const post = await createPost(payload);
    revalidateBlog(post.slug);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo crear el post." },
      { status: 400 }
    );
  }
}
