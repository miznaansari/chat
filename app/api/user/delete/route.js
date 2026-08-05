import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

export async function DELETE(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Permanently delete user and all associated chat sessions, messages, personas & usage logs via Prisma cascade
    await prisma.user.delete({
      where: { id: user.id },
    });

    const response = NextResponse.json({
      message: "Your account, chat sessions, message history, personas, and data have been permanently deleted.",
    });

    // Clear auth_token HTTP-only cookie to log user out
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Delete User Account Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}
