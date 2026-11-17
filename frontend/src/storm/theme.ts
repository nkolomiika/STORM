/* Light/Dark theme for the STORM UI.

   Semantic colours come from theme.css. The preference is persisted to
   localStorage and reflected onto <html data-theme>; images and brand assets
   retain their original colours. */

import { create } from "zustand";

export type Theme = "light" | "dark";

const STORAGE_KEY = "storm.theme";

/** Read the persisted preference; default to light. */
function readStored(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

/** Mirror the theme onto <html data-theme> so storm.css can style/invert. */
function reflect(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: readStored(),
  setTheme: (theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable (private mode) — keep it in-memory */
    }
    reflect(theme);
    set({ theme });
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));

/** Apply the persisted theme before the app paints. Called once from main.tsx. */
export function initTheme() {
  reflect(readStored());
}
