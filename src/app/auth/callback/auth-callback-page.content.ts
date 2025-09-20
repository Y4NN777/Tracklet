
import { t, type DeclarationContent } from "intlayer";

const authCallbackPageContent: DeclarationContent = {
  key: "auth-callback-page",
  content: {
    // Loading State
    loadingTitle: t({ en: "Completing Sign In", fr: "Finalisation de la connexion" }),
    loadingDescription: t({ en: "Please wait while we set up your account...", fr: "Veuillez patienter pendant que nous configurons votre compte..." }),

    // Error State
    errorTitle: t({ en: "Authentication Error", fr: "Erreur d'authentification" }),
    tryAgainButton: t({ en: "Try Again", fr: "Réessayer" }),

    // Error Messages
    authenticationFailed: t({ en: "Authentication failed. Please try again.", fr: "L'authentification a échoué. Veuillez réessayer." }),
    profileCreationFailed: t({ en: "Failed to create user profile:", fr: "Échec de la création du profil utilisateur :" }),
    unknownError: t({ en: "Unknown error", fr: "Erreur inconnue" }),
    profileLoadError: t({ en: "Error loading user profile. Please try again.", fr: "Erreur lors du chargement du profil utilisateur. Veuillez réessayer." }),
    noSessionError: t({ en: "No session found. Please try logging in again.", fr: "Aucune session trouvée. Veuillez vous reconnecter." }),
    unexpectedError: t({ en: "An unexpected error occurred. Please try again.", fr: "Une erreur inattendue est survenue. Veuillez réessayer." }),
  },
};

export default authCallbackPageContent;
