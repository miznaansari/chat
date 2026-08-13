import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";
import { executeSingleCharacterTurn } from "@/feature/turnEngine";
import { trackAiUsage, checkAiUsageLimit } from "@/lib/aiUsageTracker";
import { processWithRateQueue } from "@/lib/aiRateQueue";

export async function POST(req) {
  let userMsg = null;
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user's daily AI usage limit
    const limitCheck = await checkAiUsageLimit(user.id, user.dailyLimit);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: `Daily credit limit reached (${limitCheck.count}/${limitCheck.limit} credits today). Limit resets tomorrow, or contact admin to increase your limit.` },
        { status: 429 }
      );
    }

    const { chatSessionId, prompt, responseLength = "normal", userLanguage, language: clientLang } = await req.json();

    if (!chatSessionId) {
      return NextResponse.json(
        { error: "Chat session ID is required" },
        { status: 400 }
      );
    }

    // Determine active requested language: payload > user profile > default "en"
    const reqLanguage = String(userLanguage || clientLang || user?.language || "en").toLowerCase();
    const isHinglish = reqLanguage === "hinglish";

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

    // Sanitize character personas in English mode
    const sanitizedCharacters = (chatSession.sessionCharacters || []).map((char) => {
      if (isHinglish) return char;
      let personaText = char.persona || "";
      personaText = personaText
        .replace(/speaks\s+([a-z\s]*)\s*hinglish:?/gi, "speaks in welcoming English:")
        .replace(/speaks in spicy hinglish:?/gi, "speaks in vibrant English:")
        .replace(/speaks in hinglish:?/gi, "speaks in fluent English:")
        .replace(/speaks in energetic hinglish:?/gi, "speaks in energetic English:")
        .replace(/speaks in soft hinglish:?/gi, "speaks in gentle English:")
        .replace(/speaks inviting hinglish:?/gi, "speaks in inviting English:")
        .replace(/arey\s+beta\s+andar\s+aao[^\.']*/gi, "Hey dear, come inside! Uncle is away for 3 days on a business trip. I made hot tea, didn't want to drink it alone!")
        .replace(/garam\s+chai/gi, "hot tea")
        .replace(/andar\s+aao/gi, "come inside")
        .replace(/arey\s+beta/gi, "Hey dear")
        .replace(/arey/gi, "Hey")
        .replace(/beta/gi, "dear")
        .replace(/chai/gi, "tea");
      return { ...char, persona: personaText };
    });

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

    // Fetch messages flagged to be INCLUDED in context history (slided window of last 25 messages)
    const contextMessages = await prisma.chatMessage.findMany({
      where: {
        chatSessionId,
        includeInContext: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const recentContextMessages = contextMessages.slice(-25);

    // Format context history into structured transcript for turn engine
    const historyTranscript = recentContextMessages
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

    // Call single character turn engine wrapped with rate limiter and queue manager
    const { result: turnResult, isHighDemand, wasQueued } = await processWithRateQueue(async () => {
      return await executeSingleCharacterTurn({
        modelName,
        contents,
        story: chatSession.story,
        characters: sanitizedCharacters,
        userPersonaName: chatSession.userPersonaName || user.name || "User",
        userPersonaDetails: chatSession.userPersonaDetails || "Standard roleplay participant.",
        responseLength,
        language: reqLanguage,
      });
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

    return NextResponse.json(
      {
        userMessage: userMsg,
        modelMessage: modelMsg,
        speaker: turnResult.speakingCharacter,
        nextSpeaker: turnResult.nextSpeaker,
        isUserTurn: turnResult.isUserTurn,
        isHighDemand,
        wasQueued,
      },
      {
        headers: {
          "X-High-Demand": isHighDemand ? "true" : "false",
          "X-Queued": wasQueued ? "true" : "false",
        },
      }
    );
  } catch (error) {
    console.error("Gemini Turn-by-Turn Chat API Error:", error);
    if (userMsg && userMsg.id) {
      await prisma.chatMessage.delete({ where: { id: userMsg.id } }).catch(() => {});
    }
    return NextResponse.json(
      { error: error.message || "Failed to process character turn" },
      { status: 500 }
    );
  }
}
