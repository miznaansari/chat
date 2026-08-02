import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Eye, User, Sparkles, Share2, BookOpen } from "lucide-react";

export const revalidate = 0;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextaichat.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await prisma.blogPost.findUnique({ where: { slug } });
  if (!blog) return { title: "Blog Not Found - NextAiChat" };

  return {
    title: `${blog.title} - NextAiChat Blog`,
    description: blog.excerpt,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `${baseUrl}/blog/${blog.slug}`,
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
    },
  };
}

export default async function SingleBlogPostPage({ params }) {
  const { slug } = await params;

  let blog = null;
  try {
    // Increment view count in DB for real-time analytics
    blog = await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (e) {
    blog = await prisma.blogPost.findUnique({ where: { slug } });
  }

  if (!blog || !blog.published) {
    notFound();
  }

  // BlogPosting Schema.org JSON-LD for Google Search Article Indexing
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "NextAiChat",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${blog.slug}`,
    },
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden selection:bg-purple-500 selection:text-white py-10 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto space-y-8 w-full">
      {/* Inject Article JSON-LD Structured Data */}
      <JsonLd data={articleSchema} />

      {/* Background Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-40" />

      {/* Back Link */}
      <div className="relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-xs font-semibold">
            {blog.category}
          </span>
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{blog.views} views</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-neutral-400 pt-2 border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
            <User className="w-4 h-4 text-purple-400" />
            <span>{blog.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="relative z-10 p-6 sm:p-10 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-6 text-neutral-200 text-sm leading-relaxed prose prose-invert max-w-none">
        <p className="text-base text-neutral-300 font-medium italic border-l-4 border-purple-500 pl-4 py-1 bg-purple-950/20 rounded-r-xl">
          {blog.excerpt}
        </p>

        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </article>

      {/* CTA Box */}
      <div className="relative z-10 p-6 rounded-3xl bg-neutral-900/80 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">
            Experience NextAiChat AI Roleplays
          </h3>
          <p className="text-xs text-neutral-400">
            Try dynamic multi-character roleplay for study or entertainment.
          </p>
        </div>
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
        >
          Launch NextAiChat
        </a>
      </div>
    </div>
  );
}
