import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fa',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          brand: "OmanGate",
          hero_title: "Start your business in Oman in 5–7 days",
          hero_subtitle: "Your gateway to transparent, professional, and rapid company registration in the Sultanate of Oman.",
          cta_start: "Start Application",
          cta_learn_more: "Learn More",
          nav_services: "Services",
          nav_pricing: "Pricing",
          nav_dashboard: "Dashboard",
          nav_login: "Login",
          company_reg: "Company Registration",
          car_rental: "Car Rental",
          hostels: "Hostels & Hotels",
          real_estate: "Real Estate",
          coming_soon: "Coming Soon",
          footer_disclaimer: "Information based on MOCIIP 2026 regulations. Consult an expert for legal advice.",
          step: "Step",
          next: "Next",
          back: "Back",
          submit: "Submit",
          pay: "Pay",
          status_draft: "Draft",
          status_submitted: "Submitted",
          status_in_review: "In Review",
          status_approved: "Approved",
          status_cr_issued: "CR Issued",
          status_rejected: "Rejected",
          // ... more to be added
        }
      },
      fa: {
        translation: {
          brand: "عمان‌گیت",
          hero_title: "کسب و کار خود را در ۵ تا ۷ روز در عمان شروع کنید",
          hero_subtitle: "دروازه شما برای ثبت شرکت شفاف، حرفه‌ای و سریع در سلطنت عمان.",
          cta_start: "شروع درخواست",
          cta_learn_more: "اطلاعات بیشتر",
          nav_services: "خدمات",
          nav_pricing: "قیمت‌گذاری",
          nav_dashboard: "پنل کاربری",
          nav_login: "ورود",
          company_reg: "ثبت شرکت",
          car_rental: "اجاره خودرو",
          hostels: "هتل و اقامتگاه",
          real_estate: "املاک و مستغلات",
          coming_soon: "بزودی",
          footer_disclaimer: "اطلاعات بر اساس قوانین MOCIIP ۲۰۲۶ تهیه شده است. برای مشاوره حقوقی با کارشناس تماس بگیرید.",
          step: "مرحله",
          next: "بعدی",
          back: "قبلی",
          submit: "ارسال",
          pay: "پرداخت",
          status_draft: "پیش‌نویس",
          status_submitted: "ارسال شده",
          status_in_review: "در حال بررسی",
          status_approved: "تایید شده",
          status_cr_issued: "کد ثبتی صادر شد",
          status_rejected: "رد شده",
        }
      }
    }
  });

export default i18n;
