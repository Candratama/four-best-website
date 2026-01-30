import { NextRequest, NextResponse } from "next/server";
import { getPartners, createPartner } from "@/lib/db";

export async function GET() {
  try {
    const partners = await getPartners();
    return NextResponse.json(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, slug, short_description, full_profile, logo, hero_image,
            contact_phone, contact_email, is_featured, is_active, display_order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const id = await createPartner({
      name,
      slug,
      short_description: short_description || null,
      full_profile: full_profile || null,
      logo: logo || null,
      hero_image: hero_image || null,
      contact_phone: contact_phone || null,
      contact_email: contact_email || null,
      is_featured: is_featured || 0,
      is_active: is_active ?? 1,
      display_order: display_order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}
