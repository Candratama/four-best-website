import { NextRequest, NextResponse } from "next/server";
import { getPageSection, updatePageSectionContent, createPageSection } from "@/lib/db";

interface UpdateRequest {
  page_slug: string;
  section_key: string;
  content: string;
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as UpdateRequest;
    const { page_slug, section_key, content } = body;

    if (!page_slug || !section_key || !content) {
      return NextResponse.json(
        { error: "Missing required fields: page_slug, section_key, content" },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await getPageSection(page_slug, section_key);

    if (existingSection) {
      // Update existing section
      await updatePageSectionContent(page_slug, section_key, content);
    } else {
      // Create new section
      await createPageSection({
        page_slug,
        section_key,
        content,
        is_active: 1,
        display_order: 0,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating page section:", error);
    return NextResponse.json(
      { error: "Failed to update page section" },
      { status: 500 }
    );
  }
}
