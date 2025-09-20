import { t, type DeclarationContent } from "intlayer";

const errorToastContent: DeclarationContent = {
  key: "error-toast",
  content: {
    error: t({ en: "Error", fr: "Erreur" }),
    somethingWentWrong: t({ en: "Something went wrong. Please try again.", fr: "Quelque chose s'est mal passé. Veuillez réessayer." }),
  },
};

export default errorToastContent;
