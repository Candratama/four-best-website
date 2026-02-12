import { NextRequest, NextResponse } from "next/server";
import { getMissionById, updateMission, deleteMission } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mission = await getMissionById(Number(id));
    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }
    return NextResponse.json(mission);
  } catch (error) {
    console.error("Error fetching mission:", error);
    return NextResponse.json(
      { error: "Failed to fetch mission" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;
    await updateMission(Number(id), body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating mission:", error);
    return NextResponse.json(
      { error: "Failed to update mission" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMission(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting mission:", error);
    return NextResponse.json(
      { error: "Failed to delete mission" },
      { status: 500 }
    );
  }
}
