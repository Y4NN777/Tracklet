import { useState, useEffect } from "react";
import type { Realm } from "../types";
import type { Transaction } from "../types";
import type { Insight } from "../domain/insight";
import { usePocketBalances } from "../hooks/usePockets";
import { useTransactionSummary } from "../hooks/useTransactions";
import { useDebtSummary } from "../hooks/useDebts";
import { getRecentTransactions } from "../domain/transaction";
import { getAllDebts } from "../db/repositories/debt";
import { getActivePockets } from "../db/repositories/pocket";
import { generateInsights } from "../domain/insight";
import { EmptyState } from "../components/EmptyState";
import { format } from "date-fns";

interface DashboardProps {
  realm: Realm;
}

export function Dashboard({ realm }: DashboardProps) {
  const { balances, total, loading: balLoading } = usePocketBalances(realm);
  const { summary } = useTransactionSummary(realm);
  const debtSummary = useDebtSummary(realm);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    (async () => {
      const [txns, debts, pockets] = await Promise.all([
        getRecentTransactions(5, realm),
        getAllDebts(realm),
        getActivePockets(realm),
      ]);
      setRecent(txns);
      setInsights(generateInsights(txns, pockets, debts));
    })();
  }, [realm]);

  const isEmpty = !balLoading && balances.length === 0 && recent.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-on-surface">Dashboard</h1>
        <EmptyState
          title="Welcome to Tracklet"
          message="Create a pocket and add your first transaction to get started with tracking your finances."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-on-surface">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="Total Balance"
          value={`${total.toLocaleString()} FCFA`}
        />
        <Card
          label="Income (This Month)"
          value={`${summary.totalIncome.toLocaleString()} FCFA`}
        />
        <Card
          label="Expenses"
          value={`${summary.totalExpense.toLocaleString()} FCFA`}
        />
        <Card
          label="Active Debts"
          value={`${debtSummary.summary.activeCount}`}
        />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-on-surface">
            Insights
          </h2>
          <div className="space-y-2">
            {insights.map((insight) => {
              const colors = {
                info: "border-blue-200 bg-blue-50 text-blue-800",
                warning: "border-amber-200 bg-amber-50 text-amber-800",
                success: "border-green-200 bg-green-50 text-green-800",
                tip: "border-purple-200 bg-purple-50 text-purple-800",
              };
              return (
                <div
                  key={insight.id}
                  className={`rounded-lg border px-4 py-3 ${colors[insight.type]}`}
                >
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="mt-0.5 text-xs opacity-80">{insight.message}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent transactions */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-on-surface">
          Recent Activity
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-on-surface-muted">No transactions yet.</p>
        ) : (
          <div className="space-y-1">
            {recent.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between rounded-lg border border-border-light px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${
                      txn.type === "income"
                        ? "text-success"
                        : txn.type === "expense"
                          ? "text-danger"
                          : "text-info"
                    }`}
                  >
                    {txn.type === "income" ? "+" : txn.type === "expense" ? "−" : "↔"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {txn.description}
                    </p>
                    <p className="text-xs text-on-surface-muted">
                      {format(new Date(txn.date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    txn.type === "income"
                      ? "text-success"
                      : txn.type === "expense"
                        ? "text-danger"
                        : "text-info"
                  }`}
                >
                  {txn.type === "income" ? "+" : "−"}
                  {txn.amount.toLocaleString()} FCFA
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-light bg-white p-4">
      <p className="text-xs text-on-surface-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-on-surface">{value}</p>
    </div>
  );
}
