import { getPartners } from "@/lib/db";

export async function GET() {
  try {
    const partners = await getPartners({ activeOnly: true });
    return Response.json({
      success: true,
      count: partners.length,
      partners: partners.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
      })),
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
