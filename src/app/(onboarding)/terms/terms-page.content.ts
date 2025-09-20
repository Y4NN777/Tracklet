
import { t, type DeclarationContent } from "intlayer";

const termsPageContent: DeclarationContent = {
  key: "terms-page",
  content: {
    // Page Titles and Descriptions
    title: t({ en: "Terms and Conditions", fr: "Termes et Conditions" }),
    descriptionAuthenticated: t({ en: "Please review and accept our terms and conditions to continue", fr: "Veuillez consulter et accepter nos termes et conditions pour continuer" }),
    descriptionUnauthenticated: t({ en: "Please read our terms and conditions before creating your account", fr: "Veuillez lire nos termes et conditions avant de créer votre compte" }),

    // Loading State
    loading: t({ en: "Loading...", fr: "Chargement..." }),

    // Terms Sections
    termsOfServiceTitle: t({ en: "Terms of Service", fr: "Conditions d'utilisation" }),
    terms1Title: t({ en: "1. Acceptance of Terms", fr: "1. Acceptation des conditions" }),
    terms1Content: t({ en: "By accessing and using FinTrack, you accept and agree to be bound by the terms and provision of this agreement.", fr: "En accédant et en utilisant FinTrack, vous acceptez d'être lié par les termes et dispositions de cet accord." }),
    terms2Title: t({ en: "2. Use License", fr: "2. Licence d'utilisation" }),
    terms2Content: t({ en: "Permission is granted to temporarily use FinTrack for personal, non-commercial transitory viewing only.", fr: "L'autorisation est accordée d'utiliser temporairement FinTrack pour un usage personnel et non commercial transitoire uniquement." }),
    terms3Title: t({ en: "3. Disclaimer", fr: "3. Clause de non-responsabilité" }),
    terms3Content: t({ en: "The materials on FinTrack are provided on an 'as is' basis. FinTrack makes no warranties, expressed or implied.", fr: "Les matériaux sur FinTrack sont fournis 'tels quels'. FinTrack ne donne aucune garantie, expresse ou implicite." }),
    terms4Title: t({ en: "4. Limitations", fr: "4. Limitations" }),
    terms4Content: t({ en: "In no event shall FinTrack be liable for any damages arising out of the use of our services.", fr: "En aucun cas, FinTrack ne sera responsable des dommages résultant de l'utilisation de nos services." }),

    privacyPolicyTitle: t({ en: "Privacy Policy", fr: "Politique de confidentialité" }),
    privacy1Title: t({ en: "1. Information We Collect", fr: "1. Informations que nous collectons" }),
    privacy1Content: t({ en: "We collect information you provide directly, such as when you create an account or use our services.", fr: "Nous collectons les informations que vous fournissez directement, comme lorsque vous créez un compte ou utilisez nos services." }),
    privacy2Title: t({ en: "2. How We Use Information", fr: "2. Comment nous utilisons les informations" }),
    privacy2Content: t({ en: "We use the information to provide, maintain, and improve our services, and to communicate with you.", fr: "Nous utilisons les informations pour fournir, maintenir et améliorer nos services, et pour communiquer avec vous." }),
    privacy3Title: t({ en: "3. Information Sharing", fr: "3. Partage d'informations" }),
    privacy3Content: t({ en: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.", fr: "Nous ne vendons, n'échangeons ni ne transférons de quelque manière que ce soit vos informations personnelles à des tiers sans votre consentement." }),
    privacy4Title: t({ en: "4. Data Security", fr: "4. Sécurité des données" }),
    privacy4Content: t({ en: "We implement appropriate security measures to protect your personal information against unauthorized access.", fr: "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès non autorisé." }),

    dataProcessingTitle: t({ en: "Data Processing Agreement", fr: "Accord de traitement des données" }),
    data1Title: t({ en: "1. Data Controller", fr: "1. Responsable du traitement des données" }),
    data1Content: t({ en: "FinTrack acts as the data controller for personal data processed through our services.", fr: "FinTrack agit en tant que responsable du traitement des données personnelles traitées via nos services." }),
    data2Title: t({ en: "2. Legal Basis", fr: "2. Base juridique" }),
    data2Content: t({ en: "We process your data based on your consent and legitimate business interests.", fr: "Nous traitons vos données sur la base de votre consentement et de nos intérêts commerciaux légitimes." }),
    data3Title: t({ en: "3. Data Retention", fr: "3. Conservation des données" }),
    data3Content: t({ en: "We retain your data for as long as necessary to provide our services and comply with legal obligations.", fr: "Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services et nous conformer aux obligations légales." }),
    data4Title: t({ en: "4. Your Rights", fr: "4. Vos droits" }),
    data4Content: t({ en: "You have the right to access, rectify, erase, and port your personal data.", fr: "Vous avez le droit d'accéder, de rectifier, d'effacer et de porter vos données personnelles." }),

    // Acceptance Checkboxes
    acceptTermsLabel: t({ en: "I accept the Terms of Service", fr: "J'accepte les Conditions d'utilisation" }),
    acceptTermsDescription: t({ en: "I agree to abide by FinTrack's terms and conditions of use.", fr: "Je m'engage à respecter les termes et conditions d'utilisation de FinTrack." }),
    acceptPrivacyLabel: t({ en: "I accept the Privacy Policy", fr: "J'accepte la Politique de confidentialité" }),
    acceptPrivacyDescription: t({ en: "I consent to the collection and processing of my personal data as described.", fr: "Je consens à la collecte et au traitement de mes données personnelles comme décrit." }),
    acceptDataLabel: t({ en: "I accept the Data Processing Agreement", fr: "J'accepte l'Accord de traitement des données" }),
    acceptDataDescription: t({ en: "I understand how my financial data will be processed and stored.", fr: "Je comprends comment mes données financières seront traitées et stockées." }),

    // Unauthenticated Info
    unauthenticatedInfo: t({ en: "By proceeding with account creation, you acknowledge that you have read and understood our terms and conditions.", fr: "En poursuivant la création de votre compte, vous reconnaissez avoir lu et compris nos termes et conditions." }),

    // Buttons
    declineButton: t({ en: "Decline & Return to Login", fr: "Refuser et retourner à la connexion" }),
    backToSignupButton: t({ en: "Back to Signup", fr: "Retour à l'inscription" }),
    acceptingButton: t({ en: "Accepting...", fr: "Acceptation en cours..." }),
    redirectingButton: t({ en: "Redirecting...", fr: "Redirection en cours..." }),
    acceptAllButton: t({ en: "Accept All & Continue", fr: "Tout accepter et continuer" }),
    readTermsButton: t({ en: "I Have Read the Terms", fr: "J'ai lu les conditions" }),

    // Toasts
    acceptAllToastTitle: t({ en: "Please accept all terms", fr: "Veuillez accepter toutes les conditions" }),
    acceptAllToastDescription: t({ en: "You must accept all terms and conditions to continue.", fr: "Vous devez accepter tous les termes et conditions pour continuer." }),
    termsAcceptedToastTitle: t({ en: "Terms accepted!", fr: "Conditions acceptées !" }),
    termsAcceptedToastDescription: t({ en: "Welcome to FinTrack. Setting up your account...", fr: "Bienvenue sur FinTrack. Configuration de votre compte en cours..." }),
    acceptanceFailedToastTitle: t({ en: "Terms Acceptance Failed", fr: "Échec de l'acceptation des conditions" }),
  },
};

export default termsPageContent;
