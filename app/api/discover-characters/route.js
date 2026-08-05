import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const characters = await prisma.discoverCharacter.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "asc" },
    });

    const parsedCharacters = characters.map((c) => {
      let chars = c.characters;
      if (typeof chars === "string") {
        try {
          chars = JSON.parse(chars);
        } catch (e) {
          chars = [];
        }
      }
      return {
        ...c,
        characters: chars,
      };
    });

    return NextResponse.json({ characters: parsedCharacters });
  } catch (error) {
    console.error("Public Get Discover Characters Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch showcase characters" },
      { status: 500 }
    );
  }
}
