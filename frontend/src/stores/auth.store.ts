import { create } from "zustand";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  lastActivity: number;
  login: (token: string) => void;
  logout: () => void;
  touchActivity: () => void;
}

function isTokenExpired(): boolean {
  const lastActivity = Number(localStorage.getItem("lastActivity") ?? "0");
  if (!lastActivity) return true;
  return Date.now() - lastActivity > IDLE_TIMEOUT_MS;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem("token");
  let valid = !!storedToken;
  if (storedToken && isTokenExpired()) {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActivity");
    valid = false;
  }

  return {
    token: valid ? storedToken : null,
    isAuthenticated: valid,
    lastActivity: Number(localStorage.getItem("lastActivity") ?? Date.now()),
    login: (token: string) => {
      const now = Date.now();
      localStorage.setItem("token", token);
      localStorage.setItem("lastActivity", String(now));
      set({ token, isAuthenticated: true, lastActivity: now });
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("lastActivity");
      set({ token: null, isAuthenticated: false, lastActivity: 0 });
    },
    touchActivity: () => {
      const now = Date.now();
      localStorage.setItem("lastActivity", String(now));
      set({ lastActivity: now });
    },
  };
});
