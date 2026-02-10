import { NextRequest, NextResponse } from "next/server";
import { getAboutPage, updateAboutPage, AboutPage } from "@/lib/db";

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
    const body = await request.json() as Partial<AboutPage>;

    await updateAboutPage(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating about page:", error);
    return NextResponse.json(
      { error: "Failed to update about page" },
      { status: 500 }
    );
  }
}
