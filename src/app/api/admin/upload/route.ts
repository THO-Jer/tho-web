import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized, readSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

type RepoTreeNode = {
  kind: "dir" | "file";
  name: string;
  path: string;
  children?: RepoTreeNode[];
};

function getStorageEnv() {
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_SUPABASE_PUBLIC_URL;
  const url = rawUrl?.trim().replace(/^ttps:\/\//, "https://").replace(/\/$/, "");
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_SUPABASE_ANON_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "blog-assets";
  return { url, service, anon, bucket };
}


function encodeStoragePath(objectPath: string) {
  return objectPath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function uploadToBucket(params: {
  url: string;
  bucket: string;
  encodedPath: string;
  fileType: string;
  bytes: ArrayBuffer;
  apikey: string;
  bearer: string;
}) {
  const { url, bucket, encodedPath, fileType, bytes, apikey, bearer } = params;
  return fetch(`${url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
    method: "POST",
    headers: {
      apikey,
      Authorization: `Bearer ${bearer}`,
      "content-type": fileType,
      "x-upsert": "false",
    },
    body: new Blob([bytes], { type: fileType }),
    cache: "no-store",
  });
}

async function ensureBucketExists(url: string, bucket: string, service: string) {
  const createRes = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: bucket,
      name: bucket,
      public: true,
      file_size_limit: null,
      allowed_mime_types: ["image/jpeg", "image/png", "image/webp"],
    }),
    cache: "no-store",
  });

  if (!createRes.ok) {
    const reason = await createRes.text();
    throw new Error(`No se pudo crear bucket '${bucket}': ${reason}`);
  }
}


async function listStorageImageTree(params: { url: string; bucket: string; apikey: string; bearer: string }) {
  const { url, bucket, apikey, bearer } = params;
  const res = await fetch(`${url}/storage/v1/object/list/${encodeURIComponent(bucket)}`, {
    method: "POST",
    headers: {
      apikey,
      Authorization: `Bearer ${bearer}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      prefix: "blog",
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const reason = await res.text();
    throw new Error(`No se pudo listar Storage: ${reason}`);
  }

  const rows = (await res.json()) as Array<{ name: string }>;
  const root: RepoTreeNode[] = [];

  function ensureDir(nodes: RepoTreeNode[], name: string, relPath: string) {
    let existing = nodes.find((node) => node.kind === "dir" && node.name === name);
    if (!existing) {
      existing = { kind: "dir", name, path: relPath, children: [] };
      nodes.push(existing);
    }
    return existing;
  }

  for (const row of rows) {
    if (!row?.name) continue;
    const fullPath = `blog/${row.name}`;
    const ext = path.extname(fullPath).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;

    const parts = fullPath.split("/").filter(Boolean);
    let nodes = root;
    let rel = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      rel = rel ? `${rel}/${part}` : part;
      const isLast = i === parts.length - 1;

      if (isLast) {
        const encodedPath = encodeStoragePath(rel);
        const publicUrl = `${url}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
        nodes.push({ kind: "file", name: part, path: publicUrl });
      } else {
        const dir = ensureDir(nodes, part, rel);
        if (!dir.children) dir.children = [];
        nodes = dir.children;
      }
    }
  }

  function sortTree(nodes: RepoTreeNode[]): RepoTreeNode[] {
    return nodes
      .map((node) => (node.kind === "dir" && node.children ? { ...node, children: sortTree(node.children) } : node))
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name, "es");
      });
  }

  return sortTree(root);
}

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

  if (req.nextUrl.searchParams.get("storageTree") === "1") {
    const { url, service, anon, bucket } = getStorageEnv();
    if (!url) {
      return NextResponse.json({ error: "Storage no configurado. Define SUPABASE_URL." }, { status: 500 });
    }

    const session = await readSession(req);
    const apikey = service || anon;
    const bearer = service || session?.token;
    if (!apikey || !bearer) {
      return NextResponse.json({ error: "Credenciales insuficientes para listar Storage." }, { status: 500 });
    }

    try {
      const tree = await listStorageImageTree({ url, bucket, apikey, bearer });
      return NextResponse.json({ root: `supabase:${bucket}`, tree });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo listar Storage" }, { status: 500 });
    }
  }

  if (req.nextUrl.searchParams.get("tree") === "1") {
    try {
      const tree = await listImageTree(publicDir);
      return NextResponse.json({ root: "/public", tree });
    } catch {
      return NextResponse.json({ root: "/public", tree: [] as RepoTreeNode[] });
    }
  }

  if (req.nextUrl.searchParams.get("list") !== "1") {
    return NextResponse.json({ error: "Parámetro list=1, tree=1 o storageTree=1 requerido" }, { status: 400 });
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

    const { url, service, anon, bucket } = getStorageEnv();
    if (!url) {
      return NextResponse.json({ error: "Storage no configurado. Define SUPABASE_URL." }, { status: 500 });
    }

    const session = await readSession(req);
    const apikey = service || anon;
    const bearer = service || session?.token;

    if (!apikey || !bearer) {
      return NextResponse.json(
        { error: "Storage no configurado. Define SERVICE_ROLE o ANON_KEY + sesión válida." },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const rawExt = file.name.split(".").pop() || "jpg";
    const ext = rawExt.toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const objectPath = `blog/${filename}`;
    const encodedPath = encodeStoragePath(objectPath);

    let uploadRes = await uploadToBucket({
      url,
      bucket,
      encodedPath,
      fileType: file.type,
      bytes,
      apikey,
      bearer,
    });

    if (!uploadRes.ok) {
      let lastReason = await uploadRes.text();
      const missingBucket = uploadRes.status === 404 && /bucket not found/i.test(lastReason);

      if (missingBucket && service) {
        try {
          await ensureBucketExists(url, bucket, service);
          uploadRes = await uploadToBucket({
            url,
            bucket,
            encodedPath,
            fileType: file.type,
            bytes,
            apikey: service,
            bearer: service,
          });
          if (!uploadRes.ok) {
            lastReason = await uploadRes.text();
          }
        } catch (error) {
          return NextResponse.json(
            { error: error instanceof Error ? error.message : "No se pudo crear bucket de Storage" },
            { status: 500 }
          );
        }
      }

      if (!uploadRes.ok) {
        const hint = missingBucket && !service ? ` (configura bucket '${bucket}' en Supabase o define SERVICE_ROLE)` : "";
        return NextResponse.json({ error: `No se pudo subir a Storage: ${lastReason}${hint}` }, { status: 500 });
      }
    }

    const publicUrl = `${url}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
    return NextResponse.json({
      url: publicUrl,
      provider: "supabase-storage",
      bucket,
      path: objectPath,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo subir el archivo" },
      { status: 500 }
    );
  }
}
