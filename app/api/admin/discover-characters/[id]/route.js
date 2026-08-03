import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

// PUT update character
export async function PUT(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

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
        ...(body.characters && { characters: body.characters }),
        ...(body.isPublic !== undefined && { isPublic: Boolean(body.isPublic) }),
      },
    });

    return NextResponse.json({ character: updated });
  } catch (error) {
    console.error("Admin Update Character Error:", error);
    return NextResponse.json({ error: "Failed to update character" }, { status: 500 });
  }
}

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
