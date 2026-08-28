import { useState, useEffect } from "react";
import type { Realm, CashPosition as CashPositionType } from "../types";
import type { PocketBalance } from "../domain/pocket";
import type { DebtSummary } from "../domain/debt";
import { getCashPosition } from "../domain/cash-position";
import { getAllBalances } from "../domain/pocket";
import { getDebtSummary } from "../domain/debt";
import { EmptyState } from "../components/EmptyState";

interface CashPositionProps {
  realm: Realm;
}

export function CashPosition({ realm }: CashPositionProps) {
  const [position, setPosition] = useState<CashPositionType | null>(null);
  const [balances, setBalances] = useState<PocketBalance[]>([]);
  const [debts, setDebts] = useState<DebtSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [pos, bals, debtSum] = await Promise.all([
        getCashPosition(realm),
        getAllBalances(realm),
        getDebtSummary(realm),
      ]);
      setPosition(pos);
      setBalances(bals);
      setDebts(debtSum);
      setLoading(false);
    })();
  }, [realm]);

  if (loading) {
    return <div className="text-sm text-on-surface-muted">Calcul de la trésorerie…</div>;
  }

  if (!position || balances.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Trésorerie</h1>
        <EmptyState
          title="Aucune donnée de trésorerie"
          message="Créez une poche puis ajoutez des opérations."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Trésorerie</h1>

      {/* Main position card */}
      <div className="rounded-[1.5rem] border border-border-light bg-primary p-5 text-on-primary">
        <p className="text-sm font-medium opacity-80">Disponible estimé</p>
        <p className="mt-1 text-3xl font-bold">
          {position.available.toLocaleString()} FCFA
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-success-container" />
            Solde : {position.totalBalance.toLocaleString()} FCFA
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-warning-container" />
            À payer : −{position.committed.toLocaleString()} FCFA
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-info-container" />
            À recevoir : +{position.toReceive.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      {/* Breakdown cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Solde total"
          value={`${position.totalBalance.toLocaleString()} FCFA`}
          description="Somme des soldes de vos poches"
          color="text-on-surface"
        />
        <StatCard
          label="Vous devez"
          value={`−${position.committed.toLocaleString()} FCFA`}
          description="Dettes actives à rembourser"
          color="text-danger"
        />
        <StatCard
          label="On vous doit"
          value={`+${position.toReceive.toLocaleString()} FCFA`}
          description="Sommes actives à récupérer"
          color="text-success"
        />
      </div>

      {/* Debt detail */}
      {debts && debts.activeCount > 0 && (
        <div className="rounded-[1.5rem] border border-border-light bg-card p-4">
          <p className="text-sm font-semibold text-on-surface">Dettes actives</p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-on-surface-muted">Prêté (à recevoir)</p>
              <p className="font-semibold text-success">
                +{debts.totalLent.toLocaleString()} FCFA
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-muted">Emprunté (à rembourser)</p>
              <p className="font-semibold text-danger">
                −{debts.totalBorrowed.toLocaleString()} FCFA
              </p>
            </div>
          </div>
          <div className="mt-2 border-t border-border-light pt-2 text-xs text-on-surface-muted">
            Solde des créances :{" "}
            <span className={debts.netReceivable >= 0 ? "text-success font-medium" : "text-danger font-medium"}>
              {debts.netReceivable >= 0 ? "+" : ""}{debts.netReceivable.toLocaleString()} FCFA
            </span>
            {" · "}{debts.activeCount} dette{debts.activeCount > 1 ? "s" : ""} active{debts.activeCount > 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Per-pocket breakdown */}
      <section>
        <h2 className="mb-3 text-xl font-bold tracking-[-0.035em] text-on-surface">
          Solde par poche
        </h2>
        <div className="space-y-2">
          {balances.map((pb) => {
            const pctOfTotal = position.totalBalance > 0
              ? Math.round((pb.balance / position.totalBalance) * 100)
              : 0;
            return (
              <div
                key={pb.pocket.id}
                className="rounded-[1.5rem] border border-border-light bg-card px-4 py-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {pb.pocket.name}
                    </p>
                    {pb.pocket.description && (
                      <p className="text-xs text-on-surface-muted">
                        {pb.pocket.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      pb.balance >= 0 ? "text-success" : "text-danger"
                    }`}>
                      {pb.balance >= 0 ? "+" : ""}{pb.balance.toLocaleString()} FCFA
                    </p>
                    <p className="text-[10px] text-on-surface-muted">
                      {pctOfTotal}% du total
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-on-surface-muted">
                  <span>Entrées : +{pb.income.toLocaleString()} FCFA</span>
                  <span>Sorties : −{pb.expense.toLocaleString()} FCFA</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface-alt">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${Math.max(pctOfTotal, 1)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reconciliation formula */}
      <details className="rounded-[1.5rem] border border-border-light bg-card">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-alt transition-colors">
          Comment ce montant est-il calculé ?
        </summary>
        <div className="border-t border-border-light px-4 py-3 text-xs text-on-surface-muted space-y-1">
          <p><strong>Disponible estimé</strong> = solde total − sommes à payer + sommes à recevoir</p>
          <p><strong>Solde total</strong> = entrées − sorties de toutes les poches</p>
          <p><strong>À payer</strong> = dettes empruntées encore actives</p>
          <p><strong>À recevoir</strong> = sommes prêtées encore actives</p>
        </div>
      </details>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: string;
  color: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border-light bg-card p-4">
      <p className="text-xs text-on-surface-muted">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] text-on-surface-muted">{description}</p>
    </div>
  );
}
