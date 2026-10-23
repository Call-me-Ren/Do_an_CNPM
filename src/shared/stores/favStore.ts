import { create } from 'zustand';

interface FavState {
  favorites: string[]; // artifact ids
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cleanInvalidFavorites: (validIds: string[]) => void;
}

const getInitialFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem('user_favorites');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Only keep valid WRM artifact IDs and discard stale legacy POI IDs
    const valid = parsed.filter((id) => typeof id === 'string' && id.startsWith('WRM'));
    if (valid.length !== parsed.length) {
      localStorage.setItem('user_favorites', JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
};

export const useFavStore = create<FavState>((set, get) => ({
  favorites: getInitialFavorites(),
  toggleFavorite: (id: string) => {
    const current = get().favorites;
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    localStorage.setItem('user_favorites', JSON.stringify(next));
    set({ favorites: next });
  },
  isFavorite: (id: string) => get().favorites.includes(id),
  cleanInvalidFavorites: (validIds: string[]) => {
    const current = get().favorites;
    const filtered = current.filter((id) => validIds.includes(id));
    if (filtered.length !== current.length) {
      localStorage.setItem('user_favorites', JSON.stringify(filtered));
      set({ favorites: filtered });
    }
  }
}));
