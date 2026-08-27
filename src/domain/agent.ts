import type { CashPosition, Sale, Goal, Debt } from "../types";

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

export function markTipShown(id: string) {
  try {
    const shown = getShownTips();
    shown.add(id);
    const arr = Array.from(shown).slice(-50);
    localStorage.setItem(SHOWN_TIPS_KEY, JSON.stringify(arr));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export function generateTips(params: {
  position?: CashPosition | null;
  recentSales?: Sale[];
  goals?: Goal[];
  debts?: Debt[];
  page: string;
}): AgentTip[] {
  const shown = getShownTips();
  const tips: AgentTip[] = [];
  const { position, recentSales, goals, debts, page } = params;

  // ── Page-agnostic tips ──

  // Cash position alert
  if (position && position.available <= 0 && !shown.has("cash-negative")) {
    tips.push({
      id: "cash-negative",
      icon: "AlertTriangle",
      title: "Trésorerie faible",
      message: `Il vous reste ${position.available.toLocaleString()} FCFA après les dettes. Pensez aux sommes à récupérer ou aux dépenses à réduire.`,
      action: { label: "Voir la trésorerie", to: "/cash-position" },
    });
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
        title: "Aucune vente cette semaine",
        message: "Aucune vente n’a été enregistrée depuis 7 jours. Ajoutez les ventes récentes pour garder des chiffres fiables.",
        action: { label: "Enregistrer une vente", to: "/sales" },
      });
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
        title: `Presque atteint : ${nearest.goal.name}`,
        message: `Vous êtes à ${Math.round(nearest.progress)} %. Il reste ${(nearest.goal.targetAmount - nearest.goal.savedAmount).toLocaleString()} FCFA.`,
        action: { label: "Voir les objectifs", to: "/goals" },
      });
    }
  }

  // Debt tip — multiple active debts
  const activeDebts = debts?.filter((debt) => debt.status === "active") ?? [];
  if (activeDebts.length > 2 && !shown.has("many-debts-tip")) {
    const smallest = Math.min(...activeDebts.map((debt) => debt.amount));
    tips.push({
      id: "many-debts-tip",
      icon: "Lightbulb",
      title: `${activeDebts.length} dettes actives`,
      message: `La plus petite est de ${smallest.toLocaleString()} FCFA. La régler peut simplifier votre situation.`,
      action: { label: "Gérer les dettes", to: "/debts" },
    });
  }

  // ── Page-specific tips ──

  if (page === "dashboard" && !shown.has("dashboard-tip")) {
    tips.push({
      id: "dashboard-tip",
      icon: "Hand",
      title: "Votre argent en un coup d’œil",
      message: "Ajoutez vos opérations, vos ventes et vos objectifs pour obtenir une vue fiable.",
    });
  }

  if (page === "sales" && recentSales && recentSales.length > 5 && !shown.has("sales-pricing")) {
    const avgPrice = recentSales.reduce((s, x) => s + x.unitPrice, 0) / recentSales.length;
    tips.push({
      id: "sales-pricing",
      icon: "Wallet",
      title: `Vente moyenne : ${Math.round(avgPrice).toLocaleString()} FCFA`,
      message: "Vérifiez vos prix si ce montant vous semble faible. Un petit ajustement peut améliorer votre marge.",
    });
  }

  if (page === "reports" && !shown.has("reports-tip")) {
    tips.push({
      id: "reports-tip",
      icon: "TrendingUp",
      title: "Utilisez les filtres de date",
      message: "Comparez différentes périodes pour repérer les changements dans vos ventes et dépenses.",
    });
  }

  if (page === "goals" && goals && goals.length === 0 && !shown.has("goals-create")) {
    tips.push({
      id: "goals-create",
      icon: "Target",
      title: "Créez votre premier objectif",
      message: "Commencez par un montant réaliste puis suivez votre progression.",
    });
  }

  if (page === "debts" && debts && debts.length === 0 && !shown.has("debts-reminder")) {
    tips.push({
      id: "debts-reminder",
      icon: "FileText",
      title: "Suivez vos dettes",
      message: "Notez qui vous doit de l’argent et ce que vous devez pour ne rien oublier.",
    });
  }

  // Return at most 2 tips per call to avoid overwhelming
  return tips.slice(0, 2);
}
