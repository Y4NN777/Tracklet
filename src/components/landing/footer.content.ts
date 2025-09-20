import { t, type DeclarationContent } from "intlayer";

const footerContent: DeclarationContent = {
  key: "footer",
  content: {
    finTrack: t({ en: "FinTrack", fr: "FinTrack" }),
    description: t({ 
      en: "AI-powered personal finance management. Free, open source software built by developers for everyone seeking financial clarity.", 
      fr: "Gestion des finances personnelles assistée par IA. Logiciel gratuit et open source conçu par des développeurs pour tous ceux qui recherchent la clarté financière." 
    }),
    madeWith: t({ en: "Made with", fr: "Fait avec" }),
    byDevelopers: t({ en: "by developers, for the community", fr: "par les développeurs, pour la communauté" }),
    quickLinks: t({ en: "Quick Links", fr: "Liens rapides" }),
    getStarted: t({ en: "Get Started", fr: "Commencer" }),
    signIn: t({ en: "Sign In", fr: "Se connecter" }),
    githubRepository: t({ en: "GitHub Repository", fr: "Dépôt GitHub" }),
    termsOfService: t({ en: "Terms of Service", fr: "Conditions d'utilisation" }),
    reportIssues: t({ en: "Report Issues", fr: "Signaler des problèmes" }),
    community: t({ en: "Community", fr: "Communauté" }),
    contributingGuide: t({ en: "Contributing Guide", fr: "Guide de contribution" }),
    discussions: t({ en: "Discussions", fr: "Discussions" }),
    contactDeveloper: t({ en: "Contact Developer", fr: "Contacter le développeur" }),
    linkedIn: t({ en: "LinkedIn", fr: "LinkedIn" }),
    
    // Simple approach - separate parts for copyright
    copyrightPrefix: t({ en: "©", fr: "©" }),
    copyrightSuffix: t({ 
      en: "FinTrack. Open source under MIT License.", 
      fr: "FinTrack. Open source sous licence MIT." 
    }),
    
    githubAria: t({ en: "GitHub Repository", fr: "Dépôt GitHub" }),
    emailAria: t({ en: "Email the Y4NN", fr: "Envoyer un e-mail a the Y4NN" }),
    linkedInAria: t({ en: "LinkedIn Profile", fr: "Profil LinkedIn" }),
  },
};

export default footerContent;