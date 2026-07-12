import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface SettingsState {
  theme: Theme;
  language: string;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: (localStorage.getItem("theme") as Theme) ?? "system",
  language: localStorage.getItem("language") ?? "en",
  setTheme: (theme: Theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
  setLanguage: (language: string) => {
    localStorage.setItem("language", language);
    set({ language });
  },
}));
