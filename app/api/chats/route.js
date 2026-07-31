import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// GET user's chat sessions
export async function GET(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chatSession.findMany({
      where: { userId: user.id },
      include: {
        character: true,
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Get Chats Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}

// POST create new chat session with character details
export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterId, characterName, characterDesc, selectedModel, title } =
      await req.json();

    if (!characterName || !characterDesc) {
      return NextResponse.json(
        { error: "Character name and description are required" },
        { status: 400 }
      );
    }

    // Default model options: gemini-3.5-flash-lite or gemini-3.1-flash-lite
    const validModel =
      selectedModel === "gemini-3.1-flash-lite"
        ? "gemini-3.1-flash-lite"
        : "gemini-3.5-flash-lite";

    const chatTitle =
      title || `Chat with ${characterName}`;

    const chatSession = await prisma.chatSession.create({
      data: {
        userId: user.id,
        characterId: characterId || null,
        characterName,
        characterDesc,
        selectedModel: validModel,
        title: chatTitle,
      },
      include: {
        character: true,
      },
    });

    return NextResponse.json({ chatSession });
  } catch (error) {
    console.error("Create Chat Session Error:", error);
    return NextResponse.json(
      { error: "Failed to create chat session" },
      { status: 500 }
    );
  }
}
