
import { t, type DeclarationContent } from "intlayer";

const accountsPageContent: DeclarationContent = {
  key: "accounts-page",
  content: {
    // Page Header
    title: t({ en: "Accounts", fr: "Comptes" }),
    description: t({ en: "Manage your financial accounts and track your net worth.", fr: "Gérez vos comptes financiers et suivez votre valeur nette." }),
    addAccountButton: t({ en: "Add Account", fr: "Ajouter un compte" }),

    // Loading State
    loadingDescription: t({ en: "Loading your accounts...", fr: "Chargement de vos comptes..." }),

    // Empty State
    emptyTitle: t({ en: "No accounts yet", fr: "Aucun compte pour le moment" }),
    emptyDescription: t({ en: "Start tracking your finances by adding your bank accounts, credit cards, and investment accounts.", fr: "Commencez à suivre vos finances en ajoutant vos comptes bancaires, cartes de crédit et comptes d'investissement." }),
    addFirstAccountButton: t({ en: "Add Your First Account", fr: "Ajoutez votre premier compte" }),

    // Net Worth Card
    netWorthTitle: t({ en: "Net Worth", fr: "Valeur nette" }),
    netWorthDescription: t({ en: "Your total financial position", fr: "Votre situation financière totale" }),

    // Account Grouping
    accountsTitle: t({ en: (params: { type: string } = { type: '' }) => `${params.type} Accounts`, fr: (params: { type: string } = { type: '' }) => `Comptes ${params.type}` }),
    accountCount: t({ en: (params: { count: number } = { count: 0 }) => `(${params.count} account${params.count !== 1 ? 's' : ''})`, fr: (params: { count: number } = { count: 0 }) => `(${params.count} compte${params.count !== 1 ? 's' : ''})` }),
    total: t({ en: (params: { type: string } = { type: '' }) => `Total ${params.type}`, fr: (params: { type: string } = { type: '' }) => `Total ${params.type}` }),

    // Delete Dialog
    deleteDialogTitle: t({ en: "Delete Account", fr: "Supprimer le compte" }),
    deleteDialogDescription: t({ en: (params: { name: string } = { name: '' }) => `Are you sure you want to delete "${params.name}"? This action cannot be undone and will affect all associated transactions.`, fr: (params: { name:string } = { name: '' }) => `Êtes-vous sûr de vouloir supprimer "${params.name}" ? Cette action est irréversible et affectera toutes les transactions associées.` }),
    cancelButton: t({ en: "Cancel", fr: "Annuler" }),
    deleteButton: t({ en: "Delete", fr: "Supprimer" }),

    // Toasts
    accountAddedToastTitle: t({ en: "Account added!", fr: "Compte ajouté !" }),
    accountAddedToastDescription: t({ en: "Your account has been created successfully.", fr: "Votre compte a été créé avec succès." }),
    accountUpdatedToastTitle: t({ en: "Account updated!", fr: "Compte mis à jour !" }),
    accountUpdatedToastDescription: t({ en: "Your account has been updated successfully.", fr: "Votre compte a été mis à jour avec succès." }),
    accountDeletedToastTitle: t({ en: "Account deleted!", fr: "Compte supprimé !" }),
    accountDeletedToastDescription: t({ en: "Your account has been deleted successfully.", fr: "Votre compte a été supprimé avec succès." }),
    errorToastTitle: t({ en: "Error", fr: "Erreur" }),
    addAccountFailed: t({ en: "Failed to add account. Please try again.", fr: "Échec de l'ajout du compte. Veuillez réessayer." }),
    updateAccountFailed: t({ en: "Failed to update account. Please try again.", fr: "Échec de la mise à jour du compte. Veuillez réessayer." }),
    deleteAccountFailed: t({ en: "Failed to delete account. Please try again.", fr: "Échec de la suppression du compte. Veuillez réessayer." }),
  },
};

export default accountsPageContent;
