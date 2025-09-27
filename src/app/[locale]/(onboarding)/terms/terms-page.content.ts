import { t, type DeclarationContent } from "intlayer";

const termsPageContent: DeclarationContent = {
  key: "terms-page",
  content: {
    // Loading states
    loading: t({ en: "Loading...", fr: "Chargement..." }),
    
    // Main page content
    title: t({ en: "Terms of Service & Privacy Policy", fr: "Conditions d'utilisation et Politique de confidentialité" }),
    descriptionAuthenticated: t({ 
      en: "Please review and accept our terms to continue using Tracklet.", 
      fr: "Veuillez consulter et accepter nos conditions pour continuer à utiliser Tracklet." 
    }),
    descriptionUnauthenticated: t({ 
      en: "Please review our terms and privacy policy before creating your account.", 
      fr: "Veuillez consulter nos conditions et notre politique de confidentialité avant de créer votre compte." 
    }),
    
    // Terms of Service section
    termsOfServiceTitle: t({ en: "Terms of Service", fr: "Conditions d'utilisation" }),
    terms1Title: t({ en: "1. Service Acceptance", fr: "1. Acceptation du service" }),
    terms1Content: t({ 
      en: "By using Tracklet, you agree to these terms and confirm you are 18+ years old. This is a free, open-source personal finance management application.", 
      fr: "En utilisant Tracklet, vous acceptez ces conditions et confirmez avoir plus de 18 ans. Il s'agit d'une application gratuite et open-source de gestion des finances personnelles." 
    }),
    terms2Title: t({ en: "2. User Responsibilities", fr: "2. Responsabilités de l'utilisateur" }),
    terms2Content: t({ 
      en: "You are responsible for maintaining the confidentiality of your account, providing accurate information, and using the service lawfully.", 
      fr: "Vous êtes responsable de maintenir la confidentialité de votre compte, de fournir des informations exactes et d'utiliser le service légalement." 
    }),
    terms3Title: t({ en: "3. Service Availability", fr: "3. Disponibilité du service" }),
    terms3Content: t({ 
      en: "Tracklet is provided as-is. While we strive for reliability, we cannot guarantee uninterrupted service availability.", 
      fr: "Tracklet est fourni en l'état. Bien que nous nous efforcions d'assurer la fiabilité, nous ne pouvons garantir une disponibilité ininterrompue du service." 
    }),
    terms4Title: t({ en: "4. Limitation of Liability", fr: "4. Limitation de responsabilité" }),
    terms4Content: t({ 
      en: "Tracklet is for informational purposes only. We are not liable for financial decisions made based on the application's suggestions.", 
      fr: "Tracklet est à des fins informatives uniquement. Nous ne sommes pas responsables des décisions financières prises sur la base des suggestions de l'application." 
    }),
    
    // Privacy Policy section
    privacyPolicyTitle: t({ en: "Privacy Policy", fr: "Politique de confidentialité" }),
    privacy1Title: t({ en: "1. Data Collection", fr: "1. Collecte de données" }),
    privacy1Content: t({ 
      en: "We collect only essential information: email, profile data, and financial information you choose to input for personal finance management.", 
      fr: "Nous ne collectons que les informations essentielles : email, données de profil et informations financières que vous choisissez de saisir pour la gestion de vos finances personnelles." 
    }),
    privacy2Title: t({ en: "2. Data Usage", fr: "2. Utilisation des données" }),
    privacy2Content: t({ 
      en: "Your data is used solely to provide personalized financial insights and improve your experience. We never sell or share personal data with third parties.", 
      fr: "Vos données sont utilisées uniquement pour fournir des informations financières personnalisées et améliorer votre expérience. Nous ne vendons jamais vos données personnelles à des tiers." 
    }),
    privacy3Title: t({ en: "3. Data Security", fr: "3. Sécurité des données" }),
    privacy3Content: t({ 
      en: "We implement industry-standard security measures including encryption, secure authentication, and regular security audits.", 
      fr: "Nous mettons en œuvre des mesures de sécurité conformes aux normes de l'industrie, incluant le chiffrement, l'authentification sécurisée et des audits de sécurité réguliers." 
    }),
    privacy4Title: t({ en: "4. Data Retention", fr: "4. Conservation des données" }),
    privacy4Content: t({ 
      en: "Your data is retained only as long as necessary to provide our services. You can request data deletion at any time through your account settings.", 
      fr: "Vos données ne sont conservées que le temps nécessaire pour fournir nos services. Vous pouvez demander la suppression de vos données à tout moment via les paramètres de votre compte." 
    }),
    
    // Data Processing section
    dataProcessingTitle: t({ en: "Data Processing Agreement", fr: "Accord de traitement des données" }),
    data1Title: t({ en: "1. Processing Purpose", fr: "1. Objectif du traitement" }),
    data1Content: t({ 
      en: "We process your financial data to provide AI-powered insights, budget tracking, expense categorization, and personalized recommendations.", 
      fr: "Nous traitons vos données financières pour fournir des informations basées sur l'IA, le suivi budgétaire, la catégorisation des dépenses et des recommandations personnalisées." 
    }),
    data2Title: t({ en: "2. Legal Basis", fr: "2. Base légale" }),
    data2Content: t({ 
      en: "Processing is based on your consent and our legitimate interest in providing personalized financial management services.", 
      fr: "Le traitement est basé sur votre consentement et notre intérêt légitime à fournir des services de gestion financière personnalisés." 
    }),
    data3Title: t({ en: "3. Your Rights", fr: "3. Vos droits" }),
    data3Content: t({ 
      en: "You have the right to access, rectify, delete, or port your data. You can also withdraw consent or object to processing at any time.", 
      fr: "Vous avez le droit d'accéder, de rectifier, de supprimer ou de porter vos données. Vous pouvez également retirer votre consentement ou vous opposer au traitement à tout moment." 
    }),
    data4Title: t({ en: "4. Data Protection", fr: "4. Protection des données" }),
    data4Content: t({ 
      en: "All processing complies with GDPR and other applicable data protection laws. Your privacy is our top priority.", 
      fr: "Tout traitement est conforme au RGPD et aux autres lois applicables sur la protection des données. Votre vie privée est notre priorité absolue." 
    }),
    
    // Acceptance labels
    acceptTermsLabel: t({ 
      en: "I have read and accept the Terms of Service", 
      fr: "J'ai lu et j'accepte les Conditions d'utilisation" 
    }),
    acceptTermsDescription: t({ 
      en: "You must accept the terms to use Tracklet's services.", 
      fr: "Vous devez accepter les conditions pour utiliser les services de Tracklet." 
    }),
    acceptPrivacyLabel: t({ 
      en: "I have read and accept the Privacy Policy", 
      fr: "J'ai lu et j'accepte la Politique de confidentialité" 
    }),
    acceptPrivacyDescription: t({ 
      en: "Required to understand how your data is handled.", 
      fr: "Requis pour comprendre comment vos données sont traitées." 
    }),
    acceptDataLabel: t({ 
      en: "I consent to data processing as described", 
      fr: "Je consens au traitement des données tel que décrit" 
    }),
    acceptDataDescription: t({ 
      en: "Enables AI-powered insights and personalized features.", 
      fr: "Active les informations basées sur l'IA et les fonctionnalités personnalisées." 
    }),
    
    // Info messages
    unauthenticatedInfo: t({ 
      en: "You can review these terms now and will need to accept them during account creation.", 
      fr: "Vous pouvez consulter ces conditions maintenant et devrez les accepter lors de la création de votre compte." 
    }),
    
    // Buttons
    declineButton: t({ en: "Decline", fr: "Refuser" }),
    backToSignupButton: t({ en: "Back to Signup", fr: "Retour à l'inscription" }),
    acceptAllButton: t({ en: "Accept All Terms", fr: "Accepter toutes les conditions" }),
    readTermsButton: t({ en: "Continue to Signup", fr: "Continuer vers l'inscription" }),
    acceptingButton: t({ en: "Accepting...", fr: "Acceptation..." }),
    redirectingButton: t({ en: "Redirecting...", fr: "Redirection..." }),
    
    // Toast messages
    acceptAllToastTitle: t({ en: "Please accept all terms", fr: "Veuillez accepter toutes les conditions" }),
    acceptAllToastDescription: t({ 
      en: "You must check all boxes to continue using Tracklet.", 
      fr: "Vous devez cocher toutes les cases pour continuer à utiliser Tracklet." 
    }),
    termsAcceptedToastTitle: t({ en: "Terms accepted", fr: "Conditions acceptées" }),
    termsAcceptedToastDescription: t({ 
      en: "Thank you for accepting our terms. Redirecting...", 
      fr: "Merci d'avoir accepté nos conditions. Redirection..." 
    }),
    acceptanceFailedToastTitle: t({ en: "Acceptance failed", fr: "Échec de l'acceptation" }),
  },
};

export default termsPageContent;