import { t, type DeclarationContent } from "intlayer";

const budgetFormContent: DeclarationContent = {
  key: "budget-form",
  content: {
    // Zod Schema
    nameMinLength: t({ en: "Name must be at least 2 characters.", fr: "Le nom doit comporter au moins 2 caractères." }),
    amountGreaterThanZero: t({ en: "Amount must be greater than 0.", fr: "Le montant doit être supérieur à 0." }),
    periodRequired: t({ en: "Please select a budget period.", fr: "Veuillez sélectionner une période budgétaire." }),

    // Dialog
    editBudget: t({ en: "Edit Budget", fr: "Modifier le budget" }),
    addBudget: t({ en: "Add Budget", fr: "Ajouter un budget" }),
    updateBudgetInfo: t({ en: "Update your budget information.", fr: "Mettez à jour les informations de votre budget." }),
    addBudgetToTrack: t({ en: "Add a new budget to track your finances.", fr: "Ajoutez un nouveau budget pour suivre vos finances." }),

    // Form Fields
    name: t({ en: "Name", fr: "Nom" }),
    namePlaceholder: t({ en: "e.g. Groceries", fr: "ex. Épicerie" }),
    amount: t({ en: "Amount", fr: "Montant" }),
    amountPlaceholder: t({ en: "e.g. 500", fr: "ex. 500" }),
    budgetPeriod: t({ en: "Budget Period", fr: "Période du budget" }),
    selectPeriod: t({ en: "Select period", fr: "Sélectionnez la période" }),
    weekly: t({ en: "Weekly", fr: "Hebdomadaire" }),
    monthly: t({ en: "Monthly", fr: "Mensuel" }),
    yearly: t({ en: "Yearly", fr: "Annuel" }),
    periodDescription: t({ en: "How often this budget resets.", fr: "À quelle fréquence ce budget se réinitialise." }),
    startDate: t({ en: "Start Date", fr: "Date de début" }),
    startDateDescription: t({ en: "When this budget period starts.", fr: "Quand cette période budgétaire commence." }),
    currency: t({ en: "Currency", fr: "Devise" }),
    currencyDescription: t({ en: "Currency is set based on your preferences and cannot be changed here.", fr: "La devise est définie en fonction de vos préférences et ne peut pas être modifiée ici." }),

    // Buttons
    updateBudget: t({ en: "Update Budget", fr: "Mettre à jour le budget" }),
    addBudgetButton: t({ en: "Add Budget", fr: "Ajouter un budget" }),
  },
};

export default budgetFormContent;
