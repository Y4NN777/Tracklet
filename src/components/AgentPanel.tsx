import { useState, useEffect, useCallback } from "react";
import type { AgentTip } from "../domain/agent";
import { generateTips } from "../domain/agent";
import { getCashPosition } from "../domain/cash-position";
import { getSales } from "../db/repositories/sale";
import { getAllDebts } from "../db/repositories/debt";
import { getRecentTransactions } from "../domain/transaction";
import type { Realm } from "../types";
import {
  AlertTriangle,
  BarChart3,
  Target,
  Lightbulb,
  Hand,
  Wallet,
  TrendingUp,
  FileText,
  X,
} from "lucide-react";

interface AgentPanelProps {
  page: string;
  realm: Realm;
}

/**
 * Self-contained floating tip panel that loads its own data.
 * Shows on every page with contextual financial advice.
 */
export function AgentPanel({ page, realm }: AgentPanelProps) {
  const [tips, setTips] = useState<AgentTip[]>([]);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [position, sales, debts, txns] = await Promise.all([
        getCashPosition(realm).catch(() => null),
        getSales({ realm }).catch(() => []),
        getAllDebts(realm).catch(() => []),
        getRecentTransactions(20, realm).catch(() => []),
      ]);

      if (cancelled) return;

      const newTips = generateTips({
        position,
        recentSales: sales,
        debts,
        recentTxns: txns,
        page,
      }).filter((t) => !dismissed.has(t.id));

      setTips(newTips);
    })();

    return () => { cancelled = true; };
  }, [page, realm]);

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    setTips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    AlertTriangle: <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />,
    BarChart3: <BarChart3 size={18} className="text-blue-500 shrink-0 mt-0.5" />,
    Target: <Target size={18} className="text-purple-500 shrink-0 mt-0.5" />,
    Lightbulb: <Lightbulb size={18} className="text-amber-400 shrink-0 mt-0.5" />,
    Hand: <Hand size={18} className="text-primary shrink-0 mt-0.5" />,
    Wallet: <Wallet size={18} className="text-green-500 shrink-0 mt-0.5" />,
    TrendingUp: <TrendingUp size={18} className="text-blue-500 shrink-0 mt-0.5" />,
    FileText: <FileText size={18} className="text-gray-500 shrink-0 mt-0.5" />,
  };

  const hasTips = tips.length > 0;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all lg:bottom-6 ${
          hasTips
            ? "bg-primary text-on-primary hover:bg-primary-light"
            : "bg-white text-on-surface-muted border border-border-light"
        }`}
        aria-label={open ? "Close tips" : `${hasTips ? `${tips.length} tip${tips.length > 1 ? "s" : ""} available` : "No tips"}`}
      >
        {hasTips && !open && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {tips.length}
          </span>
        )}
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          className={open ? "rotate-45" : ""}
          style={{ transition: "transform 0.2s" }}
        >
          {open ? (
            <path d="M6 6l10 10M16 6L6 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <>
              <path
                d="M11 2a7 7 0 00-7 7c0 2.2 1 3.8 2.5 5 .8.6 1.5 1.2 1.5 2v1a1 1 0 001 1h4a1 1 0 001-1v-1c0-.8.7-1.4 1.5-2C17 12.8 18 11.2 18 9a7 7 0 00-7-7z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M11 15v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {/* Tips panel */}
      {open && (
        <div className="fixed bottom-36 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] lg:bottom-20">
          <div className="rounded-xl border border-border-light bg-white shadow-xl">
            <div className="border-b border-border-light px-4 py-3">
              <p className="text-sm font-semibold text-on-surface">Tracklet Tips</p>
              <p className="text-xs text-on-surface-muted">Contextual advice for your finances</p>
            </div>

            <div className="max-h-80 space-y-0 overflow-y-auto">
              {tips.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-on-surface-muted">
                  No tips for this page right now.
                  <br />
                  <span className="text-xs">Add more data to get personalized advice.</span>
                </div>
              ) : (
                tips.map((tip) => (
                  <div
                    key={tip.id}
                    className="border-b border-border-light last:border-b-0 px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0">{iconMap[tip.icon] ?? null}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface">{tip.title}</p>
                        <p className="mt-0.5 text-xs text-on-surface-muted">{tip.message}</p>
                        {tip.action && (
                          <a
                            href={tip.action.to}
                            className="mt-1.5 inline-block text-xs font-medium text-primary hover:underline"
                            onClick={() => dismiss(tip.id)}
                          >
                            {tip.action.label} →
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => dismiss(tip.id)}
                        className="shrink-0 rounded p-0.5 text-on-surface-muted hover:text-on-surface"
                        aria-label="Dismiss tip"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
