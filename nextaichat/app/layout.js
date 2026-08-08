import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { LanguageProvider } from "@/context/LanguageContext";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextaichat.online";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "NextAiChat - AI Roleplay Platform for Study & Entertainment",
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
    title: "NextAiChat - AI Roleplay Platform for Study & Entertainment",
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
    title: "NextAiChat - AI Roleplay Platform for Study & Entertainment",
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
      <body className="min-h-full flex flex-col bg-[#030712] text-neutral-100 selection:bg-purple-500 selection:text-white relative overflow-x-clip w-full max-w-full font-sans">
        <LanguageProvider>
          {/* ANTIGRAVITY ALWAYS-ON BACKGROUND MOTION (ORBS, ORBITS, PARTICLES & GRID) */}
          <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />
          <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-900/30 via-cyan-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />

          {/* Floating Physics Particles */}
          <div className="fixed top-1/4 left-10 w-24 h-24 rounded-full border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm animate-float-slow pointer-events-none hidden md:block z-0" />
          <div className="fixed bottom-1/4 right-12 w-32 h-32 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm animate-float-reverse pointer-events-none hidden md:block z-0" />

          {/* Orbit Rings Centered */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-neutral-800/40 animate-orbit pointer-events-none hidden lg:block z-0">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7]" />
          </div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-purple-900/30 animate-orbit-reverse pointer-events-none hidden lg:block z-0">
            <div className="absolute bottom-0 right-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
          </div>
          <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-40 z-0" />

          {/* Navbar Header (Admin Dashboard link commented out) */}
          <Navbar />
          <main className="flex-1 flex flex-col relative z-10 w-full max-w-full overflow-x-clip  ">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
