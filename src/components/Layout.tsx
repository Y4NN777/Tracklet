import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  HandCoins,
  House,
  Menu,
  PiggyBank,
  ReceiptText,
  Settings,
  Store,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import type { Realm } from "../types";
import { AgentPanel } from "./AgentPanel";
import { BrandMark } from "./BrandMark";

const navGroups = [
  {
    label: "Au quotidien",
    items: [
      { to: "/dashboard", label: "Vue d’ensemble", shortLabel: "Accueil", icon: House },
      { to: "/pockets", label: "Poches", shortLabel: "Poches", icon: WalletCards },
      { to: "/transactions", label: "Opérations", shortLabel: "Opérations", icon: ReceiptText },
      { to: "/sales", label: "Ventes", shortLabel: "Ventes", icon: Store, businessOnly: true },
    ],
  },
  {
    label: "À suivre",
    items: [
      { to: "/cash-position", label: "Trésorerie", shortLabel: "Trésorerie", icon: CircleDollarSign },
      { to: "/debts", label: "Dettes et créances", shortLabel: "Dettes", icon: HandCoins },
      { to: "/goals", label: "Objectifs", shortLabel: "Objectifs", icon: PiggyBank },
      { to: "/reports", label: "Rapports", shortLabel: "Rapports", icon: BarChart3 },
      { to: "/settings", label: "Données et sécurité", shortLabel: "Réglages", icon: Settings },
    ],
  },
];

interface LayoutProps {
  realm: Realm;
  onRealmChange: (realm: Realm) => void;
}

export function Layout({ realm, onRealmChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstNavItem = useRef<HTMLAnchorElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const visibleGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.businessOnly || realm === "business"),
  }));
  const visibleItems = visibleGroups.flatMap((group) => group.items);
  const currentItem = visibleItems.find((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`));
  const mobilePaths = ["/dashboard", "/transactions", realm === "business" ? "/sales" : "/pockets", "/cash-position"];
  const mobileNavItems = mobilePaths.map((path) => visibleItems.find((item) => item.to === path)).filter(Boolean);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const syncSidebarAvailability = () => {
      if (sidebar.current) sidebar.current.inert = !desktop.matches && !sidebarOpen;
    };

    syncSidebarAvailability();
    desktop.addEventListener("change", syncSidebarAvailability);
    return () => desktop.removeEventListener("change", syncSidebarAvailability);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    firstNavItem.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const manageDrawerKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        window.requestAnimationFrame(() => menuButton.current?.focus());
        return;
      }
      if (event.key !== "Tab" || !sidebar.current) return;

      const focusable = Array.from(
        sidebar.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!sidebar.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", manageDrawerKeyboard);
    return () => {
      document.removeEventListener("keydown", manageDrawerKeyboard);
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  const closeSidebar = () => {
    setSidebarOpen(false);
    window.requestAnimationFrame(() => menuButton.current?.focus());
  };

  return (
    <div className="product-organic flex min-h-svh bg-surface text-on-surface">
      <a
        href="#product-main"
        className="fixed left-3 top-3 z-[70] -translate-y-24 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary focus:translate-y-0"
      >
        Aller au contenu
      </a>

      {sidebarOpen && (
        <button
          type="button"
          tabIndex={-1}
          className="fixed inset-0 z-30 bg-[#30351F]/55 lg:hidden"
          onClick={closeSidebar}
          aria-label="Fermer le menu"
        />
      )}

      <aside
        ref={sidebar}
        id="product-navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[18rem] flex-col border-r border-border-light bg-card transition-transform duration-300 lg:sticky lg:top-0 lg:h-svh lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation du produit"
      >
        <div className="flex min-h-20 items-center justify-between gap-3 border-b border-border-light px-5">
          <Link to="/dashboard" className="flex min-h-12 items-center gap-3 rounded-2xl" aria-label="Tracklet — vue d’ensemble">
            <BrandMark className="h-11 w-11 shrink-0" />
            <span>
              <span className="block text-lg font-bold tracking-[-0.04em]">Tracklet</span>
              <span className="block text-xs text-on-surface-muted">Local · FCFA</span>
            </span>
          </Link>
          <button type="button" onClick={closeSidebar} className="grid h-11 w-11 place-items-center rounded-2xl hover:bg-surface lg:hidden" aria-label="Fermer le menu">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-border-light px-4 py-5">
          <p className="mb-2 px-1 text-xs font-semibold text-on-surface-muted">Espace financier</p>
          <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-card-muted p-1.5" aria-label="Choisir un espace financier">
            {(["personal", "business"] as const).map((nextRealm) => {
              const Icon = nextRealm === "personal" ? UserRound : BriefcaseBusiness;
              const active = realm === nextRealm;
              return (
                <button
                  key={nextRealm}
                  type="button"
                  onClick={() => onRealmChange(nextRealm)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-semibold transition-colors ${
                    active ? "bg-primary text-on-primary" : "text-on-surface-muted hover:bg-card"
                  }`}
                  aria-pressed={active}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {nextRealm === "personal" ? "Personnel" : "Activité"}
                </button>
              );
            })}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {visibleGroups.map((group, groupIndex) => (
            <div key={group.label} className={groupIndex === 0 ? "" : "mt-6"}>
              <p className="mb-2 px-3 text-xs font-semibold text-on-surface-muted">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon }, itemIndex) => (
                  <NavLink
                    key={to}
                    ref={groupIndex === 0 && itemIndex === 0 ? firstNavItem : undefined}
                    to={to}
                    end={to === "/dashboard"}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition-colors ${
                        isActive ? "bg-primary text-on-primary" : "text-on-surface-muted hover:bg-card-muted hover:text-on-surface"
                      }`
                    }
                  >
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border-light px-5 py-4 text-xs leading-relaxed text-on-surface-muted">
          Vos chiffres restent sur cet appareil.
        </div>
      </aside>

      <div className="min-w-0 flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex min-h-18 items-center justify-between gap-3 border-b border-border-light bg-card px-4 lg:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <button
              ref={menuButton}
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border-light hover:bg-card-muted"
              aria-label="Ouvrir le menu"
              aria-expanded={sidebarOpen}
              aria-controls="product-navigation"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{currentItem?.label ?? "Tracklet"}</p>
              <p className="flex items-center gap-1 text-xs text-on-surface-muted">
                {realm === "personal" ? <UserRound aria-hidden="true" className="h-3.5 w-3.5" /> : <BriefcaseBusiness aria-hidden="true" className="h-3.5 w-3.5" />}
                {realm === "personal" ? "Espace personnel" : "Espace activité"}
              </p>
            </div>
          </div>
          <Link to="/dashboard" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" aria-label="Vue d’ensemble">
            <BrandMark className="h-11 w-11" />
          </Link>
        </header>

        <main id="product-main" tabIndex={-1} className="product-content mx-auto w-full max-w-[88rem] flex-1 p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8">
          <Outlet />
        </main>

        <AgentPanel page={currentItem?.to.slice(1) ?? "dashboard"} realm={realm} />

        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border-light bg-card px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden" aria-label="Navigation rapide">
          {mobileNavItems.map((item) => {
            if (!item) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.68rem] font-semibold transition-colors ${
                    isActive ? "bg-primary-container text-primary" : "text-on-surface-muted"
                  }`
                }
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
                <span className="max-w-full truncate">{item.shortLabel}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
