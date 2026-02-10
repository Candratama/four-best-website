import { NextRequest, NextResponse } from "next/server";
import { getCTASection, updateCTASection, CTASection } from "@/lib/db";

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
    const body = await request.json() as Partial<CTASection>;

    await updateCTASection(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating CTA section:", error);
    return NextResponse.json(
      { error: "Failed to update CTA section" },
      { status: 500 }
    );
  }
}
