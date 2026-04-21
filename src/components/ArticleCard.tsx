import Link from 'next/link';

export default function ArticleCard({ article }: { article: any }) {
  const imageUrl = article.thumbnail?.url || article.thumbnail?.default?.url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";

  return (
    <Link href={`/article/${article.uuid}`} className="group block h-full">
      <article className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        
        {/* FIX: Hardcoded exact height (h-48) guarantees it can never blow up! */}
        <div className="w-full h-48 bg-gray-100 relative overflow-hidden shrink-0 border-b border-gray-100">
          <img 
            src={imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600 mb-3 uppercase tracking-wider">
            <span>{article.category_names?.[0] || 'News'}</span>
            <span className="text-gray-300">•</span>
            <time className="text-gray-500">{new Date(article.pubdate).toLocaleDateString()}</time>
          </div>
          
          <h2 className="text-lg md:text-xl font-bold font-serif mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h2>
          
          <p className="text-gray-600 text-sm line-clamp-3 mt-auto leading-relaxed">
            {article.text?.substring(0, 150)}...
          </p>
        </div>
      </article>
    </Link>
  );
}