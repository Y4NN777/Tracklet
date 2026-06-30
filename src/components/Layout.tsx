import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import type { Realm } from "../types";

const navItems = [
  { to: "/", label: "Dashboard", icon: IconDashboard },
  { to: "/pockets", label: "Pockets", icon: IconPockets },
  { to: "/transactions", label: "Transactions", icon: IconTransactions },
  { to: "/debts", label: "Debts", icon: IconDebts },
  { to: "/goals", label: "Goals", icon: IconGoals },
  { to: "/sales", label: "Sales", icon: IconSales },
  { to: "/reports", label: "Reports", icon: IconReports },
  { to: "/cash-position", label: "Cash", icon: IconCashPosition },
];

interface LayoutProps {
  realm: Realm;
  onRealmChange: (r: Realm) => void;
}

export function Layout({ realm, onRealmChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-surface">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (desktop) + mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border-light bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border-light px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-on-primary">
            T
          </div>
          <span className="text-lg font-semibold text-on-surface">Tracklet</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-container text-primary"
                    : "text-on-surface-muted hover:bg-surface-alt hover:text-on-surface"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Realm toggle */}
        <div className="border-t border-border-light px-4 py-4">
          <p className="mb-2 text-xs font-medium text-on-surface-muted">Realm</p>
          <div className="flex overflow-hidden rounded-lg border border-border-light text-sm">
            {(["personal", "business"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRealmChange(r)}
                className={`flex-1 px-3 py-1.5 font-medium capitalize transition-colors ${
                  realm === r
                    ? "bg-primary text-on-primary"
                    : "bg-white text-on-surface-muted hover:bg-surface-alt"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Top header (mobile) */}
        <header className="flex h-14 items-center gap-3 border-b border-border-light bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-on-surface-muted hover:bg-surface-alt"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-on-primary">
            T
          </div>
          <span className="text-sm font-semibold text-on-surface">Tracklet</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 pb-20 sm:p-6 lg:pb-6">
          <Outlet />
        </main>

        {/* Bottom nav (mobile) */}
        <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-border-light bg-white lg:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-on-surface-muted"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ─── Simple SVG Icons ─── */

function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="12" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="9" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPockets() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="13" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconTransactions() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 7H6M6 13l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconDebts() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v8M7 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconReports() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 16V4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 16V8a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconGoals() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconSales() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10h3l2-5 4 10 2-5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCashPosition() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7.5h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
