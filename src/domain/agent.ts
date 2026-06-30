import type { CashPosition, Sale, Goal, Debt, Transaction } from "../types";

export interface AgentTip {
  id: string;
  icon: string; // Lucide icon name
  title: string;
  message: string;
  action?: { label: string; to: string };
}

const SHOWN_TIPS_KEY = "tracklet-shown-tips";

function getShownTips(): Set<string> {
  try {
    const raw = localStorage.getItem(SHOWN_TIPS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markShown(id: string) {
  const shown = getShownTips();
  shown.add(id);
  // Keep only last 50 to avoid unbounded growth
  const arr = Array.from(shown).slice(-50);
  localStorage.setItem(SHOWN_TIPS_KEY, JSON.stringify(arr));
}

export function generateTips(params: {
  position?: CashPosition | null;
  recentSales?: Sale[];
  goals?: Goal[];
  debts?: Debt[];
  recentTxns?: Transaction[];
  page: string;
}): AgentTip[] {
  const shown = getShownTips();
  const tips: AgentTip[] = [];
  const { position, recentSales, goals, debts, recentTxns, page } = params;

  // ── Page-agnostic tips ──

  // Cash position alert
  if (position && position.available <= 0 && !shown.has("cash-negative")) {
    tips.push({
      id: "cash-negative",
      icon: "AlertTriangle",
      title: "Cash running low",
      message: `You have ${position.available.toLocaleString()} FCFA available after debts. Consider collecting receivables or reducing committed expenses.`,
      action: { label: "View Cash Position", to: "/cash-position" },
    });
    markShown("cash-negative");
  }

  // Recent sales — no sales in the last 7 days
  if (recentSales && recentSales.length > 0 && !shown.has("no-recent-sales")) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = recentSales.filter((s) => new Date(s.date) >= weekAgo);
    if (recent.length === 0) {
      tips.push({
        id: "no-recent-sales",
        icon: "BarChart3",
        title: "No sales this week",
        message: "You haven't logged a sale in the last 7 days. Record any recent sales to keep your revenue tracking accurate.",
        action: { label: "Log a Sale", to: "/sales" },
      });
      markShown("no-recent-sales");
    }
  }

  // Goal progress
  if (goals && goals.length > 0 && !shown.has("goal-progress")) {
    const nearest = goals
      .map((g) => ({
        goal: g,
        progress: g.targetAmount > 0 ? (g.savedAmount / g.targetAmount) * 100 : 0,
      }))
      .sort((a, b) => b.progress - a.progress)[0];

    if (nearest && nearest.progress >= 75 && nearest.progress < 100) {
      tips.push({
        id: "goal-progress",
        icon: "Target",
        title: `Almost there: ${nearest.goal.name}`,
        message: `You're ${Math.round(nearest.progress)}% toward your goal of ${nearest.goal.targetAmount.toLocaleString()} FCFA. Just ${(nearest.goal.targetAmount - nearest.goal.savedAmount).toLocaleString()} FCFA to go!`,
        action: { label: "View Goals", to: "/goals" },
      });
      markShown("goal-progress");
    }
  }

  // Debt tip — multiple active debts
  if (debts && debts.length > 2 && !shown.has("many-debts-tip")) {
    const smallest = Math.min(...debts.filter(d => d.status === "active").map(d => d.amount));
    tips.push({
      id: "many-debts-tip",
      icon: "Lightbulb",
      title: `${debts.filter(d => d.status === "active").length} active debts`,
      message: `The smallest active debt is ${smallest.toLocaleString()} FCFA. Settling it first can simplify your finances.`,
      action: { label: "Manage Debts", to: "/debts" },
    });
    markShown("many-debts-tip");
  }

  // ── Page-specific tips ──

  if (page === "dashboard" && !shown.has("dashboard-tip")) {
    tips.push({
      id: "dashboard-tip",
      icon: "Hand",
      title: "Welcome to your Dashboard",
      message: "This is your financial command center. Add transactions, log sales, and set goals to get the most out of Tracklet.",
    });
    markShown("dashboard-tip");
  }

  if (page === "sales" && recentSales && recentSales.length > 5 && !shown.has("sales-pricing")) {
    const avgPrice = recentSales.reduce((s, x) => s + x.unitPrice, 0) / recentSales.length;
    tips.push({
      id: "sales-pricing",
      icon: "Wallet",
      title: `Avg sale: ${Math.round(avgPrice).toLocaleString()} FCFA`,
      message: "Consider reviewing your pricing if this seems low. Even small price adjustments can significantly impact your margins.",
    });
    markShown("sales-pricing");
  }

  if (page === "reports" && !shown.has("reports-tip")) {
    tips.push({
      id: "reports-tip",
      icon: "TrendingUp",
      title: "Use date filters",
      message: "Adjust the date range to compare different periods. The monthly trend chart helps spot patterns in your revenue and costs.",
    });
    markShown("reports-tip");
  }

  if (page === "goals" && goals && goals.length === 0 && !shown.has("goals-create")) {
    tips.push({
      id: "goals-create",
      icon: "Target",
      title: "Set your first goal",
      message: "Goals help you stay motivated. Start with something achievable and track your progress over time.",
    });
    markShown("goals-create");
  }

  if (page === "debts" && debts && debts.length === 0 && !shown.has("debts-reminder")) {
    tips.push({
      id: "debts-reminder",
      icon: "FileText",
      title: "Track your debts",
      message: "Recording who owes you money and what you owe helps you never miss a payment or forget a receivable.",
    });
    markShown("debts-reminder");
  }

  // Return at most 2 tips per call to avoid overwhelming
  return tips.slice(0, 2);
}
