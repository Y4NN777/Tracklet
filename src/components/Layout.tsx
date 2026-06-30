import { NavLink, Outlet } from "react-router-dom";
import type { Realm } from "../types";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/pockets", label: "Pockets" },
  { to: "/transactions", label: "Transactions" },
  { to: "/debts", label: "Debts" },
  { to: "/reports", label: "Reports" },
];

interface LayoutProps {
  realm: Realm;
  onRealmChange: (r: Realm) => void;
}

export function Layout({ realm, onRealmChange }: LayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-surface">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border-light bg-white px-4 sm:px-6">
        <span className="text-lg font-semibold text-primary">Tracklet</span>

        {/* Realm toggle */}
        <div className="ml-6 flex overflow-hidden rounded-lg border border-border-light text-sm">
          {(["personal", "business"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRealmChange(r)}
              className={`px-3 py-1.5 font-medium capitalize transition-colors ${
                realm === r
                  ? "bg-primary text-on-primary"
                  : "bg-white text-on-surface-muted hover:bg-surface-alt"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <nav className="ml-auto flex gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-container text-primary"
                    : "text-on-surface-muted hover:bg-surface-alt hover:text-on-surface"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
