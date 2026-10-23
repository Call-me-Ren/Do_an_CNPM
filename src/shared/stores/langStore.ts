import { create } from 'zustand';
import { SupportedLanguage } from '../types';

interface LangState {
  currentLang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
}

export const useLangStore = create<LangState>((set) => ({
  currentLang: (localStorage.getItem('preferred_lang') as SupportedLanguage) || 'vi',
  setLang: (lang) => {
    localStorage.setItem('preferred_lang', lang);
    set({ currentLang: lang });
  },
}));
