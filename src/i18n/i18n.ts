import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./en/app.json";
import fr from "./fr/app.json";

export const AppLanguage = {
  en: "en",
  fr: "fr",
} as const;

export type AppLanguageType = (typeof AppLanguage)[keyof typeof AppLanguage];

export interface SupportedLanguage {
  code: AppLanguageType;
  selectionLabel: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: AppLanguage.fr, selectionLabel: "Français" },
  { code: AppLanguage.en, selectionLabel: "English" },
];

export const DEFAULT_LANGUAGE = AppLanguage.fr;
const I18NEXT_STORAGE_KEY = "i18nextLng";

export const storeSelectedLanguage = (newCode: string) => {
  localStorage.setItem(I18NEXT_STORAGE_KEY, newCode);
};

export const loadSelectedLanguage = (): string | null => {
  return localStorage.getItem(I18NEXT_STORAGE_KEY);
};

const initI18N = () => {
  if (!loadSelectedLanguage()) {
    storeSelectedLanguage(DEFAULT_LANGUAGE);
  }

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: { fr, en },
      defaultNS: "common",
      fallbackLng: DEFAULT_LANGUAGE,
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18N();

export default i18next;
