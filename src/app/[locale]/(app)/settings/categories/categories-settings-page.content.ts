import { t, type DeclarationContent } from "intlayer";

const categoriesSettingsPageContent: DeclarationContent = {
  key: "categories-settings-page",
  content: {
    // Page Header
    title: t({ en: "Categories", fr: "Catégories" }),
    description: t({ en: "Manage your income and expense categories for better organization.", fr: "Gérez vos catégories de revenus et de dépenses pour une meilleure organisation." }),
    addCategoryButton: t({ en: "Add Category", fr: "Ajouter une catégorie" }),

    // Loading State
    loadingDescription: t({ en: "Loading your categories...", fr: "Chargement de vos catégories..." }),

    // Empty State
    emptyTitle: t({ en: "No categories yet", fr: "Aucune catégorie pour le moment" }),
    emptyDescription: t({ en: "Create categories to organize your income and expenses for better financial tracking.", fr: "Créez des catégories pour organiser vos revenus et dépenses pour un meilleur suivi financier." }),
    addFirstCategoryButton: t({ en: "Create Your First Category", fr: "Créez votre première catégorie" }),

    // Category Grouping - Static strings (handle dynamic parts in component)
    incomeCategories: t({ en: "Income Categories", fr: "Catégories de revenus" }),
    expenseCategories: t({ en: "Expense Categories", fr: "Catégories de dépenses" }),
    category: t({ en: "category", fr: "catégorie" }),
    categories: t({ en: "categories", fr: "catégories" }),
    noIncomeCategories: t({ en: "No income categories", fr: "Aucune catégorie de revenus" }),
    noExpenseCategories: t({ en: "No expense categories", fr: "Aucune catégorie de dépenses" }),
    addFirstIncomeCategory: t({ en: "Add your first income category to get started.", fr: "Ajoutez votre première catégorie de revenus pour commencer." }),
    addFirstExpenseCategory: t({ en: "Add your first expense category to get started.", fr: "Ajoutez votre première catégorie de dépenses pour commencer." }),

    // Delete Dialog
    deleteDialogTitle: t({ en: "Delete Category", fr: "Supprimer la catégorie" }),
    deleteConfirmation: t({ en: "Are you sure you want to delete", fr: "Êtes-vous sûr de vouloir supprimer" }),
    deleteWarning: t({ en: "? This action cannot be undone.", fr: " ? Cette action est irréversible." }),
    cancelButton: t({ en: "Cancel", fr: "Annuler" }),
    deleteButton: t({ en: "Delete", fr: "Supprimer" }),

    // Toasts
    categoryAddedToastTitle: t({ en: "Category added!", fr: "Catégorie ajoutée !" }),
    categoryAddedToastDescription: t({ en: "Your category has been created successfully.", fr: "Votre catégorie a été créée avec succès." }),
    categoryUpdatedToastTitle: t({ en: "Category updated!", fr: "Catégorie mise à jour !" }),
    categoryUpdatedToastDescription: t({ en: "Your category has been updated successfully.", fr: "Votre catégorie a été mise à jour avec succès." }),
    categoryDeletedToastTitle: t({ en: "Category deleted!", fr: "Catégorie supprimée !" }),
    categoryDeletedToastDescription: t({ en: "Your category has been deleted successfully.", fr: "Votre catégorie a été supprimée avec succès." }),
    errorToastTitle: t({ en: "Error", fr: "Erreur" }),
    addCategoryFailed: t({ en: "Failed to add category. Please try again.", fr: "Échec de l'ajout de la catégorie. Veuillez réessayer." }),
    updateCategoryFailed: t({ en: "Failed to update category. Please try again.", fr: "Échec de la mise à jour de la catégorie. Veuillez réessayer." }),
    deleteCategoryFailed: t({ en: "Failed to delete category. Please try again.", fr: "Échec de la suppression de la catégorie. Veuillez réessayer." }),
  },
};

export default categoriesSettingsPageContent;