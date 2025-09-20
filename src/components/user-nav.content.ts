import { t, type DeclarationContent } from "intlayer";

const userNavContent: DeclarationContent = {
  key: "user-nav",
  content: {
    userFallback: t({
      en: "User",
      fr: "Utilisateur",
    }),
    userEmailFallback: t({
      en: "user@example.com",
      fr: "utilisateur@exemple.com",
    }),
    loading: t({
      en: "...",
      fr: "...",
    }),
    errorTitle: t({
      en: "Error",
      fr: "Erreur",
    }),
    logoutError: t({
      en: "Failed to log out. Please try again.",
      fr: "Échec de la déconnexion. Veuillez réessayer.",
    }),
    loggedOutTitle: t({
      en: "Logged out",
      fr: "Déconnecté",
    }),
    loggedOutDescription: t({
      en: "You have been successfully logged out.",
      fr: "Vous avez été déconnecté avec succès.",
    }),
    unexpectedLogoutError: t({
      en: "An unexpected error occurred during logout.",
      fr: "Une erreur inattendue est survenue lors de la déconnexion.",
    }),
    profile: t({
      en: "Profile",
      fr: "Profil",
    }),
    billing: t({
      en: "Billing",
      fr: "Facturation",
    }),
    settings: t({
      en: "Settings",
      fr: "Paramètres",
    }),
    logout: t({
      en: "Log out",
      fr: "Se déconnecter",
    }),
  },
};

export default userNavContent;
