import { NextRequest, NextResponse } from "next/server";
import { getPageSectionById, updatePageSection, deletePageSection, PageSection } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const pageSection = await getPageSectionById(parseInt(id));

    if (!pageSection) {
      return NextResponse.json(
        { error: "Page section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pageSection);
  } catch (error) {
    console.error("Error fetching page section:", error);
    return NextResponse.json(
      { error: "Failed to fetch page section" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json() as Partial<PageSection>;

    const pageSection = await getPageSectionById(parseInt(id));
    if (!pageSection) {
      return NextResponse.json(
        { error: "Page section not found" },
        { status: 404 }
      );
    }

    await updatePageSection(parseInt(id), body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating page section:", error);
    return NextResponse.json(
      { error: "Failed to update page section" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await deletePageSection(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page section:", error);
    return NextResponse.json(
      { error: "Failed to delete page section" },
      { status: 500 }
    );
  }
}
