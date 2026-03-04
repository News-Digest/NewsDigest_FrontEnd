export default function ArticleCard({ article }: { article: any }) {
  // console.log("Rendering ArticleCard with article:", article);
  return (
    <div className="group cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="w-full h-64 md:h-80 relative overflow-hidden bg-gray-100 border-b border-gray-100">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
        <div className="absolute top-4 left-4">
          <span className="text-xs font-bold uppercase tracking-wider text-white bg-violet-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-4">
          <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            AI Score: {article.score}
          </span>
          <span>•</span>
          <span>{article.time}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-5 group-hover:text-violet-600 transition-colors leading-snug">
          {article.title}
        </h2>
        
        <div className="bg-gray-50/70 rounded-xl p-5 border-l-4 border-violet-500">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium flex items-start gap-3">
            <span className="text-violet-500 text-xl leading-none mt-0.5">✨</span>
            {article.aiSummary}
          </p>
        </div>
      </div>
    </div>
  );
}