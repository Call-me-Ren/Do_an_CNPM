import { create } from 'zustand';

interface AdminUserState {
  token: string | null;
  username: string | null;
  role: string | null;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAdminAuthStore = create<AdminUserState>((set, get) => ({
  token: localStorage.getItem('admin_token'),
  username: localStorage.getItem('admin_user'),
  role: localStorage.getItem('admin_role'),

  login: (token, username, role) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', username);
    localStorage.setItem('admin_role', role);
    set({ token, username, role });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_role');
    set({ token: null, username: null, role: null });
  },

  isAuthenticated: () => !!get().token,
}));
