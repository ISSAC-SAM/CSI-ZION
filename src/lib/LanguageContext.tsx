import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

type Language = 'en' | 'ta';

interface LanguageContextType {
    lang: Language;
    toggleLang: () => void;
    t: (key: keyof typeof translations.en) => string;
    l: (item: any, fieldPrefix: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Language>(() => {
        return (localStorage.getItem('preferred_lang') as Language) || 'en';
    });

    useEffect(() => {
        localStorage.setItem('preferred_lang', lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleLang = () => setLang(prev => (prev === 'en' ? 'ta' : 'en'));

    // translate static text
    const t = (key: keyof typeof translations.en) => {
        return translations[lang][key] || translations.en[key] || key as string;
    };

    // helper for database records (e.g. item.hero_title_en vs item.hero_title_ta)
    const l = (item: any, fieldPrefix: string) => {
        if (!item) return '';
        const val = lang === 'ta' ? item[`${fieldPrefix}_ta`] : item[`${fieldPrefix}_en`];
        return val || item[`${fieldPrefix}_en`] || item[fieldPrefix] || '';
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t, l }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
