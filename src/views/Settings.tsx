import * as React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/lib/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { Button } from "@/src/components/ui/Button";
import { AccountTabs } from "@/src/components/layout/AccountTabs";
import { Loader2, Lock, Mail, Bell, LogOut } from "lucide-react";

function Notice({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  return (
    <div
      className={
        "mb-4 rounded-xl border px-4 py-2 text-sm " +
        (kind === "ok"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700")
      }
    >
      {children}
    </div>
  );
}

export function Settings() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // password
  const [pw, setPw] = React.useState("");
  const [pw2, setPw2] = React.useState("");
  const [pwBusy, setPwBusy] = React.useState(false);
  const [pwMsg, setPwMsg] = React.useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // email
  const [newEmail, setNewEmail] = React.useState("");
  const [emailBusy, setEmailBusy] = React.useState(false);
  const [emailMsg, setEmailMsg] = React.useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // newsletter
  const [nlBusy, setNlBusy] = React.useState(false);
  const [nlMsg, setNlMsg] = React.useState<{ kind: "ok" | "err"; text: string } | null>(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth?mode=sign-in" replace />;

  const provider = (user.app_metadata?.provider as string) || "email";
  const isEmailProvider = provider === "email";

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.length < 6) return setPwMsg({ kind: "err", text: "Password must be at least 6 characters." });
    if (pw !== pw2) return setPwMsg({ kind: "err", text: "Passwords do not match." });
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setPwBusy(false);
    if (error) return setPwMsg({ kind: "err", text: error.message });
    setPw("");
    setPw2("");
    setPwMsg({ kind: "ok", text: "Password updated." });
  };

  const changeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail))
      return setEmailMsg({ kind: "err", text: "Enter a valid email." });
    setEmailBusy(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailBusy(false);
    if (error) return setEmailMsg({ kind: "err", text: error.message });
    setNewEmail("");
    setEmailMsg({ kind: "ok", text: "Check your inbox to confirm the new email address." });
  };

  const subscribeNewsletter = async () => {
    setNlBusy(true);
    setNlMsg(null);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, source: "settings" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Could not subscribe.");
      setNlMsg({ kind: "ok", text: "You're subscribed to the daily digest." });
    } catch (e: any) {
      setNlMsg({ kind: "err", text: e.message });
    } finally {
      setNlBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="container mx-auto px-4 lg:px-8 py-12 max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-8">Your account</h1>
      <AccountTabs />

      {/* Change password */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Lock className="w-5 h-5 text-violet-600" /> Password
        </h2>
        {isEmailProvider ? (
          <>
            <p className="text-sm text-gray-500 mb-5">Set a new password for your account.</p>
            {pwMsg && <Notice kind={pwMsg.kind}>{pwMsg.text}</Notice>}
            <form onSubmit={changePassword} className="space-y-4">
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="New password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
              <Button type="submit" disabled={pwBusy}>
                {pwBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
              </Button>
            </form>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            You signed in with {provider}. Manage your password through your {provider} account.
          </p>
        )}
      </section>

      {/* Change email */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Mail className="w-5 h-5 text-violet-600" /> Email address
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Current: <span className="font-semibold text-gray-700">{user.email}</span>
        </p>
        {emailMsg && <Notice kind={emailMsg.kind}>{emailMsg.text}</Notice>}
        <form onSubmit={changeEmail} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="new@email.com"
            className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
          <Button type="submit" disabled={emailBusy}>
            {emailBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update email"}
          </Button>
        </form>
      </section>

      {/* Newsletter */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Bell className="w-5 h-5 text-violet-600" /> Newsletter
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Get the Daily News Digest delivered to {user.email}.
        </p>
        {nlMsg && <Notice kind={nlMsg.kind}>{nlMsg.text}</Notice>}
        <Button variant="outline" onClick={subscribeNewsletter} disabled={nlBusy}>
          {nlBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe to the digest"}
        </Button>
      </section>

      {/* Danger zone */}
      <section className="rounded-3xl border border-red-100 bg-red-50/40 p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Sign out</h2>
        <p className="text-sm text-gray-500 mb-5">Sign out of your account on this device.</p>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </section>
    </main>
  );
}
