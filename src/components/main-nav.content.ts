import { t, type DeclarationContent } from "intlayer";

const mainNavContent: DeclarationContent = {
  key: "main-nav",
  content: {
    home: t({ en: "Home", fr: "Accueil" }),
    finance: t({ en: "Finance", fr: "Finance" }),
    planning: t({ en: "Planning", fr: "Planification" }),
    hub: t({ en: "Hub", fr: "Hub" }),
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
