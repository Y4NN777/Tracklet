import { t, type DeclarationContent } from "intlayer";

const goalFormContent: DeclarationContent = {
  key: "goal-form",
  content: {
    // Zod Schema
    nameMinLength: t({ en: "Name must be at least 2 characters.", fr: "Le nom doit comporter au moins 2 caractères." }),
    targetAmountGreaterThanZero: t({ en: "Target amount must be greater than 0.", fr: "Le montant cible doit être supérieur à 0." }),
    currentAmountMin: t({ en: "Current amount must be 0 or greater.", fr: "Le montant actuel doit être de 0 ou plus." }),

    // Toast Messages
    goalAdded: t({ en: "Goal added.", fr: "Objectif ajouté." }),
    goalAddedSuccess: t({ en: "Your goal has been added successfully.", fr: "Votre objectif a été ajouté avec succès." }),

    // Dialog
    addGoal: t({ en: "Add Goal", fr: "Ajouter un objectif" }),
    addGoalDescription: t({ en: "Add a new financial goal to track your progress.", fr: "Ajoutez un nouvel objectif financier pour suivre vos progrès." }),

    // Form Fields
    name: t({ en: "Name", fr: "Nom" }),
    targetAmount: t({ en: "Target Amount", fr: "Montant cible" }),
    currentAmount: t({ en: "Current Amount", fr: "Montant actuel" }),
    currency: t({ en: "Currency", fr: "Devise" }),
    currencyDescription: t({ en: "Currency is set based on your preferences and cannot be changed here.", fr: "La devise est définie en fonction de vos préférences et ne peut pas être modifiée ici." }),

    // Buttons
    addGoalButton: t({ en: "Add Goal", fr: "Ajouter l'objectif" }),
  },
};

export default goalFormContent;
