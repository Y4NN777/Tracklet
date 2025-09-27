
import { t, type DeclarationContent } from "intlayer";

const onboardingLayoutContent: DeclarationContent = {
  key: "onboarding-layout",
  content: {
    welcome: t({ en: "Welcome to Tracklet", fr: "Bienvenue sur Tracklet" }),
    getStarted: t({ en: "Let's get you set up in just a few steps", fr: "Mettons-nous en place en quelques étapes seulement" }),
  },
};

export default onboardingLayoutContent;
