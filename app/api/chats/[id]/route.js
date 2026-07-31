import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// GET chat session with characters & messages
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
        sessionCharacters: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

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

// DELETE chat session & cascade delete characters & messages
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

    if (!existingChat || existingChat.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // Cascade delete session, characters, and messages
    await prisma.chatSession.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Chat session deleted successfully" });
  } catch (error) {
    console.error("Delete Chat Session Error:", error);
    return NextResponse.json(
      { error: "Failed to delete chat session" },
      { status: 500 }
    );
  }
}

// PATCH update chat session story or characters
export async function PATCH(req, { params }) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, story, selectedModel, characters } = await req.json();

    const existingChat = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!existingChat || existingChat.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // If characters provided, replace characters
    if (characters && Array.isArray(characters)) {
      await prisma.sessionCharacter.deleteMany({
        where: { chatSessionId: id },
      });
      await prisma.sessionCharacter.createMany({
        data: characters.map((c) => ({
          chatSessionId: id,
          name: c.name.trim(),
          persona: c.persona.trim(),
        })),
      });
    }

    const updatedSession = await prisma.chatSession.update({
      where: { id },
      data: {
        title: title ?? existingChat.title,
        story: story ?? existingChat.story,
        selectedModel: selectedModel ?? existingChat.selectedModel,
      },
      include: {
        sessionCharacters: true,
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
