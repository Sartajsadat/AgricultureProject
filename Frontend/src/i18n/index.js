import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ps from './locales/ps.json';
import da from './locales/da.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ps: { translation: ps },
      da: { translation: da },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ps', 'da'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_language',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
