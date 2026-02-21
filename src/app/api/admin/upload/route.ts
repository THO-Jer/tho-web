import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

type RepoTreeNode = {
  kind: "dir" | "file";
  name: string;
  path: string;
  children?: RepoTreeNode[];
};

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

async function listImageTree(rootDir: string, relativeDir = ""): Promise<RepoTreeNode[]> {
  const currentDir = path.join(rootDir, relativeDir);
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const nodes: RepoTreeNode[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const relPath = path.posix.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      const children = await listImageTree(rootDir, relPath);
      if (!children.length) continue;
      nodes.push({
        kind: "dir",
        name: entry.name,
        path: relPath,
        children,
      });
      continue;
    }

    if (!entry.isFile()) continue;
    if (!IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) continue;
    nodes.push({
      kind: "file",
      name: entry.name,
      path: `/${relPath}`,
    });
  }

  return nodes.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name, "es");
  });
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const publicDir = path.join(process.cwd(), "public");

  if (req.nextUrl.searchParams.get("tree") === "1") {
    try {
      const tree = await listImageTree(publicDir);
      return NextResponse.json({ root: "/public", tree });
    } catch {
      return NextResponse.json({ root: "/public", tree: [] as RepoTreeNode[] });
    }
  }

  if (req.nextUrl.searchParams.get("list") !== "1") {
    return NextResponse.json({ error: "Parámetro list=1 o tree=1 requerido" }, { status: 400 });
  }

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
