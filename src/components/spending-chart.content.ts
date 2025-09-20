import { t, type DeclarationContent } from "intlayer";

const spendingChartContent: DeclarationContent = {
  key: "spending-chart",
  content: {
    income: t({ en: "Income", fr: "Revenu" }),
    expenses: t({ en: "Expenses", fr: "Dépenses" }),
    spendingTrends: t({ en: "Spending Trends", fr: "Tendances des dépenses" }),
    incomeVsExpenses: t({ en: "Income vs. Expenses over the last 6 months.", fr: "Revenus vs Dépenses des 6 derniers mois." }),
    noData: t({ en: "No data available", fr: "Aucune donnée disponible" }),
  },
};

export default spendingChartContent;
