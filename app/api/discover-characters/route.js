import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const characters = await prisma.discoverCharacter.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Public Get Discover Characters Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch showcase characters" },
      { status: 500 }
    );
  }
}
