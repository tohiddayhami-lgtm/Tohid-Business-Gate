import { useTranslation as useI18nTranslation } from 'react-i18next';

/** برنامه تک‌زبانه فارسی است. */
export function useTranslation() {
  const { t, i18n } = useI18nTranslation();
  return {
    t,
    isRtl: true,
    currentLang: 'fa' as const,
    toggleLanguage: () => {
      void i18n.changeLanguage('fa');
    },
  };
}
