import { create } from 'zustand';

interface FavState {
  favorites: string[]; // artifact ids
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavStore = create<FavState>((set, get) => ({
  favorites: JSON.parse(localStorage.getItem('user_favorites') || '[]'),
  toggleFavorite: (id: string) => {
    const current = get().favorites;
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    localStorage.setItem('user_favorites', JSON.stringify(next));
    set({ favorites: next });
  },
  isFavorite: (id: string) => get().favorites.includes(id),
}));
