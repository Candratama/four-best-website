import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSocialLinkById, updateSocialLink, deleteSocialLink } from "@/lib/db";

const updateSocialLinkSchema = z.object({
  platform: z.string().min(1).optional(),
  url: z.string().url("URL tidak valid").optional(),
  icon: z.string().nullable().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
  display_order: z.number().int().optional(),
});

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const socialLink = await getSocialLinkById(parseInt(id));

    if (!socialLink) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(socialLink);
  } catch (error) {
    console.error("Error fetching social link:", error);
    return NextResponse.json(
      { error: "Failed to fetch social link" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateSocialLinkSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const socialLink = await getSocialLinkById(parseInt(id));
    if (!socialLink) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 }
      );
    }

    await updateSocialLink(parseInt(id), result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating social link:", error);
    return NextResponse.json(
      { error: "Failed to update social link" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await deleteSocialLink(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting social link:", error);
    return NextResponse.json(
      { error: "Failed to delete social link" },
      { status: 500 }
    );
  }
}
