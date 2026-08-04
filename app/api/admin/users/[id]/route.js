import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

export async function PATCH(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { dailyLimit } = body;

    const newLimit = parseInt(dailyLimit, 10);
    if (isNaN(newLimit) || newLimit < 1) {
      return NextResponse.json(
        { error: "Daily credit limit must be a positive integer" },
        { status: 400 }
      );
    }

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user daily limit
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { dailyLimit: newLimit },
      select: {
        id: true,
        name: true,
        email: true,
        dailyLimit: true,
      },
    });

    return NextResponse.json({
      message: `Successfully updated daily limit for ${updatedUser.name} to ${updatedUser.dailyLimit} credits.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin Update User Limit Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user daily limit" },
      { status: 500 }
    );
  }
}
