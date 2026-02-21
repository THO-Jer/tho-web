import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

async function listImagesFromDir(rootDir: string, publicPrefix: string) {
  try {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .filter((entry) => IMAGE_EXT.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => `${publicPrefix}/${entry.name}`);
  } catch {
    return [] as string[];
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (req.nextUrl.searchParams.get("list") !== "1") {
    return NextResponse.json({ error: "Parámetro list=1 requerido" }, { status: 400 });
  }

  const publicDir = path.join(process.cwd(), "public");
  const uploadsDir = path.join(publicDir, "uploads", "blog");
  const heroDir = path.join(publicDir, "hero");

  const [uploads, hero] = await Promise.all([
    listImagesFromDir(uploadsDir, "/uploads/blog"),
    listImagesFromDir(heroDir, "/hero"),
  ]);

  return NextResponse.json({ images: [...hero, ...uploads] });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
    }

    const valid = ["image/jpeg", "image/png", "image/webp"];
    if (!valid.includes(file.type)) {
      return NextResponse.json({ error: "Formato no soportado (jpg/png/webp)." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const outDir = path.join(process.cwd(), "public", "uploads", "blog");
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, filename), bytes);

    return NextResponse.json({ url: `/uploads/blog/${filename}` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo subir el archivo" },
      { status: 500 }
    );
  }
}
