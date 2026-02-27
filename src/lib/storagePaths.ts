import path from "node:path";

export function getWritableDataRoot() {
  if (process.env.DATA_DIR && process.env.DATA_DIR.trim()) {
    return process.env.DATA_DIR.trim();
  }

  if (process.env.VERCEL) {
    return "/tmp/tho-data";
  }

  return path.join(process.cwd(), "data");
}

export function getWritableDataPath(...parts: string[]) {
  return path.join(getWritableDataRoot(), ...parts);
}
