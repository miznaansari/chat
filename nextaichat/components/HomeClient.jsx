"use client";

import HeroSection from "@/components/landing/HeroSection";
import WhatWeOfferSection from "@/components/landing/WhatWeOfferSection";
import FeaturedCharactersSection from "@/components/landing/FeaturedCharactersSection";
import CharacterGridSection from "@/components/landing/CharacterGridSection";
import InteractiveDemoSection from "@/components/landing/InteractiveDemoSection";
import ToolkitProcessCtaSection from "@/components/landing/ToolkitProcessCtaSection";
import QuoteStatsSection from "@/components/landing/QuoteStatsSection";
import CalloutBannerSection from "@/components/landing/CalloutBannerSection";
import ProductShowcase from "@/components/ProductShowcase";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";

export default function HomeClient({ blogs = [], characters = [], stats = { totalChats: 0, totalCharacters: 0 }, appUrl = "https://app.nextaichat.online" }) {
  const scrollToCharacters = () => {
    const el = document.getElementById("characters");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen text-neutral-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden">

      {/* 1. Creative Dark Purple Hero Section (Replicating Image Header, Title, Splatter Glow & 4 Metrics) */}
      <HeroSection onExploreClick={scrollToCharacters} appUrl={appUrl} characters={characters} stats={stats} />

      {/* 2. "WHAT WE DO" 4-Card Section (Replicating Image "WHAT I DO" 01, 02, 03, 04) */}
      <WhatWeOfferSection characters={characters} stats={stats} appUrl={appUrl} />

      {/* 3. "FEATURED CHARACTERS" 3-Card Grid (Commented out per request) */}
      {/* <FeaturedCharactersSection id="featured" appUrl={appUrl} onExploreClick={scrollToCharacters} characters={characters} stats={stats} /> */}

      {/* 4. Complete 33 Avatar Character Discovery Grid across 4 categories */}
      <CharacterGridSection id="characters" appUrl={appUrl} characters={characters} stats={stats} />

      {/* 5. 3-Column Section: AI Engine Capabilities, How It Works (01-04), & Solid Purple CTA Block */}
      <ToolkitProcessCtaSection appUrl={appUrl} stats={stats} />

      {/* 6. Interactive Sandbox Demo Preview */}
      <InteractiveDemoSection id="demo" appUrl={appUrl} />

      {/* 7. Product Showcase Feature Cards (Commented out per request) */}
      {/* <ProductShowcase appUrl={appUrl} /> */}

      {/* 8. Cinematic Quote & Platform Metrics */}
      <QuoteStatsSection stats={stats} />

      {/* 9. Recent Blog & Knowledge Base Articles */}
      {blogs && blogs.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-purple-500/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs text-purple-400 font-mono font-bold uppercase tracking-wider">Guides & Updates</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 uppercase font-sans">Latest Articles</h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <Link
                key={post.id || post.slug}
                href={`/blog/${post.slug}`}
                className="group p-5 rounded-2xl bg-neutral-900/60 border border-purple-500/15 hover:border-purple-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-300 mb-2">
                    <Tag className="w-3 h-3 text-purple-400" />
                    <span>{post.category || "AI Roleplay"}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                    {post.description || post.summary || post.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-800 mt-4 flex items-center justify-between text-[11px] text-neutral-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {post.readTime || "4 min read"}
                  </span>
                  <span className="text-purple-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 10. Bottom Callout Banner with Avatar Stack */}
      <CalloutBannerSection appUrl={appUrl} stats={stats} characters={characters} />

    </div>
  );
}
