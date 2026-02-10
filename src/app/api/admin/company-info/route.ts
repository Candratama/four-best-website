import { NextRequest, NextResponse } from "next/server";
import { getCompanyInfo, updateCompanyInfo, CompanyInfo } from "@/lib/db";

export async function GET() {
  try {
    const companyInfo = await getCompanyInfo();
    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error("Error fetching company info:", error);
    return NextResponse.json(
      { error: "Failed to fetch company info" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Partial<CompanyInfo>;

    await updateCompanyInfo(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating company info:", error);
    return NextResponse.json(
      { error: "Failed to update company info" },
      { status: 500 }
    );
  }
}
