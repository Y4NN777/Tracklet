import { t, type DeclarationContent } from "intlayer";

const learningChatContent: DeclarationContent = {
  key: "learning-chat",
  content: {
    // Welcome Message
    welcome: t({
      en: "Hello! I'm your FinTrack Learning Assistant. I can help you learn about personal finance. What would you like to explore today?",
      fr: "Bonjour! Je suis votre assistant d'apprentissage FinTrack. Je peux vous aider à apprendre la finance personnelle. Que voulez-vous explorer aujourd'hui?",
    }),
    welcomeSuggestions: t({
      en: ["Budgeting Basics", "Saving Strategies", "Investment Basics"],
      fr: ["Bases de la Budgétisation", "Stratégies d'Épargne", "Bases de l'Investissement"],
    }),

    // Learning Themes
    budgetingBasicsTitle: t({ en: "Budgeting Basics", fr: "Bases de la Budgétisation" }),
    budgetingBasicsDescription: t({ en: "Learn fundamental budgeting concepts and techniques", fr: "Apprenez les concepts fondamentaux de budgétisation" }),
    savingStrategiesTitle: t({ en: "Saving Strategies", fr: "Stratégies d'Épargne" }),
    savingStrategiesDescription: t({ en: "Discover effective saving methods and habits", fr: "Découvrez des méthodes d'épargne efficaces" }),
    housingAndRentTitle: t({ en: "Housing & Rent", fr: "Logement & Loyer" }),
    housingAndRentDescription: t({ en: "Understand housing costs and financing options", fr: "Comprenez les coûts de logement et options de financement" }),
    investmentBasicsTitle: t({ en: "Investment Basics", fr: "Bases de l'Investissement" }),
    investmentBasicsDescription: t({ en: "Learn about investment types and strategies", fr: "Apprenez les types d'investissement et stratégies" }),
    debtManagementTitle: t({ en: "Debt Management", fr: "Gestion de la Dette" }),
    debtManagementDescription: t({ en: "Master debt repayment and credit management", fr: "Maîtrisez le remboursement de dettes et gestion du crédit" }),
    goalSettingTitle: t({ en: "Goal Setting", fr: "Fixation d'Objectifs" }),
    goalSettingDescription: t({ en: "Set and achieve your financial goals", fr: "Définissez et atteignez vos objectifs financiers" }),
    financialPlanningTitle: t({ en: "Financial Planning", fr: "Planification Financière" }),
    financialPlanningDescription: t({ en: "Comprehensive financial planning and wealth building", fr: "Planification financière complète et constitution de patrimoine" }),

    // Error Message
    errorMessage: t({ en: "I apologize, but I encountered an error. Please try again.", fr: "Je m'excuse, mais j'ai rencontré une erreur. Veuillez réessayer." }),

    // UI Text
    tellMeAbout: t({ en: "Tell me about", fr: "Parlez-moi de" }),
    learningTopics: t({ en: "Learning Topics", fr: "Sujets d'apprentissage" }),
    learningAssistant: t({ en: "Learning Assistant", fr: "Assistant d'apprentissage" }),
    language: t({ en: "Language:", fr: "Langue:" }),
    suggestedTopics: t({ en: "Suggested topics:", fr: "Sujets suggérés:" }),
    thinking: t({ en: "Thinking...", fr: "Réflexion..." }),
    placeholder: t({ en: "Ask me anything about personal finance...", fr: "Posez-moi une question sur la finance personnelle..." }),
    send: t({ en: "Send", fr: "Envoyer" }),
  },
};

export default learningChatContent;
