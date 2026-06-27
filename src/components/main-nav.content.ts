import { t, type DeclarationContent } from "intlayer";

const mainNavContent: DeclarationContent = {
  key: "main-nav",
  content: {
    home: t({ en: "Home", fr: "Accueil" }),
    wallet: t({ en: "Wallet", fr: "Portefeuille" }),
    growth: t({ en: "Growth", fr: "Croissance" }),
    assistant: t({ en: "Assistant", fr: "Assistant" }),
    settings: t({ en: "Settings", fr: "Paramètres" }),

    // Sub-items or labels
    dashboard: t({ en: "Overview", fr: "Aperçu" }),
    accounts: t({ en: "Accounts", fr: "Comptes" }),
    transactions: t({ en: "Transactions", fr: "Transactions" }),
    planning: t({ en: "Planning", fr: "Planification" }),
    budgetsAndGoals: t({ en: "Budgets & Goals", fr: "Budgets & Objectifs" }),
    savingsAI: t({ en: "AI Savings", fr: "IA d'épargne" }),
    financialInsights: t({ en: "Insights", fr: "Aperçus" }),
    learningCenter: t({ en: "Learning", fr: "Apprentissage" }),
  },
};

export default mainNavContent;
