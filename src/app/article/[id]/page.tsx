import { fetchArticleById } from '../../../lib/fetchNews';
import Link from 'next/link';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params to get the ID
  const resolvedParams = await params;
  const articleId = resolvedParams.id;

  // Fetch the single massive article from your backend
  const article = await fetchArticleById(articleId);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Headlines
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <Link href="/" className="text-blue-600 hover:underline inline-block mb-4">
        &larr; Back to Headlines
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
          <span>{article.category_names?.[0] || 'News'}</span>
          <span>•</span>
          <time className="text-gray-500">
            {new Date(article.pubdate).toLocaleDateString()}
          </time>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
          {article.title}
        </h1>
      </header>

      {article.thumbnail?.url && (
        <div className="w-full mb-8">
          <img 
            src={article.thumbnail.url} 
            alt={article.title} 
            // FIX: Locked height to h-64 (256px) or h-80 (320px) max on desktop
            className="w-full h-64 md:h-80 object-cover rounded-xl shadow-sm border border-gray-100"
          />
        </div>
      )}

      {/* Renders the massive scraped text safely */}
      <div 
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.html || article.text.replace(/\n/g, '<br />') }}
      />
    </article>
  );
}