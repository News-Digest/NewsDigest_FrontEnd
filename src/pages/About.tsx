import { Link } from "react-router-dom";

export function About() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-xl ring-1 ring-black/5">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">About News Digest</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            News Digest delivers fast, accurate coverage of the stories that matter most in technology, business, and global affairs. Our mission is to make complex news easy to understand while offering thoughtful analysis and trusted reporting.
          </p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Our mission</h2>
            <p className="mt-3 text-gray-600">
              We aim to connect readers with high-quality journalism that informs, inspires, and empowers decision-making. Every article is crafted to give you the context behind the headlines and the insight you need to stay ahead.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">What we cover</h2>
            <p className="mt-3 text-gray-600">
              From emerging AI breakthroughs and startup funding to global markets and industry trends, News Digest brings you news across the sectors that shape the future.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Stay connected</h2>
            <p className="mt-3 text-gray-600">
              Follow us for daily updates and join our newsletter to receive the top stories directly in your inbox.
            </p>
          </div>
        </section>

        <div className="mt-10 text-sm text-gray-500">
          <Link to="/" className="font-medium text-violet-600 hover:text-violet-700">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
