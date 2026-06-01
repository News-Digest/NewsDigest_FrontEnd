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

// Pointing to your custom Node.js backend
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

// ------------------------------------------------------------------
// Helpers — deterministic, stable metadata (no more Math.random()!)
// ------------------------------------------------------------------

/** Estimate reading time from the article body at ~200 wpm. Deterministic. */
function computeReadingTime(content: string): string {
  const words = content ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/**
 * Popularity score. Prefer a real value from the backend/DB. If the backend
 * doesn't provide one yet, derive a STABLE score from the article id so it no
 * longer flickers on every request. Replace this with real reader analytics
 * (Lukijadata) once the backend exposes a score/view count.
 */
function popularityScore(dbArticle: any): number {
  const real =
    dbArticle.popularityScore ??
    dbArticle.popularity_score ??
    dbArticle.score ??
    dbArticle.views;
  if (real !== undefined && real !== null && !Number.isNaN(Number(real))) {
    return Number(real);
  }
  // Stable hash of the id -> [7.5, 9.9]
  const key = String(dbArticle.originalId || dbArticle.id || dbArticle.title || "");
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return parseFloat((7.5 + (hash % 240) / 100).toFixed(1)); // 7.5 .. 9.9
}

/** Tags from the backend when available, otherwise fall back to the category. */
function articleTags(dbArticle: any, fallbackCategory: string): string[] {
  if (Array.isArray(dbArticle.tags) && dbArticle.tags.length) return dbArticle.tags;
  if (Array.isArray(dbArticle.category_names) && dbArticle.category_names.length) {
    return dbArticle.category_names;
  }
  return [dbArticle.category || fallbackCategory || "News"];
}

/** Map a backend/DB article into the shape the frontend components expect. */
function mapArticle(dbArticle: any, fallbackCategory: string) {
  const content = dbArticle.fullContent || dbArticle.content || "";
  return {
    id: dbArticle.originalId || dbArticle.id,
    title: dbArticle.title || "No Title",
    description: content ? content.substring(0, 160).trim() + "..." : "No description.",
    content: content || "Content not available.",
    image_url: dbArticle.imageUrl || dbArticle.image_url || FALLBACK_IMAGE,
    author: dbArticle.author || "Staff Writer",
    published_at: dbArticle.pubDate || dbArticle.published_at || new Date().toISOString(),
    category: dbArticle.category || fallbackCategory,
    tags: articleTags(dbArticle, fallbackCategory),
    popularity_score: popularityScore(dbArticle),
    reading_time: dbArticle.reading_time || computeReadingTime(content),
    // Compatibility fields for some components
    thumbnail: { url: dbArticle.imageUrl || dbArticle.image_url || "" },
    url: `/article/${dbArticle.originalId || dbArticle.id}`,
  };
}

function extractArticles(data: any): any[] {
  return Array.isArray(data) ? data : data.data || data.articles || [];
}

async function startServer() {
  // Prepare the Next.js app before starting Express
  await nextApp.prepare();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // ==========================================
  // API ROUTES (Fetching from your own DB!)
  // ==========================================

  app.get("/api/articles", async (req, res) => {
    const {
      category = "Latest",
      limit = 10,
      offset = 0,
      q = "",
    } = req.query as Record<string, string>;

    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    const query = (q || "").toString().trim().toLowerCase();

    try {
      const url = new URL(`${BACKEND_URL}/articles`);

      // "Latest" means no category filter
      if (category !== "Latest") {
        url.searchParams.append("category", category);
      }

      // When searching we need a wider net to filter locally; otherwise fetch
      // exactly enough to cover offset + limit.
      const fetchLimit = query ? 200 : offsetNum + limitNum;
      url.searchParams.append("limit", fetchLimit.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Backend unreachable");

      const data = await response.json();
      let mapped = extractArticles(data).map((a: any) => mapArticle(a, category));

      // Local search filtering (until the backend supports full-text search)
      if (query) {
        mapped = mapped.filter(
          (a) =>
            a.title.toLowerCase().includes(query) ||
            a.content.toLowerCase().includes(query) ||
            a.category.toLowerCase().includes(query)
        );
      }

      const total = query ? mapped.length : data.total || mapped.length;
      const paginated = mapped.slice(offsetNum, offsetNum + limitNum);

      console.log(
        `[Proxy] ${paginated.length} articles (category=${category}${query ? `, q="${query}"` : ""}, offset=${offsetNum})`
      );

      res.json({
        articles: paginated,
        total,
        hasMore: offsetNum + limitNum < total,
      });
    } catch (error) {
      console.error("Proxy Error (Articles):", error);
      res.json({ articles: [], total: 0, hasMore: false });
    }
  });

  app.get("/api/articles/trending", async (req, res) => {
    try {
      // Pull a pool of recent articles and rank by popularity score.
      const response = await fetch(`${BACKEND_URL}/articles?limit=50`);
      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const trending = extractArticles(data)
        .map((a: any) => mapArticle(a, "General"))
        .sort((a, b) => b.popularity_score - a.popularity_score)
        .slice(0, 5);

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
        res.json(mapArticle(dbArticle, "News"));
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
