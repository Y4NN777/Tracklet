import { useState, useEffect } from "react";
import type { Realm, Sale } from "../types";
import type { Insight } from "../domain/insight";
import type { ProfitReport } from "../domain/profitability";
import { getRecentTransactions } from "../domain/transaction";
import { getAllDebts } from "../db/repositories/debt";
import { getActivePockets } from "../db/repositories/pocket";
import { getSales } from "../db/repositories/sale";
import { getAllTransactions } from "../db/repositories/transaction";
import { generateInsights } from "../domain/insight";
import { computeProfitReport, computeYearToDate } from "../domain/profitability";
import { EmptyState } from "../components/EmptyState";

interface ReportsProps {
  realm: Realm;
}

export function Reports({ realm }: ReportsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [profitReport, setProfitReport] = useState<ProfitReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [txns, debts, pockets, sales, allTxns] = await Promise.all([
        getRecentTransactions(200, realm),
        getAllDebts(realm),
        getActivePockets(realm),
        getSales({ realm }),
        getAllTransactions({ realm }),
      ]);
      setInsights(generateInsights(txns, pockets, debts));
      setProfitReport(computeProfitReport(sales, allTxns));
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

      {/* Profitability section */}
      {profitReport && profitReport.currentMonth.revenue > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-on-surface">
            Profitability
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border-light bg-white p-4">
              <p className="text-xs text-on-surface-muted">Current Month</p>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-muted">Revenue</span>
                  <span className="font-semibold text-success">
                    +{profitReport.currentMonth.revenue.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-muted">Costs</span>
                  <span className="font-semibold text-danger">
                    −{profitReport.currentMonth.costs.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="border-t border-border-light pt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className={profitReport.currentMonth.profit >= 0 ? "text-success" : "text-danger"}>
                      Profit
                    </span>
                    <span className={profitReport.currentMonth.profit >= 0 ? "text-success" : "text-danger"}>
                      {profitReport.currentMonth.profit >= 0 ? "+" : ""}
                      {profitReport.currentMonth.profit.toLocaleString()} FCFA
                    </span>
                  </div>
                  <p className="mt-1 text-right text-xs text-on-surface-muted">
                    Margin: {profitReport.currentMonth.margin}% ·{" "}
                    {profitReport.currentMonth.saleCount} sale{profitReport.currentMonth.saleCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border-light bg-white p-4">
              <p className="text-xs text-on-surface-muted">Previous Month</p>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-muted">Revenue</span>
                  <span className="font-semibold text-success">
                    +{profitReport.previousMonth.revenue.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-muted">Costs</span>
                  <span className="font-semibold text-danger">
                    −{profitReport.previousMonth.costs.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="border-t border-border-light pt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className={profitReport.previousMonth.profit >= 0 ? "text-success" : "text-danger"}>
                      Profit
                    </span>
                    <span className={profitReport.previousMonth.profit >= 0 ? "text-success" : "text-danger"}>
                      {profitReport.previousMonth.profit >= 0 ? "+" : ""}
                      {profitReport.previousMonth.profit.toLocaleString()} FCFA
                    </span>
                  </div>
                  <p className="mt-1 text-right text-xs text-on-surface-muted">
                    Margin: {profitReport.previousMonth.margin}% ·{" "}
                    {profitReport.previousMonth.saleCount} sale{profitReport.previousMonth.saleCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border-light pt-3">
                <span className={`text-xs font-medium ${
                  profitReport.trend === "up" ? "text-success" : profitReport.trend === "down" ? "text-danger" : "text-on-surface-muted"
                }`}>
                  {profitReport.trend === "up" ? "▲" : profitReport.trend === "down" ? "▼" : "◆"} Trend:{" "}
                  {profitReport.trendPercentage > 0 ? "+" : ""}{profitReport.trendPercentage}%
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

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
