import i18n from "i18next";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import pt from "./locales/pt.json";

export const LANGUAGE_STORAGE_KEY = "hiworld.preferredLanguage";
export const SUPPORTED_LANGUAGES = ["en", "pt"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function normalizeLanguage(language?: string | null): SupportedLanguage | null {
  const normalized = language?.toLowerCase().split("-")[0];
  return normalized === "pt" || normalized === "en" ? normalized : null;
}

export function getStoredLanguage(): SupportedLanguage | null {
  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getOsLanguage(): SupportedLanguage {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.map(normalizeLanguage).find(Boolean) ?? "en";
}

export function setPreferredLanguage(language: SupportedLanguage) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  void i18n.changeLanguage(language);
}

function setMomentLocale(language: SupportedLanguage) {
  moment.locale(language === "pt" ? "pt-br" : "en");
}

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  lng: getStoredLanguage() ?? getOsLanguage(),
  react: {
    useSuspense: false,
  },
  resources: {
    en: {
      translation: en,
    },
    pt: {
      translation: pt,
    },
  },
});

setMomentLocale(i18n.language === "pt" ? "pt" : "en");
i18n.on("languageChanged", (language) => {
  setMomentLocale(language === "pt" ? "pt" : "en");
});

export default i18n;
