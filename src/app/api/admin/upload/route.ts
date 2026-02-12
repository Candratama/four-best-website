import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/r2/upload";
import { ImageCategory } from "@/lib/r2/utils";

const VALID_CATEGORIES: ImageCategory[] = [
  "slider",
  "partners",
  "properties",
  "team",
  "backgrounds",
  "misc",
  "branding",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;
    const slug = formData.get("slug") as string | null;

    if (!file || !category) {
      return NextResponse.json(
        { error: "File and category are required" },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(category as ImageCategory)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFilename = slug
      ? `${slug}-${file.name}`
      : file.name;

    const result = await uploadImage(buffer, originalFilename, {
      category: category as ImageCategory,
    });

    return NextResponse.json({
      url: result.url,
      key: result.key,
      thumbnailUrl: result.thumbnailUrl,
      thumbnailKey: result.thumbnailKey,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
