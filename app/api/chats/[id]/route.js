import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// GET chat session by ID
export async function GET(req, { params }) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        character: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    // Security check: ensure chat session belongs to active user
    if (chatSession.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    return NextResponse.json({ chatSession });
  } catch (error) {
    console.error("Get Chat Session Detail Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat session" },
      { status: 500 }
    );
  }
}

// DELETE chat session & cascade delete messages
export async function DELETE(req, { params }) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingChat = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!existingChat) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    // Security check: ensure chat session belongs to active user
    if (existingChat.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // Deleting chat session automatically deletes associated ChatMessage records due to Prisma onDelete: Cascade
    await prisma.chatSession.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Chat session and messages deleted successfully" });
  } catch (error) {
    console.error("Delete Chat Session Error:", error);
    return NextResponse.json(
      { error: "Failed to delete chat session" },
      { status: 500 }
    );
  }
}

// PATCH update chat session parameters (character name, description, model)
export async function PATCH(req, { params }) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existingChat = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!existingChat || existingChat.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const updatedSession = await prisma.chatSession.update({
      where: { id },
      data: {
        characterName: body.characterName ?? existingChat.characterName,
        characterDesc: body.characterDesc ?? existingChat.characterDesc,
        selectedModel: body.selectedModel ?? existingChat.selectedModel,
        title: body.title ?? existingChat.title,
      },
    });

    return NextResponse.json({ chatSession: updatedSession });
  } catch (error) {
    console.error("Update Chat Session Error:", error);
    return NextResponse.json(
      { error: "Failed to update chat session" },
      { status: 500 }
    );
  }
}
