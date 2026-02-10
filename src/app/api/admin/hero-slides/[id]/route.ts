import { NextRequest, NextResponse } from "next/server";
import { getHeroSlideById, updateHeroSlide, deleteHeroSlide, HeroSlide } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const heroSlide = await getHeroSlideById(parseInt(id));

    if (!heroSlide) {
      return NextResponse.json(
        { error: "Hero slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(heroSlide);
  } catch (error) {
    console.error("Error fetching hero slide:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slide" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json() as Partial<HeroSlide>;

    const heroSlide = await getHeroSlideById(parseInt(id));
    if (!heroSlide) {
      return NextResponse.json(
        { error: "Hero slide not found" },
        { status: 404 }
      );
    }

    await updateHeroSlide(parseInt(id), body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return NextResponse.json(
      { error: "Failed to update hero slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await deleteHeroSlide(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json(
      { error: "Failed to delete hero slide" },
      { status: 500 }
    );
  }
}
