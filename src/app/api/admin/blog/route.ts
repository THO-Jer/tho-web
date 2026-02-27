import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/adminAuth";
import { createPost, listAllPosts } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const session = await readSession(req);
  if (!session || !session.canBlog) return unauthorized();

  const posts = await listAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await readSession(req);
  if (!session || !session.canBlog) return unauthorized();

  try {
    const payload = await req.json();
    const post = await createPost(payload);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo crear el post." },
      { status: 400 }
    );
  }
}
