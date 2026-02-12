import { NextRequest, NextResponse } from "next/server";
import { updateMission } from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as { ids: number[] };

    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json(
        { error: "ids array is required" },
        { status: 400 }
      );
    }

    await Promise.all(
      body.ids.map((id, index) =>
        updateMission(id, { display_order: index })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering missions:", error);
    return NextResponse.json(
      { error: "Failed to reorder missions" },
      { status: 500 }
    );
  }
}
