import express from "express";
import next from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup Next.js environment
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

async function startServer() {
  // Prepare the Next.js app before starting Express
  await nextApp.prepare();

  const app = express();
  const PORT = 3000;

  // Pointing to your custom Node.js backend
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // ==========================================
  // API ROUTES (Fetching from your own DB!)
  // ==========================================
  
  app.get("/api/articles", async (req, res) => {
    const { category = "Latest", limit = 10, offset = 0 } = req.query;
    
    try {
      const url = new URL(`${BACKEND_URL}/articles`);
      
      // If category is "Latest", we fetch everything (no filter)
      // Otherwise, we pass the category to the backend
      if (category !== "Latest") {
        url.searchParams.append("category", category as string);
      }
      
      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("offset", offset.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Backend Port 5000 unreachable");

      const data = await response.json();
      const dbArticles = Array.isArray(data) ? data : data.data || data.articles || [];

      // Map Database fields to Frontend fields
      const mappedArticles = dbArticles.map((dbArticle: any) => ({
        id: dbArticle.originalId || dbArticle.id,
        title: dbArticle.title || "No Title",
        description: dbArticle.fullContent ? dbArticle.fullContent.substring(0, 160) + '...' : 'No description.',
        content: dbArticle.fullContent || "Content not available.",
        image_url: dbArticle.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        author: dbArticle.author || "Staff Writer",
        published_at: dbArticle.pubDate || new Date().toISOString(),
        category: dbArticle.category || (category as string),
        tags: ["News"],
        popularity_score: parseFloat((Math.random() * (9.9 - 7.5) + 7.5).toFixed(1)),
        reading_time: `${Math.floor(Math.random() * 10) + 3} min read`,
        // Compatibility fields for some components
        thumbnail: { url: dbArticle.imageUrl || "" },
        url: `/article/${dbArticle.originalId || dbArticle.id}`
      }));

      console.log(`[Proxy] Sent ${mappedArticles.length} articles for category: ${category}`);

      res.json({
        articles: mappedArticles,
        total: data.total || dbArticles.length,
        hasMore: dbArticles.length >= Number(limit)
      });
    } catch (error) {
      console.error("Proxy Error (Articles):", error);
      res.json({ articles: [], total: 0, hasMore: false });
    }
  });
  app.get("/api/articles", async (req, res) => {
    const { category = "Latest", limit = 100, offset = 0 } = req.query;
    
    try {
      const url = new URL(`${BACKEND_URL}/articles`);
      if (category !== "Latest") url.searchParams.append("category", category as string);
      
      // Fetch enough to cover the offset + limit
      const fetchLimit = Number(offset) + Number(limit);
      url.searchParams.append("limit", fetchLimit.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch from custom backend");

      const data = await response.json();
      const dbArticles = Array.isArray(data) ? data : data.data || data.articles || [];

      // Map Prisma fields to match your React components' expectations
      const mappedArticles = dbArticles.map((dbArticle: any) => {
        const contentText = dbArticle.fullContent || "";
        
        return {
          id: dbArticle.originalId || dbArticle.id,
          title: dbArticle.title || "No Title",
          description: contentText ? contentText.substring(0, 160) + '...' : 'Content pending...',
          content: contentText || "Content not available.",
          image_url: dbArticle.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          author: dbArticle.author || "Staff Writer",
          published_at: dbArticle.pubDate || new Date().toISOString(),
          category: dbArticle.category || (category as string),
          tags: ["News"],
          popularity_score: parseFloat((Math.random() * (9.9 - 7.5) + 7.5).toFixed(1)),
          reading_time: `${Math.floor(Math.random() * 10) + 3} min read`
        };
      });

      const paginated = mappedArticles.slice(Number(offset), Number(offset) + Number(limit));
      
      res.json({
        articles: paginated,
        total: dbArticles.length,
        hasMore: dbArticles.length >= Number(offset) + Number(limit)
      });
    } catch (error) {
      console.error("Error fetching from backend:", error);
      res.json({
        articles: [],
        total: 0,
        hasMore: false
      });
    }
  });

  app.get("/api/articles/trending", async (req, res) => {
    try {
      const response = await fetch(`${BACKEND_URL}/articles?limit=10`);
      if (!response.ok) throw new Error("API Error");
      
      const data = await response.json();
      const dbArticles = Array.isArray(data) ? data : data.data || data.articles || [];
      
      const trending = dbArticles
        .slice(0, 5)
        .map((dbArticle: any, i: number) => ({
          id: dbArticle.originalId || dbArticle.id || `trend-${i}`,
          title: dbArticle.title,
          category: dbArticle.category || "General",
          published_at: dbArticle.pubDate || new Date().toISOString(),
          popularity_score: parseFloat((Math.random() * (9.9 - 7.5) + 7.5).toFixed(1))
        }));
        
      res.json(trending);
    } catch (error) {
      console.error("Error fetching trending articles:", error);
      res.json([]);
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    const articleId = req.params.id;

    try {
      const response = await fetch(`${BACKEND_URL}/articles/${articleId}`);

      if (response.ok) {
        const data = await response.json();
        const dbArticle = data.data || data.article || data;

        res.json({
          id: dbArticle.originalId || dbArticle.id,
          title: dbArticle.title || "Untitled Article",
          description: (dbArticle.fullContent || "").substring(0, 160) + "...",
          content: dbArticle.fullContent || "Content currently unavailable.",
          image_url: dbArticle.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          author: dbArticle.author || "Staff Writer",
          published_at: dbArticle.pubDate || new Date().toISOString(),
          category: dbArticle.category || 'News',
          tags: ["News"],
          popularity_score: 8.5,
          reading_time: "5 min read"
        });
      } else {
        res.status(404).json({ error: "Article not found in database" });
      }
    } catch (error) {
      console.error("Error retrieving article:", error);
      res.status(500).json({ error: "Error retrieving article" });
    }
  });

  // ==========================================
  // NEXT.JS CATCH-ALL ROUTE
  // ==========================================
  // This hands off any request that isn't an /api route to Next.js
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();