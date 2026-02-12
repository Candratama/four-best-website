import { NextRequest, NextResponse } from "next/server";
import { getAboutPage, updateAboutPage } from "@/lib/db";
import { z } from "zod";

const aboutPageSchema = z.object({
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  hero_background_image: z.string().optional(),
  intro_subtitle: z.string().optional(),
  intro_title: z.string().optional(),
  intro_description: z.string().optional(),
  intro_image_left: z.string().optional(),
  intro_image_right: z.string().optional(),
  vision_subtitle: z.string().optional(),
  vision_title: z.string().optional(),
  vision_text: z.string().optional(),
  mission_subtitle: z.string().optional(),
  mission_title: z.string().optional(),
});

export async function GET() {
  try {
    const aboutPage = await getAboutPage();
    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error("Error fetching about page:", error);
    return NextResponse.json(
      { error: "Failed to fetch about page" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = aboutPageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    await updateAboutPage(result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating about page:", error);
    return NextResponse.json(
      { error: "Failed to update about page" },
      { status: 500 }
    );
  }
}
