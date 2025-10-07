import { t, type DeclarationContent } from "intlayer";

const dashboardPageContent: DeclarationContent = {
  key: "dashboard-page",
  content: {
    // Welcome Message (No Data)
    welcomeToTracklet: t({ en: "Welcome to Tracklet", fr: "Bienvenue sur Tracklet" }),
    startTracking: t({ en: "Start tracking your finances by adding your first account. Once you have an account set up, you can begin recording transactions.", fr: "Commencez à suivre vos finances en ajoutant votre premier compte. Une fois votre compte configuré, vous pouvez commencer à enregistrer des transactions." }),
    addAccount: t({ en: "Add Account", fr: "Ajouter un compte" }),

    // Error Message
    errorLoadingDashboard: t({ en: "Error Loading Dashboard", fr: "Erreur de chargement du tableau de bord" }),
    failedToLoad: t({ en: "Failed to load dashboard data", fr: "Échec du chargement des données du tableau de bord" }),
    tryAgain: t({ en: "Try Again", fr: "Réessayer" }),

    // Summary Cards
    netWorth: t({ en: "Net Worth", fr: "Valeur nette" }),
    totalAcrossAccounts: t({ en: "Total across all accounts", fr: "Total sur tous les comptes" }),
    monthlyIncome: t({ en: "Monthly Income", fr: "Revenu mensuel" }),
    thisMonthsEarnings: t({ en: "This month's earnings", fr: "Gains de ce mois-ci" }),
    monthlyExpenses: t({ en: "Monthly Expenses", fr: "Dépenses mensuelles" }),
    savingsRate: t({ en: "% savings rate", fr: "% taux d'épargne" }),
    totalSavings: t({ en: "Total Savings", fr: "Épargne totale" }),
    yourFinancialCushion: t({ en: "Your financial cushion", fr: "Votre coussin financier" }),

    // Budget Status Card
    budgetStatus: t({ en: "Budget Status", fr: "État du budget" }),
    spendingAgainstBudgets: t({ en: "Your spending against your set budgets.", fr: "Vos dépenses par rapport à vos budgets définis." }),
    overBudgetBy: t({ en: "Over budget by", fr: "Dépassement du budget de" }),
    noBudgets: t({ en: "No budgets set up yet", fr: "Aucun budget configuré pour le moment" }),
    createBudgets: t({ en: "Create budgets to track your spending", fr: "Créez des budgets pour suivre vos dépenses" }),

    // Enhanced Budget Metrics
    days: t({ en: "days", fr: "jours" }),
    perDay: t({ en: "day", fr: "jour" }),
    vsLastPeriod: t({ en: "vs last period", fr: "vs période précédente" }),
    overspendRisk: t({ en: "Overspend risk", fr: "Risque de dépassement" }),

    // Tooltip Texts
    spendingIncreased: t({ en: "Spending increased compared to previous", fr: "Dépenses augmentées par rapport à la précédente" }),
    spendingDecreased: t({ en: "Spending decreased compared to previous", fr: "Dépenses diminuées par rapport à la précédente" }),
    period: t({ en: "period", fr: "période" }),
    overspendRiskTooltip: t({ en: "Projected date when budget will be exceeded at current spending rate", fr: "Date projetée où le budget sera dépassé au taux de dépenses actuel" }),

    // Recent Transactions Card
    recentTransactions: t({ en: "Recent Transactions", fr: "Transactions récentes" }),
    latestFinancialActivities: t({ en: "A quick look at your latest financial activities.", fr: "Un aperçu rapide de vos dernières activités financières." }),
    description: t({ en: "Description", fr: "Description" }),
    category: t({ en: "Category", fr: "Catégorie" }),
    amount: t({ en: "Amount", fr: "Montant" }),
    uncategorized: t({ en: "Uncategorized", fr: "Non classé" }),
    noTransactions: t({ en: "No transactions yet", fr: "Aucune transaction pour le moment" }),
    addFirstTransaction: t({ en: "Add your first transaction to get started", fr: "Ajoutez votre première transaction pour commencer" }),

    // Manual Balance Override
    manualOverrideActive: t({
      en: "Manual Override",
      fr: "Substitution Active"
    }),
    manualBalanceText: t({
      en: "Manual balance",
      fr: "Solde manuel"
    }),
    transactionImpactText: t({
      en: "from recent transactions",
      fr: "des transactions récentes"
    }),
    sinceDateText: t({
      en: "since",
      fr: "depuis le"
    }),
    clearManualOverride: t({
      en: "Clear Manual Override",
      fr: "Effacer la Substitution Manuelle"
    }),
  },
};

export default dashboardPageContent;
