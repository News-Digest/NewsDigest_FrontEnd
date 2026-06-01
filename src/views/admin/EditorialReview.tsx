import * as React from "react";
import { adminApi } from "@/src/lib/admin/adminApi";
import type { AdminArticle, ArticleStatus } from "@/src/lib/admin/types";
import { Button } from "@/src/components/ui/Button";
import { Loader2, Check, X, Pencil, Save, ExternalLink } from "lucide-react";

const TABS: ArticleStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export function EditorialReview() {
  const [status, setStatus] = React.useState<ArticleStatus>("PENDING");
  const [articles, setArticles] = React.useState<AdminArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<AdminArticle | null>(null);

  const load = React.useCallback((s: ArticleStatus) => {
    setLoading(true);
    setError(null);
    adminApi
      .get<AdminArticle[]>(`/articles?status=${s}&limit=100`)
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    load(status);
  }, [status, load]);

  const act = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      await adminApi.post(`/articles/${id}/${action}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Editorial Review</h1>
          <p className="text-gray-500 text-sm">
            Triage AI-selected articles before they reach the feed or a digest.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setStatus(t)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              status === t ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          No {status.toLowerCase()} articles.
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((a) => (
            <article key={a.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex gap-4">
                {a.imageUrl && (
                  <img
                    src={a.imageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-28 h-20 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-violet-600">
                      {a.category}
                    </span>
                    {typeof a.aiScore === "number" && (
                      <span className="text-[11px] font-bold text-gray-400">
                        score {a.aiScore.toFixed(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-snug">{a.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                    {a.editedSummary || a.aiSummary || a.fullContent.slice(0, 240)}
                  </p>
                  {a.sourceUrl && (
                    <a
                      href={a.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:underline"
                    >
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
                <Button
                  size="sm"
                  onClick={() => act(a.id, "approve")}
                  disabled={busyId === a.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {busyId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => act(a.id, "reject")}
                  disabled={busyId === a.id}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" /> Reject
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(a)}>
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          article={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EditModal({
  article,
  onClose,
  onSaved,
}: {
  article: AdminArticle;
  onClose: () => void;
  onSaved: (a: AdminArticle) => void;
}) {
  const [title, setTitle] = React.useState(article.title);
  const [summary, setSummary] = React.useState(article.editedSummary ?? article.aiSummary ?? "");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await adminApi.patch<AdminArticle>(`/articles/${article.id}`, {
        title,
        editedSummary: summary,
      });
      onSaved(updated);
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit article</h2>
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <label className="block mb-4">
          <span className="text-sm font-semibold text-gray-700">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-500"
          />
        </label>
        <label className="block mb-6">
          <span className="text-sm font-semibold text-gray-700">Summary (editor override)</span>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={8}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-500"
          />
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
