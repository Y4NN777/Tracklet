import { Locales, type IntlayerConfig } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [ Locales.ENGLISH, Locales.FRENCH ],
    defaultLocale: Locales.ENGLISH,
  },
};

export default config;
