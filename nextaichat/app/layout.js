import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "NextAiChat - AI Roleplay for Study & Entertainment",
  description: "The #1 AI Roleplay Platform based on role play for study, educational learning, entertainment, and fun interactive multi-character conversations.",
  keywords: ["AI Roleplay", "NextAiChat", "Character AI Alternative", "Study AI", "Roleplay Chat"],
};

export const viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="min-h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 selection:bg-purple-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
