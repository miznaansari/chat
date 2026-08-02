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

    const { chatSessionId, prompt, responseLength = "normal" } = await req.json();

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

    let lengthInstruction = "";
    if (responseLength === "veryshort") {
      lengthInstruction = `\n=== MANDATORY ULTRA-SHORT RESPONSE DIRECTIVE ===\nKeep responses EXTREMELY SHORT (Strictly MAXIMUM 1 single short sentence per speech block). Be lightning-fast, direct, and ultra-concise.`;
    } else if (responseLength === "short") {
      lengthInstruction = `\n=== MANDATORY SHORT RESPONSE DIRECTIVE ===\nKeep character dialogue short and concise (Maximum 1 to 2 short sentences per speech block). Be punchy and fast-paced.`;
    } else if (responseLength === "detailed") {
      lengthInstruction = `\n=== MANDATORY DETAILED RESPONSE DIRECTIVE ===\nProvide detailed, highly descriptive, and immersive roleplay responses with rich character actions, extended dialogue, and inner thoughts.`;
    }

    const systemInstruction = `You are roleplaying a scene with MULTIPLE CHARACTERS in the following roleplay story scenario:

=== SCENARIO / STORY SETTING ===
${chatSession.story || "Interactive roleplay scenario."}

=== AVAILABLE CHARACTERS IN THIS SCENE ===
${charactersList}
${lengthInstruction}

=== MANDATORY DYNAMIC ROLEPLAY & CHARACTER PARTICIPATION RULES ===
1. DYNAMIC SITUATION-BASED RESPONSE (CRITICAL):
   - Do NOT force every character to reply in every turn!
   - Characters should ONLY speak or act if they are present, awake, active, and relevant to the current situation.
   - If a character has gone to sleep, left the room, is unconscious, or has no reason to speak, that character MUST REMAIN SILENT.
   - If a character is sleeping or away, you may optionally include a short scene narrative note (e.g., *(Character Name is sleeping in the other room)*), or omit them entirely.

2. MULTIPLE MESSAGES / CONSECUTIVE BLOCKS PER CHARACTER:
   - A single character is NOT restricted to only 1 message block per turn.
   - A character can send 2, 3, or more consecutive message blocks if their thought or sentence naturally spans across multiple parts!
   - Example format for a character sending consecutive messages:
     [Character 1]: Mujhe na bahar jana hai... 🚶‍♂️

     [Character 1]: Kyunki outdoor me bohot sara kaam baki hai! 🏢

     [Character 2]: Okay, dhyan se jana! 👍

3. FORMATTING & TAGGING RULES:
   - EVERY character speech block MUST start on a new line with their exact tag:
     [Character Name]: Spoken dialogue or actions
   - Always put a double line break (blank line) between consecutive character tags or speech blocks.

4. RICH EXPRESSIVE STYLING:
   - Include situation-appropriate Emojis naturally when relevant to the scene.
   - Use **bold** for actions or emphasis.
   - Use *italics* for vocal tone or whisperings.
   - Use *thought: "character thought"* for character inner thoughts.
   - Use Markdown tables when presenting choices or options.

5. PERSONA & SCENE CONTINUITY:
   - Each character MUST strictly adhere to their persona, tone, and active status in the ongoing scene history.

6. CINEMATIC NARRATIVE HOOKS:
   - At dramatic scene transitions or turn endings, naturally include story notes in parentheses like (Ab dekhte hai aage kya hota hai...) or (Ab aage kya hoga...) to build suspense!`;

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
