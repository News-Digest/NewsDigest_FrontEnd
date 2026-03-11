import Link from 'next/link';

export default function ArticleCard({ article }: { article: any }) {
  return (
    <Link 
      href={`/article/${article.id}?category=${encodeURIComponent(article.category)}`} 
      className="group cursor-pointer bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-row h-auto md:h-48 items-stretch"
    >
      <div className="w-1/3 max-w-60 shrink-0 relative overflow-hidden bg-gray-100 border-r border-gray-200">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>

      <div className="p-4 md:p-6 flex flex-col flex-1 justify-center">
        
        <h2 className="text-lg md:text-xl font-serif font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-violet-600 transition-colors">
          {article.title}
        </h2>
        
        <p className="text-sm md:text-base text-gray-600 line-clamp-3">
          <span className="text-violet-500 font-bold mr-2">✨ AI Summary:</span>
          {article.aiSummary}
        </p>
        
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 font-medium">
          <span className="bg-violet-50 text-violet-600 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
            {article.category}
          </span>
          <span>•</span>
          <span>{article.time}</span>
        </div>

      </div>
    </Link>
  );
}