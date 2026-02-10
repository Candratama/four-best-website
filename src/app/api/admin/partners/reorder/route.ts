import { NextRequest, NextResponse } from "next/server";
import { swapPartnerOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      id1?: number;
      id2?: number;
    };

    const { id1, id2 } = body;

    if (!id1 || !id2) {
      return NextResponse.json(
        { error: "Both id1 and id2 are required" },
        { status: 400 }
      );
    }

    await swapPartnerOrder(id1, id2);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering partners:", error);
    return NextResponse.json(
      { error: "Failed to reorder partners" },
      { status: 500 }
    );
  }
}
