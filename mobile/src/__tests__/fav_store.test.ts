jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => {}),
  removeItem: jest.fn(async () => {}),
}));

import { useFavStore } from '../shared/stores/favStore';

describe('favStore (mobile)', () => {
  beforeEach(() => {
    useFavStore.setState({ favorites: [] });
  });

  it('toggles and cleans invalid favorites', () => {
    useFavStore.getState().toggleFavorite('WRM001');
    useFavStore.getState().toggleFavorite('OLD999');
    expect(useFavStore.getState().isFavorite('WRM001')).toBe(true);

    useFavStore.getState().cleanInvalidFavorites(['WRM001', 'WRM002']);
    expect(useFavStore.getState().favorites).toEqual(['WRM001']);

    useFavStore.getState().toggleFavorite('WRM001');
    expect(useFavStore.getState().favorites).toEqual([]);
  });
});
