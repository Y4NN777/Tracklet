import { useState, useEffect } from "react";
import type { Realm } from "../types";
import type { Transaction, CashPosition as CashPositionType } from "../types";
import type { Insight } from "../domain/insight";
import type { ProfitReport } from "../domain/profitability";
import type { PocketBalance } from "../domain/pocket";
import type { TransactionSummary } from "../domain/transaction";
import type { DebtSummary } from "../domain/debt";
import { getAllBalances } from "../domain/pocket";
import { getRecentTransactions, getTransactionSummary } from "../domain/transaction";
import { getDebtSummary } from "../domain/debt";
import { getAllDebts } from "../db/repositories/debt";
import { getActivePockets } from "../db/repositories/pocket";
import { getSales } from "../db/repositories/sale";
import { getAllTransactions } from "../db/repositories/transaction";
import { generateInsights } from "../domain/insight";
import { getCashPosition } from "../domain/cash-position";
import { computeProfitReport } from "../domain/profitability";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";
import { format } from "date-fns";

interface DashboardProps {
  realm: Realm;
}

interface DashboardSnapshot {
  balances: PocketBalance[];
  total: number;
  summary: TransactionSummary;
  debtSummary: DebtSummary;
  recent: Transaction[];
  insights: Insight[];
  cashPosition: CashPositionType;
  profitReport: ProfitReport;
}

export function Dashboard({ realm }: DashboardProps) {
  const { addToast } = useToast();
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [showBusy, setShowBusy] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadFailed(false);
    const busyTimer = window.setTimeout(() => {
      if (!cancelled) setShowBusy(true);
    }, 120);

    (async () => {
      try {
        const [balances, summary, debtSummary, txns, debts, pockets, cashPosition, sales, allTxns] = await Promise.all([
          getAllBalances(realm),
          getTransactionSummary(realm),
          getDebtSummary(realm),
          getRecentTransactions(5, realm),
          getAllDebts(realm),
          getActivePockets(realm),
          getCashPosition(realm),
          getSales({ realm }),
          getAllTransactions({ realm }),
        ]);

        if (cancelled) return;

        setSnapshot({
          balances,
          total: balances.reduce((sum, balance) => sum + balance.balance, 0),
          summary,
          debtSummary,
          recent: txns,
          insights: generateInsights(txns, pockets, debts),
          cashPosition,
          profitReport: computeProfitReport(sales, allTxns),
        });
        setLoadFailed(false);
      } catch {
        if (cancelled) return;
        setLoadFailed(true);
        addToast("error", "Impossible d’actualiser la vue d’ensemble.");
      } finally {
        if (!cancelled) {
          window.clearTimeout(busyTimer);
          setShowBusy(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(busyTimer);
      setShowBusy(false);
    };
  }, [realm, reloadToken, addToast]);

  if (!snapshot) {
    if (loadFailed) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-on-surface">Vue d’ensemble</h1>
          <EmptyState
            title="Vue indisponible"
            message="Tracklet n’a pas pu lire les données locales. Réessayez dans un instant."
            action={{ label: "Réessayer", onClick: () => setReloadToken((token) => token + 1) }}
          />
        </div>
      );
    }

    return <DashboardSkeleton />;
  }

  const {
    balances,
    total,
    summary,
    debtSummary,
    recent,
    insights,
    cashPosition,
    profitReport,
  } = snapshot;

  const isEmpty = balances.length === 0 && recent.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <DashboardHeading busy={showBusy} />
        <EmptyState
          title="Bienvenue dans Tracklet"
          message="Créez une poche puis ajoutez votre première opération pour commencer."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeading busy={showBusy} />

      {/* Cash Position */}
      <div className="rounded-xl border border-border-light bg-gradient-to-br from-primary to-primary-light p-5 text-on-primary">
        <p className="text-sm font-medium opacity-80">Trésorerie disponible</p>
        <p className="mt-1 text-3xl font-bold">
          {cashPosition.available.toLocaleString()} FCFA
        </p>
        <div className="mt-3 flex gap-6 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-green-300" />
            Solde : {cashPosition.totalBalance.toLocaleString()} FCFA
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-300" />
            À payer : −{cashPosition.committed.toLocaleString()} FCFA
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-300" />
            À recevoir : +{cashPosition.toReceive.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="Solde total"
          value={`${total.toLocaleString()} FCFA`}
        />
        <Card
          label="Entrées totales"
          value={`${summary.totalIncome.toLocaleString()} FCFA`}
        />
        <Card
          label="Dépenses totales"
          value={`${summary.totalExpense.toLocaleString()} FCFA`}
        />
        <Card
          label="Dettes actives"
          value={`${debtSummary.activeCount}`}
        />
      </div>

      {/* Profitability (when sales data exists) */}
      {profitReport.currentMonth.revenue > 0 && (
        <div className="rounded-xl border border-border-light bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-on-surface">
              Résultat du mois
            </p>
            {profitReport.currentMonth.saleCount > 0 && (
              <span className={`text-xs font-medium ${
                profitReport.trend === "up" ? "text-success" : profitReport.trend === "down" ? "text-danger" : "text-on-surface-muted"
              }`}>
                {profitReport.trend === "up" ? "▲" : profitReport.trend === "down" ? "▼" : "◆"}{" "}
                {Math.abs(profitReport.trendPercentage)}% par rapport au mois dernier
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-success">
                +{profitReport.currentMonth.revenue.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-on-surface-muted">Ventes</p>
            </div>
            <div>
              <p className="text-lg font-bold text-danger">
                −{profitReport.currentMonth.costs.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-on-surface-muted">Dépenses</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${
                profitReport.currentMonth.profit >= 0 ? "text-success" : "text-danger"
              }`}>
                {profitReport.currentMonth.profit >= 0 ? "+" : ""}
                {profitReport.currentMonth.profit.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-on-surface-muted">
                Résultat ({profitReport.currentMonth.margin}% de marge)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-on-surface">
            Conseils
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
          Activité récente
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-on-surface-muted">Aucune opération pour le moment.</p>
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

function DashboardHeading({ busy }: { busy: boolean }) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold text-on-surface">Vue d’ensemble</h1>
      <span
        className={`text-xs font-medium text-on-surface-muted transition-opacity ${busy ? "opacity-100" : "opacity-0"}`}
        role="status"
        aria-live="polite"
      >
        Mise à jour…
      </span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Chargement de la vue d’ensemble" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-alt" />
      <div className="h-36 animate-pulse rounded-xl bg-primary-container" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl border border-border-light bg-white" />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-xl border border-border-light bg-white" />
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
