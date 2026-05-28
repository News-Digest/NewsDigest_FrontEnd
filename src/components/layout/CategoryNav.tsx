import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/src/lib/utils";

export function CategoryNav() {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "Latest";
  
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

  return (
    <nav className="">
      {/* {categories.map((cat) => (
        <Link
          key={cat}
          to={cat === "Latest" ? "/" : `/?category=${cat}`}
          className={cn(
            "font-sans font-medium text-sm md:text-base pb-2 whitespace-nowrap transition-colors border-b-2",
            currentCategory === cat
              ? "text-violet-600 border-violet-600"
              : "text-gray-500 border-transparent hover:text-gray-900"
          )}
        >
          {cat}
        </Link>
      ))} */}
    </nav>
  );
}
