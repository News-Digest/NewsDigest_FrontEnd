import Link from 'next/link';

export default function CategoryNav({ currentCategory }: { currentCategory: string }) {
  const categories = ['Technology', 'Health', 'Construction', 'Consumer', 'Manufacturing', 'Retail', 'Science', 'Professional Services', 'Travel'];

  return (
    <nav className="flex gap-6 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/?category=${cat}`}
          className={`font-sans font-medium text-sm md:text-base pb-2 whitespace-nowrap transition-colors ${
            currentCategory === cat
              ? 'text-violet-600 border-b-2 border-violet-600'
              : 'text-gray-500 hover:text-obsidian'
          }`}
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}