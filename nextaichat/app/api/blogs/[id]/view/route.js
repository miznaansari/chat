import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const { id } = await params;

    const blog = await prisma.blogPost.update({
      where: {
        id,
      },
      data: {
        views: { increment: 1 },
      },
      select: { id: true, views: true },
    });

    return NextResponse.json({ views: blog.views });
  } catch (error) {
    console.error("Error incrementing blog views:", error);
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
