import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { TRANSLATIONS } from '../i18n/translations';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-IN', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN', flag: '🇮🇳' }
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('agrisphere-language');
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (newLang) => {
    if (TRANSLATIONS[newLang]) {
      setLanguageState(newLang);
      localStorage.setItem('agrisphere-language', newLang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('agrisphere-language', language);
  }, [language]);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = useCallback((keyPath, params = {}) => {
    if (!keyPath) return '';
    const keys = keyPath.split('.');
    
    let result = TRANSLATIONS[language];
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        result = undefined;
        break;
      }
    }

    // Fallback to English if missing in selected language
    if (result === undefined && language !== 'en') {
      result = TRANSLATIONS['en'];
      for (const k of keys) {
        if (result && result[k] !== undefined) {
          result = result[k];
        } else {
          result = undefined;
          break;
        }
      }
    }

    if (result === undefined) {
      return keyPath; // Return key path as final fallback
    }

    if (typeof result !== 'string') {
      return result;
    }

    // String interpolation for parameters {key}
    let text = result;
    Object.keys(params).forEach(paramKey => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });

    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      speechLocale: currentLangObj.speechLocale,
      currentLanguage: currentLangObj,
      supportedLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
