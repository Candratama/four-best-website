import { NextRequest, NextResponse } from "next/server";
import { getPageSection, updatePageSectionContent, createPageSection } from "@/lib/db";
import { z } from "zod";

const pageSectionSchema = z.object({
  page_slug: z.string().min(1, "page_slug wajib diisi"),
  section_key: z.string().min(1, "section_key wajib diisi"),
  content: z.string().min(1, "content wajib diisi").refine(
    (val) => {
      try { JSON.parse(val); return true; } catch { return false; }
    },
    { message: "content harus berupa JSON yang valid" }
  ),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = pageSectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const { page_slug, section_key, content } = result.data;

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
