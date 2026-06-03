import { Link } from "react-router-dom"; // Swap for 'next/link' if using Next.js
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import { formatDate, cn } from "@/src/lib/utils";
import { UnifiedArticle } from "./article";

interface ArticleCardProps {
  article: UnifiedArticle;
  variant?: "small" | "medium" | "large" | "horizontal";
  className?: string;
}

export function ArticleCard({ article, variant = "medium", className }: ArticleCardProps) {
  // --- 1. DATA NORMALIZATION ---
  const id = article.id || article.uuid;
  const title = article.title;
  const description = article.description || article.text?.substring(0, 150);
  const date = String(article.published_at || article.pubdate || new Date().toISOString());
  const category = article.category || article.category_names?.[0] || "News";
  const author = article.author || "Staff";
  
  const imageUrl = 
    article.image_url || 
    article.thumbnail?.url || 
    article.thumbnail?.default?.url || 
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";

  // --- 2. LAYOUT VARIANTS ---

  // FULL WIDTH / HERO STYLE
  if (variant === "large") {
    return (
      <Link 
        to={`/article/${id}`} 
        className={cn("group block relative overflow-hidden rounded-3xl bg-gray-900 aspect-[21/9] md:aspect-[3/1]", className)}
      >
        <img
          src={imageUrl}
          alt={title}
          // Added scale-125 for a permanent zoom to crop out baked-in image text.
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 scale-125 group-hover:scale-[1.30]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-4xl">
          <Badge className="mb-4 bg-violet-600 text-white border-none">{category}</Badge>
          <h2 className="text-lg md:text-3xl font-black text-white mb-3 leading-tight">{title}</h2>
          <p className="text-gray-300 text-lg mb-6 line-clamp-2 hidden md:block max-w-2xl">{description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="font-bold text-white">{author}</span>
            <span>•</span>
            <span>{formatDate(date)}</span>
            {article.reading_time && (
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.reading_time}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // SIDE-BY-SIDE STYLE
  if (variant === "horizontal") {
    return (
      <Link 
        to={`/article/${id}`} 
        className={cn("group flex flex-row bg-white rounded-xl border border-gray-200 overflow-hidden h-auto md:h-40 hover:shadow-md transition-all", className)}
      >
        <div className="w-1/3 max-w-60 shrink-0 relative bg-gray-100 overflow-hidden">
          {/* Added scale-125 for permanent zoom */}
          <img src={imageUrl} alt={title} className="w-full h-full object-cover scale-125 group-hover:scale-[1.30] transition-transform duration-500" />
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-1 justify-center">
          <Badge variant="outline" className="w-fit mb-2 text-[10px] uppercase">{category}</Badge>
          <h2 className="text-sm md:text-base font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">{title}</h2>
          <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{description}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 font-medium">
            <span>{formatDate(date)}</span>
            <span className="inline-flex items-center gap-1 font-bold text-violet-600 group-hover:gap-2 transition-all">
              Read more <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // STANDARD VERTICAL CARD (Small & Medium)
  return (
    <Link to={`/article/${id}`} className={cn("group block flex flex-col h-full", className)}>
      <div className={cn(
        "overflow-hidden rounded-2xl mb-4 relative bg-gray-100 shrink-0",
        variant === "small" ? "aspect-square" : "aspect-video"
      )}>
        <img
          src={imageUrl}
          alt={title}
          // Added scale-125 for permanent zoom
          className="w-full h-full object-cover scale-125 transition-transform duration-500 group-hover:scale-[1.30]"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-none shadow-sm">{category}</Badge>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 className={cn(
          "font-black text-gray-900 mb-2 group-hover:text-violet-600 transition-colors leading-tight",
          variant === "small" ? "text-sm" : "text-lg"
        )}>
          {title}
        </h3>
        
        {variant !== "small" && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs text-gray-400">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-gray-700 truncate">{author}</span>
            <span>•</span>
            <span className="whitespace-nowrap">{formatDate(date)}</span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-violet-600 group-hover:gap-2 transition-all whitespace-nowrap">
            Read more <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}