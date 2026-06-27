import { t, type DeclarationContent } from "intlayer";

const settingsPageContent: DeclarationContent = {
  key: "settings-page",
  content: {
    // Titles
    settingsTitle: t({ en: "Settings", fr: "Paramètres" }),
    settingsDescription: t({ en: "Manage your account settings and preferences.", fr: "Gérez les paramètres et les préférences de votre compte." }),
    profileTitle: t({ en: "Profile", fr: "Profil" }),
    categories: t({ en: "Categories", fr: "Catégories" }),

    // Toasts
    settingsSaved: t({ en: "Settings saved", fr: "Paramètres enregistrés" }),
    preferencesUpdated: t({ en: "Your preferences have been updated.", fr: "Vos préférences ont été mises à jour." }),
    error: t({ en: "Error", fr: "Erreur" }),
    failedToSave: t({ en: "Failed to save your preferences.", fr: "Échec de l'enregistrement de vos préférences." }),

    // General
    saving: t({ en: "Saving...", fr: "Enregistrement..." }),

    // Appearance Section
    appearanceTitle: t({ en: "Appearance", fr: "Apparence" }),
    appearanceDescription: t({ en: "Customize the look and feel of the app.", fr: "Personnalisez l'apparence de l'application." }),
    themeTitle: t({ en: "Theme", fr: "Thème" }),
    themeDescription: t({ en: "Select your preferred color scheme.", fr: "Sélectionnez votre palette de couleurs préférée." }),
    lightTheme: t({ en: "Light", fr: "Clair" }),
    darkTheme: t({ en: "Dark", fr: "Sombre" }),
    systemTheme: t({ en: "System", fr: "Système" }),

    // Preferences Section
    preferencesTitle: t({ en: "Preferences", fr: "Préférences" }),
    preferencesDescription: t({ en: "Configure your account settings and preferences.", fr: "Configurez les paramètres et les préférences de votre compte." }),

    // Notifications Section
    notificationsTitle: t({ en: "Notifications", fr: "Notifications" }),
    notificationsDescription: t({ en: "Manage how you receive alerts and updates.", fr: "Gérez la manière dont vous recevez les alertes et les mises à jour." }),

    // Budget Alerts Card
    budgetAlertsTitle: t({ en: "Budget Alerts", fr: "Alertes de budget" }),
    budgetAlertsDescription: t({ en: "Get notified when you're approaching or exceeding budget limits.", fr: "Soyez averti lorsque vous approchez ou dépassez les limites de votre budget." }),
    enableBudgetAlertsLabel: t({ en: "Enable Budget Alerts", fr: "Activer les alertes de budget" }),
    enableBudgetAlertsDescription: t({ en: "Receive notifications about budget spending.", fr: "Recevez des notifications sur les dépenses budgétaires." }),
    alertThresholdsLabel: t({ en: "Alert Thresholds (%)", fr: "Seuils d'alerte (%)" }),
    alertThresholdsDescription: t({ en: "Get notified at these spending percentages.", fr: "Soyez averti à ces pourcentages de dépenses." }),

    // Transaction Alerts Card
    transactionAlertsTitle: t({ en: "Transaction Alerts", fr: "Alertes de transaction" }),
    transactionAlertsDescription: t({ en: "Get notified about significant or unusual transactions.", fr: "Soyez averti des transactions importantes ou inhabituelles." }),
    enableTransactionAlertsLabel: t({ en: "Enable Transaction Alerts", fr: "Activer les alertes de transaction" }),
    enableTransactionAlertsDescription: t({ en: "Receive notifications about transactions.", fr: "Recevez des notifications sur les transactions." }),
    minAmountLabel: t({ en: "Minimum Alert Amount", fr: "Montant minimum de l'alerte" }),
    minAmountDescription: t({ en: "Get notified for transactions above this amount.", fr: "Soyez averti pour les transactions dépassant ce montant." }),
  },
};

export default settingsPageContent;
