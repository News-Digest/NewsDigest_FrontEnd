import * as React from "react";
import { Button } from "@/src/components/ui/Button";
import { Mail, Check, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Captures newsletter sign-ups into the backend (proxied via
 * /api/newsletter/subscribe -> backend POST /api/newsletter/subscribe), which
 * upserts a subscriber the digest email pipeline (sendDigestToSubscribers)
 * actually reads from. `source` is kept for analytics/labelling.
 */
function useNewsletterForm(source: string) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("You're in! Check your inbox for the next digest.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return { email, setEmail, status, message, handleSubmit };
}

export function NewsletterCTA({ variant = "inline" }: { variant?: "inline" | "full" }) {
  const { email, setEmail, status, message, handleSubmit } = useNewsletterForm(variant);
  const loading = status === "loading";
  const success = status === "success";

  if (variant === "full") {
    return (
      <section className="bg-violet-600 py-16 rounded-3xl my-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-violet-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-violet-700 rounded-full opacity-20 blur-3xl"></div>

        <div className="container mx-auto px-8 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Get the digest delivered to your inbox.
            </h2>
            <p className="text-violet-100 mb-8 text-lg">
              Join readers who start their day with our curated news analysis.
              No spam, just the stories that matter.
            </p>
            {success ? (
              <div className="flex items-center justify-center gap-2 text-white font-semibold text-lg">
                <Check className="w-5 h-5" /> {message}
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-violet-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  required
                  disabled={loading}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="bg-white text-violet-600 hover:bg-violet-50"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                </Button>
              </form>
            )}
            {status === "error" && <p className="text-white/90 text-sm mt-4">{message}</p>}
            <p className="text-violet-200 text-xs mt-4">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
          <Mail className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Newsletter</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        Don't miss out on the latest insights. Subscribe to our weekly newsletter for exclusive content.
      </p>
      {success ? (
        <div className="flex items-center gap-2 text-violet-700 font-semibold text-sm py-3">
          <Check className="w-5 h-5" /> {message}
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            required
            disabled={loading}
          />
          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Subscribe Now"}
          </Button>
          {status === "error" && <p className="text-red-600 text-xs">{message}</p>}
        </form>
      )}
    </div>
  );
}
