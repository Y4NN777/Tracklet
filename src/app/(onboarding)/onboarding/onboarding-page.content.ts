
import { t, type DeclarationContent } from "intlayer";

const onboardingPageContent: DeclarationContent = {
  key: "onboarding-page",
  content: {
    // Onboarding Steps
    step1Title: t({ en: "Welcome to FinTrack", fr: "Bienvenue sur FinTrack" }),
    step1Description: t({ en: "Your AI-powered finance companion awaits", fr: "Votre compagnon financier alimenté par l'IA vous attend" }),
    step2Title: t({ en: "Discover FinTrack", fr: "Découvrez FinTrack" }),
    step2Description: t({ en: "Learn what makes your financial journey smarter", fr: "Découvrez ce qui rend votre parcours financier plus intelligent" }),
    step3Title: t({ en: "Profile Setup", fr: "Configuration du Profil" }),
    step3Description: t({ en: "Personalize your experience", fr: "Personnalisez votre expérience" }),
    step4Title: t({ en: "Preferences", fr: "Préférences" }),
    step4Description: t({ en: "Customize your financial settings", fr: "Personnalisez vos paramètres financiers" }),
    step5Title: t({ en: "You're All Set!", fr: "Vous êtes Prêt !" }),
    step5Description: t({ en: "Ready to take control of your finances", fr: "Prêt à prendre le contrôle de vos finances" }),

    // Step Content
    step1Welcome: t({ en: "Welcome to FinTrack!", fr: "Bienvenue sur FinTrack !" }),
    step1Greeting: t({
      en: (params: { name: string }) => `Hello ${params.name}! Let's set up your profile.`,
      fr: (params: { name: string }) => `Bonjour ${params.name} ! Configurons votre profil.`,
    }),
    step1DefaultGreeting: t({ en: "Hello there! Let's set up your profile.", fr: "Bonjour ! Configurons votre profil." }),

    step2AIPowered: t({ en: "AI-Powered Insights", fr: "Aperçus Alimentés par l'IA" }),
    step2GoalTracking: t({ en: "Goal Tracking", fr: "Suivi d'Objectifs" }),
    step2SmartBudgeting: t({ en: "Smart Budgeting", fr: "Budgétisation Intelligente" }),
    step2CrossDeviceSync: t({ en: "Cross-Device Sync", fr: "Synchronisation Multi-Appareils" }),

    step3UploadPhoto: t({ en: "Upload Photo", fr: "Télécharger une Photo" }),
    step3FullName: t({ en: "Full Name", fr: "Nom Complet" }),
    step3FullNamePlaceholder: t({ en: "Enter your full name", fr: "Entrez votre nom complet" }),

    step4Theme: t({ en: "Theme", fr: "Thème" }),
    step4ThemeLight: t({ en: "Light", fr: "Clair" }),
    step4ThemeDark: t({ en: "Dark", fr: "Sombre" }),
    step4ThemeSystem: t({ en: "System", fr: "Système" }),
    step4Currency: t({ en: "Currency", fr: "Devise" }),

    step5AllSet: t({ en: "You're All Set!", fr: "Vous êtes Prêt !" }),
    step5Ready: t({ en: "Welcome to FinTrack! Your personalized experience is ready.", fr: "Bienvenue sur FinTrack ! Votre expérience personnalisée est prête." }),

    // General UI
    stepOf: t({
      en: (params: { current: number, total: number }) => `Step ${params.current} of ${params.total}`,
      fr: (params: { current: number, total: number }) => `Étape ${params.current} sur ${params.total}`,
    }),
    percentComplete: t({
      en: (params: { progress: number }) => `${params.progress}% complete`,
      fr: (params: { progress: number }) => `${params.progress}% terminé`,
    }),
    loading: t({ en: "Loading...", fr: "Chargement..." }),
    back: t({ en: "Back", fr: "Retour" }),
    skipForNow: t({ en: "Skip for now", fr: "Passer pour le moment" }),
    continue: t({ en: "Continue", fr: "Continuer" }),
    getStarted: t({ en: "Get Started", fr: "Commencer" }),
    completingSetup: t({ en: "Completing Setup...", fr: "Finalisation de la configuration..." }),

    // Toasts
    avatarUploadSuccessTitle: t({ en: "Avatar uploaded!", fr: "Avatar téléchargé !" }),
    avatarUploadSuccessDescription: t({ en: "Your profile picture has been saved.", fr: "Votre photo de profil a été enregistrée." }),
    avatarUploadFailedTitle: t({ en: "Upload failed", fr: "Échec du téléchargement" }),
    avatarUploadFailedDescription: t({ en: "Please try again.", fr: "Veuillez réessayer." }),
    welcomeToastTitle: t({ en: "Welcome to FinTrack!", fr: "Bienvenue sur FinTrack !" }),
    welcomeToastDescription: t({ en: "Redirecting you to the dashboard...", fr: "Redirection vers le tableau de bord..." }),
    setupFailedTitle: t({ en: "Setup failed", fr: "Échec de la configuration" }),
    setupFailedDescription: t({ en: "Redirecting you anyway.", fr: "Redirection en cours malgré tout." }),
  },
};

export default onboardingPageContent;
