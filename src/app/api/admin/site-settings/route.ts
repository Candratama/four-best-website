import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";

const siteSettingsSchema = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Format warna tidak valid").optional(),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Format warna tidak valid").optional(),
});

export async function GET() {
  try {
    const siteSettings = await getSiteSettings();
    return NextResponse.json(siteSettings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = siteSettingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    await updateSiteSettings(result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
