import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslation from './locales/ar.json';
import heTranslation from './locales/he.json';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: arTranslation },
    he: { translation: heTranslation },
  },
  lng: 'he', // اللغة الافتراضية (العربية)
  fallbackLng: 'he',
  interpolation: { escapeValue: false },
});

export default i18n;