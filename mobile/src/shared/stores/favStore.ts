import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cleanInvalidFavorites: (validIds: string[]) => void;
}

export const useFavStore = create<FavState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id) => {
        const current = get().favorites;
        const next = current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id];
        set({ favorites: next });
      },
      isFavorite: (id) => get().favorites.includes(id),
      cleanInvalidFavorites: (validIds) => {
        const current = get().favorites;
        const filtered = current.filter((id) => validIds.includes(id));
        if (filtered.length !== current.length) {
          set({ favorites: filtered });
        }
      },
    }),
    {
      name: 'user_favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
