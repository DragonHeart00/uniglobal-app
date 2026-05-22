import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import sv from "./locales/sv.json";
import ar from "./locales/ar.json";

export const SUPPORTED_LANGS = ["sv", "ar"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const LANG_META: Record<Lang, { label: string; dir: "ltr" | "rtl"; flag: string }> = {
  sv: { label: "Svenska", dir: "ltr", flag: "🇸🇪" },
  ar: { label: "العربية", dir: "rtl", flag: "🇸🇦" },
};

if (!i18n.isInitialized) {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        sv: { translation: sv },
        ar: { translation: ar },
      },
      fallbackLng: "sv",
      supportedLngs: SUPPORTED_LANGS as unknown as string[],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "godkant.lang",
        caches: ["localStorage"],
      },
    });
}

export function applyDirection(lang: string) {
  if (typeof document === "undefined") return;
  const meta = LANG_META[(SUPPORTED_LANGS as readonly string[]).includes(lang) ? (lang as Lang) : "sv"];
  document.documentElement.lang = lang;
  document.documentElement.dir = meta.dir;
}

export default i18n;
