import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// GET user's saved reusable phrases
export async function GET(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snippets = await prisma.reusablePhrase.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ snippets });
  } catch (error) {
    console.error("Get Snippets Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}

// POST create a new reusable phrase
export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Snippet text is required" },
        { status: 400 }
      );
    }

    const snippet = await prisma.reusablePhrase.create({
      data: {
        userId: user.id,
        text: text.trim(),
      },
    });

    return NextResponse.json({ snippet });
  } catch (error) {
    console.error("Create Snippet Error:", error);
    return NextResponse.json(
      { error: "Failed to save snippet" },
      { status: 500 }
    );
  }
}
