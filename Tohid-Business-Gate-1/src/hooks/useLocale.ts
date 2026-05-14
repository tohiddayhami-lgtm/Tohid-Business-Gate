import { useTranslation as useI18nTranslation } from "react-i18next";

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();
  const resolved = i18n.resolvedLanguage ?? i18n.language ?? "fa";
  const currentLang = resolved.startsWith("fa") ? "fa" : "en";
  const isRtl = currentLang === "fa";
  const toggleLanguage = () => {
    void i18n.changeLanguage(currentLang === "en" ? "fa" : "en");
  };
  return { t, isRtl, toggleLanguage, currentLang };
}