import * as React from "react";
import { adminApi } from "@/src/lib/admin/adminApi";
import type { Analytics } from "@/src/lib/admin/types";
import { Loader2, Users, Mail, DollarSign, ShieldAlert } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <Icon className="w-5 h-5 text-violet-600" />
      </div>
      <div className="mt-3 text-3xl font-black text-gray-900">{value}</div>
    </div>
  );
}

export function AdminDashboard() {
  const [data, setData] = React.useState<Analytics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    adminApi
      .get<Analytics>("/analytics")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldAlert className="w-5 h-5" /> Couldn't load analytics
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  const maxMonthly = Math.max(1, ...(data?.monthlyUsers.map((m) => m.newUsers) ?? [1]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Reader and subscription overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total users" value={data?.totalUsers ?? 0} icon={Users} />
        <StatCard label="Active subscribers" value={data?.activeSubscribers ?? 0} icon={Mail} />
        <StatCard
          label="Est. revenue"
          value={`$${(data?.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard label="Roles tracked" value={data?.roleCounts.length ?? 0} icon={ShieldAlert} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New users by month */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-bold text-gray-900 mb-6">New users (last 6 months)</h2>
          <div className="flex items-end gap-3 h-40">
            {data?.monthlyUsers.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end h-32">
                  <div
                    className="w-full rounded-t-lg bg-violet-500"
                    style={{ height: `${(m.newUsers / maxMonthly) * 100}%` }}
                    title={`${m.newUsers} new users`}
                  />
                </div>
                <span className="text-[11px] font-semibold text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-bold text-gray-900 mb-6">Users by role</h2>
          <div className="space-y-3">
            {data?.roleCounts.map((r) => {
              const total = data.totalUsers || 1;
              const pct = Math.round((r._count.role / total) * 100);
              return (
                <div key={r.role}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{r.role}</span>
                    <span className="text-gray-500">{r._count.role}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-violet-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
