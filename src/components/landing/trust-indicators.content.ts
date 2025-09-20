import { t, type DeclarationContent } from "intlayer";

const trustIndicatorsContent: DeclarationContent = {
  key: "trust-indicators",
  content: {
    freeAndOpenSource: t({ en: "Free & Open Source", fr: "Gratuit et Open Source" }),
    freeAndOpenSourceDescription: t({ en: "Completely free software with transparent, auditable code. No hidden costs or premium tiers.", fr: "Logiciel entièrement gratuit avec un code transparent et auditable. Pas de coûts cachés ni de niveaux premium." }),
    communityDriven: t({ en: "Community Driven", fr: "Dirigé par la communauté" }),
    communityDrivenDescription: t({ en: "Built by developer for friend developers and everyone. Open to community contributions and collaborative improvement.", fr: "Conçu par un développeurs pour développeurs et pour tout le monde. Ouvert aux contributions de la communauté et à l'amélioration collaborative." }),
    secureAndPrivate: t({ en: "Secure & Private", fr: "Sécurisé et Privé" }),
    secureAndPrivateDescription: t({ en: "JWT-based authentication with Supabase enterprise-grade database security and OAuth integration.", fr: "Authentification basée sur JWT avec la sécurité de base de données de niveau entreprise de Supabase et l'intégration OAuth." }),
    trustedByDevelopers: t({ en: "In Trusting process by Developers Worldwide", fr: "En cours d'approuvement par les développeurs du monde entier" }),
    trustedByDevelopersDescription: t({ en: "Built with transparency, security, and community collaboration in mind", fr: "Conçu dans un esprit de transparence, de sécurité et de collaboration communautaire" }),
    dataProtected: t({ en: "Your data is protected with industry-standard security", fr: "Vos données sont protégées par une sécurité conforme aux normes de l'industrie" }),
  },
};

export default trustIndicatorsContent;
