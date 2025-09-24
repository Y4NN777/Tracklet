import { t, type DeclarationContent } from "intlayer";

const notificationBellContent: DeclarationContent = {
  key: "notification-bell",
  content: {
    notifications: t({ en: "Notifications", fr: "Notifications" }),
    markAllAsRead: t({ en: "Mark all as read", fr: "Marquer tout comme lu" }),
    noNotifications: t({ en: "No notifications", fr: "Aucune notification" }),

    // Dynamic notification messages for transaction and budget alerts.
    largeTransactionAlertTitle: t({ en: "Large Transaction Alert", fr: "Alerte de transaction importante" }),
    largeTransactionAlertMessage: t({
      en: (params: { amount: string; description: string } = { amount: '', description: '' }) => `You made a ${params.amount} expense for "${params.description}"`,
      fr: (params: { amount: string; description: string } = { amount: '', description: '' }) => `Vous avez effectué une dépense de ${params.amount} pour "${params.description}"`,
    }),

    unusualSpendingAlertTitle: t({ en: "Unusual Spending Detected", fr: "Dépense inhabituelle détectée" }),
    unusualSpendingAlertMessage: t({
      en: (params: { amount: string; category: string } = { amount: '', category: '' }) => `Unusual expense of ${params.amount} in ${params.category}`,
      fr: (params: { amount: string; category: string } = { amount: '', category: '' }) => `Dépense inhabituelle de ${params.amount} dans ${params.category}`,
    }),

    budgetAlertTitle: t({ en: "Budget Alert", fr: "Alerte budgétaire" }),
    budgetAlertMessage: t({
      en: (params: { spent: string; budgetName: string; percentage: string } = { spent: '', budgetName: '', percentage: '' }) => `You have spent ${params.spent} (${params.percentage}%) of your ${params.budgetName} budget`,
      fr: (params: { spent: string; budgetName: string; percentage: string } = { spent: '', budgetName: '', percentage: '' }) => `Vous avez dépensé ${params.spent} (${params.percentage}%) de votre budget ${params.budgetName}`,
    }),
  },
};

export default notificationBellContent;
