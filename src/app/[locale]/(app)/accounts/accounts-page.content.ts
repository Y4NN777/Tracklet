
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
    accountsTitle: t({
      en: (params: { type: string } = { type: '' }) => {
        const displayNames: Record<string, string> = {
          bank_account: "Bank Account",
          savings: "Savings",
          credit: "Credit Card",
          investment: "Investment",
          mobile_money: "Mobile Money",
          cash: "Cash",
          business_fund: "Business Fund",
          other: "Other"
        };
        const displayName = displayNames[params.type] || params.type;
        return `${displayName} Accounts`;
      },
      fr: (params: { type: string } = { type: '' }) => {
        const displayNames: Record<string, string> = {
          bank_account: "Compte Bancaire",
          savings: "Épargne",
          credit: "Carte de Crédit",
          investment: "Investissement",
          mobile_money: "Mobile Money",
          cash: "Espèces",
          business_fund: "Fonds Commercial",
          other: "Autre"
        };
        const displayName = displayNames[params.type] || params.type;
        return `Comptes ${displayName}`;
      }
    }),
    accountCount: t({ en: (params: { count: number } = { count: 0 }) => `(${params.count} account${params.count !== 1 ? 's' : ''})`, fr: (params: { count: number } = { count: 0 }) => `(${params.count} compte${params.count !== 1 ? 's' : ''})` }),
    total: t({
      en: (params: { type: string } = { type: '' }) => {
        const displayNames: Record<string, string> = {
          bank_account: "Bank Account",
          savings: "Savings",
          credit: "Credit Card",
          investment: "Investment",
          mobile_money: "Mobile Money",
          cash: "Cash",
          business_fund: "Business Fund",
          other: "Other"
        };
        const displayName = displayNames[params.type] || params.type;
        return `Total ${displayName}`;
      },
      fr: (params: { type: string } = { type: '' }) => {
        const displayNames: Record<string, string> = {
          bank_account: "Compte Bancaire",
          savings: "Épargne",
          credit: "Carte de Crédit",
          investment: "Investissement",
          mobile_money: "Mobile Money",
          cash: "Espèces",
          business_fund: "Fonds Commercial",
          other: "Autre"
        };
        const displayName = displayNames[params.type] || params.type;
        return `Total ${displayName}`;
      }
    }),

    // Account Type Display Names
    accountTypeDisplay: {
      bank_account: t({ en: "Bank Account", fr: "Compte Bancaire" }),
      savings: t({ en: "Savings", fr: "Épargne" }),
      credit: t({ en: "Credit Card", fr: "Carte de Crédit" }),
      investment: t({ en: "Investment", fr: "Investissement" }),
      mobile_money: t({ en: "Mobile Money", fr: "Mobile Money" }),
      cash: t({ en: "Cash", fr: "Espèces" }),
      business_fund: t({ en: "Business Fund", fr: "Fonds Commercial" }),
      other: t({ en: "Other", fr: "Autre" }),
    },

    // Manual Balance Override
    manualBadge: t({ en: "Manual", fr: "Manuel" }),
    manualOverrideCleared: t({ en: "Manual balance override cleared. Account now shows calculated balance.", fr: "Substitution manuelle du solde supprimée. Le compte affiche maintenant le solde calculé." }),
    clearManualOverrideFailed: t({ en: "Failed to clear manual balance override. Please try again.", fr: "Échec de la suppression de la substitution manuelle du solde. Veuillez réessayer." }),
    clearManualOverrideTooltip: t({ en: "Clear manual balance override", fr: "Supprimer la substitution manuelle du solde" }),

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
