
import { t, type DeclarationContent } from "intlayer";

const transactionsPageContent: DeclarationContent = {
  key: "transactions-page",
  content: {
    // Page Header
    title: t({ en: "Transactions", fr: "Transactions" }),
    description: t({ en: "View and manage all your transactions.", fr: "Affichez et gérez toutes vos transactions." }),
    addTransactionButton: t({ en: "Add Transaction", fr: "Ajouter une transaction" }),
    exportDataButton: t({ en: "Export Data", fr: "Exporter les données" }),
    exportAsCSV: t({ en: "Export as CSV", fr: "Exporter en CSV" }),
    exportAsExcel: t({ en: "Export as Excel", fr: "Exporter en Excel" }),
    exportAsPDF: t({ en: "Export as PDF", fr: "Exporter en PDF" }),

    // Loading State
    loadingDescription: t({ en: "Loading your transactions...", fr: "Chargement de vos transactions..." }),

    // Empty State
    emptyTitle: t({ en: "No transactions yet", fr: "Aucune transaction pour le moment" }),
    emptyDescription: t({ en: "Start tracking your finances by adding your first transaction.", fr: "Commencez à suivre vos finances en ajoutant votre première transaction." }),

    // Filters
    searchPlaceholder: t({ en: "Search transactions...", fr: "Rechercher des transactions..." }),
    categoryFilterPlaceholder: t({ en: "Category", fr: "Catégorie" }),
    allCategories: t({ en: "All Categories", fr: "Toutes les catégories" }),
    dateRange: t({ en: "Date Range", fr: "Plage de dates" }),

    // Empty Filtered State
    emptyFilteredTitle: t({ en: "No transactions found", fr: "Aucune transaction trouvée" }),
    emptyFilteredDescription: t({ en: "Try adjusting your search or filter criteria.", fr: "Essayez d'ajuster vos critères de recherche ou de filtrage." }),

    // Delete Dialog
    deleteDialogTitle: t({ en: "Delete Transaction", fr: "Supprimer la transaction" }),
    deleteDialogDescription: t({ en: "Are you sure you want to delete this transaction? This action cannot be undone.", fr: "Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible." }),
    cancelButton: t({ en: "Cancel", fr: "Annuler" }),
    deleteButton: t({ en: "Delete", fr: "Supprimer" }),

    // Toasts
    transactionAddedToastTitle: t({ en: "Transaction added!", fr: "Transaction ajoutée !" }),
    transactionAddedToastDescription: t({ en: "Your transaction has been recorded successfully.", fr: "Votre transaction a été enregistrée avec succès." }),
    transactionUpdatedToastTitle: t({ en: "Transaction updated!", fr: "Transaction mise à jour !" }),
    transactionUpdatedToastDescription: t({ en: "Your transaction has been updated successfully.", fr: "Votre transaction a été mise à jour avec succès." }),
    transactionDeletedToastTitle: t({ en: "Transaction deleted!", fr: "Transaction supprimée !" }),
    transactionDeletedToastDescription: t({ en: "Your transaction has been deleted successfully.", fr: "Votre transaction a été supprimée avec succès." }),
    exportSuccessToastTitle: t({ en: "Export successful!", fr: "Exportation réussie !" }),
    exportCSVSuccess: t({ en: "Your transactions have been exported to CSV.", fr: "Vos transactions ont été exportées en CSV." }),
    exportXLSXSuccess: t({ en: "Your transactions have been exported to Excel.", fr: "Vos transactions ont été exportées en Excel." }),
    exportPDFSuccess: t({ en: "Your transactions have been exported to PDF.", fr: "Vos transactions ont été exportées en PDF." }),
    exportFailedToastTitle: t({ en: "Export failed", fr: "Échec de l'exportation" }),
    exportFailedToastDescription: t({ en: "Failed to export transactions. Please try again.", fr: "Échec de l'exportation des transactions. Veuillez réessayer." }),
    errorToastTitle: t({ en: "Error", fr: "Erreur" }),
    addTransactionFailed: t({ en: "Failed to add transaction. Please try again.", fr: "Échec de l'ajout de la transaction. Veuillez réessayer." }),
    updateTransactionFailed: t({ en: "Failed to update transaction. Please try again.", fr: "Échec de la mise à jour de la transaction. Veuillez réessayer." }),
    deleteTransactionFailed: t({ en: "Failed to delete transaction. Please try again.", fr: "Échec de la suppression de la transaction. Veuillez réessayer." }),
  },
};

export default transactionsPageContent;
