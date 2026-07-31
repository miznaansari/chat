import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// Helper to call Gemini API with automatic fallback to FALLBACK_GEMINI_API_KEY if primary key fails
async function generateGeminiContentWithFallback({ modelName, contents, systemInstruction, temperature = 0.85 }) {
  const primaryKey = process.env.GEMINI_API_KEY;
  const fallbackKey = process.env.FALLBACK_GEMINI_API_KEY;

  if (!primaryKey && !fallbackKey) {
    throw new Error("Neither GEMINI_API_KEY nor FALLBACK_GEMINI_API_KEY is configured in server environment (.env)");
  }

  const keysToTry = [];
  if (primaryKey) keysToTry.push({ key: primaryKey, label: "primary (GEMINI_API_KEY)" });
  if (fallbackKey && fallbackKey !== primaryKey) {
    keysToTry.push({ key: fallbackKey, label: "fallback (FALLBACK_GEMINI_API_KEY)" });
  }

  let lastError = null;

  for (const { key, label } of keysToTry) {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature,
        },
      });
      return response;
    } catch (err) {
      console.warn(`Gemini API call failed using ${label}:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All configured Gemini API keys failed.");
}

export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatSessionId, prompt } = await req.json();

    if (!chatSessionId || !prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Chat session ID and prompt are required" },
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

    // Fetch messages flagged to be INCLUDED in context history (includeInContext === true)
    const contextMessages = await prisma.chatMessage.findMany({
      where: {
        chatSessionId,
        includeInContext: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Save current user message into database
    const userMessageTokenEstimate = Math.ceil(prompt.length / 4);
    const userMsg = await prisma.chatMessage.create({
      data: {
        chatSessionId,
        role: "user",
        content: prompt,
        includeInContext: true,
        tokenEstimate: userMessageTokenEstimate,
      },
    });

    // Build multi-character system instruction for Gemini API
    const charactersList =
      chatSession.sessionCharacters && chatSession.sessionCharacters.length > 0
        ? chatSession.sessionCharacters
          .map(
            (char, idx) =>
              `${idx + 1}. [${char.name}]\nPersona & Backstory: ${char.persona}`
          )
          .join("\n\n")
        : "No character profiles defined.";

    const systemInstruction = `You are roleplaying a scene with MULTIPLE CHARACTERS in the following roleplay story scenario:

=== SCENARIO / STORY SETTING ===
${chatSession.story || "Interactive roleplay scenario."}

=== ACTIVE CHARACTERS IN THIS SCENE ===
${charactersList}

=== MANDATORY FORMATTING & THOUGHT STYLE RULES ===
1. Respond as the characters in the scene in reaction to the user's input in a SINGLE API response.
2. Format each character's speech clearly with their character tag:
   [Character Name]: Spoken dialogue or actions

3. RICH MARKDOWN STYLING:
   - Use **bold** (**action** or **emphasis**) for key character actions/gestures.
   - Use *italics* (*tone*) for vocal tone or whisperings.
   - Use <u>underline</u> (<u>text</u>) or Markdown for secret/important clues.
   - Use Markdown Tables (| Col1 | Col2 |) and Numbered Point Sequences (1., 2., 3.) when presenting choices or structured lists.

4. INNER THOUGHTS FORMATTING:
   - Enclose character inner thoughts strictly in single quotes 'character thought' or *(thought: '...')*.
   - Example: [Sherlock]: "I see the clue." 'Does Watson realize what this implies?' *smiles subtly*

5. Each character MUST speak strictly in accordance with their distinct persona and speaking style.`;

    // Map context messages to Gemini contents format
    const contents = contextMessages.map((msg) => ({
      role: msg.role === "model" || msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const modelName =
      chatSession.selectedModel === "gemini-3.1-flash-lite"
        ? "gemini-3.1-flash-lite"
        : "gemini-3.5-flash-lite";

    // Call Gemini API with automatic API key fallback mechanism
    const response = await generateGeminiContentWithFallback({
      modelName,
      contents,
      systemInstruction,
      temperature: 0.85,
    });

    const replyText = response.text || "No response generated.";
    const replyTokenEstimate = Math.ceil(replyText.length / 4);

    // Save AI multi-character response in database
    const modelMsg = await prisma.chatMessage.create({
      data: {
        chatSessionId,
        role: "model",
        content: replyText,
        includeInContext: true,
        tokenEstimate: replyTokenEstimate,
      },
    });

    // Touch chatSession updatedAt
    await prisma.chatSession.update({
      where: { id: chatSessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      userMessage: userMsg,
      modelMessage: modelMsg,
    });
  } catch (error) {
    console.error("Gemini Multi-Character Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat response" },
      { status: 500 }
    );
  }
}
