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
      title: "High monthly spending",
      message: `You've spent ${monthlySpend.toLocaleString()} FCFA this month. Review your expenses.`,
    });
  }

  // No transaction activity
  if (txns.length === 0) {
    insights.push({
      id: "no-activity",
      type: "info",
      title: "Getting started",
      message: "Add your first transaction to start tracking your finances.",
    });
  }

  // Active debts reminder
  const activeDebts = debts.filter((d) => d.status === "active");
  if (activeDebts.length > 3) {
    insights.push({
      id: "many-debts",
      type: "warning",
      title: `${activeDebts.length} active debts`,
      message:
        "You have several active debts. Consider settling some to reduce complexity.",
    });
  }
  if (activeDebts.length > 0 && activeDebts.length <= 3) {
    insights.push({
      id: "debts-reminder",
      type: "info",
      title: `${activeDebts.length} active debt${activeDebts.length > 1 ? "s" : ""}`,
      message: "Keep track of your payment deadlines.",
    });
  }

  // Empty pockets
  const emptyPockets = pockets.filter((p) => {
    const pocketTxns = txns.filter((t) => t.pocketId === p.id);
    const balance = pocketTxns.reduce(
      (s, t) => s + (t.type === "income" ? t.amount : -t.amount),
      0,
    );
    return balance === 0;
  });
  if (emptyPockets.length > 0 && pockets.length > emptyPockets.length) {
    insights.push({
      id: "empty-pockets",
      type: "tip",
      title: `${emptyPockets.length} pocket${emptyPockets.length > 1 ? "s" : ""} with no funds`,
      message: `Consider transferring funds to ${emptyPockets.map((p) => p.name).join(", ")}.`,
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
      title: "Income tracking active",
      message: `You've recorded ${totalIncome.toLocaleString()} FCFA in income.`,
    });
  }

  return insights;
}
