import { NextRequest, NextResponse } from "next/server";
import { getSocialLinkById, updateSocialLink, deleteSocialLink, SocialLink } from "@/lib/db";

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
    const body = await request.json() as Partial<SocialLink>;

    const socialLink = await getSocialLinkById(parseInt(id));
    if (!socialLink) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 }
      );
    }

    await updateSocialLink(parseInt(id), body);
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
