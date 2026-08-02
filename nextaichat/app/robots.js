export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextaichat.com";

  const aiUserAgents = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
    "CCBot",
    "Bytespider",
    "FacebookBot",
    "Diffbot",
  ];

  const rules = [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    ...aiUserAgents.map((bot) => ({
      userAgent: bot,
      allow: "/",
      disallow: ["/admin/", "/api/"],
    })),
  ];

  return {
    rules,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
