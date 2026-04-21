import Link from 'next/link';

const CATEGORIES = [
  "Home", "Business", "Health", "Construction", 
  "Technology", "Finance", "Energy", "Science", 
  "Retail", "Automotive", "Real Estate"
];

export default function CategoryNav({ currentCategory }: { currentCategory: string }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat || (currentCategory === 'Latest' && cat === 'Home');
        const href = cat === "Home" ? "/" : `/?category=${cat}`;
        
        return (
          <Link 
            key={cat} 
            href={href}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              isActive 
                ? "bg-gray-900 text-white border-gray-900 shadow-md" // High contrast active state!
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
            }`}
          >
            {cat}
          </Link>
        );
      })}
    </nav>
  );
}