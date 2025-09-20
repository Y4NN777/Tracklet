import { t, type DeclarationContent } from "intlayer";

const savingsFormContent: DeclarationContent = {
  key: "savings-form",
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
    analyzing: t({ en: "Analyzing...", fr: "Analyse en cours..." }),
    getRecommendations: t({ en: "Get Recommendations", fr: "Obtenir des recommandations" }),

    // Toast
    error: t({ en: "Error", fr: "Erreur" }),

    // Form
    aiSavingsAdvisor: t({ en: "AI Savings Advisor", fr: "Conseiller en épargne IA" }),
    formDescription: t({ en: "Provide your financial details to get personalized savings tips.", fr: "Fournissez vos détails financiers pour obtenir des conseils d'épargne personnalisés." }),
    monthlyIncome: t({ en: "Monthly Income", fr: "Revenu mensuel" }),
    totalSavings: t({ en: "Total Savings", fr: "Épargne totale" }),
    totalDebt: t({ en: "Total Debt", fr: "Dette totale" }),
    monthlyExpenses: t({ en: "Monthly Expenses", fr: "Dépenses mensuelles" }),
    categoryPlaceholder: t({ en: "Category (e.g., Rent)", fr: "Catégorie (ex: Loyer)" }),
    amount: t({ en: "Amount", fr: "Montant" }),
    addExpense: t({ en: "Add Expense", fr: "Ajouter une dépense" }),
    financialGoals: t({ en: "Financial Goals", fr: "Objectifs financiers" }),
    financialGoalsPlaceholder: t({ en: "e.g., Save for a house, pay off debt, invest for retirement.", fr: "ex: Économiser pour une maison, rembourser des dettes, investir pour la retraite." }),

    // AI Recommendations
    aiRecommendations: t({ en: "AI Recommendations", fr: "Recommandations de l'IA" }),
    collapse: t({ en: "Collapse", fr: "Réduire" }),
    expand: t({ en: "Expand", fr: "Agrandir" }),
    personalizedTips: t({ en: "Here are your personalized tips!", fr: "Voici vos conseils personnalisés !" }),
    waitingForInput: t({ en: "Waiting for input", fr: "En attente d'entrée" }),
    waitingForInputDescription: t({ en: "Your personalized savings opportunities will appear here once you submit your financial details.", fr: "Vos opportunités d'épargne personnalisées apparaîtront ici une fois que vous aurez soumis vos détails financiers." }),
  },
};

export default savingsFormContent;
