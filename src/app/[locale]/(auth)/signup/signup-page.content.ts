
import { t, type DeclarationContent } from "intlayer";

const signupPageContent: DeclarationContent = {
  key: "signup-page",
  content: {
    // Card Header
    title: t({ en: "Create an account", fr: "Créer un compte" }),
    description: t({ en: "Enter your information to get started with Tracklet", fr: "Entrez vos informations pour commencer avec Tracklet" }),

    // Form Fields
    fullNameLabel: t({ en: "Full Name", fr: "Nom complet" }),
    fullNamePlaceholder: t({ en: "John Doe", fr: "John Doe" }),
    emailLabel: t({ en: "Email", fr: "Email" }),
    emailPlaceholder: t({ en: "you@example.com", fr: "vous@exemple.com" }),
    passwordLabel: t({ en: "Password", fr: "Mot de passe" }),
    passwordPlaceholder: t({ en: "••••••••", fr: "••••••••" }),
    passwordHint: t({ en: "Must be at least 8 characters long", fr: "Doit contenir au moins 8 caractères" }),
    confirmPasswordLabel: t({ en: "Confirm Password", fr: "Confirmez le mot de passe" }),
    showPasswordLabel: t({ en: "Show password", fr: "Afficher le mot de passe" }),
    hidePasswordLabel: t({ en: "Hide password", fr: "Masquer le mot de passe" }),

    // Terms
    agreeTo: t({ en: "I agree to the", fr: "J'accepte les" }),
    termsAndConditions: t({ en: "terms and conditions", fr: "termes et conditions" }),

    // Buttons
    createAccountButton: t({ en: "Create account", fr: "Créer un compte" }),
    creatingAccountButton: t({ en: "Creating account...", fr: "Création du compte en cours..." }),
    googleButton: t({ en: "Continue with Google", fr: "Continuer avec Google" }),
    connectingGoogleButton: t({ en: "Connecting to Google...", fr: "Connexion à Google en cours..." }),

    // Separator
    orContinueWith: t({ en: "Or continue with", fr: "Ou continuer avec" }),

    // Card Footer
    alreadyHaveAccount: t({ en: "Already have an account?", fr: "Vous avez déjà un compte ?" }),
    signInLink: t({ en: "Sign in", fr: "Se connecter" }),

    // Validation Errors
    passwordsDoNotMatch: t({ en: "Passwords do not match", fr: "Les mots de passe ne correspondent pas" }),
    passwordTooShort: t({ en: "Password must be at least 8 characters long", fr: "Le mot de passe doit contenir au moins 8 caractères" }),
    mustAgreeToTerms: t({ en: "You must agree to the terms and conditions", fr: "Vous devez accepter les termes et conditions" }),

    // Toasts & Errors
    accountCreatedToastTitle: t({ en: "Account created!", fr: "Compte créé !" }),
    accountCreatedToastDescription: t({ en: "Welcome! Let's set up your profile.", fr: "Bienvenue ! Configurons votre profil." }),
    unexpectedError: t({ en: "An unexpected error occurred", fr: "Une erreur inattendue est survenue" }),
    accountCreationFailed: t({ en: "Failed to create account. Please try again.", fr: "Échec de la création du compte. Veuillez réessayer." }),
    autoLoginFailed: t({ en: "Account created but we couldn't sign you in automatically. Please log in.", fr: "Compte créé mais nous n'avons pas pu vous connecter automatiquement. Veuillez vous connecter." }),
    googleSignupFailed: t({ en: "Failed to sign up with Google. Please try again.", fr: "Échec de l'inscription avec Google. Veuillez réessayer." }),
  },
};

export default signupPageContent;
