import { Link } from "react-router-dom";

export function Contact() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-xl ring-1 ring-black/5">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Have a story idea, partnership request, or question? We’d love to hear from you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-5 rounded-3xl border border-gray-200 bg-gray-50 p-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email</h2>
              <p className="mt-2 text-gray-600">hello@newsdigest.com</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Office</h2>
              <p className="mt-2 text-gray-600">123 Media Lane<br />San Francisco, CA 94107</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Follow Us</h2>
              <p className="mt-2 text-gray-600">Twitter: @NewsDigest | LinkedIn: News Digest</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 p-8">
            <form className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Name</span>
                <input type="text" className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" placeholder="Your name" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Email</span>
                <input type="email" className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" placeholder="you@example.com" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Message</span>
                <textarea rows={5} className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" placeholder="Write your message here" />
              </label>
              <button className="inline-flex w-full items-center justify-center rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700" type="button">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <Link to="/" className="font-medium text-violet-600 hover:text-violet-700">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
