import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// GET all user personas
export async function GET(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const personas = await prisma.userPersona.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ personas });
  } catch (error) {
    console.error("Get User Personas Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user personas" },
      { status: 500 }
    );
  }
}

// POST create new user persona
export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, persona, avatar, isDefault } = await req.json();

    if (!name || !name.trim() || !persona || !persona.trim()) {
      return NextResponse.json(
        { error: "Persona Name and Persona Description are required." },
        { status: 400 }
      );
    }

    // Check how many personas user already has
    const existingCount = await prisma.userPersona.count({
      where: { userId: user.id },
    });

    // If this is the first persona, automatically make it default
    const makeDefault = existingCount === 0 ? true : Boolean(isDefault);

    if (makeDefault) {
      // Unset default on existing personas
      await prisma.userPersona.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newPersona = await prisma.userPersona.create({
      data: {
        userId: user.id,
        name: name.trim(),
        persona: persona.trim(),
        avatar: avatar ? avatar.trim() : null,
        isDefault: makeDefault,
      },
    });

    return NextResponse.json({ persona: newPersona }, { status: 201 });
  } catch (error) {
    console.error("Create User Persona Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user persona" },
      { status: 500 }
    );
  }
}
