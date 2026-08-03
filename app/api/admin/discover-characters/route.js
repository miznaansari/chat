import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

// GET all characters (Admin View)
export async function GET(req) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const characters = await prisma.discoverCharacter.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Admin Get Characters Error:", error);
    return NextResponse.json({ error: "Failed to fetch characters" }, { status: 500 });
  }
}

// POST create new character (Admin View)
export async function POST(req) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      tagline,
      badge,
      badgeBg,
      avatar,
      category,
      filterGroup,
      chatsCount,
      rating,
      story,
      characters,
      isPublic,
    } = body;

    if (!name || !tagline || !story) {
      return NextResponse.json(
        { error: "Name, tagline, and story description are required" },
        { status: 400 }
      );
    }

    const formattedCharacters = Array.isArray(characters) && characters.length > 0
      ? characters
      : [{ name: name, persona: tagline }];

    const newChar = await prisma.discoverCharacter.create({
      data: {
        name: name.trim(),
        tagline: tagline.trim(),
        badge: badge || "NEW",
        badgeBg: badgeBg || "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
        avatar: avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
        category: category || "Exam & Tutors",
        filterGroup: filterGroup || "assistants",
        chatsCount: parseInt(chatsCount) || 0,
        rating: rating || "4.9",
        story: story.trim(),
        characters: formattedCharacters,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      },
    });

    return NextResponse.json({ character: newChar });
  } catch (error) {
    console.error("Admin Create Character Error:", error);
    return NextResponse.json({ error: "Failed to create character" }, { status: 500 });
  }
}
