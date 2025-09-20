import { t, type DeclarationContent } from "intlayer";

const notificationBellContent: DeclarationContent = {
  key: "notification-bell",
  content: {
    notifications: t({ en: "Notifications", fr: "Notifications" }),
    markAllAsRead: t({ en: "Mark all as read", fr: "Marquer tout comme lu" }),
    noNotifications: t({ en: "No notifications", fr: "Aucune notification" }),
  },
};

export default notificationBellContent;
