import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await params;
  if (path.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const safe = path.filter((segment) => !segment.includes("..") && !segment.includes("/"));
  if (safe.length !== path.length) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const file = join(process.cwd(), ".data", "uploads", ...safe);
  try {
    const buffer = await readFile(file);
    const ext = path[path.length - 1].split(".").pop()?.toLowerCase() ?? "";
    const contentType =
      {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",
        svg: "image/svg+xml",
        avif: "image/avif",
        pdf: "application/pdf",
        mp4: "video/mp4",
      }[ext] ?? "application/octet-stream";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}