import React, { createContext, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'fr' | 'en';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('bsf-lang') as Language) || 'fr'
  );

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      i18n.changeLanguage(lang);
      localStorage.setItem('bsf-lang', lang);
    },
    [i18n]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
