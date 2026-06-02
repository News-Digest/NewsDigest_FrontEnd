import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Bell, User as UserIcon, LogOut, Settings } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/lib/AuthContext";
import { useLanguage, LANGUAGES, type LangCode } from "@/src/lib/LanguageContext";

const categories = [
  "Latest",
  "Technology",
  "Health",
  "Construction",
  "Consumer",
  "Manufacturing",
  "Retail",
  "Science",
  "Professional Services",
  "Travel"
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromPath = location.pathname.match(/^\/category\/(.+)$/);
  const activeCategory = categoryFromPath
    ? decodeURIComponent(categoryFromPath[1])
    : searchParams.get("category") || "Latest";
  const { user, signInWithGoogle, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "guest"}`;

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/?q=${encodeURIComponent(q)}`);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 shadow-sm" : "bg-white py-[15px]"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-black tracking-tighter text-violet-600">
              NEWS<span className="text-gray-900 font-light italic">DIGEST</span>
            </Link>
            <nav className="hidden xl:flex items-center gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={cat === "Latest" ? "/" : `/?category=${encodeURIComponent(cat)}`}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-violet-600 whitespace-nowrap",
                    activeCategory === cat ? "text-violet-600" : "text-gray-600"
                  )}
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className={cn(
                "flex items-center overflow-hidden transition-all duration-200",
                isSearchOpen ? "w-44 sm:w-64" : "w-9"
              )}
            >
              {isSearchOpen && (
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  placeholder="Search articles..."
                  className="w-full bg-gray-100 rounded-l-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                />
              )}
              <button
                type={isSearchOpen ? "submit" : "button"}
                onClick={() => !isSearchOpen && setIsSearchOpen(true)}
                aria-label="Search"
                className={cn(
                  "p-2 text-gray-500 hover:text-violet-600 transition-colors",
                  isSearchOpen && "bg-gray-100 rounded-r-full"
                )}
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            <button className="p-2 text-gray-500 hover:text-violet-600 transition-colors hidden sm:block" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
              aria-label="Language"
              className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-600 outline-none hover:border-violet-400 focus:ring-2 focus:ring-violet-100 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.code.toUpperCase()}
                </option>
              ))}
            </select>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-violet-600 transition-all"
                >
                  <img src={avatarUrl} alt={displayName} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100]">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <div className="text-sm font-bold text-gray-900 truncate">{displayName}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <UserIcon className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button 
                      onClick={() => logout()}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/auth?mode=sign-in"
                  className="inline-flex items-center justify-center rounded-md border border-violet-600 bg-transparent px-4 py-2 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=sign-up"
                  className="inline-flex items-center justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <button
              className="xl:hidden p-2 text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 shadow-xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={cat === "Latest" ? "/" : `/?category=${encodeURIComponent(cat)}`}
                  className="text-lg font-medium text-gray-900 border-b border-gray-50 pb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
              <Link
                to="/subscription"
                className="inline-flex items-center justify-center w-full rounded-md bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Subscribe Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
