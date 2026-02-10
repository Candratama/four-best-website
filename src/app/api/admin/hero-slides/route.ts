import { NextRequest, NextResponse } from "next/server";
import { getHeroSlides, createHeroSlide } from "@/lib/db";

export async function GET() {
  try {
    const heroSlides = await getHeroSlides();
    return NextResponse.json(heroSlides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      page_slug?: string;
      image?: string;
      title?: string;
      subtitle?: string;
      overlay_opacity?: number;
      is_active?: number;
      display_order?: number;
    };

    const { page_slug, image, title, subtitle, overlay_opacity, is_active, display_order } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const id = await createHeroSlide({
      page_slug: page_slug || "home",
      image,
      title: title || null,
      subtitle: subtitle || null,
      overlay_opacity: overlay_opacity || 50,
      is_active: is_active ?? 1,
      display_order: display_order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json(
      { error: "Failed to create hero slide" },
      { status: 500 }
    );
  }
}
