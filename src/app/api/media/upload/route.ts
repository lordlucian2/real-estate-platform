import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { uid } from "@/lib/utils";
import { addMedia } from "@/lib/cms";
import { getCurrentUser } from "@/lib/cms";
import type { MediaItem } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const rawFolder = (form.get("folder") as string) || "generic";
  const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60) || "generic";
  const files = form.getAll("file").filter((f): f is File => f instanceof File);

  const items: MediaItem[] = [];
  const dir = join(process.cwd(), ".data", "uploads", folder);
  await mkdir(dir, { recursive: true });

  for (const file of files) {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const name = `${Date.now()}-${safe}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, name), buffer);
    const kind: MediaItem["kind"] = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("text/") || file.type.includes("pdf")
        ? "document"
        : "other";
    items.push({
      id: uid("media"),
      name,
      url: `/api/media/${folder}/${encodeURIComponent(name)}`,
      kind,
      folder,
      size: buffer.byteLength,
      uploadedAt: new Date().toISOString(),
    });
  }

  if (items.length > 0) await addMedia(items);
  return NextResponse.json({ ok: true, items });
}