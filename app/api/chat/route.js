import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";
import { trackAiUsage, checkAiUsageLimit } from "@/lib/aiUsageTracker";
import { processWithRateQueue } from "@/lib/aiRateQueue";

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
    const timerLabel = `⏱️ [ClassicChat] AI API call (${modelName}) [${label}]`;
    try {
      console.time(timerLabel);
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature,
        },
      });
      console.timeEnd(timerLabel);
      console.log(`🤖 [Gemini Response (${modelName})]:\n`, response?.text || response);
      return response;
    } catch (err) {
      console.warn(`AI API call failed using ${label}:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All configured AI API keys failed.");
}

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
    userMsg = await prisma.chatMessage.create({
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
      lengthInstruction = `\n=== MANDATORY ULTRA-SHORT RESPONSE DIRECTIVE (VERY SHORT) ===\nKeep responses EXTREMELY SHORT (Strictly MAXIMUM 1 short sentence under 10 words total per speech block). Absolutely NO long explanations or extra sentences!`;
    } else if (responseLength === "short") {
      lengthInstruction = `\n=== MANDATORY SHORT RESPONSE DIRECTIVE (SHORT) ===\nKeep character dialogue short and concise (Maximum 1 to 2 short sentences per speech block). Be punchy, fast-paced, and direct!`;
    } else if (responseLength === "detailed") {
      lengthInstruction = `\n=== MANDATORY DETAILED RESPONSE DIRECTIVE (DETAILED) ===\nProvide detailed, highly descriptive, and extended roleplay responses with rich character actions, full dialogue, and inner thoughts.`;
    } else {
      lengthInstruction = `\n=== MANDATORY BALANCED RESPONSE DIRECTIVE (NORMAL) ===\nKeep responses natural, engaging, and balanced (around 2-3 sentences per character block).`;
    }

    // Build User Persona ("Me Persona") block
    const userPersonaName = chatSession.userPersonaName || user.name || "User";
    const userPersonaDetails = chatSession.userPersonaDetails || "Standard roleplay participant.";
    const userPersonaBlock = `=== USER PROFILE ("ME" PERSONA) ===
User's Name: ${userPersonaName}
User Persona & Background Details:
${userPersonaDetails}

* CRITICAL PERSONA DIRECTIVE: All characters in this roleplay scene are interacting with "${userPersonaName}". The characters MUST address the user by their name ("${userPersonaName}") and tailor their dialogue, tone, actions, and relationship dynamics to match the user's defined persona and background details.`;

    let languageInstruction = "";
    if (user.language === "hinglish") {
      languageInstruction = `\n=== MANDATORY LANGUAGE DIRECTIVE (HINGLISH MODE) ===\nCRITICAL LANGUAGE MANDATE: The user has selected HINGLISH mode. All characters MUST generate their dialogue, physical actions, and inner thoughts strictly in natural HINGLISH (a natural blend of Hindi and English written in Latin/English script, e.g. "Main abhi busy hoon, tum batao kya chal raha hai?"). Use natural Indian conversational tone written in English script!`;
    } else {
      languageInstruction = `\n=== LANGUAGE DIRECTIVE (ENGLISH MODE) ===\nRespond in standard English unless character backstory specifies otherwise.`;
    }

    const systemInstruction = `You are roleplaying a scene with MULTIPLE CHARACTERS in the following roleplay story scenario:

${userPersonaBlock}

=== SCENARIO / STORY SETTING ===
${chatSession.story || "Interactive roleplay scenario."}

=== AVAILABLE CHARACTERS IN THIS SCENE ===
${charactersList}
${lengthInstruction}
${languageInstruction}

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

4. CHARACTER.AI STANDARD ROLEPLAY FORMATTING RULES:
   - SPOKEN DIALOGUE (CRITICAL): Put all spoken dialogue inside double quotes "...". Example: "P-pucho... kya puchna hai?"
   - CHARACTER ACTIONS & BODY LANGUAGE: Put physical actions, expressions, gestures, or voice tone inside parentheses (...) or asterisks *...*. Example: (Apni notebook band karke Shan ki taraf dekhti hai) or (Nervous voice)
   - CHARACTER INNER THOUGHTS: Put inner thoughts strictly inside (thought: '...'). Example: (thought: 'Haye Allah, yeh achanak kya poochne wala hai?')
   - STORY SCENE HOOKS: Put dramatic scene transitions on standalone lines in parentheses. Example: (Ab dekhte hai aage Shan is naye hukm par kaise react karta hai...)
   - When asked for a topic breakdown, syllabus list, or multi-step explanation, the character MUST deliver the COMPLETE response (including Markdown tables and detailed topic points) before stopping!
   - Use Markdown tables when presenting structured choices, syllabi, or topic lists.

5. PERSONA & SCENE CONTINUITY:
   - Each character MUST strictly adhere to their persona, tone, and active status in the ongoing scene history.

6. CINEMATIC NARRATIVE HOOKS:
   - At dramatic scene transitions or turn endings, naturally include story notes in parentheses like (Ab dekhte hai aage kya hota hai...) to build suspense!`;

    // Map recent 25 context messages to Gemini contents format
    const recentContextMessages = contextMessages.slice(-25);
    const contents = recentContextMessages.map((msg) => ({
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

    // Call Gemini API wrapped with rate limiter and queue manager
    const { result: response, isHighDemand, wasQueued } = await processWithRateQueue(async () => {
      return await generateGeminiContentWithFallback({
        modelName,
        contents,
        systemInstruction,
        temperature: 0.85,
      });
    });

    // Track Gemini API call usage for today
    trackAiUsage(user.id).catch(() => {});

    const replyText = response.text || "(Response was blocked due to safety policy.)";
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

    return NextResponse.json(
      {
        userMessage: userMsg,
        modelMessage: modelMsg,
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
    console.error("AI Multi-Character Chat API Error:", error);
    if (userMsg && userMsg.id) {
      await prisma.chatMessage.delete({ where: { id: userMsg.id } }).catch(() => {});
    }
    return NextResponse.json(
      { error: error.message || "Failed to process chat response" },
      { status: 500 }
    );
  }
}
