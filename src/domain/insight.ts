import type { Transaction, Pocket, Debt } from "../types";

export interface Insight {
  id: string;
  type: "info" | "warning" | "success" | "tip";
  title: string;
  message: string;
}

export function generateInsights(
  txns: Transaction[],
  pockets: Pocket[],
  debts: Debt[],
): Insight[] {
  const insights: Insight[] = [];

  // High spending alert
  const monthTxns = txns.filter((t) => {
    const txnDate = new Date(t.date);
    const now = new Date();
    return (
      txnDate.getMonth() === now.getMonth() &&
      txnDate.getFullYear() === now.getFullYear() &&
      t.type === "expense"
    );
  });
  const monthlySpend = monthTxns.reduce((s, t) => s + t.amount, 0);
  if (monthlySpend > 100000) {
    insights.push({
      id: "high-spend",
      type: "warning",
      title: "Dépenses élevées ce mois-ci",
      message: `Vous avez dépensé ${monthlySpend.toLocaleString()} FCFA ce mois-ci. Vérifiez vos principales dépenses.`,
    });
  }

  // No transaction activity
  if (txns.length === 0) {
    insights.push({
      id: "no-activity",
      type: "info",
      title: "Bien démarrer",
      message: "Ajoutez votre première opération pour commencer le suivi.",
    });
  }

  // Active debts reminder
  const activeDebts = debts.filter((d) => d.status === "active");
  if (activeDebts.length > 3) {
    insights.push({
      id: "many-debts",
      type: "warning",
      title: `${activeDebts.length} dettes actives`,
      message:
        "Vous avez plusieurs dettes actives. Réglez d’abord les plus urgentes.",
    });
  }
  if (activeDebts.length > 0 && activeDebts.length <= 3) {
    insights.push({
      id: "debts-reminder",
      type: "info",
      title: `${activeDebts.length} dette${activeDebts.length > 1 ? "s" : ""} active${activeDebts.length > 1 ? "s" : ""}`,
      message: "Gardez les échéances de paiement à l’œil.",
    });
  }

  // Empty pockets
  const emptyPockets = pockets.filter((p) => {
    const pocketTxns = txns.filter((t) => t.pocketId === p.id);
    const balance = pocketTxns.reduce(
      (sum, transaction) => {
        if (transaction.type === "income" || transaction.transferDirection === "in") return sum + transaction.amount;
        if (transaction.type === "expense" || transaction.transferDirection === "out") return sum - transaction.amount;
        return sum;
      },
      0,
    );
    return balance === 0;
  });
  if (emptyPockets.length > 0 && pockets.length > emptyPockets.length) {
    insights.push({
      id: "empty-pockets",
      type: "tip",
      title: `${emptyPockets.length} poche${emptyPockets.length > 1 ? "s" : ""} sans fonds`,
      message: `Vous pouvez transférer de l’argent vers ${emptyPockets.map((p) => p.name).join(", ")}.`,
    });
  }

  // First income milestone
  const totalIncome = txns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  if (totalIncome > 0) {
    insights.push({
      id: "tracking-income",
      type: "success",
      title: "Suivi des entrées actif",
      message: `Vous avez enregistré ${totalIncome.toLocaleString()} FCFA d’entrées.`,
    });
  }

  return insights;
}
