import { NextResponse } from "next/server";
import RequireUser from "@/lib/RequireUser";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { language } = await req.json();

    if (!language || !["en", "hinglish"].includes(language)) {
      return NextResponse.json(
        { error: "Invalid language selection. Must be 'en' or 'hinglish'." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        language,
        hasChosenLanguage: true,
      },
      select: {
        id: true,
        name: true,
        language: true,
        hasChosenLanguage: true,
      },
    });

    return NextResponse.json({
      message: "Language preference updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user language:", error);
    return NextResponse.json(
      { error: "Failed to update language preference" },
      { status: 500 }
    );
  }
}
