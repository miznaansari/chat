import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// GET user's chat sessions with multi-character details
export async function GET(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chatSession.findMany({
      where: { userId: user.id },
      include: {
        sessionCharacters: true,
        messages: {
          orderBy: { createdAt: "asc" },
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

// POST create new multi-character chat session
export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, story, characters, selectedModel, userPersonaId, userPersonaName, userPersonaDetails } = await req.json();

    if (!characters || !Array.isArray(characters) || characters.length === 0) {
      return NextResponse.json(
        { error: "At least one character with name and persona is required" },
        { status: 400 }
      );
    }

    const validModel =
      selectedModel === "gemini-3.1-flash-lite"
        ? "gemini-3.1-flash-lite"
        : "gemini-3.5-flash-lite";

    const chatTitle =
      title || `Roleplay: ${characters.map((c) => c.name).join(", ")}`;

    // Resolve user persona details
    let finalPersonaId = userPersonaId || null;
    let finalPersonaName = userPersonaName || null;
    let finalPersonaDetails = userPersonaDetails || null;

    if (finalPersonaId && (!finalPersonaName || !finalPersonaDetails)) {
      const p = await prisma.userPersona.findUnique({ where: { id: finalPersonaId } });
      if (p && p.userId === user.id) {
        finalPersonaName = p.name;
        finalPersonaDetails = p.persona;
      }
    }

    if (!finalPersonaId && !finalPersonaName) {
      // Find default user persona
      const defaultP = await prisma.userPersona.findFirst({
        where: { userId: user.id, isDefault: true },
      });
      if (defaultP) {
        finalPersonaId = defaultP.id;
        finalPersonaName = defaultP.name;
        finalPersonaDetails = defaultP.persona;
      } else {
        // Fallback to user account name
        finalPersonaName = user.name;
      }
    }

    const chatSession = await prisma.chatSession.create({
      data: {
        userId: user.id,
        userPersonaId: finalPersonaId,
        userPersonaName: finalPersonaName,
        userPersonaDetails: finalPersonaDetails,
        title: chatTitle,
        story: story || "An interactive roleplay scenario.",
        selectedModel: validModel,
        sessionCharacters: {
          create: characters.map((c) => ({
            name: c.name.trim(),
            persona: c.persona.trim(),
          })),
        },
      },
      include: {
        sessionCharacters: true,
      },
    });

    return NextResponse.json({ chatSession });
  } catch (error) {
    console.error("Create Multi-Character Chat Session Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create chat session" },
      { status: 500 }
    );
  }
}
