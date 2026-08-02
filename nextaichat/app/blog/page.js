import Link from "next/link";
import prisma from "@/lib/prisma";
import { BookOpen, Eye, Search, ArrowRight, Sparkles, Clock, Calendar } from "lucide-react";

export const revalidate = 0; // Dynamic DB fetch

export const metadata = {
  title: "NextAiChat Blog - Articles & Guides on AI Roleplay for Study & Fun",
  description: "Read official NextAiChat blog posts, guides, and tutorials on AI roleplay for study, exam prep, creative writing, and entertainment.",
};

export default async function BlogListingPage({ searchParams }) {
  const query = await searchParams;
  const categoryFilter = query?.category || "All";
  const searchQuery = query?.search || "";

  let blogs = [];
  try {
    const where = { published: true };
    if (categoryFilter !== "All") {
      where.category = categoryFilter;
    }
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery } },
        { excerpt: { contains: searchQuery } },
      ];
    }

    blogs = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Blog page fetch error:", err);
  }

  const categories = ["All", "Study & Education", "Entertainment", "Guides", "Platform Updates"];

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden selection:bg-purple-500 selection:text-white py-12 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-8 w-full">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-40" />

      {/* Header */}
      <div className="text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Official NextAiChat Blog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Articles, Guides & <span className="text-purple-400">Tutorials</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Learn how to get the most out of AI roleplay for study simulations, language practice, creative storytelling, and entertainment.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <Link
                key={cat}
                href={`/blog${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Search Bar */}
        <form action="/blog" method="GET" className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search articles..."
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
          />
        </form>
      </div>

      {/* Blog Cards Grid */}
      <div className="relative z-10">
        {blogs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
            <p className="text-sm text-neutral-400">
              No published articles found in this category.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950 border border-purple-700 text-purple-200 text-xs font-semibold hover:bg-purple-900 transition-colors"
            >
              <span>Add Blog Post via Admin</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-purple-500/50 transition-all flex flex-col justify-between backdrop-blur-md shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-semibold">
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{blog.views} views</span>
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h2>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500 mt-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span className="font-semibold text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Post <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
