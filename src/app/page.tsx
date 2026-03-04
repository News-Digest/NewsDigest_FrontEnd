import { fetchCorporateNews } from '../lib/fetchNews';
import CategoryNav from '../components/CategoryNav';
import ArticleCard from '../components/ArticleCard';

// In Next.js App Router, searchParams lets us read the URL dynamically
export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  // Await the searchParams (Next.js 15 requirement) and default to 'Latest' if empty
  const params = await searchParams;
  const currentCategory = params.category || 'Latest';
  
  // Fetch the data based on the clicked category
  const displayArticles = await fetchCorporateNews(currentCategory, 'en');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-2">Today's Executive Brief</h1>
        <p className="text-gray-500">Live data fetched directly from the Publications API.</p>
      </header>

      {/* Our New Interactive Navigation Component */}
      <CategoryNav currentCategory={currentCategory} />

      <div className="flex flex-col gap-8">
        {displayArticles.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No articles found for {currentCategory}.</p>
        ) : (
          displayArticles.map((article: any) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
}