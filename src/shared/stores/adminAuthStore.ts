import { create } from 'zustand';

interface AdminUserState {
  token: string | null;
  username: string | null;
  role: string | null;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const getStoredSession = () => {
  if (typeof window === 'undefined') {
    return { token: null, username: null, role: null };
  }
  try {
    const token = sessionStorage.getItem('admin_session_token');
    const username = sessionStorage.getItem('admin_session_user');
    const role = sessionStorage.getItem('admin_session_role');
    if (token) {
      return { token, username, role };
    }
  } catch {
    // sessionStorage not available
  }
  return { token: null, username: null, role: null };
};

export const useAdminAuthStore = create<AdminUserState>((set, get) => {
  const initial = getStoredSession();

  return {
    token: initial.token,
    username: initial.username,
    role: initial.role,

    login: (token, username, role) => {
      try {
        sessionStorage.setItem('admin_session_token', token);
        sessionStorage.setItem('admin_session_user', username);
        sessionStorage.setItem('admin_session_role', role);
      } catch {
        // ignore
      }
      set({ token, username, role });
    },

    logout: () => {
      try {
        sessionStorage.removeItem('admin_session_token');
        sessionStorage.removeItem('admin_session_user');
        sessionStorage.removeItem('admin_session_role');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_role');
      } catch {
        // ignore
      }
      set({ token: null, username: null, role: null });
    },

    isAuthenticated: () => {
      return Boolean(get().token);
    },
  };
});
