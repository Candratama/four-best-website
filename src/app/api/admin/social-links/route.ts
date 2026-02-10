import { NextRequest, NextResponse } from "next/server";
import { getSocialLinks, createSocialLink } from "@/lib/db";

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
    const body = await request.json() as {
      platform?: string;
      url?: string;
      icon?: string;
      is_active?: number;
      display_order?: number;
    };

    const { platform, url, icon, is_active, display_order } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: "Platform and URL are required" },
        { status: 400 }
      );
    }

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
