import { fetchCorporateNews, fetchFullArticleContent } from '@/src/lib/fetchNews';
import Link from 'next/link';

// Next.js allows us to read both the ID and the searchParams (category)
export default async function ArticlePage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ category?: string }> }) {
  const { id } = await params;
  const { category } = await searchParams;

  // 1. Fetch the feed for this specific category (which we KNOW works and has no paywall!)
  const articles = await fetchCorporateNews(category || 'Latest', 'en');

  // 2. Find our specific article in the allowed feed array
  const article = articles.find((a: any) => a.id === id);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8">This article may have been removed or placed behind a paywall.</p>
        <Link href="/" className="bg-violet-600 text-white px-6 py-3 rounded-full hover:bg-violet-700 transition">
          Return to Feed
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto py-8 md:py-12 space-y-8">
      {/* Back Button */}
      <Link href="/" className="text-violet-600 font-medium hover:text-obsidian transition flex items-center gap-2 mb-8 w-fit">
        <span>←</span> Back to Executive Brief
      </Link>

      {/* Article Header */}
      <header className="space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full">
          {article.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight text-obsidian">
          {article.title}
        </h1>
        <p className="text-gray-500 font-medium pb-6 border-b border-gray-200">{article.time}</p>
      </header>

      {/* Massive Hero Image */}
      <div className="w-full h-64 md:h-112.5 relative rounded-2xl overflow-hidden shadow-lg bg-gray-100">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* The Full Content */}
      <div 
        className="prose prose-lg prose-violet max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.fullContent }} 
      />
    </article>
  );
}
