import { useParams, Navigate } from "react-router-dom";

/**
 * Legacy route. The whole app navigates categories via `/?category=<name>`
 * (see Header). To keep a single source of truth we redirect the old
 * `/category/:category` URLs to the query-string version instead of running a
 * second, parallel category feed implementation.
 */
export function CategoryPage() {
  const { category } = useParams();
  const target = category ? `/?category=${encodeURIComponent(category)}` : "/";
  return <Navigate to={target} replace />;
}
