
import { t, type DeclarationContent } from "intlayer";

const budgetsPageContent: DeclarationContent = {
  key: "budgets-page",
  content: {
    // Loading State
    loading: t({ en: "Loading budgets and goals...", fr: "Chargement des budgets et des objectifs..." }),

    // Budgets Section
    budgetsTitle: t({ en: "Monthly Budgets", fr: "Budgets mensuels" }),
    newBudgetButton: t({ en: "New Budget", fr: "Nouveau budget" }),
    emptyBudgetsTitle: t({ en: "No budgets yet", fr: "Aucun budget pour le moment" }),
    emptyBudgetsDescription: t({ en: "Start managing your finances by creating your first budget.", fr: "Commencez à gérer vos finances en créant votre premier budget." }),
    createBudgetButton: t({ en: "Create Budget", fr: "Créer un budget" }),
    deleteConfirmation: t({ en: (params: { name: string } = { name: '' }) => `Are you sure you want to delete "${params.name}"? This action cannot be undone.`, fr: (params: { name: string } = { name: '' }) => `Êtes-vous sûr de vouloir supprimer "${params.name}" ? Cette action est irréversible.` }),

    // Goals Section
    goalsTitle: t({ en: "Financial Goals", fr: "Objectifs financiers" }),
    newGoalButton: t({ en: "New Goal", fr: "Nouvel objectif" }),
    goalTarget: t({ en: (params: { amount: string } = { amount: '' }) => `Target: ${params.amount}`, fr: (params: { amount: string } = { amount: '' }) => `Objectif : ${params.amount}` }),
    goalProgress: t({ en: (params: { progress: string } = { progress: '' }) => `${params.progress}% complete`, fr: (params: { progress: string } = { progress: '' }) => `${params.progress}% atteint` }),
    goalSaved: t({ en: (params: { amount: string } = { amount: '' }) => `${params.amount} saved`, fr: (params: { amount: string } = { amount: '' }) => `${params.amount} économisé` }),
    emptyGoalsTitle: t({ en: "No financial goals yet", fr: "Aucun objectif financier pour le moment" }),
    emptyGoalsDescription: t({ en: "Set your financial goals to stay motivated and track your progress.", fr: "Définissez vos objectifs financiers pour rester motivé et suivre vos progrès." }),
    createGoalButton: t({ en: "Create Goal", fr: "Créer un objectif" }),

    // Toasts
    budgetAddedToastTitle: t({ en: "Budget added!", fr: "Budget ajouté !" }),
    budgetAddedToastDescription: t({ en: "Your budget has been created successfully.", fr: "Votre budget a été créé avec succès." }),
    budgetUpdatedToastTitle: t({ en: "Budget updated!", fr: "Budget mis à jour !" }),
    budgetUpdatedToastDescription: t({ en: "Your budget has been updated successfully.", fr: "Votre budget a été mis à jour avec succès." }),
    budgetDeletedToastTitle: t({ en: "Budget deleted!", fr: "Budget supprimé !" }),
    budgetDeletedToastDescription: t({ en: "Your budget has been deleted successfully.", fr: "Votre budget a été supprimé avec succès." }),
    goalAddedToastTitle: t({ en: "Goal added!", fr: "Objectif ajouté !" }),
    goalAddedToastDescription: t({ en: "Your financial goal has been created successfully.", fr: "Votre objectif financier a été créé avec succès." }),
    errorToastTitle: t({ en: "Error", fr: "Erreur" }),
    addBudgetFailed: t({ en: "Failed to add budget. Please try again.", fr: "Échec de l'ajout du budget. Veuillez réessayer." }),
    updateBudgetFailed: t({ en: "Failed to update budget. Please try again.", fr: "Échec de la mise à jour du budget. Veuillez réessayer." }),
    deleteBudgetFailed: t({ en: "Failed to delete budget. Please try again.", fr: "Échec de la suppression du budget. Veuillez réessayer." }),
    addGoalFailed: t({ en: "Failed to add goal. Please try again.", fr: "Échec de l'ajout de l'objectif. Veuillez réessayer." }),

    // Enhanced Budget Metrics
    dailyRate: t({ en: "Daily Rate", fr: "Taux journalier" }),
    timeLeft: t({ en: "Time Left", fr: "Temps restant" }),
    vsLastPeriod: t({ en: "vs Last Period", fr: "vs Période précédente" }),
    riskDate: t({ en: "Risk Date", fr: "Date de risque" }),
    perDay: t({ en: "day", fr: "jour" }),
    days: t({ en: "days", fr: "jours" }),
  },
};

export default budgetsPageContent;
