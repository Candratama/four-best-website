import { NextRequest, NextResponse } from "next/server";
import { getMissions, createMission } from "@/lib/db";

export async function GET() {
  try {
    const missions = await getMissions();
    return NextResponse.json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    return NextResponse.json(
      { error: "Failed to fetch missions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      text?: string;
      icon?: string;
      is_active?: number;
      display_order?: number;
    };

    const missions = await getMissions();
    const id = await createMission({
      icon: body.icon || null,
      text: body.text || "",
      is_active: body.is_active ?? 1,
      display_order: body.display_order ?? missions.length,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Error creating mission:", error);
    return NextResponse.json(
      { error: "Failed to create mission" },
      { status: 500 }
    );
  }
}
