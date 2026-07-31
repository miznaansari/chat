import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

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

    // Retrieve chat session with ownership verification
    const chatSession = await prisma.chatSession.findUnique({
      where: { id: chatSessionId },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    if (chatSession.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in server environment (.env)" },
        { status: 500 }
      );
    }

    // Fetch messages flagged to be INCLUDED in context history (includeInContext === true)
    const contextMessages = await prisma.chatMessage.findMany({
      where: {
        chatSessionId,
        includeInContext: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Save current user message into database first
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

    // System instruction defining character roleplay behavior
    const systemInstruction = `You are roleplaying as ${chatSession.characterName}.\n\nCharacter Persona & Description:\n${chatSession.characterDesc}\n\nMaintain this roleplay character identity strictly in all your responses. Stay in character at all times.`;

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

    // Use exact model string requested: gemini-3.5-flash-lite or gemini-3.1-flash-lite
    const modelName =
      chatSession.selectedModel === "gemini-3.1-flash-lite"
        ? "gemini-3.1-flash-lite"
        : "gemini-3.5-flash-lite";

    const ai = new GoogleGenAI({ apiKey });

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const replyText = response.text || "No response generated.";
    const replyTokenEstimate = Math.ceil(replyText.length / 4);

    // Save AI character response in database
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
    console.error("Gemini Roleplay Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat response" },
      { status: 500 }
    );
  }
}
