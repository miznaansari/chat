import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import RequireUser from "@/lib/RequireUser";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Old password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Fetch user password hash from DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, password: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify old password
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, dbUser.password);
    if (!isOldPasswordCorrect) {
      return NextResponse.json(
        { error: "Incorrect old password. Please verify and try again." },
        { status: 400 }
      );
    }

    // Hash new password & save to DB
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Failed to change password. Please try again." },
      { status: 500 }
    );
  }
}
