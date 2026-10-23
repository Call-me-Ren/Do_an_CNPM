import { create } from 'zustand';

interface AdminUserState {
  token: string | null;
  username: string | null;
  role: string | null;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAdminAuthStore = create<AdminUserState>((set, get) => {
  // Clear any existing localStorage or sessionStorage tokens on module initialization
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_role');
      sessionStorage.removeItem('admin_session_token');
      sessionStorage.removeItem('admin_session_user');
      sessionStorage.removeItem('admin_session_role');
    } catch {
      // ignore
    }
  }

  return {
    // Strictly in-memory on each page load. Direct typing in URL bar ALWAYS starts at null!
    token: null,
    username: null,
    role: null,

    login: (token, username, role) => {
      set({ token, username, role });
    },

    logout: () => {
      set({ token: null, username: null, role: null });
    },

    isAuthenticated: () => {
      return Boolean(get().token);
    },
  };
});
