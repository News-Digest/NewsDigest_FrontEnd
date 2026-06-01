import * as React from "react";
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/src/lib/admin/AdminAuthContext";
import { cn } from "@/src/lib/utils";
import {
  LayoutDashboard,
  FileCheck2,
  Newspaper,
  Users,
  LogOut,
  Loader2,
  ExternalLink,
} from "lucide-react";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/review", label: "Editorial Review", icon: FileCheck2, end: false },
  { to: "/admin/digests", label: "Digests", icon: Newspaper, end: false },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users, end: false },
];

export function AdminLayout() {
  const { token, user, loading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-gray-900 text-gray-300 flex flex-col">
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="text-lg font-black text-white">
            NEWS<span className="text-violet-400">DIGEST</span>
          </div>
          <div className="text-[11px] uppercase tracking-widest text-gray-500 mt-1">
            Admin Console
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300 hover:text-white hover:bg-red-600/80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="text-sm text-gray-500">
            Signed in as <span className="font-semibold text-gray-900">{user?.email}</span>
            <span className="ml-2 rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide">
              {user?.role}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
