import { t, type DeclarationContent } from "intlayer";

const faqSectionContent: DeclarationContent = {
  key: "faq-section",
  content: {
    isFinTrackFree: t({ en: "Is FinTrack really free?", fr: "FinTrack est-il vraiment gratuit ?" }),
    isFinTrackFreeAnswer: t({ en: "Yes, FinTrack is completely free with no hidden costs, subscriptions, or premium tiers. It's open source software that you can use forever without any payment.", fr: "Oui, FinTrack est entièrement gratuit, sans coûts cachés, abonnements ou niveaux premium. C'est un logiciel open source que vous pouvez utiliser pour toujours sans aucun paiement." }),
    canIContribute: t({ en: "Can I contribute to the development?", fr: "Puis-je contribuer au développement ?" }),
    canIContributeAnswer: t({ en: "Absolutely! FinTrack is an open source project that welcomes contributions from developers of all skill levels. You can contribute code, report issues, suggest features, or help with documentation.", fr: "Absolument ! FinTrack est un projet open source qui accueille les contributions de développeurs de tous niveaux. Vous pouvez contribuer au code, signaler des problèmes, suggérer des fonctionnalités ou aider à la documentation." }),
    isDataSecure: t({ en: "Is my financial data secure?", fr: "Mes données financières sont-elles en sécurité ?" }),
    isDataSecureAnswer: t({ en: "Yes, we take security seriously. FinTrack uses JWT-based authentication, Supabase enterprise-grade database security, OAuth integration for secure user access, and data encryption at rest and in transit.", fr: "Oui, nous prenons la sécurité au sérieux. FinTrack utilise une authentification basée sur JWT, la sécurité de base de données de niveau entreprise de Supabase, l'intégration OAuth pour un accès utilisateur sécurisé et le cryptage des données au repos et en transit." }),
    whatMakesFinTrackDifferent: t({ en: "What makes FinTrack different from other finance apps?", fr: "Qu'est-ce qui différencie FinTrack des autres applications financières ?" }),
    whatMakesFinTrackDifferentAnswer: t({ en: "FinTrack combines AI-powered insights with complete open source transparency. Unlike proprietary apps, you can see exactly how your data is handled, and the AI features are built specifically for personal finance management.", fr: "FinTrack combine des informations basées sur l'IA avec une transparence open source complète. Contrairement aux applications propriétaires, vous pouvez voir exactement comment vos données sont traitées, et les fonctionnalités d'IA sont conçues spécifiquement pour la gestion des finances personnelles." }),
    doINeedFinancialKnowledge: t({ en: "Do I need financial knowledge to use FinTrack?", fr: "Ai-je besoin de connaissances financières pour utiliser FinTrack ?" }),
    doINeedFinancialKnowledgeAnswer: t({ en: "Not at all! FinTrack includes a comprehensive Learning Center with AI-powered educational content in multiple languages. The app is designed to be user-friendly while teaching you financial concepts along the way.", fr: "Pas du tout ! FinTrack comprend un centre d'apprentissage complet avec du contenu éducatif alimenté par l'IA en plusieurs langues. L'application est conçue pour être conviviale tout en vous enseignant des concepts financiers en cours de route." }),
    frequentlyAskedQuestions: t({ en: "Frequently Asked Questions", fr: "Questions fréquemment posées" }),
    everythingYouNeedToKnow: t({ en: "Everything you need to know about FinTrack", fr: "Tout ce que vous devez savoir sur FinTrack" }),
    commonQuestions: t({ en: "Common Questions", fr: "Questions courantes" }),
    stillHaveQuestions: t({ en: "Still have questions?", fr: "Vous avez encore des questions ?" }),
    viewDocumentation: t({ en: "View Documentation →", fr: "Voir la documentation →" }),
    askOnGitHub: t({ en: "Ask on GitHub →", fr: "Demander sur GitHub →" }),
  },
};

export default faqSectionContent;