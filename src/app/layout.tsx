import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'News Digest | AI Digest',
  description: 'AI-Powered Daily News Digest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-paper text-obsidian antialiased`}>
        {/* Sleek Glassmorphism Navigation */}
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="shrink-0 flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-600 rounded-full animate-pulse"></div>
                <span className="font-serif font-bold text-xl tracking-tight">News Digest</span>
              </div>
              
              <div>
                <button className="bg-obsidian text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}