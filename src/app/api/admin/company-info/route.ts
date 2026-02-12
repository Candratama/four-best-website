import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCompanyInfo, updateCompanyInfo } from "@/lib/db";

const companyInfoSchema = z.object({
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  opening_hours: z.string().optional(),
  map_url: z.string().optional(),
});

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
    const body = await request.json();
    const result = companyInfoSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    await updateCompanyInfo(result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating company info:", error);
    return NextResponse.json(
      { error: "Failed to update company info" },
      { status: 500 }
    );
  }
}
