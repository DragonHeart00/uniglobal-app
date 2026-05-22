import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/i18n";

export type Theme = "light" | "dark" | "system";
export type Mode = "study" | "test" | "exam" | "favorite";

export interface LatestResult {
  mode: Mode;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  passed: boolean;
  at: number;
  lang: Lang;
  folder?: number | "all";
}

interface AppState {
  lang: Lang;
  theme: Theme;
  favorites: Record<Lang, number[]>;
  latestResult: LatestResult | null;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleFavorite: (lang: Lang, n: number) => boolean;
  isFavorite: (lang: Lang, n: number) => boolean;
  clearFavorites: (lang: Lang) => void;
  setLatestResult: (r: LatestResult | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: "sv",
      theme: "system",
      favorites: { sv: [], ar: [] },
      latestResult: null,
      setLang: (l) => set({ lang: l }),
      setTheme: (t) => set({ theme: t }),
      isFavorite: (lang, n) => get().favorites[lang]?.includes(n) ?? false,
      toggleFavorite: (lang, n) => {
        const list = get().favorites[lang] ?? [];
        const exists = list.includes(n);
        const next = exists ? list.filter((x) => x !== n) : [...list, n];
        set({ favorites: { ...get().favorites, [lang]: next } });
        return !exists;
      },
      clearFavorites: (lang) =>
        set({ favorites: { ...get().favorites, [lang]: [] } }),
      setLatestResult: (r) => set({ latestResult: r }),
    }),
    {
      name: "godkant.app",
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        favorites: s.favorites,
        latestResult: s.latestResult,
      }),
    },
  ),
);

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const effective = theme === "system" ? (mql.matches ? "dark" : "light") : theme;
  root.classList.toggle("dark", effective === "dark");
}
