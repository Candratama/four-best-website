import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSocialLinks, createSocialLink } from "@/lib/db";

const createSocialLinkSchema = z.object({
  platform: z.string().min(1, "Platform wajib diisi"),
  url: z.string().url("URL tidak valid"),
  icon: z.string().nullable().optional(),
  is_active: z.number().int().min(0).max(1).optional().default(1),
  display_order: z.number().int().optional().default(0),
});

export async function GET() {
  try {
    const socialLinks = await getSocialLinks();
    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createSocialLinkSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const { platform, url, icon, is_active, display_order } = result.data;

    const id = await createSocialLink({
      platform,
      url,
      icon: icon || null,
      is_active: is_active ?? 1,
      display_order: display_order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error creating social link:", error);
    return NextResponse.json(
      { error: "Failed to create social link" },
      { status: 500 }
    );
  }
}
