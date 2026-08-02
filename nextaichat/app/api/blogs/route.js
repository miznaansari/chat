import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("publishedOnly") === "true";
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where = {};
    if (publishedOnly) {
      where.published = true;
    }
    if (category && category !== "All") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const blogs = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, category, author, published } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required." },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newBlog = await prisma.blogPost.create({
      data: {
        title,
        slug: generatedSlug,
        excerpt,
        content,
        coverImage: coverImage || null,
        category: category || "General",
        author: author || "NextAiChat Team",
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json({ blog: newBlog, message: "Blog created successfully" });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
