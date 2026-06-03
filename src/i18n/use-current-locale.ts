import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US";
import frFR from "antd/locale/fr_FR";
import { useTranslation } from "react-i18next";
import { AppLanguage, type AppLanguageType, DEFAULT_LANGUAGE } from "./i18n";

const APP_LANGUAGE_TO_LOCALE = new Map<AppLanguageType, Locale>([
  [AppLanguage.fr, frFR],
  [AppLanguage.en, enUS],
]);

export const useCurrentLocale = (): Locale | undefined => {
  const { i18n } = useTranslation();
  const appLanguage = (i18n.language as AppLanguageType) ?? DEFAULT_LANGUAGE;
  return APP_LANGUAGE_TO_LOCALE.get(appLanguage);
};
