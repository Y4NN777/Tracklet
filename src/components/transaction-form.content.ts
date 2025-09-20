import { t, type DeclarationContent } from "intlayer";

const transactionFormContent: DeclarationContent = {
  key: "transaction-form",
  content: {
    // Zod Schema
    descriptionMinLength: t({ en: "Description must be at least 5 characters.", fr: "La description doit comporter au moins 5 caractères." }),
    amountGreaterThanZero: t({ en: "Amount must be greater than 0.", fr: "Le montant doit être supérieur à 0." }),
    typeRequired: t({ en: "Please select a transaction type.", fr: "Veuillez sélectionner un type de transaction." }),
    accountRequired: t({ en: "Account must be selected.", fr: "Un compte doit être sélectionné." }),

    // Dialog
    editTransaction: t({ en: "Edit Transaction", fr: "Modifier la transaction" }),
    addTransaction: t({ en: "Add Transaction", fr: "Ajouter une transaction" }),
    updateTransactionInfo: t({ en: "Update your transaction information.", fr: "Mettez à jour les informations de votre transaction." }),
    addTransactionToTrack: t({ en: "Add a new transaction to track your finances.", fr: "Ajoutez une nouvelle transaction pour suivre vos finances." }),

    // Form Fields
    description: t({ en: "Description", fr: "Description" }),
    amount: t({ en: "Amount", fr: "Montant" }),
    transactionType: t({ en: "Transaction Type", fr: "Type de transaction" }),
    selectTransactionType: t({ en: "Select transaction type", fr: "Sélectionnez le type de transaction" }),
    income: t({ en: "Income", fr: "Revenu" }),
    expense: t({ en: "Expense", fr: "Dépense" }),
    transfer: t({ en: "Transfer", fr: "Transfert" }),
    chooseTransactionType: t({ en: "Choose whether this is income, expense, or transfer.", fr: "Choisissez s'il s'agit d'un revenu, d'une dépense ou d'un transfert." }),
    categoryOptional: t({ en: "Category (optional)", fr: "Catégorie (facultatif)" }),
    selectCategory: t({ en: "Select a category", fr: "Sélectionnez une catégorie" }),
    chooseCategory: t({ en: "Choose the category for this transaction (optional).", fr: "Choisissez la catégorie pour cette transaction (facultatif)." }),
    account: t({ en: "Account", fr: "Compte" }),
    selectAccount: t({ en: "Select an account", fr: "Sélectionnez un compte" }),
    chooseAccount: t({ en: "Choose the account for this transaction.", fr: "Choisissez le compte pour cette transaction." }),
    date: t({ en: "Date", fr: "Date" }),
    pickDate: t({ en: "Pick a date", fr: "Choisissez une date" }),
    currency: t({ en: "Currency", fr: "Devise" }),
    currencyDescription: t({ en: "Currency is set based on your preferences and cannot be changed here.", fr: "La devise est définie en fonction de vos préférences et ne peut pas être modifiée ici." }),

    // Buttons
    updateTransaction: t({ en: "Update Transaction", fr: "Mettre à jour la transaction" }),
    addTransactionButton: t({ en: "Add Transaction", fr: "Ajouter une transaction" }),
  },
};

export default transactionFormContent;
