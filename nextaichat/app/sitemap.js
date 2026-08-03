import prisma from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextaichat.online";
  // Strip trailing slashes to prevent double slash sitemap errors (e.g. https://domain.com//compare)
  const baseUrl = rawBaseUrl.replace(/\/$/, "");
  const now = new Date();

  // Static site routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Fetch dynamic published blog posts safely from Database
  let blogRoutes = [];
  try {
    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    blogRoutes = blogs
      .filter((blog) => blog && blog.slug)
      .map((blog) => {
        const blogDate = blog.updatedAt ? new Date(blog.updatedAt) : now;
        const validDate = isNaN(blogDate.getTime()) ? now : blogDate;
        return {
          url: `${baseUrl}/blog/${encodeURIComponent(blog.slug)}`,
          lastModified: validDate,
          changeFrequency: "weekly",
          priority: 0.7,
        };
      });
  } catch (error) {
    console.error("Error generating blog sitemap entries:", error);
  }

  return [...staticRoutes, ...blogRoutes];
}
