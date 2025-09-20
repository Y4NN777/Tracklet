
import { t, type DeclarationContent } from "intlayer";

const settingsPageContent: DeclarationContent = {
  key: "settings-page",
  content: {
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

    // Goal Reminders Card
    goalRemindersTitle: t({ en: "Goal Reminders", fr: "Rappels d'objectifs" }),
    goalRemindersDescription: t({ en: "Get reminded about your savings goals and deadlines.", fr: "Recevez des rappels concernant vos objectifs d'épargne et vos échéances." }),
    enableGoalRemindersLabel: t({ en: "Enable Goal Reminders", fr: "Activer les rappels d'objectifs" }),
    enableGoalRemindersDescription: t({ en: "Receive notifications about savings goals.", fr: "Recevez des notifications sur les objectifs d'épargne." }),
    reminderFrequencyLabel: t({ en: "Reminder Frequency", fr: "Fréquence des rappels" }),
    dailyOption: t({ en: "Daily", fr: "Quotidien" }),
    weeklyOption: t({ en: "Weekly", fr: "Hebdomadaire" }),
    monthlyOption: t({ en: "Monthly", fr: "Mensuel" }),
    daysBeforeDeadlineLabel: t({ en: "Days Before Deadline", fr: "Jours avant l'échéance" }),

    // Transaction Alerts Card
    transactionAlertsTitle: t({ en: "Transaction Alerts", fr: "Alertes de transaction" }),
    transactionAlertsDescription: t({ en: "Get notified about significant or unusual transactions.", fr: "Soyez averti des transactions importantes ou inhabituelles." }),
    enableTransactionAlertsLabel: t({ en: "Enable Transaction Alerts", fr: "Activer les alertes de transaction" }),
    enableTransactionAlertsDescription: t({ en: "Receive notifications about transactions.", fr: "Recevez des notifications sur les transactions." }),
    minAmountLabel: t({ en: "Minimum Alert Amount", fr: "Montant minimum de l'alerte" }),
    minAmountDescription: t({ en: "Get notified for transactions above this amount.", fr: "Soyez averti pour les transactions dépassant ce montant." }),
    detectUnusualSpendingLabel: t({ en: "Detect Unusual Spending", fr: "Détecter les dépenses inhabituelles" }),
    detectUnusualSpendingDescription: t({ en: "Alert me about statistically unusual transactions.", fr: "M'alerter des transactions statistiquement inhabituelles." }),

    // Email Notifications Card
    emailNotificationsTitle: t({ en: "Email Notifications", fr: "Notifications par e-mail" }),
    emailNotificationsDescription: t({ en: "Receive notifications via email.", fr: "Recevez des notifications par e-mail." }),
    enableEmailNotificationsLabel: t({ en: "Enable Email Notifications", fr: "Activer les notifications par e-mail" }),
    emailDigestLabel: t({ en: "Email Digest Frequency", fr: "Fréquence du résumé par e-mail" }),
    immediateOption: t({ en: "Immediate", fr: "Immédiat" }),
    dailyDigestOption: t({ en: "Daily Digest", fr: "Résumé quotidien" }),
    weeklyDigestOption: t({ en: "Weekly Digest", fr: "Résumé hebdomadaire" }),
  },
};

export default settingsPageContent;
