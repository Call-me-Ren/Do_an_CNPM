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
  // Purge any legacy localStorage tokens so users must strictly authenticate
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_role');
    } catch {
      // ignore
    }
  }

  const initialToken =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('admin_session_token')
      : null;
  const initialUser =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('admin_session_user')
      : null;
  const initialRole =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('admin_session_role')
      : null;

  return {
    token: initialToken,
    username: initialUser,
    role: initialRole,

    login: (token, username, role) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_session_token', token);
        sessionStorage.setItem('admin_session_user', username);
        sessionStorage.setItem('admin_session_role', role);
      }
      set({ token, username, role });
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_session_token');
        sessionStorage.removeItem('admin_session_user');
        sessionStorage.removeItem('admin_session_role');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_role');
      }
      set({ token: null, username: null, role: null });
    },

    isAuthenticated: () => {
      const activeToken =
        get().token ||
        (typeof window !== 'undefined'
          ? sessionStorage.getItem('admin_session_token')
          : null);
      return Boolean(activeToken);
    },
  };
});
