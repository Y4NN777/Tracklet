import { t, type DeclarationContent } from "intlayer";

const accountFormContent: DeclarationContent = {
  key: "account-form",
  content: {
    // Validation Messages
    nameMinLength: t({
      en: "Account name must be at least 2 characters.",
      fr: "Le nom du compte doit contenir au moins 2 caractères.",
    }),
    typeRequired: t({
      en: "Please select an account type.",
      fr: "Veuillez sélectionner un type de compte.",
    }),
    balanceRequired: t({
      en: "Balance is required.",
      fr: "Le solde est requis.",
    }),
    currencyRequired: t({
      en: "Currency must be selected.",
      fr: "La devise doit être sélectionnée.",
    }),

    // Toast Messages
    accountAddedTitle: t({ en: "Account added.", fr: "Compte ajouté." }),
    accountAddedDescription: t({ en: "Your account has been added successfully.", fr: "Votre compte a été ajouté avec succès." }),
    errorTitle: t({ en: "Error", fr: "Erreur" }),
    failedToCreateAccount: t({ en: "Failed to create account. Please try again.", fr: "Échec de la création du compte. Veuillez réessayer." }),

    // Dialog/Form Labels and Descriptions
    editAccountTitle: t({ en: "Edit Account", fr: "Modifier le Compte" }),
    addAccountTitle: t({ en: "Add Account", fr: "Ajouter un Compte" }),
    updateAccountDescription: t({ en: "Update your account information.", fr: "Mettez à jour les informations de votre compte." }),
    addAccountDescription: t({ en: "Add a new financial account to track your money.", fr: "Ajoutez un nouveau compte financier pour suivre votre argent." }),
    accountNameLabel: t({ en: "Account Name", fr: "Nom du Compte" }),
    accountNamePlaceholder: t({ en: "e.g., Main Checking, Emergency Savings", fr: "ex: Compte Courant Principal, Épargne d'Urgence" }),
    accountNameDescription: t({ en: "Give your account a descriptive name.", fr: "Donnez un nom descriptif à votre compte." }),
    accountTypeLabel: t({ en: "Account Type", fr: "Type de Compte" }),
    selectAccountTypeOption: t({ en: "Select account type", fr: "Sélectionner le type de compte" }),
    checkingAccountOption: t({ en: "Checking - Primary spending account", fr: "Chèque - Compte de dépenses principal" }),
    savingsAccountOption: t({ en: "Savings - High-interest savings", fr: "Épargne - Épargne à intérêt élevé" }),
    creditCardOption: t({ en: "Credit Card - Credit accounts", fr: "Carte de Crédit - Comptes de crédit" }),
    investmentAccountOption: t({ en: "Investment - Retirement, stocks, etc.", fr: "Investissement - Retraite, actions, etc." }),
    accountTypeDescription: t({ en: "What type of financial account is this?", fr: "Quel type de compte financier est-ce ?" }),
    currentBalanceLabel: t({ en: "Current Balance", fr: "Solde Actuel" }),
    currentBalanceDescription: t({ en: "Your current account balance. Use negative values for debt.", fr: "Votre solde de compte actuel. Utilisez des valeurs négatives pour les dettes." }),
    currencyLabel: t({ en: "Currency", fr: "Devise" }),
    currencyDescription: t({ en: "Currency is set based on your preferences and cannot be changed here.", fr: "La devise est définie en fonction de vos préférences et ne peut pas être modifiée ici." }),
    updateAccountButton: t({ en: "Update Account", fr: "Mettre à jour le Compte" }),
    addAccountButton: t({ en: "Add Account", fr: "Ajouter un Compte" }),
    isSavingsAccountLabel: t({ en: "Is this a savings account?", fr: "S'agit-il d'un compte d'épargne ?" }),
    isSavingsAccountDescription: t({ en: "Mark this account as a savings account to include it in your total savings.", fr: "Marquez ce compte comme un compte d'épargne pour l'inclure dans votre épargne totale." }),

    // Manual Balance Override
    useManualOverrideLabel: t({
      en: "Set manual balance override",
      fr: "Définir une substitution de solde manuel"
    }),
    manualBalanceLabel: t({
      en: "Manual Balance",
      fr: "Solde Manuel"
    }),
    manualBalancePlaceholder: t({
      en: "Enter manual balance",
      fr: "Entrez le solde manuel"
    }),
    manualBalanceNoteLabel: t({
      en: "Reason for manual adjustment (optional)",
      fr: "Raison de l'ajustement manuel (optionnel)"
    }),
    manualBalanceNotePlaceholder: t({
      en: "e.g., Bank Or personal account reconciliation, opening balance adjustment",
      fr: "ex: Réconciliation bancaire ou de compte personnel, ajustement du solde d'ouverture"
    }),
    manualBalanceRequired: t({
      en: "Manual balance is required when override is active",
      fr: "Le solde manuel est requis lorsque la substitution est active"
    }),
    useManualOverrideDescription: t({
      en: "Override the automatically calculated balance with a custom value. Useful for personal reconciliation or opening balance adjustments.",
      fr: "Remplacez le solde calculé automatiquement par une valeur personnalisée. Utile pour la réconciliation personnelle ou les ajustements du solde d'ouverture."
    }),
    manualBalanceDescription: t({
      en: "Set a custom balance that will override the calculated value from your transactions.",
      fr: "Définissez un solde personnalisé qui remplacera la valeur calculée à partir de vos transactions."
    }),
    manualBalanceNoteDescription: t({
      en: "Optional note explaining why this manual balance was set (e.g., personal or particular reason).",
      fr: "Note optionnelle expliquant pourquoi ce solde manuel a été défini (ex: raison personnelle ou particulière)."
    }),
  },
};

export default accountFormContent;