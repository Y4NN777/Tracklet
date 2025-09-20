
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

    // Category Grouping
    categoriesTitle: t({ en: (params: { type: string }) => `${params.type} Categories`, fr: (params: { type: string }) => `Catégories de ${params.type}` }),
    categoryCount: t({ en: (params: { count: number }) => `(${params.count} categor${params.count !== 1 ? 'ies' : 'y'})`, fr: (params: { count: number }) => `(${params.count} catégorie${params.count !== 1 ? 's' : ''})` }),
    emptyGroupTitle: t({ en: (params: { type: string }) => `No ${params.type} categories`, fr: (params: { type: string }) => `Aucune catégorie de ${params.type}` }),
    emptyGroupDescription: t({ en: (params: { type: string }) => `Add your first ${params.type} category to get started.`, fr: (params: { type: string }) => `Ajoutez votre première catégorie de ${params.type} pour commencer.` }),

    // Delete Dialog
    deleteDialogTitle: t({ en: "Delete Category", fr: "Supprimer la catégorie" }),
    deleteDialogDescription: t({ en: (params: { name: string }) => `Are you sure you want to delete "${params.name}"? This action cannot be undone.`, fr: (params: { name: string }) => `Êtes-vous sûr de vouloir supprimer "${params.name}" ? Cette action est irréversible.` }),
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
