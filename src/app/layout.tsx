// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Initialize the font
const inter = Inter({ subsets: ["latin"] });

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