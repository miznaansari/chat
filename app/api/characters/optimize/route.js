import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import RequireUser from "@/lib/RequireUser";

// Helper to call Gemini API for text optimization with fallback key
async function generateGeminiOptimization({ text, type = "persona" }) {
  const primaryKey = process.env.GEMINI_API_KEY;
  const fallbackKey = process.env.FALLBACK_GEMINI_API_KEY;

  if (!primaryKey && !fallbackKey) {
    throw new Error("Gemini API key is not configured in server environment.");
  }

  const keysToTry = [];
  if (primaryKey) keysToTry.push({ key: primaryKey, label: "primary" });
  if (fallbackKey && fallbackKey !== primaryKey) {
    keysToTry.push({ key: fallbackKey, label: "fallback" });
  }

  let promptInstruction = "";
  if (type === "story") {
    promptInstruction = `You are a professional roleplay story editor. 
Improve the following roleplay scenario/setting background text:
- STRICT LANGUAGE RULE: Maintain the EXACT input language and script! If input is Hinglish (Hindi written in Roman script), keep output strictly in Hinglish. If input is English, keep output in English. DO NOT translate Hinglish into English or Devanagari.
- Fix all spelling, grammar, and punctuation mistakes within that language style.
- Make the setting vivid, engaging, and atmospheric.
- Keep the original core idea intact.
- Return ONLY the final polished text directly without introduction, quotation marks, or meta-comments.`;
  } else {
    promptInstruction = `You are a professional character designer. 
Improve the following character persona and backstory description:
- STRICT LANGUAGE RULE: Maintain the EXACT input language and script! If input is Hinglish (Hindi written in Roman script), keep output strictly in Hinglish. If input is English, keep output in English. DO NOT translate Hinglish into English or Devanagari.
- Fix all spelling, grammar, and phrasing errors within that language style.
- Enhance character personality traits, speech tone, and distinctive behaviors in Hinglish or English as provided.
- Make it vivid and descriptive for roleplaying.
- Keep the original intent intact.
- Return ONLY the final polished persona text directly without introduction, quotation marks, or meta-comments.`;
  }

  let lastError = null;

  for (const { key } of keysToTry) {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: [
          {
            role: "user",
            parts: [{ text: `${promptInstruction}\n\nORIGINAL TEXT:\n${text}` }],
          },
        ],
        config: {
          temperature: 0.7,
        },
      });

      const resultText = response.text ? response.text.trim() : text;
      // Strip outer wrapping quotes if Gemini added any
      return resultText.replace(/^["']|["']$/g, "").trim();
    } catch (err) {
      console.warn("Gemini Optimization failed:", err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to optimize text with Gemini.");
}

export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, type = "persona" } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text content is required for optimization" },
        { status: 400 }
      );
    }

    const optimizedText = await generateGeminiOptimization({
      text: text.trim(),
      type,
    });

    return NextResponse.json({ optimizedText });
  } catch (error) {
    console.error("Optimize Character API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to optimize text" },
      { status: 500 }
    );
  }
}
