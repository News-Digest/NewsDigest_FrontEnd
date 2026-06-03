import { NavLink } from "react-router-dom";
import { cn } from "@/src/lib/utils";

const tabs = [
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export function AccountTabs() {
  return (
    <div className="flex gap-1 mb-8 border-b border-gray-100">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            cn(
              "px-4 py-2.5 text-sm font-bold -mb-px border-b-2 transition-colors",
              isActive
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}
