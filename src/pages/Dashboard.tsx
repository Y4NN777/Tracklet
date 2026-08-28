import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDollarSign,
  HandCoins,
  Minus,
  Plus,
  Store,
  TrendingDown,
  TrendingUp,
  UserRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Realm, Transaction, CashPosition as CashPositionType } from "../types";
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
          <DashboardHeading busy={false} realm={realm} />
          <EmptyState
            title="Vue indisponible"
            message="Tracklet n’a pas pu lire les données locales. Vos données n’ont pas été modifiées."
            action={{ label: "Réessayer", onClick: () => setReloadToken((token) => token + 1) }}
          />
        </div>
      );
    }
    return <DashboardSkeleton />;
  }

  const { balances, total, summary, debtSummary, recent, insights, cashPosition, profitReport } = snapshot;
  const isEmpty = balances.length === 0 && recent.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <DashboardHeading busy={showBusy} realm={realm} />
        <section className="overflow-hidden rounded-[2rem] border border-border-light bg-card">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-[1.25rem] bg-primary-container text-primary">
                <WalletCards aria-hidden="true" className="h-7 w-7" />
              </span>
              <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-[-0.05em] sm:text-4xl">
                Votre première vue se construit en deux gestes.
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-on-surface-muted">
                Commencez par la poche que vous utilisez aujourd’hui. Tracklet calculera ensuite les soldes à partir de vos opérations réelles.
              </p>
              <Link to="/pockets" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-light">
                Créer ma première poche
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <ol className="space-y-3" aria-label="Premiers pas">
              <li className="rounded-[1.5rem] bg-primary p-5 text-on-primary">
                <p className="text-xs font-semibold">Étape 1</p>
                <p className="mt-2 text-lg font-bold">Créez une poche</p>
                <p className="mt-1 text-sm leading-relaxed">Espèces, Orange Money, Moov Money ou caisse d’activité.</p>
              </li>
              <li className="rounded-[1.5rem] bg-card-muted p-5">
                <p className="text-xs font-semibold text-on-surface-muted">Étape 2</p>
                <p className="mt-2 text-lg font-bold">Enregistrez le prochain mouvement</p>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-muted">Une entrée ou une dépense suffit pour commencer à lire votre situation.</p>
              </li>
            </ol>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <DashboardHeading busy={showBusy} realm={realm} />
      <QuickActions realm={realm} />

      <section className="rounded-[2rem] bg-primary p-6 text-on-primary sm:p-8" aria-labelledby="cash-position-title">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p id="cash-position-title" className="text-sm font-semibold">Trésorerie disponible</p>
            <p className="mt-2 text-[clamp(2.35rem,6vw,4.6rem)] font-bold leading-none tracking-[-0.06em]">
              {cashPosition.available.toLocaleString()} <span className="text-[0.45em] tracking-normal">FCFA</span>
            </p>
          </div>
          <Link to="/cash-position" className="inline-flex min-h-11 items-center gap-2 self-start rounded-2xl bg-on-primary/10 px-4 text-sm font-semibold underline decoration-on-primary/30 underline-offset-4 hover:bg-on-primary/15 lg:self-auto">
            Voir le calcul
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <dl className="mt-7 grid gap-3 sm:grid-cols-3">
          <CashPart label="Solde des poches" value={cashPosition.totalBalance} prefix="" />
          <CashPart label="À payer" value={cashPosition.committed} prefix="−" />
          <CashPart label="À recevoir" value={cashPosition.toReceive} prefix="+" />
        </dl>
      </section>

      <section aria-labelledby="summary-title">
        <SectionHeading id="summary-title" title="Les repères du moment" description="Les montants de l’espace actuellement sélectionné." />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={WalletCards} label="Solde total" value={`${total.toLocaleString()} FCFA`} />
          <StatCard icon={ArrowDownLeft} label="Entrées totales" value={`${summary.totalIncome.toLocaleString()} FCFA`} tone="success" />
          <StatCard icon={ArrowUpRight} label="Dépenses totales" value={`${summary.totalExpense.toLocaleString()} FCFA`} tone="danger" />
          <StatCard icon={HandCoins} label="Dettes actives" value={`${debtSummary.activeCount}`} tone="warning" />
        </div>
      </section>

      {profitReport.currentMonth.revenue > 0 && (
        <section className="rounded-[2rem] border border-border-light bg-card p-5 sm:p-6" aria-labelledby="profit-title">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h2 id="profit-title" className="text-xl font-bold tracking-[-0.035em]">Résultat du mois</h2>
              <p className="mt-1 text-sm text-on-surface-muted">Ventes moins dépenses professionnelles.</p>
            </div>
            {profitReport.currentMonth.saleCount > 0 && <Trend report={profitReport} />}
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <ResultPart label="Ventes" value={profitReport.currentMonth.revenue} tone="success" />
            <ResultPart label="Dépenses" value={profitReport.currentMonth.costs} tone="danger" prefix="−" />
            <ResultPart label={`Résultat · ${profitReport.currentMonth.margin}% de marge`} value={profitReport.currentMonth.profit} tone={profitReport.currentMonth.profit >= 0 ? "success" : "danger"} signed />
          </dl>
        </section>
      )}

      {insights.length > 0 && (
        <section aria-labelledby="insights-title">
          <SectionHeading id="insights-title" title="À regarder maintenant" description="Des repères calculés à partir de vos données locales." />
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="recent-title">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading id="recent-title" title="Activité récente" description="Les cinq derniers mouvements enregistrés." />
          <Link to="/transactions" className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
            Tout voir
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 rounded-[1.5rem] bg-card p-5 text-sm text-on-surface-muted">Aucune opération pour le moment.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-[2rem] border border-border-light bg-card">
            {recent.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DashboardHeading({ busy, realm }: { busy: boolean; realm: Realm }) {
  const RealmIcon = realm === "personal" ? UserRound : BriefcaseBusiness;
  return (
    <div className="flex min-h-14 flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <RealmIcon aria-hidden="true" className="h-4 w-4" />
          {realm === "personal" ? "Espace personnel" : "Espace activité"}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-[-0.05em] text-on-surface sm:text-4xl">Vue d’ensemble</h1>
      </div>
      <span className={`min-h-5 text-xs font-semibold text-on-surface-muted transition-opacity ${busy ? "opacity-100" : "opacity-0"}`} role="status" aria-live="polite">
        Mise à jour…
      </span>
    </div>
  );
}

function QuickActions({ realm }: { realm: Realm }) {
  const actions = [
    { to: "/transactions", label: "Nouvelle opération", icon: Plus },
    { to: "/pockets", label: "Voir les poches", icon: WalletCards },
    realm === "business" ? { to: "/sales", label: "Enregistrer une vente", icon: Store } : { to: "/goals", label: "Voir les objectifs", icon: CircleDollarSign },
  ];
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Actions rapides">
      {actions.map(({ to, label, icon: Icon }, index) => (
        <Link key={to} to={to} className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-colors ${index === 0 ? "bg-primary text-on-primary hover:bg-primary-light" : "border border-border bg-card text-on-surface hover:bg-card-muted"}`}>
          <Icon aria-hidden="true" className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function CashPart({ label, value, prefix }: { label: string; value: number; prefix: string }) {
  return (
    <div className="rounded-[1.25rem] bg-on-primary/10 px-4 py-3">
      <dt className="text-xs font-medium">{label}</dt>
      <dd className="mt-1 font-bold">{prefix}{value.toLocaleString()} FCFA</dd>
    </div>
  );
}

function SectionHeading({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <div>
      <h2 id={id} className="text-xl font-bold tracking-[-0.035em] text-on-surface">{title}</h2>
      <p className="mt-1 text-sm text-on-surface-muted">{description}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "default" }: { icon: LucideIcon; label: string; value: string; tone?: "default" | "success" | "danger" | "warning" }) {
  const tones = {
    default: "bg-primary-container text-primary",
    success: "bg-success-container text-success",
    danger: "bg-danger-container text-danger",
    warning: "bg-warning-container text-warning",
  };
  return (
    <div className="rounded-[1.5rem] border border-border-light bg-card p-5">
      <span className={`grid h-10 w-10 place-items-center rounded-2xl ${tones[tone]}`}><Icon aria-hidden="true" className="h-5 w-5" /></span>
      <p className="mt-5 text-xs font-semibold text-on-surface-muted">{label}</p>
      <p className="mt-1 break-words text-xl font-bold tracking-[-0.025em] text-on-surface">{value}</p>
    </div>
  );
}

function Trend({ report }: { report: ProfitReport }) {
  const Icon = report.trend === "up" ? TrendingUp : report.trend === "down" ? TrendingDown : Minus;
  const tone = report.trend === "up" ? "text-success" : report.trend === "down" ? "text-danger" : "text-on-surface-muted";
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold ${tone}`}>
      <Icon aria-hidden="true" className="h-4 w-4" />
      {Math.abs(report.trendPercentage)}% par rapport au mois dernier
    </span>
  );
}

function ResultPart({ label, value, tone, prefix = "", signed = false }: { label: string; value: number; tone: "success" | "danger"; prefix?: string; signed?: boolean }) {
  const shownPrefix = signed ? (value >= 0 ? "+" : "") : prefix;
  return (
    <div className="rounded-[1.25rem] bg-card-muted p-4">
      <dt className="text-xs font-semibold text-on-surface-muted">{label}</dt>
      <dd className={`mt-2 text-lg font-bold ${tone === "success" ? "text-success" : "text-danger"}`}>{shownPrefix}{value.toLocaleString()} FCFA</dd>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const styles = {
    info: "border-info bg-info-container",
    warning: "border-warning bg-warning-container",
    success: "border-success bg-success-container",
    tip: "border-primary bg-primary-container",
  };
  return (
    <article className={`rounded-[1.5rem] border p-5 text-on-surface ${styles[insight.type]}`}>
      <p className="font-bold">{insight.title}</p>
      <p className="mt-1 text-sm leading-relaxed">{insight.message}</p>
    </article>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const Icon = transaction.type === "income" ? ArrowDownLeft : transaction.type === "expense" ? ArrowUpRight : ArrowLeftRight;
  const tone = transaction.type === "income" ? "text-success bg-success-container" : transaction.type === "expense" ? "text-danger bg-danger-container" : "text-info bg-info-container";
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-light px-4 py-4 last:border-b-0 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${tone}`}><Icon aria-hidden="true" className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-on-surface">{transaction.description}</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">{format(new Date(transaction.date), "d MMM yyyy", { locale: fr })}</p>
        </div>
      </div>
      <span className={`shrink-0 text-right text-sm font-bold ${transaction.type === "income" ? "text-success" : transaction.type === "expense" ? "text-danger" : "text-info"}`}>
        {transaction.type === "income" ? "+" : transaction.type === "expense" ? "−" : ""}{transaction.amount.toLocaleString()} FCFA
      </span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Chargement de la vue d’ensemble" aria-busy="true">
      <div className="h-14 w-56 animate-pulse rounded-2xl bg-card-muted" />
      <div className="h-14 animate-pulse rounded-2xl bg-card" />
      <div className="h-64 animate-pulse rounded-[2rem] bg-primary-container" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-[1.5rem] border border-border-light bg-card" />)}
      </div>
    </div>
  );
}
