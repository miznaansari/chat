import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

// PUT & PATCH update character
async function updateCharacter(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    let formattedCharacters = undefined;
    if (body.characters !== undefined) {
      if (typeof body.characters === "string") {
        formattedCharacters = body.characters;
      } else {
        formattedCharacters = JSON.stringify(body.characters);
      }
    }

    const updated = await prisma.discoverCharacter.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.tagline && { tagline: body.tagline.trim() }),
        ...(body.badge !== undefined && { badge: body.badge }),
        ...(body.badgeBg !== undefined && { badgeBg: body.badgeBg }),
        ...(body.avatar && { avatar: body.avatar }),
        ...(body.category && { category: body.category }),
        ...(body.filterGroup && { filterGroup: body.filterGroup }),
        ...(body.chatsCount !== undefined && { chatsCount: parseInt(body.chatsCount) }),
        ...(body.rating && { rating: body.rating }),
        ...(body.story && { story: body.story.trim() }),
        ...(formattedCharacters !== undefined && { characters: formattedCharacters }),
        ...(body.isPublic !== undefined && { isPublic: Boolean(body.isPublic) }),
      },
    });

    let returnChars = updated.characters;
    if (typeof returnChars === "string") {
      try {
        returnChars = JSON.parse(returnChars);
      } catch (e) {
        returnChars = [];
      }
    }

    return NextResponse.json({
      character: {
        ...updated,
        characters: returnChars,
      },
    });
  } catch (error) {
    console.error("Admin Update Character Error:", error);
    return NextResponse.json({ error: "Failed to update character" }, { status: 500 });
  }
}

export { updateCharacter as PUT, updateCharacter as PATCH };

// DELETE character
export async function DELETE(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.discoverCharacter.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Character deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Character Error:", error);
    return NextResponse.json({ error: "Failed to delete character" }, { status: 500 });
  }
}
