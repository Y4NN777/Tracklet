import { useState, useEffect } from "react";
import type { Realm } from "../types";
import type { Insight } from "../domain/insight";
import { getRecentTransactions } from "../domain/transaction";
import { getAllDebts } from "../db/repositories/debt";
import { getActivePockets } from "../db/repositories/pocket";
import { generateInsights } from "../domain/insight";
import { EmptyState } from "../components/EmptyState";

interface ReportsProps {
  realm: Realm;
}

export function Reports({ realm }: ReportsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [txns, debts, pockets] = await Promise.all([
        getRecentTransactions(200, realm),
        getAllDebts(realm),
        getActivePockets(realm),
      ]);
      setInsights(generateInsights(txns, pockets, debts));
      setLoading(false);
    })();
  }, [realm]);

  if (loading) {
    return <div className="text-sm text-on-surface-muted">Loading insights...</div>;
  }

  if (insights.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Reports & Insights</h1>
        <EmptyState
          title="No insights yet"
          message="Add some transactions and debts to generate financial insights."
        />
      </div>
    );
  }

  const byType = (type: Insight["type"]) => insights.filter((i) => i.type === type);
  const typeLabels: Record<Insight["type"], string> = {
    success: "Achievements",
    warning: "Needs Attention",
    info: "Information",
    tip: "Tips",
  };
  const typeColors: Record<Insight["type"], string> = {
    success: "border-green-200 bg-green-50",
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50",
    tip: "border-purple-200 bg-purple-50",
  };
  const dotColors: Record<Insight["type"], string> = {
    success: "bg-green-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    tip: "bg-purple-500",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-on-surface">
        Reports & Insights
      </h1>

      {(["success", "warning", "info", "tip"] as const).map((type) => {
        const items = byType(type);
        if (items.length === 0) return null;
        return (
          <section key={type}>
            <h2 className="mb-3 text-lg font-semibold text-on-surface">
              {typeLabels[type]}
            </h2>
            <div className="space-y-2">
              {items.map((insight) => (
                <div
                  key={insight.id}
                  className={`rounded-lg border px-4 py-3 ${typeColors[insight.type]}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 block h-2 w-2 shrink-0 rounded-full ${dotColors[insight.type]}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        {insight.title}
                      </p>
                      <p className="mt-0.5 text-xs text-on-surface-muted">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
