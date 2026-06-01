// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Initialize the font
const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "News Digest — Curated daily news & analysis",
    template: "%s | News Digest",
  },
  description:
    "A curated daily digest of the stories that matter across technology, health, business, science and more.",
  keywords: ["news", "digest", "daily news", "curated news", "newsletter"],
  openGraph: {
    type: "website",
    siteName: "News Digest",
    title: "News Digest — Curated daily news & analysis",
    description:
      "A curated daily digest of the stories that matter across technology, health, business, science and more.",
    url: siteUrl,
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "News Digest",
    description: "A curated daily digest of the stories that matter.",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 2. Add the font class to the body tag */}
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}