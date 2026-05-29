// src/lib/fetchNews.ts

// Pointing to your custom Node.js backend instead of the external API
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * 🌉 THE DATA BRIDGE
 * Your frontend components expect the old CorporateNews format.
 * This helper function maps your Prisma Database fields to match the old format
 * so you don't have to rewrite a single React component!
 */
const mapDatabaseArticleToFrontend = (dbArticle: any) => {
  if (!dbArticle) return null;
  
  return {
    uuid: dbArticle.originalId || dbArticle.id,
    id: dbArticle.originalId || dbArticle.id,
    title: dbArticle.title,
    // Provide the massive scraped text to both text and html fields!
    text: dbArticle.fullContent,
    html: dbArticle.fullContent,
    category_names: [dbArticle.category],
    pubdate: dbArticle.pubDate,
    thumbnail: { url: dbArticle.imageUrl },
    url: `/article/${dbArticle.originalId || dbArticle.id}`,
    link: `/article/${dbArticle.originalId || dbArticle.id}`
  };
};

export const fetchNews = async (category: string = "", limit: number = 100) => {
  try {
    const url = new URL(`${BACKEND_URL}/articles`);
    if (category) url.searchParams.append("category", category);
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      // Revalidate every 60 seconds so new cron job articles show up automatically
      next: { revalidate: 60 } 
    });

    if (!response.ok) throw new Error("Failed to fetch from custom backend");

    const data = await response.json();
    
    // Depending on how your article.controller.ts is set up, it might return data directly or inside a { data: [] } object
    const articles = Array.isArray(data) ? data : data.data || data.articles || [];

    // Map them and send them to the React components
    return articles.map(mapDatabaseArticleToFrontend);
  } catch (error) {
    console.error("[FRONTEND] Error fetching news:", error);
    return [];
  }
};

export const fetchArticleById = async (articleId: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/articles/${articleId}`, {
      cache: 'no-store' // Always get fresh data for the article reading page
    });

    if (!response.ok) throw new Error("Article not found in your database");

    const data = await response.json();
    const article = data.data || data.article || data;

    return mapDatabaseArticleToFrontend(article);
  } catch (error) {
    console.error(`[FRONTEND] Error fetching article ${articleId}:`, error);
    return null;
  }
};