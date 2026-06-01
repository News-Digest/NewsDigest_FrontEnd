import * as React from "react";
import { adminApi } from "@/src/lib/admin/adminApi";
import type { AdminDigest, DigestStatus } from "@/src/lib/admin/types";
import { Button } from "@/src/components/ui/Button";
import { formatDate } from "@/src/lib/utils";
import { Loader2, Plus, Check, Send, Sparkles } from "lucide-react";

const statusStyles: Record<DigestStatus, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  APPROVED: "bg-blue-100 text-blue-700",
  SENT: "bg-green-100 text-green-700",
};

export function AdminDigests() {
  const [digests, setDigests] = React.useState<AdminDigest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null); // id or "compile"

  const load = React.useCallback(() => {
    setLoading(true);
    adminApi
      .get<AdminDigest[]>("/digests")
      .then((data) => setDigests(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const compile = async () => {
    setBusy("compile");
    setError(null);
    setNotice(null);
    try {
      const res = await adminApi.post<AdminDigest | null>("/digests/compile");
      setNotice(res ? "New draft digest compiled." : "No eligible articles to compile.");
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  const run = async (id: string, action: "approve" | "send") => {
    setBusy(id);
    setError(null);
    setNotice(null);
    try {
      const result = await adminApi.post<any>(`/digests/${id}/${action}`);
      if (action === "send" && result?.delivery) {
        setNotice(`Sent to ${result.delivery.recipientCount} subscribers.`);
      } else if (action === "send") {
        setNotice("Digest sent.");
      } else {
        setNotice("Digest approved — ready to send.");
      }
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Digests</h1>
          <p className="text-gray-500 text-sm">
            Compile, approve, and send the Daily News Digest.
          </p>
        </div>
        <Button onClick={compile} disabled={busy === "compile"}>
          {busy === "compile" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Compile new draft
        </Button>
      </div>

      {notice && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : digests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          <Sparkles className="w-6 h-6 mx-auto mb-3 text-gray-300" />
          No digests yet. Compile a draft to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {digests.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusStyles[d.status]}`}>
                    {d.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(d.dateFor)} · {d.articles?.length ?? 0} articles
                    {d.status === "SENT" && ` · ${d.recipientCount} recipients`}
                  </span>
                </div>
                <h3 className="mt-1 font-bold text-gray-900 truncate">{d.title}</h3>
                {d.intro && <p className="text-sm text-gray-500 line-clamp-1">{d.intro}</p>}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {d.status === "DRAFT" && (
                  <Button
                    size="sm"
                    onClick={() => run(d.id, "approve")}
                    disabled={busy === d.id}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {busy === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve
                  </Button>
                )}
                {d.status === "APPROVED" && (
                  <Button
                    size="sm"
                    onClick={() => run(d.id, "send")}
                    disabled={busy === d.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {busy === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </Button>
                )}
                {d.status === "SENT" && (
                  <span className="text-xs font-semibold text-green-600">Delivered</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
