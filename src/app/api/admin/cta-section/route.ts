import { NextRequest, NextResponse } from "next/server";
import { getCTASection, updateCTASection } from "@/lib/db";
import { z } from "zod";

const ctaSectionSchema = z.object({
  subtitle: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  primary_button_text: z.string().optional(),
  primary_button_href: z.string().optional(),
  secondary_button_text: z.string().optional(),
  secondary_button_href: z.string().optional(),
  background_image: z.string().optional(),
});

export async function GET() {
  try {
    const ctaSection = await getCTASection();
    return NextResponse.json(ctaSection);
  } catch (error) {
    console.error("Error fetching CTA section:", error);
    return NextResponse.json(
      { error: "Failed to fetch CTA section" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = ctaSectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    await updateCTASection(result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating CTA section:", error);
    return NextResponse.json(
      { error: "Failed to update CTA section" },
      { status: 500 }
    );
  }
}
