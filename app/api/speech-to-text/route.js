import { NextResponse } from "next/server";
import RequireUser from "@/lib/RequireUser";

export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SARVAM_API_KEY is not configured in server environment (.env)" },
        { status: 500 }
      );
    }

    const incomingFormData = await req.formData();
    const file = incomingFormData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided in request" },
        { status: 400 }
      );
    }

    // Build FormData to send to Sarvam AI STT endpoint
    const sarvamFormData = new FormData();

    // Ensure clean MIME type without parameter attributes like ;codecs=opus
    let contentType = file.type || "audio/webm";
    if (contentType.includes(";")) {
      contentType = contentType.split(";")[0].trim();
    }

    let filename = file.name && file.name !== "blob" ? file.name : "recording.webm";
    if (!filename.includes(".")) {
      const ext = contentType.includes("mp4") ? "mp4" : contentType.includes("ogg") ? "ogg" : contentType.includes("wav") ? "wav" : "webm";
      filename = `${filename}.${ext}`;
    }

    // Convert ArrayBuffer to Node Buffer for valid binary audio serialization
    const fileArrayBuffer = await file.arrayBuffer();
    const audioBuffer = Buffer.from(fileArrayBuffer);

    console.log(`🎙️ [Sarvam STT] Audio file: ${filename}, size: ${audioBuffer.length} bytes, type: ${contentType}`);

    if (audioBuffer.length < 500) {
      return NextResponse.json(
        { error: "Audio recording is too short or empty. Please speak for at least 1-2 seconds." },
        { status: 400 }
      );
    }

    const cleanFile = new File([audioBuffer], filename, { type: contentType });
    sarvamFormData.append("file", cleanFile, filename);

    // Model: saaras:v3 (recommended by Sarvam API) or saaras:v4
    const model = incomingFormData.get("model") || "saaras:v3";
    sarvamFormData.append("model", model);

    // Mode: transcribe, translate, verbatim, translit, codemix
    const mode = incomingFormData.get("mode") || "transcribe";
    sarvamFormData.append("mode", mode);

    // Language: English (en-IN)
    const languageCode = incomingFormData.get("language_code") || "en-IN";
    sarvamFormData.append("language_code", languageCode);

    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
      },
      body: sarvamFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Sarvam STT API error:", data);
      const errorMessage =
        data.detail ||
        (typeof data.error === "string" ? data.error : data.error?.message) ||
        "Failed to transcribe audio with Sarvam AI";

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Speech-to-text handler error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during speech-to-text processing" },
      { status: 500 }
    );
  }
}
