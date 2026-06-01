import * as React from "react";
import type { AdminAuthUser } from "./types";

const TOKEN_KEY = "nd_admin_token";
const USER_KEY = "nd_admin_user";

interface AdminAuthContextType {
  token: string | null;
  user: AdminAuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = React.createContext<AdminAuthContextType | undefined>(undefined);

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Called by the API client on a 401 so the UI drops back to the login screen. */
export function clearAdminSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("nd-admin-logout"));
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<AdminAuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        /* ignore corrupt value */
      }
    }
    setLoading(false);

    const onLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("nd-admin-logout", onLogout);
    return () => window.removeEventListener("nd-admin-logout", onLogout);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || data?.message || "Invalid email or password.");
    }
    if (!data?.token) {
      throw new Error("Login succeeded but no token was returned.");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    clearAdminSession();
    setToken(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = React.useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
