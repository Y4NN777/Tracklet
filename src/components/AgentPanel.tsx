import { useState, useEffect, useCallback, useRef } from "react";
import type { AgentTip } from "../domain/agent";
import { generateTips, markTipShown } from "../domain/agent";
import { getCashPosition } from "../domain/cash-position";
import { getSales } from "../db/repositories/sale";
import { getAllDebts } from "../db/repositories/debt";
import { getGoals } from "../db/repositories/goal";
import type { Realm } from "../types";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  Target,
  Lightbulb,
  Hand,
  Wallet,
  TrendingUp,
  FileText,
  ArrowRight,
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [position, sales, debts, goals] = await Promise.all([
        getCashPosition(realm).catch(() => null),
        getSales({ realm }).catch(() => []),
        getAllDebts(realm).catch(() => []),
        getGoals(realm).catch(() => []),
      ]);

      if (cancelled) return;

      const newTips = generateTips({
        position,
        recentSales: sales,
        debts,
        goals,
        page,
      }).filter((t) => !dismissed.has(t.id));

      setTips(newTips);
      newTips.forEach((tip) => markTipShown(tip.id));
    })();

    return () => { cancelled = true; };
  }, [page, realm]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    setTips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    AlertTriangle: <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />,
    BarChart3: <BarChart3 size={18} className="text-info shrink-0 mt-0.5" />,
    Target: <Target size={18} className="text-danger shrink-0 mt-0.5" />,
    Lightbulb: <Lightbulb size={18} className="text-warning shrink-0 mt-0.5" />,
    Hand: <Hand size={18} className="text-primary shrink-0 mt-0.5" />,
    Wallet: <Wallet size={18} className="text-success shrink-0 mt-0.5" />,
    TrendingUp: <TrendingUp size={18} className="text-success shrink-0 mt-0.5" />,
    FileText: <FileText size={18} className="text-on-surface-muted shrink-0 mt-0.5" />,
  };

  const hasTips = tips.length > 0;

  return (
    <>
      {/* Floating button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`fixed bottom-24 right-4 z-30 flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-3 shadow-lg transition-colors lg:bottom-6 lg:right-6 ${
          hasTips
            ? "bg-primary text-on-primary hover:bg-primary-light"
            : "border-border-light bg-card text-on-surface-muted hover:bg-card-muted"
        }`}
        aria-label={open ? "Fermer les conseils" : hasTips ? `${tips.length} conseil${tips.length > 1 ? "s" : ""}` : "Aucun conseil"}
        aria-expanded={open}
        aria-controls="tracklet-guidance-panel"
      >
        {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Lightbulb aria-hidden="true" className="h-5 w-5" />}
        <span className="hidden text-sm font-semibold sm:inline">Repères{hasTips ? ` · ${tips.length}` : ""}</span>
      </button>

      {/* Tips panel */}
      {open && (
        <div id="tracklet-guidance-panel" className="fixed bottom-40 right-4 z-30 w-[22rem] max-w-[calc(100vw-2rem)] lg:bottom-20 lg:right-6">
          <div className="overflow-hidden rounded-[2rem] border border-border-light bg-card shadow-xl">
            <div className="border-b border-border-light px-5 py-4">
              <p className="text-base font-bold tracking-[-0.025em] text-on-surface">Repères utiles</p>
              <p className="mt-1 text-xs leading-relaxed text-on-surface-muted">Uniquement à partir des données de cet appareil.</p>
            </div>

            <div className="max-h-80 space-y-0 overflow-y-auto">
              {tips.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-on-surface-muted">
                  Aucun conseil pour cette page.
                  <br />
                  <span className="text-xs">Ajoutez des données pour obtenir des conseils utiles.</span>
                </div>
              ) : (
                tips.map((tip) => (
                  <div
                    key={tip.id}
                    className="border-b border-border-light px-5 py-4 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0">{iconMap[tip.icon] ?? null}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface">{tip.title}</p>
                        <p className="mt-0.5 text-xs text-on-surface-muted">{tip.message}</p>
                        {tip.action && (
                          <Link
                            to={tip.action.to}
                            className="mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
                            onClick={() => dismiss(tip.id)}
                          >
                            {tip.action.label}
                            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => dismiss(tip.id)}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-on-surface-muted hover:bg-card-muted hover:text-on-surface"
                        aria-label="Masquer le conseil"
                      >
                        <X aria-hidden="true" className="h-4 w-4" />
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
