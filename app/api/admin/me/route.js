import { NextResponse } from "next/server";
import RequireAdmin from "@/lib/RequireAdmin";

export async function GET(req) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
