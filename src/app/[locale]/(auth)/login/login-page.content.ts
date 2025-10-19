
import { t, type DeclarationContent } from "intlayer";

const loginPageContent: DeclarationContent = {
  key: "login-page",
  content: {
    // Card Header
    title: t({ en: "Welcome back", fr: "Content de vous revoir" }),
    description: t({ en: "Enter your email and password to access your account", fr: "Entrez votre email et votre mot de passe pour accéder à votre compte" }),

    // Form Fields
    emailLabel: t({ en: "Email", fr: "Email" }),
    emailPlaceholder: t({ en: "you@example.com", fr: "vous@exemple.com" }),
    passwordLabel: t({ en: "Password", fr: "Mot de passe" }),
    passwordPlaceholder: t({ en: "••••••••", fr: "••••••••" }),
    showPasswordLabel: t({ en: "Show password", fr: "Afficher le mot de passe" }),
    hidePasswordLabel: t({ en: "Hide password", fr: "Masquer le mot de passe" }),
    forgotPasswordLink: t({ en: "Forgot password?", fr: "Mot de passe oublié ?" }),

    // Buttons
    signInButton: t({ en: "Sign in", fr: "Se connecter" }),
    signingInButton: t({ en: "Signing in...", fr: "Connexion en cours..." }),
    googleButton: t({ en: "Continue with Google", fr: "Continuer avec Google" }),
    connectingGoogleButton: t({ en: "Connecting to Google...", fr: "Connexion à Google en cours..." }),

    // Separator
    orContinueWith: t({ en: "Or continue with", fr: "Ou continuer avec" }),

    // Card Footer
    noAccount: t({ en: "Don't have an account?", fr: "Vous n'avez pas de compte ?" }),
    signUpLink: t({ en: "Sign up", fr: "S'inscrire" }),

    // Toasts & Errors
    welcomeBackToastTitle: t({ en: "Welcome back!", fr: "Content de vous revoir !" }),
    welcomeBackToastDescription: t({ en: "You have successfully logged in.", fr: "Vous vous êtes connecté avec succès." }),
    unexpectedError: t({ en: "An unexpected error occurred. Please try again.", fr: "Une erreur inattendue est survenue. Veuillez réessayer." }),
    googleLoginFailed: t({ en: "Failed to login with Google. Please try again.", fr: "Échec de la connexion avec Google. Veuillez réessayer." }),
  },
};

export default loginPageContent;
