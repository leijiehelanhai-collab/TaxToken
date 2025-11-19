import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import ko from './locales/ko/translation.json';
import ja from './locales/ja/translation.json';
import es from './locales/es/translation.json';
import de from './locales/de/translation.json';
import zh from './locales/zh/translation.json';

const resources = { en: { translation: en }, ko: { translation: ko }, ja: { translation: ja }, es: { translation: es }, de: { translation: de }, zh: { translation: zh } };

const saved = typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: saved,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
