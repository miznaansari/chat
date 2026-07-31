import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// GET user's saved characters
export async function GET(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const characters = await prisma.chatCharacter.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Get Characters Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    );
  }
}

// POST create a new character preset
export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, avatar } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Character name and description are required" },
        { status: 400 }
      );
    }

    const character = await prisma.chatCharacter.create({
      data: {
        userId: user.id,
        name,
        description,
        avatar: avatar || null,
      },
    });

    return NextResponse.json({ character });
  } catch (error) {
    console.error("Create Character Error:", error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 }
    );
  }
}
