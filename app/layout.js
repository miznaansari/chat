import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import PwaRegister from "@/components/PwaRegister";
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "NextAiChat - AI Roleplay for Study & Entertainment",
  description: "Interactive AI Roleplay Platform based on role play for study, educational learning, entertainment, and fun interactive conversations.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NextAiChat",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="min-h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 selection:bg-blue-500 selection:text-white">
        <NextTopLoader
          color="#a855f7"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 12px #a855f7,0 0 6px #6366f1"
          zIndex={16000}
        />
        <PwaRegister />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
