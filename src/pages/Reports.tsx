import { useState, useEffect, useMemo } from "react";
import type { Realm, Transaction, Sale, Category } from "../types";
import type { Insight } from "../domain/insight";
import type { ProfitReport } from "../domain/profitability";
import type { ReportFilters } from "../domain/report";
import { getSales } from "../db/repositories/sale";
import { getAllTransactions } from "../db/repositories/transaction";
import { getCategoriesByRealm } from "../db/repositories/category";
import { getAllDebts } from "../db/repositories/debt";
import { getActivePockets } from "../db/repositories/pocket";
import { getRecentTransactions } from "../domain/transaction";
import { generateInsights } from "../domain/insight";
import { computeProfitReport } from "../domain/profitability";
import {
  defaultDateRange,
  computeCategoryBreakdown,
  computeMonthlyTrends,
  transactionsToCSV,
  salesToCSV,
  downloadCSV,
} from "../domain/report";
import { EmptyState } from "../components/EmptyState";
import { format, parseISO } from "date-fns";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface ReportsProps {
  realm: Realm;
}

export function Reports({ realm }: ReportsProps) {
  const [filters, setFilters] = useState<ReportFilters>(defaultDateRange);
  const [allTxns, setAllTxns] = useState<Transaction[]>([]);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [profitReport, setProfitReport] = useState<ProfitReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [
        recentTxns,
        sales,
        txns,
        cats,
        debts,
        pockets,
      ] = await Promise.all([
        getRecentTransactions(200, realm),
        getSales({ realm }),
        getAllTransactions({ realm }),
        getCategoriesByRealm(realm),
        getAllDebts(realm),
        getActivePockets(realm),
      ]);
      setAllTxns(txns);
      setAllSales(sales);
      setCategories(cats);
      setInsights(generateInsights(recentTxns, pockets, debts));
      setProfitReport(computeProfitReport(sales, txns));
      setLoading(false);
    })();
  }, [realm]);

  // Filter transactions by date range
  const filteredTxns = useMemo(() => {
    return allTxns.filter((t) => {
      if (filters.startDate && t.date < filters.startDate) return false;
      if (filters.endDate && t.date > filters.endDate) return false;
      return true;
    });
  }, [allTxns, filters]);

  // Filter sales by date range
  const filteredSales = useMemo(() => {
    return allSales.filter((s) => {
      if (filters.startDate && s.date < filters.startDate) return false;
      if (filters.endDate && s.date > filters.endDate) return false;
      return true;
    });
  }, [allSales, filters]);

  // Category breakdown (from filtered expenses)
  const breakdown = useMemo(
    () => computeCategoryBreakdown(filteredTxns, categories),
    [filteredTxns, categories],
  );

  // Monthly trends (last 6 months)
  const monthlyTrends = useMemo(
    () => computeMonthlyTrends(allTxns, allSales, 6, realm),
    [allTxns, allSales, realm],
  );

  // Summary numbers for filtered range
  const filteredIncome = filteredTxns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const filteredExpenses = filteredTxns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const filteredRevenue = realm === "business"
    ? filteredSales.reduce((sum, sale) => sum + sale.total, 0)
    : filteredIncome;
  const filteredProfit = filteredRevenue - filteredExpenses;

  if (loading) {
    return <div className="text-sm text-on-surface-muted">Chargement des rapports…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Rapports</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const csv = transactionsToCSV(filteredTxns);
              downloadCSV(csv, `tracklet-transactions-${filters.startDate}-${filters.endDate}.csv`);
            }}
            className="rounded-2xl border border-border-light px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-alt transition-colors"
          >
            Exporter les opérations
          </button>
          <button
            type="button"
            onClick={() => {
              const csv = salesToCSV(filteredSales);
              downloadCSV(csv, `tracklet-sales-${filters.startDate}-${filters.endDate}.csv`);
            }}
            className="rounded-2xl border border-border-light px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-alt transition-colors"
          >
            Exporter les ventes
          </button>
        </div>
      </div>

      {/* Date range filter */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-on-surface-muted mb-1">Du</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
            className="rounded-2xl border border-border-light px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-on-surface-muted mb-1">Au</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
            className="rounded-2xl border border-border-light px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-1">
          {[
            { label: "3M", months: 3 },
            { label: "6M", months: 6 },
            { label: "1Y", months: 12 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - preset.months);
                setFilters({
                  startDate: format(start, "yyyy-MM-dd"),
                  endDate: format(end, "yyyy-MM-dd"),
                });
              }}
              className="rounded-2xl border border-border-light px-2.5 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-alt transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards for filtered range */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={realm === "business" ? "Ventes" : "Entrées"}
          value={`${filteredRevenue.toLocaleString()} FCFA`}
          color="text-success"
        />
        <SummaryCard
          label="Dépenses"
          value={`${filteredExpenses.toLocaleString()} FCFA`}
          color="text-danger"
        />
        <SummaryCard
          label="Résultat"
          value={`${filteredProfit.toLocaleString()} FCFA`}
          color={filteredProfit >= 0 ? "text-success" : "text-danger"}
        />
        <SummaryCard
          label="Marge"
          value={filteredRevenue > 0 ? `${Math.round((filteredProfit / filteredRevenue) * 100)}%` : "—"}
          color={filteredProfit >= 0 ? "text-success" : "text-danger"}
        />
      </div>

      {/* Monthly trends */}
      {monthlyTrends.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-[-0.035em] text-on-surface">
            Évolution mensuelle
          </h2>
          <div className="rounded-[1.5rem] border border-border-light bg-card p-4">
            <div className="flex items-end gap-2" style={{ height: 160 }}>
              {monthlyTrends.map((month) => {
                const maxVal = Math.max(
                  ...monthlyTrends.map((m) => Math.max(m.revenue, m.costs, 1)),
                );
                const revPct = (month.revenue / maxVal) * 100;
                const costPct = (month.costs / maxVal) * 100;
                return (
                  <div
                    key={month.month}
                    className="flex flex-1 flex-col items-center justify-end gap-0.5"
                  >
                    <div className="flex flex-col-reverse items-center w-full" style={{ height: 140 }}>
                      <div
                        className="w-full max-w-[32px] rounded-t bg-danger/40"
                        style={{ height: `${Math.max(costPct, 2)}%` }}
                        title={`Costs: ${month.costs.toLocaleString()} FCFA`}
                      />
                      <div
                        className="w-full max-w-[32px] rounded-t bg-success"
                        style={{ height: `${Math.max(revPct, 2)}%` }}
                        title={`Revenue: ${month.revenue.toLocaleString()} FCFA`}
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-muted mt-1">
                      {format(parseISO(month.month + "-01"), "MMM")}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-center gap-4 text-xs text-on-surface-muted">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-success" /> Entrées
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-danger/40" /> Dépenses
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Category breakdown */}
      {breakdown.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-[-0.035em] text-on-surface">
            Dépenses par catégorie
          </h2>
          <div className="space-y-2">
            {breakdown.map((cat) => (
              <div
                key={cat.categoryId}
                className="rounded-2xl border border-border-light bg-card px-4 py-2.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: cat.categoryColor }}
                    />
                    <span className="font-medium text-on-surface">
                      {cat.categoryName}
                    </span>
                    <span className="text-xs text-on-surface-muted">
                      ({cat.count})
                    </span>
                  </div>
                  <span className="font-semibold text-on-surface">
                    {cat.total.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-surface-alt">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.categoryColor,
                    }}
                  />
                </div>
                <p className="mt-0.5 text-right text-[10px] text-on-surface-muted">
                  {cat.percentage}%
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Profitability month-over-month */}
      {profitReport && profitReport.currentMonth.revenue > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-[-0.035em] text-on-surface">
            Résultat mois par mois
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border-light bg-card p-4">
              <p className="text-xs text-on-surface-muted">Mois en cours</p>
              <div className="mt-2 space-y-1.5">
                <Row label="Ventes" value={`+${profitReport.currentMonth.revenue.toLocaleString()} FCFA`} valueClass="text-success" />
                <Row label="Dépenses" value={`−${profitReport.currentMonth.costs.toLocaleString()} FCFA`} valueClass="text-danger" />
                <Row label="Résultat" value={`${profitReport.currentMonth.profit >= 0 ? "+" : ""}${profitReport.currentMonth.profit.toLocaleString()} FCFA`} valueClass={profitReport.currentMonth.profit >= 0 ? "text-success" : "text-danger"} bold />
                <p className="mt-1 text-xs text-on-surface-muted">Marge : {profitReport.currentMonth.margin}%</p>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-border-light bg-card p-4">
              <p className="text-xs text-on-surface-muted">Mois précédent</p>
              <div className="mt-2 space-y-1.5">
                <Row label="Ventes" value={`+${profitReport.previousMonth.revenue.toLocaleString()} FCFA`} valueClass="text-success" />
                <Row label="Dépenses" value={`−${profitReport.previousMonth.costs.toLocaleString()} FCFA`} valueClass="text-danger" />
                <Row label="Résultat" value={`${profitReport.previousMonth.profit >= 0 ? "+" : ""}${profitReport.previousMonth.profit.toLocaleString()} FCFA`} valueClass={profitReport.previousMonth.profit >= 0 ? "text-success" : "text-danger"} bold />
                <p className="mt-1 text-xs text-on-surface-muted">Marge : {profitReport.previousMonth.margin}%</p>
              </div>
              <div className="mt-2 border-t border-border-light pt-2 text-xs">
                <span className={`font-medium ${
                  profitReport.trend === "up" ? "text-success" : profitReport.trend === "down" ? "text-danger" : "text-on-surface-muted"
                }`}>
                  {profitReport.trend === "up" ? <TrendingUp aria-hidden="true" className="mr-1 inline h-4 w-4" /> : profitReport.trend === "down" ? <TrendingDown aria-hidden="true" className="mr-1 inline h-4 w-4" /> : <Minus aria-hidden="true" className="mr-1 inline h-4 w-4" />} Évolution :{" "}
                  {profitReport.trendPercentage > 0 ? "+" : ""}{profitReport.trendPercentage}%
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-[-0.035em] text-on-surface">Conseils</h2>
          <div className="space-y-2">
            {insights.map((insight) => {
              const colors: Record<string, string> = {
                info: "border-info bg-info-container",
                warning: "border-warning bg-warning-container",
                success: "border-success bg-success-container",
                tip: "border-primary bg-primary-container",
              };
              return (
                <div
                  key={insight.id}
                  className={`rounded-2xl border px-4 py-3 ${colors[insight.type]}`}
                >
                  <p className="text-sm font-medium text-on-surface">{insight.title}</p>
                  <p className="mt-0.5 text-xs text-on-surface-muted">{insight.message}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!loading && filteredTxns.length === 0 && filteredSales.length === 0 && insights.length === 0 && (
        <EmptyState
          title="Aucune donnée sur cette période"
          message="Changez les dates ou ajoutez des opérations pour afficher le rapport."
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border-light bg-card p-4">
      <p className="text-xs text-on-surface-muted">{label}</p>
      <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
  bold = false,
}: {
  label: string;
  value: string;
  valueClass: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-on-surface-muted">{label}</span>
      <span className={`${valueClass} ${bold ? "font-bold" : "font-semibold"}`}>
        {value}
      </span>
    </div>
  );
}
