import { t, type DeclarationContent } from "intlayer";

const insightsFormContent: DeclarationContent = {
  key: "insights-form",
  content: {
    // Zod Schema
    incomeMin: t({ en: "Income must be a positive number.", fr: "Le revenu doit être un nombre positif." }),
    savingsMin: t({ en: "Savings must be a positive number.", fr: "L'épargne doit être un nombre positif." }),
    debtMin: t({ en: "Debt must be a positive number.", fr: "La dette doit être un nombre positif." }),
    financialGoalsMin: t({ en: "Please describe your financial goals.", fr: "Veuillez décrire vos objectifs financiers." }),
    categoryRequired: t({ en: "Category is required", fr: "La catégorie est requise" }),
    amountMin: t({ en: "Amount must be positive", fr: "Le montant doit être positif" }),
    expensesMin: t({ en: "Please add at least one expense.", fr: "Veuillez ajouter au moins une dépense." }),
    currencyRequired: t({ en: "Currency is required.", fr: "La devise est requise." }),

    // Submit Button
    generating: t({ en: "Generating...", fr: "Génération en cours..." }),
    getInsights: t({ en: "Get Insights", fr: "Obtenir des aperçus" }),

    // Toast
    error: t({ en: "Error", fr: "Erreur" }),

    // Form
    financialInsights: t({ en: "Financial Insights", fr: "Aperçus financiers" }),
    formDescription: t({ en: "Provide your financial details to receive AI-powered insights.", fr: "Fournissez vos détails financiers pour recevoir des aperçus basés sur l'IA." }),
    monthlyIncome: t({ en: "Monthly Income", fr: "Revenu mensuel" }),
    totalSavings: t({ en: "Total Savings", fr: "Épargne totale" }),
    totalDebt: t({ en: "Total Debt", fr: "Dette totale" }),
    monthlyExpenses: t({ en: "Monthly Expenses", fr: "Dépenses mensuelles" }),
    categoryPlaceholder: t({ en: "Category (e.g., Rent)", fr: "Catégorie (ex: Loyer)" }),
    amount: t({ en: "Amount", fr: "Montant" }),
    amountPlaceholder: t({ en: "e.g. 500", fr: "ex. 500" }),
    addExpense: t({ en: "Add Expense", fr: "Ajouter une dépense" }),
    financialGoals: t({ en: "Financial Goals", fr: "Objectifs financiers" }),
    financialGoalsPlaceholder: t({ en: "e.g., Save for a house, pay off debt, invest for retirement.", fr: "ex: Économiser pour une maison, rembourser des dettes, investir pour la retraite." }),

    // AI Insights
    aiGeneratedInsights: t({ en: "AI Generated Insights", fr: "Aperçus générés par l'IA" }),
    collapse: t({ en: "Collapse", fr: "Réduire" }),
    expand: t({ en: "Expand", fr: "Agrandir" }),
    spendingPatterns: t({ en: "Spending Patterns", fr: "Tendances de dépenses" }),
    potentialSavings: t({ en: "Potential Savings", fr: "Épargnes potentielles" }),
    investmentOpportunities: t({ en: "Investment Opportunities", fr: "Opportunités d'investissement" }),
    waitingForInput: t({ en: "Waiting for input", fr: "En attente d'entrée" }),
    waitingForInputDescription: t({ en: "Your personalized financial insights will appear here once you submit your details.", fr: "Vos aperçus financiers personnalisés apparaîtront ici une fois que vous aurez soumis vos détails." }),
  },
};

export default insightsFormContent;
