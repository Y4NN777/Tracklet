
import { t, type DeclarationContent } from "intlayer";

const learningPageContent: DeclarationContent = {
  key: "learning-page",
  content: {
    title: t({ en: "Learning Center", fr: "Centre d'apprentissage" }),
    description: t({ en: "Learn about personal finance through interactive conversations with our AI assistant.", fr: "Apprenez-en plus sur les finances personnelles grâce à des conversations interactives avec notre assistant IA." }),
  },
};

export default learningPageContent;
