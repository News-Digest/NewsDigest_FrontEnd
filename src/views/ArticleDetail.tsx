import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { Article } from "@/src/app/types";
import { formatDate, cn } from "../../src/lib/utils";
import { Badge } from "../../src/components/ui/Badge";
import { NewsletterCTA } from "../../src/components/layout/NewsletterCTA";
import { TrendingSidebar } from "../../src/components/article/TrendingSidebar";
import { 
  Clock, 
  Share2, 
  Bookmark, 
  MessageSquare, 
  Twitter, 
  Facebook, 
  Linkedin,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Lock
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/src/lib/AuthContext";
import { Button } from "@/src/components/ui/Button";

const FREE_ARTICLE_LIMIT = 3;
const VIEWED_KEY = "nd_viewed_articles";

export function ArticleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = React.useState<Article | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [locked, setLocked] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  // Metered paywall: anonymous readers get FREE_ARTICLE_LIMIT articles, then
  // the body is gated. Signed-in users are unlimited.
  React.useEffect(() => {
    if (!article) return;
    if (user) {
      setLocked(false);
      return;
    }
    let viewed: string[] = [];
    try {
      viewed = JSON.parse(localStorage.getItem(VIEWED_KEY) || "[]");
    } catch {
      viewed = [];
    }
    if (viewed.includes(article.id)) {
      setLocked(false); // already counted/read
      return;
    }
    if (viewed.length >= FREE_ARTICLE_LIMIT) {
      setLocked(true);
      return;
    }
    viewed.push(article.id);
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    setLocked(false);
  }, [article, user]);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(console.error);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-40 flex justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!article) return <div className="container mx-auto px-4 py-20 text-center">Article not found.</div>;

  return (
    <div className="relative">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-violet-600 z-[60] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-violet-600 transition-colors mb-8 group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Content */}
          <article className="lg:col-span-8">
            <header className="mb-10">
              <Badge variant="accent" className="mb-4 text-sm px-4 py-1 bg-violet-100 text-violet-700">
                {article.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
                {article.title}
              </h1>
              <p className="text-xl text-gray-500 mb-8 leading-relaxed font-medium">
                {article.description}
              </p>
              
              <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author}`} alt={article.author} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{article.author}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{formatDate(article.published_at)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.reading_time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-all">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-all">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-xl">
              <img 
                src={article.image_url} 
                alt={article.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {locked ? (
              <div className="relative">
                {/* Teaser: first slice of the content, fading out */}
                <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-p:leading-relaxed max-h-48 overflow-hidden relative">
                  <ReactMarkdown>{article.content.slice(0, 600)}</ReactMarkdown>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    You've reached your free article limit
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    Create a free account to keep reading, or subscribe for unlimited access to
                    every story and the daily digest.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/auth?mode=sign-up">
                      <Button size="lg" className="w-full sm:w-auto">Sign up free</Button>
                    </Link>
                    <Link to="/subscription">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        View plans
                      </Button>
                    </Link>
                  </div>
                  <p className="mt-4 text-xs text-gray-400">
                    Already have an account?{" "}
                    <Link to="/auth?mode=sign-in" className="font-semibold text-violet-600 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-violet-600 prose-blockquote:border-l-4 prose-blockquote:border-violet-600 prose-blockquote:bg-violet-50 prose-blockquote:p-6 prose-blockquote:rounded-r-xl">
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                {article.source_url && (
              <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Source
                </p>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 break-all"
                >
                  Read the original article
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                {article.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-violet-600 transition-colors">
                  <Bookmark className="w-5 h-5" />
                  Save
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-violet-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  Comment
                </button>
              </div>
            </div>
              </>
            )}

            <NewsletterCTA variant="full" />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <TrendingSidebar />
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Share this story</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 text-sm font-bold hover:bg-violet-50 transition-colors">
                    <Twitter className="w-4 h-4 text-blue-400" /> Twitter
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 text-sm font-bold hover:bg-violet-50 transition-colors">
                    <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
