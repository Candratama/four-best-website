import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings, SiteSettings } from "@/lib/db";

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
    const body = await request.json() as Partial<SiteSettings>;

    await updateSiteSettings(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
