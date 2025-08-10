import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en/common.json';
import esTranslations from './locales/es/common.json';
import frTranslations from './locales/fr/common.json';
import deTranslations from './locales/de/common.json';
import zhTranslations from './locales/zh/common.json';
import arTranslations from './locales/ar/common.json';

// Language detection options
const languageDetectorOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage'],
  lookupLocalStorage: 'preferredLanguage',
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: languageDetectorOptions,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    resources: {
      en: {
        common: enTranslations,
      },
      es: {
        common: esTranslations,
      },
      fr: {
        common: frTranslations,
      },
      de: {
        common: deTranslations,
      },
      zh: {
        common: zhTranslations,
      },
      ar: {
        common: arTranslations,
      },
    },

    // Namespace settings
    defaultNS: 'common',
    ns: ['common'],

    // Performance settings
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Export supported languages for components
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];
