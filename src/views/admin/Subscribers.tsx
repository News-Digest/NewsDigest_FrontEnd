import * as React from "react";
import { adminApi } from "@/src/lib/admin/adminApi";
import type { AdminUser } from "@/src/lib/admin/types";
import { Button } from "@/src/components/ui/Button";
import { formatDate } from "@/src/lib/utils";
import { Loader2, Download, Search, CheckCircle2, XCircle } from "lucide-react";

export function Subscribers() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [onlySubscribers, setOnlySubscribers] = React.useState(false);

  React.useEffect(() => {
    adminApi
      .get<AdminUser[]>("/users")
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    if (onlySubscribers && !u.isSubscriber) return false;
    if (query && !u.email.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const subscriberCount = users.filter((u) => u.isSubscriber).length;

  const exportCsv = () => {
    const rows = [
      ["email", "name", "country", "role", "isSubscriber", "isEmailVerified", "createdAt"],
      ...filtered.map((u) => [
        u.email,
        u.name ?? "",
        u.country ?? "",
        u.role,
        String(u.isSubscriber),
        String(u.isEmailVerified),
        u.createdAt,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Subscribers &amp; Users</h1>
          <p className="text-gray-500 text-sm">
            {users.length} users · {subscriberCount} subscribers
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email…"
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-500"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <input
            type="checkbox"
            checked={onlySubscribers}
            onChange={(e) => setOnlySubscribers(e.target.checked)}
            className="rounded accent-violet-600"
          />
          Subscribers only
        </label>
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
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Subscriber</th>
                <th className="px-4 py-3 font-semibold">Verified</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{u.email}</div>
                    {u.name && <div className="text-xs text-gray-400">{u.name}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.isSubscriber ? <Yes /> : <No />}</td>
                  <td className="px-4 py-3">{u.isEmailVerified ? <Yes /> : <No />}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    No users match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Yes = () => <CheckCircle2 className="w-4 h-4 text-green-500" />;
const No = () => <XCircle className="w-4 h-4 text-gray-300" />;
