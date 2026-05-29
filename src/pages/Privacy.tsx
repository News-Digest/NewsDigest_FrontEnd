import { Link } from "react-router-dom";

export function Privacy() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-xl ring-1 ring-black/5">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            At News Digest, we respect your privacy and are committed to protecting your personal information.
          </p>
        </div>

        <section className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Information we collect</h2>
            <p className="mt-3">
              We may collect information you voluntarily provide, such as email addresses for newsletter subscriptions or account creation. We also gather non-personal data from your browser for analytics and performance improvements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">How we use data</h2>
            <p className="mt-3">
              We use collected information to deliver the service, communicate updates, and improve our platform. We do not sell your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Cookies</h2>
            <p className="mt-3">
              Cookies may be used to personalize your experience and remember your preferences. You can manage cookie settings through your browser.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
            <p className="mt-3">
              If you have privacy questions, please contact us at <span className="font-medium text-violet-600">privacy@newsdigest.com</span>.
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
