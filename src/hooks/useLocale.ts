import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  const isRtl = i18n.language === 'fa';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return { t, toggleLanguage, isRtl, currentLang: i18n.language };
};
