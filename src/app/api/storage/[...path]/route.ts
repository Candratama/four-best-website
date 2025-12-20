import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "@/lib/cloudflare";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const key = path.join("/");

  try {
    const storage = await getStorage();
    const object = await storage.get(key);

    if (!object) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new NextResponse(object.body, { headers });
  } catch (error) {
    console.error("Error fetching from R2:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}
