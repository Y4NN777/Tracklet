import { t, type DeclarationContent } from "intlayer";

const mainNavContent: DeclarationContent = {
  key: "main-nav",
  content: {
    dashboard: t({ en: "Dashboard", fr: "Tableau de bord" }),
    accounts: t({ en: "Accounts", fr: "Comptes" }),
    transactions: t({ en: "Transactions", fr: "Transactions" }),
    categories: t({ en: "Categories", fr: "Catégories" }),
    budgetsAndGoals: t({ en: "Budgets & Goals", fr: "Budgets & Objectifs" }),
    savingsAI: t({ en: "Savings AI", fr: "IA d'épargne" }),
    financialInsights: t({ en: "Financial Insights", fr: "Aperçus financiers" }),
    learningCenter: t({ en: "Learning Center", fr: "Centre d'apprentissage" }),
    settings: t({ en: "Settings", fr: "Paramètres" }),
    profile: t({ en: "Profile", fr: "Profil" }),
  },
};

export default mainNavContent;
