import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// PATCH / PUT update a specific persona
export async function PATCH(req, { params }) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Persona ID required" }, { status: 400 });
    }

    const personaItem = await prisma.userPersona.findUnique({
      where: { id },
    });

    if (!personaItem || personaItem.userId !== user.id) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    const { name, persona, avatar, isDefault } = await req.json();

    if (isDefault) {
      // Unset default on other personas
      await prisma.userPersona.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.userPersona.update({
      where: { id },
      data: {
        ...(name && name.trim() ? { name: name.trim() } : {}),
        ...(persona && persona.trim() ? { persona: persona.trim() } : {}),
        ...(avatar !== undefined ? { avatar: avatar ? avatar.trim() : null } : {}),
        ...(isDefault !== undefined ? { isDefault: Boolean(isDefault) } : {}),
      },
    });

    return NextResponse.json({ persona: updated });
  } catch (error) {
    console.error("Update User Persona Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user persona" },
      { status: 500 }
    );
  }
}

// DELETE a specific persona
export async function DELETE(req, { params }) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Persona ID required" }, { status: 400 });
    }

    const personaItem = await prisma.userPersona.findUnique({
      where: { id },
    });

    if (!personaItem || personaItem.userId !== user.id) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    await prisma.userPersona.delete({
      where: { id },
    });

    // If deleted persona was default, set another existing persona as default if available
    if (personaItem.isDefault) {
      const remaining = await prisma.userPersona.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (remaining) {
        await prisma.userPersona.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Persona deleted successfully" });
  } catch (error) {
    console.error("Delete User Persona Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user persona" },
      { status: 500 }
    );
  }
}
