
import { t, type DeclarationContent } from "intlayer";

const forgotPasswordPageContent: DeclarationContent = {
  key: "forgot-password-page",
  content: {
    // Initial View
    title: t({ en: "Forgot your password?", fr: "Mot de passe oublié ?" }),
    description: t({ en: "Enter your email address and we'll send you a link to reset your password", fr: "Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe" }),
    emailLabel: t({ en: "Email address", fr: "Adresse e-mail" }),
    emailPlaceholder: t({ en: "you@example.com", fr: "vous@exemple.com" }),
    sendButton: t({ en: "Send reset email", fr: "Envoyer l'e-mail de réinitialisation" }),
    sendingButton: t({ en: "Sending reset email...", fr: "Envoi de l'e-mail de réinitialisation en cours..." }),
    backToLogin: t({ en: "Back to login", fr: "Retour à la connexion" }),

    // Success View
    successTitle: t({ en: "Check your email", fr: "Vérifiez vos e-mails" }),
    successDescription: t({
      en: (params: { email: string } = { email: '' }) => `We've sent a password reset link to ${params.email}`,
      fr: (params: { email: string } = { email: '' }) => `Nous avons envoyé un lien de réinitialisation de mot de passe à ${params.email}`,
    }),
    noEmailAlert: t({ en: "Didn't receive the email? Check your spam folder or try resending the email.", fr: "Vous n'avez pas reçu l'e-mail ? Vérifiez votre dossier de spam ou essayez de renvoyer l'e-mail." }),
    tryAnotherEmailButton: t({ en: "Try another email", fr: "Essayer une autre adresse e-mail" }),

    // Toasts & Errors
    emailSentToastTitle: t({ en: "Reset email sent!", fr: "E-mail de réinitialisation envoyé !" }),
    emailSentToastDescription: t({ en: "Check your email for password reset instructions.", fr: "Vérifiez vos e-mails pour les instructions de réinitialisation du mot de passe." }),
    sendFailedError: t({ en: "Failed to send reset email. Please try again.", fr: "Échec de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer." }),
  },
};

export default forgotPasswordPageContent;
