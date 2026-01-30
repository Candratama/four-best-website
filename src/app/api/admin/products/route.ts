import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partner_id, name, slug, category, location, description,
            main_image, is_active, display_order } = body;

    if (!partner_id || !name || !slug || !category) {
      return NextResponse.json(
        { error: "Partner, name, slug, and category are required" },
        { status: 400 }
      );
    }

    const id = await createProduct({
      partner_id,
      name,
      slug,
      category,
      location: location || null,
      description: description || null,
      main_image: main_image || null,
      is_active: is_active ?? 1,
      display_order: display_order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
