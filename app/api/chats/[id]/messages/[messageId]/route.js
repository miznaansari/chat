import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

// PATCH update message context inclusion status
export async function PATCH(req, { params }) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, messageId } = await params;
    const { includeInContext } = await req.json();

    // Verify chat ownership
    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!chatSession || chatSession.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const updatedMessage = await prisma.chatMessage.update({
      where: {
        id: messageId,
        chatSessionId: id,
      },
      data: {
        includeInContext: Boolean(includeInContext),
      },
    });

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.error("Toggle Context Inclusion Error:", error);
    return NextResponse.json(
      { error: "Failed to update message context flag" },
      { status: 500 }
    );
  }
}

// DELETE message from database
export async function DELETE(req, { params }) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, messageId } = await params;

    // Verify chat ownership
    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!chatSession || chatSession.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    await prisma.chatMessage.delete({
      where: {
        id: messageId,
        chatSessionId: id,
      },
    });

    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    console.error("Delete Message Error:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
