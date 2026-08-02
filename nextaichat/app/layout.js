import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextaichat.com";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "NextAiChat - #1 AI Roleplay Platform for Study & Entertainment",
    template: "%s | NextAiChat",
  },
  description:
    "NextAiChat is the premier AI Roleplay platform designed for study, educational exam prep, interactive language practice, and multi-character entertainment stories with dynamic speaker turns.",
  keywords: [
    "NextAiChat",
    "AI Roleplay",
    "Character AI Alternative",
    "AI Study Tutors",
    "Educational Roleplay AI",
    "Multi Character AI Chat",
    "Dynamic Turn Engine AI",
    "Roleplay Chat Platform",
  ],
  authors: [{ name: "NextAiChat Team", url: baseUrl }],
  creator: "NextAiChat Inc.",
  publisher: "NextAiChat Inc.",
  applicationName: "NextAiChat",
  category: "Technology / Artificial Intelligence",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "NextAiChat",
    title: "NextAiChat - #1 AI Roleplay Platform for Study & Entertainment",
    description:
      "Engage with AI personas for interactive studying, educational simulations, language practice, storytelling, and multi-character entertainment.",
    images: [
      {
        url: "/logo-landspace.png",
        width: 1200,
        height: 630,
        alt: "NextAiChat AI Roleplay Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextAiChat - #1 AI Roleplay Platform for Study & Entertainment",
    description:
      "Interactive AI Roleplay for study simulations, tutor conversations, and multi-character storytelling.",
    images: ["/logo-landspace.png"],
    creator: "@nextaichat",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const schemaWebSite = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NextAiChat",
    url: baseUrl,
    description:
      "The #1 AI Roleplay Platform for study, educational simulations, entertainment, and dynamic multi-character conversations.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "NextAiChat Inc.",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
  };

  return (
    <html lang="en" className="min-h-full antialiased dark">
      <head>
        <JsonLd data={schemaWebSite} />
        <meta name="ai-content-declaration" content="authorized" />
        <meta name="chatgpt-plugin" content="enabled" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Context Summary" />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 selection:bg-purple-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
