import { t, type DeclarationContent } from "intlayer";

const heroSectionContent: DeclarationContent = {
  key: "hero-section",
  content: {
    title: t({
      en: ["AI-Powered Personal", "Finance Management"],
      fr: ["Gestion des Finances", "Personnelles par l'IA"],
    }),
    subtitle: t({
      en: "Take control of your finances with intelligent insights and smart recommendations. Free, open source software built by for everyone.",
      fr: "Prenez le contrôle de vos finances avec des informations intelligentes et des recommandations pertinentes. Un logiciel gratuit et open source, conçu pour tous.",
    }),
    getStarted: t({
      en: "Get Started Free",
      fr: "Commencer Gratuitement",
    }),
    signIn: t({
      en: "Sign In",
      fr: "Se Connecter",
    }),
    trustIndicator: t({
      en: "Join users managing their finances smarter",
      fr: "Rejoignez des personnes qui gèrent leurs finances plus intelligemment",
    }),
  },
};

export default heroSectionContent;
