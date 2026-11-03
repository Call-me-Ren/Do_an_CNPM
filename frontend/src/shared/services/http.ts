import axios from 'axios';
import { useAdminAuthStore } from '../stores/adminAuthStore';

/**
 * VITE_API_URL:
 *  - không khai báo / rỗng  -> KHÔNG dùng back-end (chế độ demo: mock JSON + localStorage, vd GitHub Pages)
 *  - '/api'                 -> gọi qua proxy cùng origin (Vite dev proxy hoặc nginx)
 *  - 'http://host:4000/api' -> gọi thẳng back-end
 */
const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

export const API_BASE = rawApiUrl.replace(/\/+$/, '');
export const apiEnabled = API_BASE.length > 0;

export const http = axios.create({ baseURL: API_BASE, timeout: 8000 });

http.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().token;
  if (token && !token.startsWith('mock-')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && useAdminAuthStore.getState().token && !String(error.config?.url).includes('/auth/login')) {
      useAdminAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

/** true nếu lỗi do không kết nối được back-end (khác với lỗi nghiệp vụ 4xx). */
export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}
