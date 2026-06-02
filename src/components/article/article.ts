export interface UnifiedArticle {
  id?: string;
  uuid?: string;
  title: string;
  // Snippet 1 uses text/thumbnail, Snippet 2 uses description/image_url
  text?: string;
  description?: string;
  image_url?: string;
  thumbnail?: {
    url?: string;
    default?: { url?: string };
  };
  // Dates
  pubdate?: string | number;
  published_at?: string | number;
  // Categories
  category?: string;
  category_names?: string[];
  // Metadata
  author?: string;
  reading_time?: string;
  source_url?: string | null;
}