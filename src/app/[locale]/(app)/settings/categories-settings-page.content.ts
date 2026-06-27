import { t, type DeclarationContent } from "intlayer";

const categoriesSettingsPageContent: DeclarationContent = {
  key: "categories-settings-page",
  content: {
    title: t({ en: "Category Management", fr: "Gestion des catégories" }),
    description: t({ en: "Organize your income and expenses with custom categories.", fr: "Organisez vos revenus et vos dépenses avec des catégories personnalisées." }),
    addCategoryButton: t({ en: "Add Category", fr: "Ajouter une catégorie" }),
    incomeCategories: t({ en: "Income Categories", fr: "Catégories de revenus" }),
    expenseCategories: t({ en: "Expense Categories", fr: "Catégories de dépenses" }),
    category: t({ en: "category", fr: "catégorie" }),
    categories: t({ en: "categories", fr: "catégories" }),
    noIncomeCategories: t({ en: "No income categories yet", fr: "Aucune catégorie de revenus pour le moment" }),
    noExpenseCategories: t({ en: "No expense categories yet", fr: "Aucune catégorie de dépenses pour le moment" }),
    addFirstIncomeCategory: t({ en: "Add your first income category to start tracking.", fr: "Ajoutez votre première catégorie de revenus pour commencer le suivi." }),
    addFirstExpenseCategory: t({ en: "Add your first expense category to start tracking.", fr: "Ajoutez votre première catégorie de dépenses pour commencer le suivi." }),
    deleteDialogTitle: t({ en: "Delete Category", fr: "Supprimer la catégorie" }),
    deleteConfirmation: t({ en: "Are you sure you want to delete", fr: "Êtes-vous sûr de vouloir supprimer" }),
    deleteWarning: t({ en: "? This action cannot be undone and will affect all associated transactions.", fr: " ? Cette action ne peut pas être annulée et affectera toutes les transactions associées." }),
    cancelButton: t({ en: "Cancel", fr: "Annuler" }),
    deleteButton: t({ en: "Delete", fr: "Supprimer" }),
    categoryAddedToastTitle: t({ en: "Category added", fr: "Catégorie ajoutée" }),
    categoryAddedToastDescription: t({ en: "The category has been successfully added.", fr: "La catégorie a été ajoutée avec succès." }),
    categoryUpdatedToastTitle: t({ en: "Category updated", fr: "Catégorie mise à jour" }),
    categoryUpdatedToastDescription: t({ en: "The category has been successfully updated.", fr: "La catégorie a été mise à jour avec succès." }),
    categoryDeletedToastTitle: t({ en: "Category deleted", fr: "Catégorie supprimée" }),
    categoryDeletedToastDescription: t({ en: "The category has been successfully deleted.", fr: "La catégorie a été supprimée avec succès." }),
    addCategoryFailed: t({ en: "Failed to add category.", fr: "Échec de l'ajout de la catégorie." }),
    updateCategoryFailed: t({ en: "Failed to update category.", fr: "Échec de la mise à jour de la catégorie." }),
    deleteCategoryFailed: t({ en: "Failed to delete category.", fr: "Échec de la suppression de la catégorie." }),
    loadingDescription: t({ en: "Loading your categories...", fr: "Chargement de vos catégories..." }),
    emptyTitle: t({ en: "Welcome to Category Management", fr: "Bienvenue dans la gestion des catégories" }),
    emptyDescription: t({ en: "Start by creating categories for your income and expenses to better organize your finances.", fr: "Commencez par créer des catégories pour vos revenus et dépenses afin de mieux organiser vos finances." }),
    addFirstCategoryButton: t({ en: "Create your first category", fr: "Créer votre première catégorie" }),
  },
};

export default categoriesSettingsPageContent;
