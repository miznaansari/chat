import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";
import { executeSingleCharacterTurn } from "@/feature/turnEngine";
import { trackAiUsage } from "@/lib/aiUsageTracker";

export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatSessionId, prompt, responseLength = "normal" } = await req.json();

    if (!chatSessionId) {
      return NextResponse.json(
        { error: "Chat session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve chat session with ownership verification and sessionCharacters
    const chatSession = await prisma.chatSession.findUnique({
      where: { id: chatSessionId },
      include: {
        sessionCharacters: true,
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    if (chatSession.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    let userMsg = null;

    // If user provided a prompt in this call, save user message
    if (prompt && typeof prompt === "string" && prompt.trim().length > 0) {
      const userMessageTokenEstimate = Math.ceil(prompt.trim().length / 4);
      userMsg = await prisma.chatMessage.create({
        data: {
          chatSessionId,
          role: "user",
          content: prompt.trim(),
          includeInContext: true,
          tokenEstimate: userMessageTokenEstimate,
        },
      });
    }

    // Fetch messages flagged to be INCLUDED in context history
    const contextMessages = await prisma.chatMessage.findMany({
      where: {
        chatSessionId,
        includeInContext: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Format full context history into structured transcript for turn engine
    const historyTranscript = contextMessages
      .map((msg) => {
        if (msg.role === "user") {
          return `[me / user]: ${msg.content}`;
        }
        return msg.content; // Already starts with [CharacterName]: dialogue...
      })
      .join("\n\n");

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `=== CONVERSATION HISTORY ===\n${
              historyTranscript || "(Scene starting...)"
            }\n\n=== ACTION REQUIRED ===\nBased on the history above, generate the NEXT SINGLE character turn now.`,
          },
        ],
      },
    ];

    const modelName =
      chatSession.selectedModel === "gemini-3.1-flash-lite"
        ? "gemini-3.1-flash-lite"
        : "gemini-3.5-flash-lite";

    // Call single character turn engine
    const turnResult = await executeSingleCharacterTurn({
      modelName,
      contents,
      story: chatSession.story,
      characters: chatSession.sessionCharacters || [],
      responseLength,
    });

    // Track Gemini API call usage for today
    trackAiUsage(user.id).catch(() => {});

    const replyText = turnResult.formattedContent;
    const replyTokenEstimate = Math.ceil(replyText.length / 4);

    // Save AI single-character response in database
    const modelMsg = await prisma.chatMessage.create({
      data: {
        chatSessionId,
        role: "model",
        content: replyText,
        includeInContext: true,
        tokenEstimate: replyTokenEstimate,
      },
    });

    // Update chatSession updatedAt
    await prisma.chatSession.update({
      where: { id: chatSessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      userMessage: userMsg,
      modelMessage: modelMsg,
      speaker: turnResult.speakingCharacter,
      nextSpeaker: turnResult.nextSpeaker,
      isUserTurn: turnResult.isUserTurn,
    });
  } catch (error) {
    console.error("Gemini Turn-by-Turn Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process character turn" },
      { status: 500 }
    );
  }
}
