import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../locales/i18n';
import { SupportedLanguage } from '../types';

interface LangState {
  currentLang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      currentLang: 'vi',
      setLang: (lang) => {
        i18n.changeLanguage(lang).catch(() => {});
        set({ currentLang: lang });
      },
    }),
    {
      name: 'preferred_lang',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.currentLang) {
          i18n.changeLanguage(state.currentLang).catch(() => {});
        }
      },
    }
  )
);
