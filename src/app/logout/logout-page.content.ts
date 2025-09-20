
import { t, type DeclarationContent } from "intlayer";

const logoutPageContent: DeclarationContent = {
  key: "logout-page",
  content: {
    // Logging Out State
    loggingOutTitle: t({ en: "Logging out...", fr: "Déconnexion en cours..." }),
    loggingOutDescription: t({ en: "Please wait while we securely log you out of your account.", fr: "Veuillez patienter pendant que nous vous déconnectons de votre compte en toute sécurité." }),
    clearingSession: t({ en: "Clearing your session and redirecting...", fr: "Suppression de votre session et redirection en cours..." }),

    // Error State
    errorTitle: t({ en: "Logout Error", fr: "Erreur de déconnexion" }),
    tryAgainButton: t({ en: "Try Again", fr: "Réessayer" }),
    returnToLoginButton: t({ en: "Return to Login", fr: "Retour à la connexion" }),

    // Success State (though usually redirects before showing this)
    successTitle: t({ en: "Logged Out Successfully", fr: "Déconnexion réussie" }),
    successDescription: t({ en: "You have been securely logged out of your account.", fr: "Vous avez été déconnecté de votre compte en toute sécurité." }),

    // Error Messages
    logoutFailed: t({ en: "Failed to log out. Please try again.", fr: "Échec de la déconnexion. Veuillez réessayer." }),
    unexpectedError: t({ en: "An unexpected error occurred. Please try again.", fr: "Une erreur inattendue est survenue. Veuillez réessayer." }),
  },
};

export default logoutPageContent;
