import * as React from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/lib/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { Button } from "@/src/components/ui/Button";
import { AccountTabs } from "@/src/components/layout/AccountTabs";
import { Loader2, Check, LogOut, Mail, Calendar, ShieldCheck, ArrowRight } from "lucide-react";

export function Profile() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const initialName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const [name, setName] = React.useState(initialName);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setName(initialName);
  }, [initialName]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=sign-in" replace />;
  }

  const email = user.email ?? "";
  const provider = (user.app_metadata?.provider as string) || "email";
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
  const displayName = name || email.split("@")[0] || "User";

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="container mx-auto px-4 lg:px-8 py-12 max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-8">Your account</h1>
      <AccountTabs />

      {/* Identity card */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 mb-6">
        <div className="flex items-center gap-5">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-20 h-20 rounded-full border border-gray-100 object-cover"
          />
          <div className="min-w-0">
            <div className="text-xl font-bold text-gray-900 truncate">{displayName}</div>
            <div className="text-sm text-gray-500 flex items-center gap-2 truncate">
              <Mail className="w-4 h-4 shrink-0" /> {email}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Member since
            </div>
            <div className="text-sm font-semibold text-gray-800">{memberSince}</div>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Signed in with
            </div>
            <div className="text-sm font-semibold text-gray-800 capitalize">{provider}</div>
          </div>
        </div>
      </section>

      {/* Settings: editable display name */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Profile settings</h2>
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={saveName} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Email</span>
            <input
              value={email}
              disabled
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
            />
          </label>
          <Button type="submit" disabled={saving || name.trim() === initialName.trim()}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-4 h-4" /> Saved
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </section>

      {/* Subscription CTA */}
      <section className="rounded-3xl border border-violet-200 bg-violet-50 p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Subscription</h2>
        <p className="text-sm text-gray-600 mb-5">
          Manage your plan or upgrade for unlimited articles and the daily digest.
        </p>
        <Link to="/subscription">
          <Button variant="outline">
            View plans <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </main>
  );
}
