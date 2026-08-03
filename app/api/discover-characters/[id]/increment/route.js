import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Character ID is required" }, { status: 400 });
    }

    // Try finding by ID first, or fallback to matching by name
    const existing = await prisma.discoverCharacter.findFirst({
      where: {
        OR: [{ id: id }, { name: id }],
      },
    });

    if (existing) {
      const updated = await prisma.discoverCharacter.update({
        where: { id: existing.id },
        data: {
          chatsCount: { increment: 1 },
        },
      });

      return NextResponse.json({
        success: true,
        chatsCount: updated.chatsCount,
      });
    }

    return NextResponse.json({ success: true, chatsCount: 1 });
  } catch (error) {
    console.error("Increment chatsCount Error:", error);
    return NextResponse.json({ error: "Failed to increment counter" }, { status: 500 });
  }
}
