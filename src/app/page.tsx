import { fetchNews } from '../lib/fetchNews';
import CategoryNav from '../components/CategoryNav';
import ArticleCard from '../components/ArticleCard';

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const currentCategory = params.category || 'Home';
  const apiCategory = (currentCategory === 'Home' || currentCategory === 'Latest') ? "" : currentCategory;
  
  const displayArticles = await fetchNews(apiCategory);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8 border-b border-gray-100 pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-3 text-gray-900">Today's Executive Brief</h1>
        <p className="text-gray-500 text-lg">Live data fetched directly from your Supabase Database.</p>
      </header>

      <CategoryNav currentCategory={currentCategory} />

      {/* FIX: Adjusted grid for horizontal cards. 
        1 column on mobile/tablet, 2 columns on desktop. 
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayArticles.length === 0 ? (
          <div className="col-span-full">
            <p className="text-gray-500 text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No articles found for {currentCategory}. Run your backend cron job!
            </p>
          </div>
        ) : (
          displayArticles.map((article: any) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </main>
  );
}