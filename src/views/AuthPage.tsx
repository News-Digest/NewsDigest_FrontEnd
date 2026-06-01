"use client";

import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/src/lib/AuthContext";
import { Button } from "@/src/components/ui/Button";

export function AuthPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = React.useState<"sign-in" | "sign-up">(() => {
    const initialMode = searchParams.get("mode");
    return initialMode === "sign-up" ? "sign-up" : "sign-in";
  });
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "sign-up" && password !== confirmPassword) {
      setError("Passwords must match.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "sign-up") {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const queryMode = searchParams.get("mode");
    if (queryMode === "sign-up") {
      setMode("sign-up");
    } else if (queryMode === "sign-in") {
      setMode("sign-in");
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              {mode === "sign-up" ? "Create an account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {mode === "sign-up"
                ? "Sign up with email or continue with Google."
                : "Sign in to your account or create a new one."}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          {mode === "sign-up" ? (
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </label>
          ) : null}

          <Button type="submit" size="lg" className="w-full">
            {loading ? (mode === "sign-up" ? "Creating account..." : "Signing in...") : mode === "sign-up" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">Or continue with</p>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="mt-4 w-full text-gray-900 flex items-center justify-center gap-3"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="#4285F4" d="M23.9 12.3c0-.8-.1-1.5-.3-2.2H12v4.1h6.5c-.3 1.6-1.4 2.9-2.9 3.8v3.2h4.7c2.7-2.5 4.3-6 4.3-10.9z" />
              <path fill="#34A853" d="M12 24c3.2 0 5.9-1 7.8-2.7l-4.7-3.2c-1.3.9-3.1 1.5-5.1 1.5-3.9 0-7.1-2.6-8.3-6.2H.9v3.9C2.8 21.6 7 24 12 24z" />
              <path fill="#FBBC05" d="M3.7 14.4c-.3-.9-.5-1.8-.5-2.4s.2-1.6.5-2.4V5.7H.9C-.2 7.7-.8 9.8-.8 12s.6 4.3 1.7 6.3l2.8-3.9z" />
              <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.8l3.3-3.3C17.9 1.2 15.2 0 12 0 7 0 2.8 2.4.9 5.7l2.8 3.9C4.9 7.4 8.1 4.8 12 4.8z" />
            </svg>
            {loading ? "Please wait..." : "Sign in with Google"}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === "sign-up" ? (
            <>Already have an account? <button type="button" className="font-semibold text-violet-600 hover:text-violet-700" onClick={() => setMode("sign-in")}>Sign In</button></>
          ) : (
            <>New here? <button type="button" className="font-semibold text-violet-600 hover:text-violet-700" onClick={() => setMode("sign-up")}>Create account</button></>
          )}
        </p>

        <p className="mt-4 text-center text-sm text-gray-400">
          <Link to="/" className="font-medium text-violet-600 hover:text-violet-700">
            Back to news
          </Link>
        </p>
      </div>
    </main>
  );
}
