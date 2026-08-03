import { GoogleGenAI } from "@google/genai";

/**
 * Executes a single turn in a turn-by-turn multi-character roleplay session using Gemini.
 * Gemini determines which character speaks in this turn, generates their dialogue,
 * and decides who should speak in the next turn (another character, same character, or user 'me').
 */
export async function executeSingleCharacterTurn({
  modelName = "gemini-3.5-flash-lite",
  contents = [],
  story = "",
  characters = [],
  responseLength = "normal",
}) {
  const primaryKey = process.env.GEMINI_API_KEY;
  const fallbackKey = process.env.FALLBACK_GEMINI_API_KEY;

  if (!primaryKey && !fallbackKey) {
    throw new Error(
      "Neither GEMINI_API_KEY nor FALLBACK_GEMINI_API_KEY is configured in environment (.env)"
    );
  }

  const keysToTry = [];
  if (primaryKey) keysToTry.push({ key: primaryKey, label: "primary (GEMINI_API_KEY)" });
  if (fallbackKey && fallbackKey !== primaryKey) {
    keysToTry.push({ key: fallbackKey, label: "fallback (FALLBACK_GEMINI_API_KEY)" });
  }

  const characterNames = characters.map((c) => c.name);
  const characterListFormatted =
    characters.length > 0
      ? characters
        .map(
          (c, idx) =>
            `${idx + 1}. [${c.name}]\nPersona: ${c.persona}`
        )
        .join("\n\n")
      : "No characters specified.";

  let lengthDirective = "";
  if (responseLength === "veryshort") {
    lengthDirective = "=== STRICT RESPONSE LENGTH DIRECTIVE (VERY SHORT) ===\nCRITICAL MANDATE: Output STRICTLY MAXIMUM 1 SHORT SENTENCE (under 10 words total) for this turn! Absolutely NO long explanations or extra sentences!";
  } else if (responseLength === "short") {
    lengthDirective = "=== STRICT RESPONSE LENGTH DIRECTIVE (SHORT) ===\nCRITICAL MANDATE: Output STRICTLY 1 to 2 short sentences for this turn. Keep it punchy, fast, and concise!";
  } else if (responseLength === "detailed") {
    lengthDirective = "=== STRICT RESPONSE LENGTH DIRECTIVE (DETAILED) ===\nCRITICAL MANDATE: Provide an extended, rich, highly detailed response with deep scene descriptions, character actions, inner monologues, and full dialogue!";
  } else {
    lengthDirective = "=== RESPONSE LENGTH DIRECTIVE (NORMAL) ===\nKeep character dialogue natural, engaging, and balanced (around 2-3 sentences).";
  }

  const systemInstruction = `You are a dynamic orchestrator for a TURN-BY-TURN MULTI-CHARACTER roleplay chat.

${lengthDirective}

=== STORY / SCENARIO ===
${story || "Interactive Roleplay Scenario."}

=== PARTICIPATING CHARACTERS ===
${characterListFormatted}

=== CHARACTER.AI STANDARD ROLEPLAY FORMATTING RULES ===
1. You MUST generate the response for ONLY ONE character per API call.
2. Select the character who naturally should speak next based on conversation flow, scene context, and previous dialogue.
3. SPOKEN DIALOGUE (CRITICAL): Put all spoken dialogue inside double quotes "...". Example: "P-pucho... kya puchna hai?" Never put spoken dialogue in single quotes or inside thoughts!
4. CHARACTER ACTIONS & BODY LANGUAGE: Put physical actions, expressions, gestures, or voice tone inside parentheses (...) or asterisks *...*. Example: (Apni notebook band karke Shan ki taraf dekhti hai) or (Nervous voice)
5. CHARACTER INNER THOUGHTS: Put inner thoughts strictly inside (thought: '...'). Example: (thought: 'Haye Allah, yeh achanak kya poochne wala hai?')
6. STORY SCENE HOOKS: Put dramatic scene transitions on standalone lines in parentheses. Example: (Ab dekhte hai aage Shan is naye hukm par kaise react karta hai...)
7. RESPECT THE RESPONSE LENGTH DIRECTIVE AT THE TOP OF THIS INSTRUCTION STRICTLY.
8. MULTI-PART & COMPLETE EXPLANATIONS (CRITICAL):
   - When answering a user's question, syllabus request, or topic explanation (e.g. HLD topics, exam prep, rules), the character MUST NOT stop mid-way!
   - If the answer requires multiple turns, tables, or follow-up details (e.g. syllabus points), set "nextSpeaker" to the SAME character name (e.g. "${characterNames[0] || "Prof. Ananya"}") and "isUserTurn": false so the character continues speaking in consecutive turns to complete their full explanation BEFORE handing back to the user!
9. Decide who should speak in the NEXT turn:
   - Name of another character (e.g. ${characterNames.join(", ")})
   - Same character again if their response/explanation is incomplete or has follow-up details!
   - "USER" (or "me") ONLY when the character has COMPLETELY finished their thought, question, or full explanation.

=== CRITICAL JSON OUTPUT FORMAT ===
You MUST return ONLY valid JSON matching this exact structure (no markdown fences, no plain text outside JSON):
{
  "speakingCharacter": "Name of the character speaking in this turn",
  "dialogue": "Spoken dialogue, physical actions, inner voice, or tables for this character turn",
  "nextSpeaker": "Exact name of the character who should speak next (same character if explanation is incomplete), OR 'USER' if turn is finished",
  "isUserTurn": true_or_false
}

Note: Set "isUserTurn": true ONLY if the character's explanation or dialogue is 100% complete and it is time for the user to reply.`;

  let lastError = null;

  for (const { key, label } of keysToTry) {
    const timerLabel = `⏱️ [TurnEngine] Gemini API call (${modelName}) [${label}]`;
    try {
      console.time(timerLabel);
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.85,
          responseMimeType: "application/json",
        },
      });
      console.timeEnd(timerLabel);

      const responseText = response.text ? response.text.trim() : "";

      // Parse JSON output
      let parsed = null;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        // Fallback cleanup if response contains markdown backticks
        const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
      }

      const speakingCharacter = parsed.speakingCharacter || characterNames[0] || "Character";
      const dialogue = parsed.dialogue || responseText;
      let rawNextSpeaker = String(parsed.nextSpeaker || "USER").trim();
      let isUserTurn = Boolean(parsed.isUserTurn);

      // Match nextSpeaker against active characters list (case-insensitive)
      const matchedChar = characters.find(
        (c) => c.name.toLowerCase() === rawNextSpeaker.toLowerCase()
      );

      let nextSpeaker = "me";
      if (matchedChar) {
        nextSpeaker = matchedChar.name;
        isUserTurn = false;
      } else if (
        rawNextSpeaker.toUpperCase() === "USER" ||
        rawNextSpeaker.toLowerCase() === "me" ||
        rawNextSpeaker.toLowerCase().includes("user")
      ) {
        nextSpeaker = "me";
        isUserTurn = true;
      } else {
        // Fallback: If unknown string returned, check if any character name is substring
        const partialChar = characters.find((c) =>
          rawNextSpeaker.toLowerCase().includes(c.name.toLowerCase())
        );
        if (partialChar) {
          nextSpeaker = partialChar.name;
          isUserTurn = false;
        } else {
          nextSpeaker = "me";
          isUserTurn = true;
        }
      }

      return {
        speakingCharacter,
        dialogue,
        nextSpeaker,
        isUserTurn,
        formattedContent: `[${speakingCharacter}]: ${dialogue}`,
      };
    } catch (err) {
      console.warn(`Turn engine attempt failed using ${label}:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini API keys failed in turn engine.");
}
