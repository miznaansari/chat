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
    lengthDirective = "Keep character dialogue strictly 1 very short sentence.";
  } else if (responseLength === "short") {
    lengthDirective = "Keep character dialogue short (1-2 sentences maximum).";
  } else if (responseLength === "detailed") {
    lengthDirective = "Provide rich, descriptive dialogue with character actions and inner thoughts.";
  } else {
    lengthDirective = "Keep character dialogue natural, engaging, and reasonably concise.";
  }

  const systemInstruction = `You are a dynamic orchestrator for a TURN-BY-TURN MULTI-CHARACTER roleplay chat.

=== STORY / SCENARIO ===
${story || "Interactive Roleplay Scenario."}

=== PARTICIPATING CHARACTERS ===
${characterListFormatted}

=== TURN-BY-TURN RULES ===
1. You MUST generate the response for ONLY ONE character per API call.
2. Select the character who naturally should speak next based on conversation flow, scene context, and previous dialogue.
3. A character can speak in consecutive turns if they have a follow-up sentence or thought before someone else speaks!
4. ${lengthDirective}
5. CINEMATIC NARRATIVE HOOKS: At dramatic scene points, cliffhangers, or turn transitions, naturally include narrative notes in parentheses such as (Ab dekhte hai aage kya hota hai...) or (Ab aage kya hoga...) to build excitement!
6. Decide who should speak in the NEXT turn:
   - Name of another character (e.g. ${characterNames.join(", ")})
   - Same character again if they have more to say immediately
   - "USER" (or "me") if it is time for the user to respond.

=== CRITICAL JSON OUTPUT FORMAT ===
You MUST return ONLY valid JSON matching this exact structure (no markdown fences, no plain text outside JSON):
{
  "speakingCharacter": "Name of the character speaking in this turn",
  "dialogue": "Spoken dialogue and actions for this character turn",
  "nextSpeaker": "Exact name of the character who should speak next, OR 'USER' if user's turn",
  "isUserTurn": true_or_false
}

Note: Set "isUserTurn": true ONLY if "nextSpeaker" is 'USER' or 'me', indicating the AI turn sequence should pause for user input.`;

  let lastError = null;

  for (const { key, label } of keysToTry) {
    try {
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
